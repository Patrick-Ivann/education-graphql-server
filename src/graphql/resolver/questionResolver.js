import {
    mongoObjectId
} from "../../utils";
import {
    PubSub
} from "graphql-subscriptions";
import Question from "../../mongoDB/QuestionSchema";
import {
    Types
} from "mongoose";


PubSub
export const RESOLVERMONGO = {


    Query: {

        questions: () => {
            return Question.find({})
        },
        question: (root, args) => {

            if (!Types.ObjectId.isValid(args.id)) {
                throw new UserInputError(`${args.id} cette ID n'est pas valide. `)
            }

            return Question.findById(args.id)
        }
    },

    Mutation: {
        pushQuestion: async (root, args) => {



            const newQuestion = new Question({
                id: mongoObjectId(),
                title: args.title,
                possibilities: args.possibilities.split(','),
                articleId: args.articleId,
                moduleId: args.moduleId,
                answer: args.answer
            })

            let insertedQuestion = await newQuestion.save()

            if (!insertedQuestion) {
                console.log('---question save failed')
                throw new Error('---question save failed')
            }
            return insertedQuestion

        },
        popQuestion: (root, args) => {

            Question.findByTitle(args.title, () => {
                Question.findByIdAndDelete(args.id, (err, result) => {
                    if (err) {
                        console.error(err)
                    }

                    return args.id
                })
            })
        },

        updateQuestion: (root, args) => {
            var question = {}

            args.title && (question.title = args.title)
            args.possibilities && (question.possibilities = args.possibilities.split(","))
            args.articleId && (question.articleId = args.articleId)
            args.moduleId && (question.moduleId = args.moduleId)
            args.answer && (question.answer = args.answer)

            Question.findByIdAndUpdate(args.id, {
                $set: {
                    question
                }
            }, {
                new: true
            }).then((result) => {
                return result
            }).catch((err) => {
                console.error(err)
            });
        }
    }

}