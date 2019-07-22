const mongoose = require('mongoose');
import {
    hash,
    compare
} from "bcryptjs";


// Define schema
const Schema = mongoose.Schema;

const UserSchema = new Schema({



    "courses": {
        type: Schema.Types.ObjectId,
        ref: 'Course'
    },

    "username": {
        type: String,
        validator: async username => User.isExisting(username),
        message: ({
            value
        }) => `Pseudo ${username} déjà pris`
    },

    "mail": {
        type: String,
        validator: mail => User.isExisting(mail),
        message: ({
            value
        }) => `Email ${mail} déjà pris`
    },
    "firstname": {
        type: String,
    },
    "lastname": {
        type: String,
    },
    "password": {
        type: String,

    },
    "enrolledCourse":{
        type: [String]
    },
    "rank": {
        type: String,
    }, //"origines"

    "lastConnection": {
        type: Date,
    },


    "timeSpent": {
        type: String,
        default: "1"
    }



}, {
    timestamps: true
})


UserSchema.pre("save", async function (next) {
    if (this.isModified('password')) {
        try {
            this.password = await hash(this.password, 12)
        } catch (error) {
            next(error)
        }
    }

    next()
})

UserSchema.statics.isExisting = async function (params) {
    return await this.where(params).countDocuments() === 0
}

UserSchema.statics.findByLogin = function (mail, cb) {
    this.find({
        mail: new RegExp(mail, 'i')
    }, cb)
}


UserSchema.methods.checkPasswordEquals = function (password) {
    return compare(password, this.password)
}






const User = mongoose.model('user', UserSchema);
export default User;