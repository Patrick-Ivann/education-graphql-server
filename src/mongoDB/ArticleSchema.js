const mongoose = require('mongoose');


// Define schema
const Schema = mongoose.Schema;

const ArticleSchema = new Schema({


    "title": {
        type: String,
        validator: async title => Article.isExisting(title),
        message: ({
            value
        }) => `Cette article ${title} existe déjà`
    },

    "parts": [{
        type: Schema.Types.ObjectId,
        ref: 'Course'
    }],

    "moduleId" : {type:"String"},


    "subtitle": {
        type: String,
    },
    "version": {
        type: Number,
    },
    "objectives": [{
        type: String,

    }],
    "encoding": {
        type: String,
    },
    "time": {
        type: String,
    },
    "requirements": [{
        type: String,
    }],
    "difficulty": {
        type: String,

    },
    "introduction": {
        type: String,
    }, //"origines"





}, {
    timestamps: true
})


ArticleSchema.statics.isExisting = async function (params) {
    return await this.where(params).countDocuments() === 0
}

ArticleSchema.statics.findByTitle = function (title, cb) {
    this.find({
        title: new RegExp(title, 'i')
    }, cb)
}

ArticleSchema.statics.findByModuleId = function (id, cb) {
    this.find({
        moduleId: id
    }, cb)
}




const article = mongoose.model('article', ArticleSchema);

export default article