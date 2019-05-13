import {
    modules,
    MODULE_SUBSCRIPTION_TOPIC,
    articles
} from "../Resolvers";
import {
    mongoObjectId
} from "../../utils";

import {
    PubSub
} from "graphql-subscriptions";


/**
 * !GOOD RESOLVERS
 * TODO ADD MONGOOSE SUPPORT AND CHAPTERS
 */

const pubsub = new PubSub();



export const RESOLVERMONGO = {

    Query: {

        modules: () => {

            return Module.find({});
        },
        module: (root, args) => {

            if (!mongoose.Types.ObjectId.isValid(args.id)) {
                throw new UserInputError(`${args.id} cette ID n'est pas valide. `)
            }

            return Module.findById(args.id)
        }

    },

    Mutation: {

        pushModule: async (root, args, context) => {

            await Joi.validate(args, pushModule)

            const newModule = new Module({

                id: mongoObjectId(),
                courseId: args.courseId,
                title: args.title,
                subtitle: args.subtitle,
                introduction: args.introduction,
                objectives: args.objectives.split(","),
                requirements: args.requirements.split(",")
            })



            newModule.save((err, result) => {
                if (err) {
                    console.log("---module save failed " + err)
                }
                console.log("+++module saved successfully ")
                console.log(result)

                return result


            })

        },
        popModule: (root, args) => {

            Module.findByTitle(args.title, () => {
                Module.findByIdAndDelete(args.id, (err, result) => {
                    if (err) {
                        console.log(err)
                    }

                    return args.id
                })
            })

        },

        updateModule: (root, args) => {

            var module = {}

            args.courseId && (module.courseId = args.courseId)

            args.title && (module.title = args.title)

            args.subtitle && (module.subtitle = args.subtitle)

            args.introduction && (module.introduction = args.introduction)

            args.chapters && (module.chapters = args.chapters)

            args.objectives && (module.objectives = args.objectives.split(","))

            args.requirements && (module.requirements = args.requirements.split(","))



            Module.findByIdAndUpdate(args.id, {
                $set: {
                    module
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


    Module: {

       async chapters(root, args, context, info) {
            return await Article.findByModuleId(root.id)

        }
    }
}

export const RESOLVER = {


    Query: {

        modules: () => modules,
        module: (root, args) => {

            // if (!mongoose.Types.ObjectId.isValid(args.id)) {
            //     throw new UserInputError(`${args.id} cette ID n'est pas valide. `)
            // }

            // return Module.findById(args.id)

            modules.find((element) => {
                return element.id = args.id;
            })
        }

    },
    Mutation: {

        pushModule: (root, args) => {
            const newModule = {
                id: mongoObjectId(),
                courseId: args.courseId,
                title: args.title,
                subtitle: args.subtitle,
                introduction: args.introduction,
                objectives: args.objectives.split(","),
                requirements: args.requirements.split(",")
            };
            modules.push(newModule);

            pubsub.publish(MODULE_SUBSCRIPTION_TOPIC, {
                newModule,
            });


            return newModule;
        },


        popModule: (root, args) => {

            modules.splice(args.id - 1, 1)

            pubsub.publish(MODULE_SUBSCRIPTION_TOPIC, {
                modules,
            });


            return args.id;

        },

        updateModule: (root, args) => {

            modules.map(module => {
                if (module.id === args.id) {


                    args.courseId && (module.courseId = args.courseId)

                    args.title && (module.title = args.title)

                    args.subtitle && (module.subtitle = args.subtitle)

                    args.introduction && (module.introduction = args.introduction)

                    args.chapters && (module.chapters = args.chapters)

                    args.objectives && (module.objectives = args.objectives.split(","))

                    args.requirements && (module.requirements = args.requirements.split(","))



                    return module;
                }
            });
            return modules.filter(module => module.id === args.id)[0];

        }



    },
    Subscription: {

    },

    Module: {

        chapters(root, args, context, info) {
            return articles.filter(chapitre => chapitre.courseId === root.id)

        }
    }



}