import to, {
    mongoObjectId
} from "../../utils";
import {
    users,
    USER_SUBSCRIPTION_TOPIC
} from "../Resolvers";
import {
    UserInputError,
    ApolloError,
    AuthenticationError
} from "apollo-server-core";
import Joi from "Joi";
import {
    hash
} from "bcryptjs";

import jwt from "jsonwebtoken";

import {
    PubSub
} from "graphql-subscriptions";
import {
    createToken,
    checkAuthenticated,
    trySignUp,
    authenticated,
    checkUnAuthenticated,
    checkUnAuthenticatedNew,
    authenticatedNew,
    createRefreshedToken,
    generateTokens,
    readToken,
    extractToken,
    tradeTokenForUserNew
} from "./utils/authHelpers";
import {
    signIn,
    signUp
} from "../schema/joi/user";
import User from "../../mongoDB/UserSchema";
import UserProgress from "../../mongoDB/UserProgress";
import UserAnswer from "../../mongoDB/UserFailureSchema";

import moment from 'moment';
import {
    isNumber
} from "util";

/**
 * TODO ADD SUBSCRIPTION AND MONGOOSE SUPPOPRT
 * TODO ADD ENROLLEMENT TO COURSE SUPPPORT 
 */

const pubSub = new PubSub();

export const RESOLVER = {


    Query: {

        date: (root, args, context, info) => {
            checkAuthenticated(context.req);

            return Date.now().toString()
        },


        isAuthenticated: (root, args, context) => `Authorized!`,


        himself: async (root, args, context, info) => {





            const authTokenHeader = context.req.headers.authorization;
            const authToken = authTokenHeader.split("Bearer")[1];

            const secret = context.secret

            try {
                var user = jwt.verify(authToken.trim(), secret, {
                    algorithms: "HS384"
                });
                return User.findById(user.id);
            } catch (error) {
                throw new AuthenticationError('UNAUTHORIZED');

            }




        },

        /*         users: (root,args,context,info) =>{
            
            checkAuthenticated(context.req)

                    return User.find({})
                }, */

        users: async () => await User.find({}),
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

        refreshToken: (root, args, ctx, info) => {


            const authTokenHeader = context.req.headers.authorization;
            const authToken = authTokenHeader.split("Bearer")[1];

            const secret = context.secret

            try {
                var user = jwt.verify(authToken.trim(), secret, {
                    algorithms: "HS384"
                });
                return createRefreshedToken(user.id, ctx.secret, "30min")
            } catch (error) {
                throw new AuthenticationError('UNAUTHORIZED');

            }
        },


        signOut: /*authenticatedNew(*/ async (root, args, context, info) => {

            /**
             * TODO UPDATE TIMESPENT FIELD
             * !EXPECTING LASTCONNECTION ARG
             */





            const user = await readToken(await extractToken(context), context.secret)


            /**
             * TODO ADD MOMENT.JS TO CALCULATE TIME SPENT SINCE THE LAST CONNECTION
             */
            /* 
                        var now = new moment(Date.now())
                        var lastConnection = new moment(user.user.lastConnection)
                        var storedTimeSpent = moment.duration(Number(user.user.timeSpent), "seconds")
                        var timeSpent = 0

                        var timeSpentThisSession = moment.duration(now.diff(lastConnection))

                        console.log(moment.isDuration(moment.duration(parseFloat(user.user.timeSpent))))
                        console.log(moment.duration(Number(user.user.timeSpent), "seconds").asSeconds())

                        console.log(storedTimeSpent.minutes())
                        console.log(storedTimeSpent.asMinutes())


                        console.log(timeSpentThisSession.minutes())
                        console.log("time dans le cookie donc avant " + user.user.timeSpent + " -- " + moment.duration(storedTimeSpent).toISOString())
                        user.user.timeSpent !== "0000" ? timeSpent = moment.duration(storedTimeSpent).add(timeSpentThisSession) : timeSpent = timeSpentThisSession;

                        console.log("timeSpent in minute " + moment.duration(timeSpent).minutes() + " dd " + moment.duration(timeSpent).minutes())
                        console.log("timeSpent " + timeSpent + " timeSession mdr challah c'est différent " + timeSpentThisSession)
                        console.log(moment.duration(timeSpent).hours() + "H" + moment.duration(timeSpent).Minutes())
                        console.log(moment.duration(timeSpent).seconds())

                        User.findOneAndUpdate({
                            _id: user.user._id
                        }, {
                            $set: {
                                timeSpent: moment.duration(timeSpent)
                            }
                        }, {
                            new: true,
                        }).then((result) => {
                            console.log(result)
                        }).catch((err) => {
                            throw new Error("impossible de vous deconnecter")
                        }); */



            /* 
                        context.req.session.destroy(err => {
                            if (err) {
                                throw new Error("impossible de vous deconnecter")
                            }
                            // context.res.clearCookie(process.env.SESSION_NAME)

                            return true
                        }) */

            return true
        } /*)*/ ,


        signUp: async (root, args, {
            req
        }, info) => {


            await Joi.validate(args, signUp, {
                abortEarly: false
            })

            const user = await User.create(args)


            return user
        },

        signIn: async (root, args, {
            req,
            res,
            secret
        }, info) => {

            /**
             * TODO UPDATE "LAST CONNECTION" FIELD
             */

            if (req.headers.authorization) {
                checkUnAuthenticatedNew(req)
                //                throw new AuthenticationError("ALREADY_CONNECTED")
                //return User.findById(req.session.userId)
            }

            await Joi.validate(args, signIn, {
                abortEarly: false
            });

            const user = await trySignUp(args.mail, args.password)



            // req.session.userId = user.id

            var tok = await createToken(user, secret, '30m');
            var userUpdate = {}

            userUpdate.lastConnection = new Date(Date.now())


            const updatedUser = await User.findOneAndUpdate({
                _id: user.id
            }, {
                $set: {
                    lastConnection: userUpdate.lastConnection
                }
            }, {
                new: true,
            })

            var [legitToken, refreshToken] = await generateTokens(updatedUser);





            res.set("Access-Control-Expose-Headers", "x-token", "x-refresh-token")
            res.set("x-token", legitToken)
            res.set("x-refresh-token", refreshToken)

            console.log(moment.duration(Number(user.timeSpent), 'seconds').asHours() + " : " + moment.duration(Number(user.timeSpent), 'seconds').asMinutes())


            return {
                ...user._doc,
                // timeSpent : moment.duration(user.timeSpent).asHours() + ":" + moment.duration(user.timeSpent).asMinutes(),
                id: user._id,
                token: legitToken,
                refreshToken: refreshToken
            };


            return user

        },




        pushError: async (root, args, context) => {



            const user = await readToken(await extractToken(context), context.secret)
            /* .then((result) => {


                        }).catch((err) => {
                            console.log(err)
                            throw new ApolloError(err)
                        }); */

            console.log(user.user._id)

            var failure = {}

            args.articleId && (failure.articleId = args.articleId)
            args.moduleId && (failure.moduleId = args.moduleId)

            failure.surveyType = args.surveyType
            failure.answerType = "failure"

            failure.questionId = args.questionId

            const newFailure = new UserAnswer({

                id: mongoObjectId(),
                userId: user.user._id,
                moduleId: failure.moduleId,
                articleId: failure.articleId,
                questionId: failure.questionId,
                surveyType: failure.surveyType,
                answerType: failure.answerType
            })


            newFailure.save((err, result) => {
                if (err) {
                    console.log("---userFailure save failed " + err)
                    throw new Error("---userFailure save failed " + err)

                }
                console.log("+++userFailure saved successfully ")
                console.log(result)

                return result


            })

            return user.user
        },

        pushSucces: async (root, args, context) => {



            const user = await readToken(await extractToken(context), context.secret)
            /* .then((result) => {


                        }).catch((err) => {
                            console.log(err)
                            throw new ApolloError(err)
                        }); */

            console.log(user.user._id)

            var succes = {}

            args.articleId && (succes.articleId = args.articleId)
            args.moduleId && (succes.moduleId = args.moduleId)

            succes.surveyType = args.surveyType
            succes.answerType = "succes"

            failure.questionId = args.questionId

            const newSucces = new UserAnswer({

                id: mongoObjectId(),
                userId: user.user._id,
                moduleId: succes.moduleId,
                articleId: succes.articleId,
                questionId: succes.questionId,
                surveyType: succes.surveyType,
                answerType: succes.answerType
            })


            newSucces.save((err, result) => {
                if (err) {
                    console.log("---userSucces save failed " + err)
                    throw new Error("---userSucces save failed " + err)

                }
                console.log("+++userSucces saved successfully ")
                console.log(result)

                return result


            })

            return user.user
        },
        pushProgress: async (root, args, context) => {

            const user = await readToken(await extractToken(context), context.secret)

            const newProgress = new UserProgress({
                id: mongoObjectId(),
                userId: user.user._id,
                articleId: args.articleId,
                moduleId: args.moduleId,
                courseId: args.courseId
            })

            newProgress.save((err, result) => {
                if (err) {
                    console.log("---userProgress save failed " + err)
                    throw new Error("---userProgress save failed " + err)

                }
                console.log("+++userProgress saved successfully ")
                console.log(result)

                return result


            })

            return user

        },

        /**
         * 
         * !DEPRECATED 
         */
        updateProgress: async (root, args) => {

            const user = await readToken(await extractToken(context), context.secret)
            var progress = {}

            args.courseId && (progress.courseId = args.courseId)
            args.moduleId && (progress.moduleId = args.moduleId)



            UserProgress.findOneAndUpdate({
                userId: user.user._id
            }, {
                $set: {
                    progress
                }
            }, {
                new: true
            }).then((result) => {
                console.log(result)

                return result
            }).catch((error) => console.log(error))

            return await User.findById(user.user._id);

        },

        updateProgressTime: async (root, args, context, info) => {
            const user = await readToken(await extractToken(context), context.secret)
            var time = {}
            var progress = {}
            var err, userProgress
            args.timeSpent && (progress.timeSpent = args.timeSpent);


            [err, userProgress] = await to(
                UserProgress.findOneAndUpdate({
                    userId: user.user._id,
                    articleId: args.articleId
                }, {
                    $set: {
                        timeSpent: args.timeSpent
                    },
                }, {
                    upsert: true,
                    new: true
                }));
            if (!userProgress) throw new ApolloError('Impossible de mettre à jour la progression utilisateur found');

            time.SpentTotalFromCookie = Number(user.user.timeSpent) // alreadySAVEDtIME
            time.SpentOnArticle = Number(userProgress.timeSpent) //time to add to the alreadyStoredVALUE
            time.SpentToSave = time.SpentTotalFromCookie + time.SpentOnArticle //Upcomming user.user.timeSpent

            User.findByIdAndUpdate(user.user._id, {
                $set: {
                    timeSpent: time.SpentToSave
                }
            }, {
                new: true
            }).then((result) => {
                console.log(result)

                return result
            }).catch((error) => console.log(error))


            return await User.findById(user.user._id);


        },

        /**
         * !TO TRIGGER WHEN SOMEONE BUY A COURSE
         */
        enrolledToCourse: async (root, args, context, info) => {


            const user = await readToken(await extractToken(context), context.secret)
            var modifiedUser = {}

            args.courseId && (modifiedUser.courseId = args.courseId)


            User.findOneAndUpdate({
                userId: user.user._id
            }, {
                $set: {
                    modifiedUser
                }
            }, {
                new: true
            }).then((result) => {
                console.log(result)

                return result
            }).catch((error) => console.log(error))

            return await User.findById(user.user._id);



        }


    },


    User: {

        tracking: (root, args) => {

            const obj = {

                test: () => {
                    console.log(root)
                    return root.id
                },

                chapterTime: async () => {
                    let test = await UserProgress.find({
                        userId: root.id
                    }).select("timeSpent -_id")
                    return test.reduce((previous, current) => Number(previous) + Number(current.timeSpent), 0);     
                },
                /**
                 * TODO QUERY FIELD timeSpent ON USER
                 */
                totalTime: async () => {
                    var time = await User.findById(root.id).select("timeSpent -_id")
                    var seconds = Number(time.timeSpent)
                    return Math.floor(moment.duration(seconds, 'seconds').asHours()) + 'h:' + moment.duration(seconds, 'seconds').minutes();

                },


                progress: async () => {

                    return await UserProgress.find({
                        userId: root.id
                    })

                },

                surveyReort: async () => {
                    return await UserAnswer.find({
                        userId: root.id
                    })
                }


            }

            return obj
        },
        /* tracking: {

            Tracking:{

                test : (root,args) =>{
    
                    return "tttt"
                },

            },

    
            Progress : async(root, args, context, info) => {
                console.log(root)
                return await UserProgress.find({ userId : root.id})
    
            }, 
                
            surveyFailure : async(root,args,context,info) => {
                return await UserFailure.find({userId: root.id})
            }
    
        }*/

    }





}