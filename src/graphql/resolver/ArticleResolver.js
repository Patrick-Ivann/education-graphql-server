import {
    ARTICLE_SUBSCRIPTION_TOPIC
} from "../Resolvers";
import to, {
    mongoObjectId
} from "../../utils";
import Joi from "Joi";
import {
    pushArticle
} from "../schema/joi/ExportIndex";

import {
    PubSub
} from "graphql-subscriptions";
import {
    parts,
    id
} from "./PartResolver";

import Article from '../../mongoDB/ArticleSchema'
import Part from '../../mongoDB/PartSchema'
import {
    Types
} from "mongoose";
import question from "../../mongoDB/QuestionSchema";
import {
    UserInputError
} from "apollo-server-core";


const pubsub = new PubSub();


/**
 * TODO ADD MONGOOSE SUPPORT AND PARTS PUSH
 * !GOOD RESOLVER, 
 */



let articles = [

    {
        id: id,
        title: "title",
        subtitle: "sous titre",
        version: 1,
        objectives: [
            "o", "bj", "ect", "if"
        ],
        encoding: "encoding",
        time: "10",
        requirements: [
            "re", "qui", "rem", "ents"
        ],
        difficulty: "facile",
        introduction: "introduction"

    }
]


export const RESOLVERMONGO = {
    Query: {

        articles: async () => {

            return await Article.find({});
        },
        article: async (root, args) => {

            if (!Types.ObjectId.isValid(args.id)) {
                throw new UserInputError(`${args.id} cette ID n'est pas valide. `)
            }

            return await Article.findById(args.id)
        },
        upcommingArticle: async (root, args) => {

            if (!Types.ObjectId.isValid(args.id)) {
                console.log(args.id)
                throw new UserInputError(`${args.id} cette ID n'est pas valide. `)
            }

            let err, nextArticle;

            [err, nextArticle] = await to(Article.findOne({
                    _id: {
                        $lt: args.id
                    }
                })
                .limit(1)
                .sort({
                    title: 'asc'
                }).lean({
                    virtuals: true
                })
            )


            return nextArticle ? nextArticle.id : (await Article.findById(args.id).select("moduleId -_id").lean()).moduleId


        },


        articleByModule: async (root, args) => {

            let fetchedArticle = await Article.find({
                moduleId: args.moduleId
            })

            console.log(fetchedArticle)

            if (!fetchedArticle || fetchedArticle.length === 0) {
                throw Error("Aucun article dans ce module.")
            }
            return fetchedArticle
        }

    },

    Mutation: {

        pushArticle: async (root, args, context) => {

            await Joi.validate(args, pushArticle)

            let newArticles = new Article({
                id: mongoObjectId(),
                moduleId: args.moduleId,
                title: args.title,
                version: args.version,
                subtitle: args.subtitle,
                objectives: args.objectives.split(','),
                encoding: args.encoding,
                time: args.time,
                requirements: args.requirements.split(','),
                difficulty: args.difficulty,
                introduction: args.introduction,

            })
            let pushedArticle = await newArticles.save()

            if (!pushArticle) {
                console.log("---article save failed ")
                throw Error("---article save failed ")
            }
            return pushedArticle

        },
        popArticle: (root, args) => {

            Article.findByTitle(args.title, () => {
                Article.findByIdAndDelete(args.id, (err, result) => {
                    if (err) {
                        console.log(err)
                    }

                    return args.id
                })
            })

        },

        updateArticle: (root, args) => {

            var article = {}

            args.moduleId && (article.moduleId = args.moduleId)

            args.title && (article.title = args.title)

            args.subtitle && (article.subtitle = args.subtitle)

            args.version && (article.version = args.version)
            args.objectives && (article.objectives = args.objectives.split(','))
            args.encoding && (article.encoding = args.encoding)
            args.time && (article.time = args.time)
            args.requirements && (article.requirements = args.requirements.split(','))
            args.difficulty && (article.difficulty = args.difficulty)
            args.introduction && (article.introduction = args.introduction)

            args.parts && (article.parts = args.parts)

            Article.findByIdAndUpdate(args.id, {
                $set: {
                    article
                }
            }, {
                new: true
            }).then((result) => {

                return result
            }).catch((error) => console.log(error))
        }
    },

    Subscription: {

    },

    Article: {
        async parts(root, args, context, info) {

            let id = root.id
            return await Part.find({
                articleId: id
            })


        },

        async questions(root) {


            let id = root.id

            return await question.find({
                articleId: id
            })
        },

        async isLastOfModule(root) {
            let id = root.id

            let currentModuleId = (await Article.findById(
                id
            )).moduleId

            let listOfArticle = await Article.find({
                moduleId: currentModuleId
            }).sort({_id:-1});

            if ((listOfArticle[0].id).toString() === (root.id).toString()) return true


            return false

            /**
             * TODO 1.article et donc moduleId 2.chopper tous les articles du module 3.guetter si c'est le plus jeune
             * 
             * 
             */
        }


    }



}


export const RESOLVER = {


    Query: {

        articles: () => articles,
        article: (root, args) => {

            if (!args.id) {
                throw new Error('id is required')
            }
            return articles.find(article => article.id === args.id)
        }

    },
    Mutation: {

        pushArticle: async (root, args) => {
            await Joi.validate(args, pushArticle)
            const newArticles = {
                id: mongoObjectId(),
                moduleId: args.moduleId,
                title: args.title,
                version: args.version,
                subtitle: args.subtitle,
                objectives: args.objectives.split(','),
                encoding: args.encoding,
                time: args.time,
                requirements: args.requirements.split(','),
                difficulty: args.difficulty,
                introduction: args.introduction,


            };
            articles.push(newArticles);

            pubsub.publish(ARTICLE_SUBSCRIPTION_TOPIC, {
                newArticles,
            });


            return newArticles;
        },


        popArticle: (root, args) => {

            articles.splice(args.id - 1, 1)

            pubsub.publish(ARTICLE_SUBSCRIPTION_TOPIC, {
                articles,
            });


            return args.id;

        },

        updateArticle: (root, args) => {


            articles.map(article => {
                if (article.id === args.id) {

                    args.moduleId && (article.moduleId = args.moduleId)

                    args.title && (article.title = args.title)

                    args.subtitle && (article.subtitle = args.subtitle)

                    args.version && (article.version = args.version)
                    args.objectives && (article.objectives = args.objectives.split(','))
                    args.encoding && (article.encoding = args.encoding)
                    args.time && (article.time = args.time)
                    args.requirements && (article.requirements = args.requirements.split(','))
                    args.difficulty && (article.difficulty = args.difficulty)
                    args.introduction && (article.introduction = args.introduction)

                    args.parts && (article.parts = args.parts)

                    console.log(article)
                    return article;
                }
            });
            return articles.filter(article => article.id === args.id)[0];

        }



    },
    Subscription: {

    },

    Article: {
        parts(root, args, context, info) {
            return parts.filter(part => part.articleId === root.id)

        }


    }




}