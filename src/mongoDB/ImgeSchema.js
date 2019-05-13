const mongoose = require('mongoose');


// Define schema
const Schema = mongoose.Schema;

const ImageSchema = new Schema({

    title: {
        type: 'String'
    },
    path: {
        type: 'String'
    },

    path: {
        type: 'String'
    },
    filename: {
        type: 'String'
    },
    mimetype: {
        type: 'String'
    },
    encoding: {
        type: 'String'
    },



}, {
    timestamps: true
})

const image = mongoose.model('image', ImageSchema);

export default image