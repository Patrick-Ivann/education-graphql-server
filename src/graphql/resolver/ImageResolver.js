import {
    unlinkSync,
    createWriteStream
} from 'fs';
import {
    join
} from 'path';
import {
    getRandomString
} from '../../utils';
import { mongoObjectId } from '../../utils';

const {
    PubSub,
} = require('graphql-subscriptions');

const pubsub = new PubSub();

export const RESOLVERS = {

    Query: {
        images: () => images,

    },

    Mutation: {

        uploadSingleFile: async (root, args) => {

            const {
                createReadStream,
                filename,
                mimetype,
                encoding
            } = await args.file;




            let path = join(__dirname, '../../../images/') + images.length + 1 + "-" + filename

            const newFile = {
                // id: images.length + 1,
                id: mongoObjectId(),
                title: args.title,
                path: path,
                filename: filename,
                mimetype: mimetype,
                encoding: encoding,
            };
            images.push(newFile);


            const stream = createReadStream()

            stream.pipe(createWriteStream(join(__dirname, '../../images/') + newFile.id + "-" + newFile.filename))


            pubsub.publish(FILE_SUBSCRIPTION_TOPIC, {
                newImage: newFile,
            });




            return newFile
        }
    },

    Subscription: {

        newImage: {
            subscribe: () => pubsub.asyncIterator([FILE_SUBSCRIPTION_TOPIC]),
        },
    },


}