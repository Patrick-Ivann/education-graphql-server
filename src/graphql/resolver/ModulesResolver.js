import { modules, MODULE_SUBSCRIPTION_TOPIC } from "../Resolvers";
import { mongoObjectId } from "../../utils";

import { PubSub } from "graphql-subscriptions";


/**
 * !GOOD RESOLVERS
 * TODO ADD MONGOOSE SUPPORT AND CHAPTERS
 */

const pubsub = new PubSub();

export const RESOLVER = {


    Query: {

        modules : () => modules,
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
    Mutation:{

        pushModule: (root, args) => {
            const newModule = {
                id: mongoObjectId(),
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

        updateModule:(root,args) => {

            modules.map(module => {
                if (module.id === args.id) {


                      args.title &&( module.title = args.title)

                      args.subtitle &&( module.subtitle  = args.subtitle)
    
                     args.introduction &&( module.introduction =  args.introduction)
    
                     args.chapters &&( module.chapters = args.chapters)
    
                     args.objectives &&( module.objectives = args.objectives.split(","))
    
                     args.requirements &&( module.requirements = args.requirements.split(","))
    


                    return module;
                }
            });
            return modules.filter(module => module.id === args.id)[0];

        }



    } ,
    Subscription:{

    }




}