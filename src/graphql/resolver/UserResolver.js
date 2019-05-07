import {
    mongoObjectId
} from "../../utils";
import {
    users,
    USER_SUBSCRIPTION_TOPIC
} from "../Resolvers";
import {
    UserInputError
} from "apollo-server-core";
import Joi from "Joi";
import { hash } from "bcryptjs";
import {
    signUp
} from "../schema/joi/ExportIndex";
import { PubSub } from "graphql-subscriptions";
import { createToken } from "./utils/authHelpers";

/**
 * TODO ADD SUBSCRIPTION AND MONGOOSE SUPPOPRT
 * TODO ADD ENROLLEMENT TO COURSE SUPPPORT 
 */

 const pubSub = new PubSub();

export const RESOLVER = {


    Query: {

        users: () => users,
        user: (root, args) => {

            // if (!mongoose.Types.ObjectId.isValid(args.id)) {
            //     throw new UserInputError(`${args.id} cette ID n'est pas valide. `)
            // }

            // return User.findById(args.id)

            users.find((element) => {
                return element.id = args.id;
            })
        }

    },
    Mutation: {


        /* signIn: async (
            parent,
            { mail, password },
            { models, secret },
          ) => {
            const user = await User.findByLogin(mail);
      
            if (!user) {
              throw new UserInputError(
                'No user found with this email credentials.',
              );
            }
      
            const isValid = await user.validatePassword(password);
      
            if (!isValid) {
              throw new AuthenticationError('Invalid password.');
            }
      
            return { token: createToken(user, secret, '30m') };
          },*/


        

        pushUser: async (root, args, {secret}) => {

            console.log("object")
            Joi.validate(args, signUp)


            users.map((user)=>{
                if (user.mail === args.mail) {
                    throw new UserInputError("Ce mail est déjà associé à un compte")
                }
            })

            const newUser = {
                id: mongoObjectId(),
                username: args.username,
                mail: args.mail,
                firstname: args.firstname,
                lastname: args.lastname,
                password: await hash(args.password, 12),
                rank : 1,
                createAt: Date.now().toString()


            };
            console.log(newUser)
            users.push(newUser);



            pubSub.publish(USER_SUBSCRIPTION_TOPIC, {
                newUser,
            });

            return createToken(newUser,secret,"2h");
        },


        popUser: (root, args) => {
            users.map(user => {
                if (user.id === args.id && user.password === user.password) {

                    users.splice(args.id - 1, 1)
                    return args.id;

                }

            })
        },

        updateUser: async (root, args) => {

            users.map(async (user) => {
                if (user.id === args.id) {


                    args.username ? username = args.username : null


                    args.password ? password = await hash(args.password, 12) : null

                    args.courses ? courses = args.courses : null

                    return user;
                }
            });
            return users.filter(user => user.id === id)[0];

        },




    },





}