import {
    ApolloError
} from 'apollo-server-express';
import {
    v4
} from 'uuid';
import {
    GraphQLError
} from 'graphql';

// import {
//     ERROR
// } from "./CONSTANTS.JS";
// import {
//     UNAUTHORIZED
// } from "./CONSTANTS.JS";
    // import {
    //     FORBIDDEN
    // } from "./CONSTANTS.JS";

const e401s = [{
        WRONG_PASSWORD: 'Mauvais Mot de passe'
    }, {
        WRONG_CREDENTIALS: 'Il n\'y a pas d\'utilisateur avec associé'
    },
    {
        DOES_NOT_EXIST: 'Il n\'y a pas d\'utilisateur associé'
    },
    {
        UNAUTHORIZED : 'UNAUTHORIZED'
    },

 {
        ALREADY_CONNECTED : 'déja connecté.'
    },
    
];

const e403s = ['Forbidden',"unavailable"];
// export const formatError = (err, response) => {
export const formatError = err => { // eslint-disable-line
    let error = err;
    const maskError = !(error.originalError instanceof ApolloError) && !e401s.includes(err.message) && !e403s.includes(err.message);
    if (process.env.NODE_ENV === 'production' && maskError) {
        const errId = v4();
        console.log('errId: ', errId);
        console.log(error);

        return new GraphQLError(`Internal Error: [Log id] ${errId}`);
    }
    if (e401s.includes(err.message)) {
        // We need this response status in the apollo client afterware
        error = {
            message: err.message,
            status: 401,
            location: err.location,
            path: err.path,
            extensions: {
                code: err.extensions.code,
            },
        }; // thus set the status in the error
    }
    if (e403s.includes(err.message)) {
        // We need this response status in the apollo client afterware
        error = {
            message: err.message,
            status: 403,
            location: err.location,
            path: err.path,
            extensions: {
                code: err.extensions.code,
            },
        }; // thus set the status in the error
        console.log(error)
    }
    return error;
};