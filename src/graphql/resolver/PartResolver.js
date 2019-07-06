import {
    PART_SUBSCRIPTION_TOPIC
} from "../Resolvers";
import {
    mongoObjectId
} from "../../utils";
import {
    PubSub
} from "graphql-subscriptions";
import part from "../../mongoDB/PartSchema";





const pubsub = new PubSub();

/**
 * !GOOD RESOLVER
 */

export let id = mongoObjectId()
export let parts = [

    {
        id: mongoObjectId(),
        title: "titre téco",
        content: "content",
        articleId: id
    }
]


export const RESOLVERMONGO = {

    Query: {

        parts: () => {
            return Part.find({})
        },
        part: (root, args) => {

            if (!mongoose.Types.ObjectId.isValid(args.id)) {
                throw new UserInputError(`${args.id} cette ID n'est pas valide. `)
            }

            return Part.findById(args.id)
        }

    },


    Mutation: {


        pushPart: async (root, args) => {



            const newPart = new part({
                id: mongoObjectId(),
                title: args.title,
                content: args.content,
                articleId: args.articleId
            })

            let insertedPart = await newPart.save()

            if (!insertedPart) {
                console.log('---part save failed')
                throw new Error('---part save failed')
            }
            return insertedPart

        },
        popPart: (root, args) => {

            Part.findByTitle(args.title, () => {
                Part.findByIdAndDelete(args.id, (err, result) => {
                    if (err) {
                        console.error(err)
                    }

                    return args.id
                })
            })
        },

        updatePart: (root, args) => {
            var part = {}

            args.title && (part.title = args.title)

            args.content && (part.content = args.content)

            Part.findByIdAndUpdate(args.id, {
                $set: {
                    part
                }
            }, {
                new: true
            }).then((result) => {
                return result
            }).catch((err) => {
                console.error(err)
            });
        }
    },

    Subscription: {

    },




}


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
                content: args.content,
                articleId: args.articleId
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