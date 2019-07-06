const mongoose = require('mongoose');


// Define schema
const Schema = mongoose.Schema;

const CourseSchema = new Schema({

    title: {
        type: 'String',
        validator: async title => Course.isExisting(title),
        message: ({
            value
        }) => `Ce cours ${title} existe déjà`
    },
    subtitle: {
        type: 'String'
    },
    introduction: {
        type: 'String'
    },
    modules: [{
        type: Schema.Types.ObjectId,
        ref: 'Module'
    }],
    objectives: {
        type: [
            'String'
        ]
    },
    requirements: {
        type: [
            'String'
        ]
    }
}, {
    timestamps: true
})

CourseSchema.statics.isExisting = async function (params) {
    return await this.where(params).countDocuments() === 0
}

CourseSchema.statics.findByTitle = function (title, cb) {
    this.find({
        title: new RegExp(title, 'i')
    }, cb)
}

CourseSchema.static.findByCourseId = function (id, cb) {
    this.find({
        courseId: id
    }, cb)
}



const course = mongoose.model('course', CourseSchema);

export default course