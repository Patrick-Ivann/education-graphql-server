import {
    unlinkSync,
    createWriteStream
} from 'fs';
import {
    join
} from 'path';
import {
    getRandomString
} from '../utils';

const {
    PubSub,
} = require('graphql-subscriptions');

const pubsub = new PubSub();
export const ARTICLE_SUBSCRIPTION_TOPIC = 'newarticle';
export const FILE_SUBSCRIPTION_TOPIC = "IMAGE_ADDED";
export const PART_SUBSCRIPTION_TOPIC = "newpart";
export const MODULE_SUBSCRIPTION_TOPIC = "newmodule";
export const USER_SUBSCRIPTION_TOPIC = "newuser";
export const COURSE_SUBSCRIPTION_TOPIC = "newcourse"

export const parts = [];
export const images = [];
export const users = [];
export const courses = [];
export const modules = [];
export const articles = [];
// GraphQL: Resolvers

import {
    RESOLVERMONGO as article
} from "./resolver/ArticleResolver";
import {
    RESOLVERS as image
} from "./resolver/ImageResolver";
import {
    RESOLVERMONGO as part
} from "./resolver/PartResolver";
import {
    RESOLVERMONGO as module
} from "./resolver/ModulesResolver";
import {
    RESOLVERMONGO as course
} from "./resolver/CourseResolver";
import {
    RESOLVER as user
} from "./resolver/UserResolver";

import {
    RESOLVERMONGO as question
} from "./resolver/questionResolver";



// const authResolvers = mapValues(mergeResolvers(resolvers), (resolver, type) =>
//   mapValues(resolver, (item) => {
//     if (type !== 'Mutation' && type !== 'Query') return item; // skip type resolvers
//     const { name = '' } = item;
//     const isPrivate = isPrivateOperation(name);
//     if (isPrivate) return authenticated(item);
   
//     return item;
//   }));
const   RESOLVERS =  [article, image, part, module, course, question, user]


/* const RESOLVERS = {
    Query: {
        parts: () => parts,
        images: () => images,
        parts: () => parts,
        users: () => users,
        courses: ()=> course,
        modules: () => modules,
        articles: () => articles
    },

    Mutation: {
        pushArticle: (root, args) => {
            const newArticles = {
                title: args.title,
                content: args.content
            };
            parts.push(newArticles);

            pubsub.publish(ARTICLES_SUBSCRIPTION_TOPIC, {
                newArticles,
            });


            return newArticles;
        },



        uploadSingleFile: async (root, args) => {

            const {
                createReadStream,
                filename,
                mimetype,
                encoding
            } = await args.file;




            let path = join(__dirname, '../images/') + images.length + 1 + "-" + filename
            
            const newFile = {
               // id: images.length + 1,
                id : getRandomString(16),
                title : args.title,
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
            
            // const {ok , errors, payload } = await (async () =>{
                
            //     console.log("ddddd")
            //     let filepath = `/images/${id}-${filename}`;
            //     return new Promise((resolve, reject) => {
            //         stream.on("error",err=>{
            //             if (stream.truncated) {
            //                 unlinkSync(filepath);
            //             }

            //             console.log(err)

            //             reject({ok: false,errors:err})
            //         })
            //         stream
            //         .pipe(createWriteStream(filepath))
            //         .on('error', err => { console.log(err), reject({ok: false, errors:err})})
            //         .on('finish', () => {
            //             filepath = filepath.split(".")
            //             filepath.shift()
            //             filepath = filepath.join(".")

            //             return resolve({ok: true , payload: {
            //                 path: filepath
            //             }})
            //         })
                
            //     });


            // })

            // pubsub.publish(ARTICLES_SUBSCRIPTION_TOPIC, {

            //     newFile,
            // });

            

            return newFile
        }
    },

    Subscription: {
        newArticle: {
            subscribe: () => pubsub.asyncIterator(ARTICLES_SUBSCRIPTION_TOPIC),
        },

        newImage: {
            subscribe: () => pubsub.asyncIterator([FILE_SUBSCRIPTION_TOPIC]),
        },
    },

}; */
// Exports
export default RESOLVERS;