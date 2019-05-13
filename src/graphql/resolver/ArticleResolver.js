import {
    ARTICLE_SUBSCRIPTION_TOPIC
} from "../Resolvers";
import {
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

        articles: () => {

            return Article.find({});
        },
        article: (root, args) => {

            if (!mongoose.Types.ObjectId.isValid(args.id)) {
                throw new UserInputError(`${args.id} cette ID n'est pas valide. `)
            }

            return Article.findById(args.id)
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

            newArticles.save((err, result) => {
                if (err) {
                    console.log("---article save failed " + err)
                }
                console.log("+++article saved successfully ")
                console.log(result)

                return result


            })

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

            return await Part.findByArticleId(root.id) 

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