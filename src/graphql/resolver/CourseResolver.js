import {
    courses,
    COURSE_SUBSCRIPTION_TOPIC,
    modules
} from "../Resolvers";
import {
    mongoObjectId
} from "../../utils";


import {
    PubSub
} from "graphql-subscriptions";


const pubsub = new PubSub();


/**
 * TODO ADD MONGOOSE AND MODULES SUPPORT
 * !GOOD RESOLVER
 */


export const RESOLVERMONGO = {

    Query: {

        courses: () => {

            return Course.find({});
        },
        course: (root, args) => {

            if (!mongoose.Types.ObjectId.isValid(args.id)) {
                throw new UserInputError(`${args.id} cette ID n'est pas valide. `)
            }

            return Course.findById(args.id)
        }

    },

    Mutation: {

        pushCourse: async (root, args, context) => {

            await Joi.validate(args, pushCourse)

            const newCourse = new Course({

                id: mongoObjectId(),
                title: args.title,
                subtitle: args.subtitle,
                introduction: args.introduction,
                //  modules: args.modules,
                objectives: args.objectives.split(','),
                requirements: args.requirements.split(',')
            })



            newCourse.save((err, result) => {
                if (err) {
                    console.log("---course save failed " + err)
                }
                console.log("+++course saved successfully ")
                console.log(result)

                return result


            })

        },
        popCourse: (root, args) => {

            Course.findByTitle(args.title, () => {
                Course.findByIdAndDelete(args.id, (err, result) => {
                    if (err) {
                        console.log(err)
                    }

                    return args.id
                })
            })

        },

        updateCourse: (root, args) => {

            var course = {}

            args.title && (course.title = args.title)

            args.subtitle && (course.subtitle = args.subtitle)

            args.introduction && (course.introduction = args.introduction)

            args.modules && (course.modules = args.modules)

            args.objectives && (course.objectives = args.objectives.split(","))

            args.requirements && (course.requirements = args.requirements.split(","))




            Course.findByIdAndUpdate(args.id, {
                $set: {
                    course
                }
            }, {
                new: true
            }).then((result) => {

                return result
            }).catch((error) => console.log(error))
        }
    },


    Course: {

       async modules(root, args, context, info) {
            return await Module.findByCourseId(root.id)

        }
    }

}


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
                console.log(element.id + "  r  " + args.id)
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

        updateCourse: (root, args) => {

            courses.map(course => {
                if (course.id === args.id) {




                    args.title && (title = args.title)

                    args.subtitle && (subtitle = args.subtitle)

                    args.introduction && (introduction = args.introduction)

                    args.modules && (modules = args.modules)

                    args.objectives && (objectives = args.objectives.split(","))

                    args.requirements && (requirements = args.requirements.split(","))



                    return course;
                }
            });
            return courses.filter(course => course.id === args.id)[0];

        }




    },
    Subscription: {

    },

    Course: {

        modules(root, args, context, info) {
            return modules.filter(module => module.courseId === root.id)

        }
    }




}