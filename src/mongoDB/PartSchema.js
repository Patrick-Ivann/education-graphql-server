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



}, {
    timestamps: true
})



PartSchema.methods.findByModuleId = function (id, cb) {
    this.find({
        articleId: id
    }, cb)
}
const part = mongoose.model('part', PartSchema);
export default part