const mongoose = require('mongoose');


// Define schema
const Schema = mongoose.Schema;

const QuestionSchema = new Schema({

    "title": {
        type: String,
        validator: async title => Question.isExisting(title),
        message: ({
            value
        }) => `Cette question ${title} existe déjà`
    },


    "articleId" : {type:"String"},
    "moduleId" : {type:"String"},


    "answer": {
        type: String,
    },
    
    "possibilities": [{
        type: String,

    }],




}, {
    timestamps: true
})





    
const question = mongoose.model('question', QuestionSchema);

export default question