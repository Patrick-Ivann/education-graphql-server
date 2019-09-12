const mongoose = require('mongoose');


// Define schema
const Schema = mongoose.Schema;

const UserProgressSchema = new Schema({


    userId: {
        type: "String"
    },

    articleId: {
        type: "String"
    },

    moduleId: {
        type: "String"
    },
    courseId: {
        type: "String"
    },

    timeSpent: {
        type: "String",
        default: "1"
    },
}, {
    timestamps: true,
    toObject: { virtuals: true },
    toJSON: { virtuals: true }
})

UserProgressSchema.virtual('timeSpentInt').get(function() { 
    console.log(this.timeSpent),
    // console.log(this)
    console.log(typeof(this.timeSpent))
    return parseInt(this.timeSpent); });


const UserProgress = mongoose.model('userProgress', UserProgressSchema);
export default UserProgress;