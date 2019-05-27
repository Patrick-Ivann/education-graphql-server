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
import {
    hash
} from "bcryptjs";

import {
    PubSub
} from "graphql-subscriptions";
import {
    createToken,
    checkAuthenticated,
    trySignUp,
    authenticated
} from "./utils/authHelpers";
import {
    signIn,
    signUp
} from "../schema/joi/user";
import User from "../../mongoDB/UserSchema";

/**
 * TODO ADD SUBSCRIPTION AND MONGOOSE SUPPOPRT
 * TODO ADD ENROLLEMENT TO COURSE SUPPPORT 
 */

const pubSub = new PubSub();

export const RESOLVER = {


    Query: {

        himself: authenticated((root, args, context, info) => {

            checkAuthenticated(context.req);

            return User.findById(context.req.session.userId);

        }),

/*         users: (root,args,context,info) =>{

            checkAuthenticated(context.req)

            return User.find({})
        }, */

        users: () => users,
        user: authenticated((root, args, context, info) => {

            // if (!mongoose.Types.ObjectId.isValid(args.id)) {
            //     throw new UserInputError(`${args.id} cette ID n'est pas valide. `)
            // }

            // return User.findById(args.id)

            checkAuthenticated(context.req)

            users.find((element) => {
                return element.id = args.id;
            })
        })

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



          signOut :  authenticated(async(root,args,context,info) =>{

            checkAuthenticated(context.req)
            context.req.session.destroy(err=>{
                if (err) {
                    throw new Error("impossible de vous deconnecter")
                }
                context.res.clearCookie(process.env.SESSION_NAME)
                
                return true 
            })
          }),


        signUp: async (root, args, {req}, info) => {

            console.log(args)

            await Joi.validate(args, signUp, {
                abortEarly: false
            })

            const user = await User.create(args)
        
            req.session.userId = user.id

            return  user
        },

        signIn: async (root, args, {req} , info) => {

            if (req.session.UserId) {
                return User.findById(req.session.userId)
            }

            await Joi.validate(args, signIn, {
                abortEarly: false
            });

            const user = await trySignUp(args.mail, args.password)

            req.session.userId = user.id

            return user

        },



        pushUser: async (root, args, {
            secret
        }) => {

            Joi.validate(args, signUp)


            users.map((user) => {
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
                rank: 1,
                createAt: Date.now().toString()


            };
            console.log(newUser)
            users.push(newUser);



            pubSub.publish(USER_SUBSCRIPTION_TOPIC, {
                newUser,
            });

            return createToken(newUser, secret, "2h");
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