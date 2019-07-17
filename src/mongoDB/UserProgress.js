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

}, {
    timestamps: true
})



const UserProgress = mongoose.model('userProgress', UserProgressSchema);
export default UserProgress;