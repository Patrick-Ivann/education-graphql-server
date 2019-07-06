const mongoose = require('mongoose');


// Define schema
const Schema = mongoose.Schema;

const PartSchema = new Schema({

    title: {
        type: 'String'
    },
    content: {
        type: 'String'
    },

    articleId :{type: 'String'} 

}, {
    timestamps: true
})



PartSchema.statics.findByArticleId = function (id, cb) {
    console.log(id)
    this.find({
        articleId: id
    }, cb)
}
const part = mongoose.model('part', PartSchema);
export default part