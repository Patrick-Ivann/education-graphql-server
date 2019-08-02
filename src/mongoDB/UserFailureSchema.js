import to from '../utils';

const mongoose = require('mongoose');


// Define schema
const Schema = mongoose.Schema;

const userAnswerSchema = new Schema({


    articleId: {
        type: "String"
    },
    courseId: {
        type: "String"
    },
    userId: {
        type: "String"
    },
    moduleId: {
        type: "String"
    },
    questionId: {
        type: "String"
    },
    surveyType: {
        type: "String"
    },

    answerType: {
        type: "String"
    },

    firstAttempt: {
        type: Boolean,
        default: false
    },
}, {
    timestamps: true
})

userAnswerSchema.pre("save", async function (next) {

    var re = new RegExp(this.userId, 'i');
    var questionId = new RegExp(this.questionId, 'i');
    var surveyType = new RegExp(this.surveyType, 'i');

    var err, answer;
    [err, answer] = await to(mongoose.models["userAnswers"].find({
        userId: {
            $regex: re
        },
        questionId: {
            $regex: questionId
        },
        surveyType: {
            $regex: surveyType
        }
    }));
    if (answer.length === 0) {
        this.firstAttempt = true;
    }

    next();
})


const userAnswer = mongoose.model('userAnswers', userAnswerSchema);
export default userAnswer;