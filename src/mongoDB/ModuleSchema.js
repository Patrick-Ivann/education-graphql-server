const mongoose = require('mongoose');


// Define schema
const Schema = mongoose.Schema;

const moduleSchema = new Schema({
	
	title: {
        type: 'String',
        validator: async title => module.isExisting(title),
        message: ({
            value
        }) => `Ce module ${title} existe déjà`
	},
	subtitle: {
		type: 'String'
	},
	introduction: {
		type: 'String'
	},
	chapters: [{
        type: Schema.Types.ObjectId,
        ref: 'Article'
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
	},
	courseId :{type: "String"}
}, {
    timestamps: true
})

moduleSchema.statics.isExisting = async function (params) {
    return await this.where(params).countDocuments() === 0
}

moduleSchema.statics.findByTitle = function (title, cb) {
    this.find({
        title: new RegExp(title, 'i')
    }, cb)
}

moduleSchema.statics.findByCourseId = function (id, cb) {
    this.find({
        moduleId: id
    }, cb)
}


const module = mongoose.model('module', moduleSchema);

export default module