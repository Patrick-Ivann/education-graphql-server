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
    timestamps: true
})



const UserProgress = mongoose.model('userProgress', UserProgressSchema);
export default UserProgress;