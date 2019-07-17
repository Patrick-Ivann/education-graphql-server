const mongoose = require('mongoose');


// Define schema
const Schema = mongoose.Schema;

const userAnswerSchema = new Schema({


    articleId: {
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
    }
}, {
    timestamps: true
})



const userAnswer = mongoose.model('userAnswer', userAnswerSchema);
export default userAnswer;