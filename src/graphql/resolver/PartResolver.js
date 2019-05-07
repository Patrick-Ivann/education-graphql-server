import {
    parts,
    PART_SUBSCRIPTION_TOPIC
} from "../Resolvers";
import {
    mongoObjectId
} from "../../utils";
import { PubSub } from "graphql-subscriptions";


const pubsub = new PubSub();

/**
 * !GOOD RESOLVER
 * TODO PUT MONGODB resolvers
 */


export const RESOLVERS = {
    Query: {
        parts: () => parts,

        // parts:() =>{
        //     return Part.find({})
        // },

        part: (root, args) => {

            // if (!mongoose.Types.ObjectId.isValid(args.id)) {
            //     throw new UserInputError(`${args.id} cette ID n'est pas valide. `)
            // }

            // return User.findById(args.id)

            parts.find((element) => {
                return element.id = args.id;
            })
        }
    },

    Mutation: {
        pushPart: (root, args) => {
            const newPart = {
                id: mongoObjectId(),
                title: args.title,
                content: args.content
            };
            parts.push(newPart);

            pubsub.publish(PART_SUBSCRIPTION_TOPIC, {
                newPart,
            });



            return newPart;
        },


        updatePart: (root, args) => {

            parts.map(part => {
                if (part.id === args.id) {


                    args.title && (part.title = args.title) 

                    args.content && (part.content = args.content) 



                    return part;

                }
            })

            return parts.filter(part => part.id === args.id)[0];

        },


        popPart: (root, args) => {

            parts.splice(args.id - 1, 1)


            return args.id;

        },


    },

    Subscription: {
        newPart: {
            subscribe: () => pubsub.asyncIterator(PART_SUBSCRIPTION_TOPIC),
        },

    },

};