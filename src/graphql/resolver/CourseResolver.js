import {
    courses, COURSE_SUBSCRIPTION_TOPIC
} from "../Resolvers";
import {
    mongoObjectId
} from "../../utils";


import { PubSub } from "graphql-subscriptions";


const pubsub = new PubSub();


/**
 * TODO ADD MONGOOSE AND MODULES SUPPORT
 * !GOOD RESOLVER
 */

export const RESOLVER = {


    Query: {

        courses: () => courses,
        
        course: (root, args) => {

            // if (!mongoose.Types.ObjectId.isValid(args.id)) {
            //     throw new UserInputError(`${args.id} cette ID n'est pas valide. `)
            // }

            // return User.findById(args.id)

            console.log(courses)
            courses.map((element) => {
                console.log(element.id + "  r  " + args.id )
                if (element.id === args.id) {
                    
                     return element
                }  
            })
        }

    },
    Mutation: {

        pushCourse: (root, args) => {
            const newCourse = {
                id: mongoObjectId(),
                title: args.title,
                subtitle: args.subtitle,
                introduction: args.introduction,
              //  modules: args.modules,
                objectives: args.objectives.split(','),
                requirements: args.requirements.split(',')
            };
            courses.push(newCourse);

            pubsub.publish(COURSE_SUBSCRIPTION_TOPIC, {
                newCourse,
            });


            return newCourse;
        },


        popCourse: (root, args) => {

            courses.splice(args.id - 1, 1)

            pubsub.publish(COURSE_SUBSCRIPTION_TOPIC, {
                courses,
            });


            return args.id;

        },

        updateCourse:(root,args) => {

            courses.map(course => {
                if (course.id === args.id) {


                      args.title && ( title = args.title)

                      args.subtitle && ( subtitle  = args.subtitle)
    
                     args.introduction && ( introduction =  args.introduction)
    
                     args.modules && ( modules = args.modules)
    
                     args.objectives && ( objectives = args.objectives.split(","))
    
                     args.requirements && ( requirements = args.requirements.split(","))
    


                    return course;
                }
            });
            return courses.filter(course => course.id === args.id)[0];

        }




    },
    Subscription: {

    }




}