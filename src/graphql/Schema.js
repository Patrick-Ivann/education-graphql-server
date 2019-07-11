import {
    ApolloServer
} from 'apollo-server-express';
// Imports: GraphQL TypeDefs & Resolvers
import TYPEDEFS from './Types.js';
import RESOLVERS from './Resolvers.js';

import {
    typeDef as Article
} from './schema/Article'
import {
    typeDef as Image
} from './schema/Image'
import {
    typeDef as User
} from './schema/User';
import {
    typeDef as Module
} from './schema/Module'
import {
    typeDef as Course
} from './schema/Course'
import {
    typeDef as Part
} from './schema/Part'
import {
    typeDef as Question
} from './schema/Question'
import {
    tradeTokenForUser
} from './resolver/utils/authHelpers.js';
import {
    corsWrapper
} from '../CORS.js';
import {
    formatError
} from './resolver/utils/formatError.js';

import {
    directiveResolvers, isAuthenticated
} from './directives/directivesResolver';

// GraphQL: Schema



const APOLLOSERVER = new ApolloServer({
    cors: corsWrapper(),

    typeDefs: [TYPEDEFS, Article, Image, User, Module, Course, Part,Question],
    resolvers: RESOLVERS,
    /* context: async ({
        req,
        res
    }) => {
        let authToken = null;
        let currentUser = null;


        if (!req || !req.session.userId) {
            throw new Error(`Unauthorized`);
        }

        try {
            console.log(req.session.userId);
            authToken = req.session.userId;

            if (authToken) {
                currentUser = await tradeTokenForUser(authToken);

                console.log(currentUser)
            }
        } catch (e) {
            console.warn(`Unable to authenticate using auth token: ${authToken}`);
        } */

    context: async ({
        req,
        res
    }) => {

        return {
            secret: process.env.JWT_SECRET,
            req,
            res,

        }
    },
    schemaDirectives : {
        isAuthenticated : isAuthenticated
        
    },
        subscriptions: {
        path: '/subscription',
        onConnect: () => console.log('Connected to websocket'),
    },
    playground: {
        endpoint: `http://localhost:4000/graphql`,
        settings: {
            'editor.theme': 'dark'     
        }
    },
    formatError: err => formatError(err),
    debug: true,
    tracing: true,
    
    plugins: [
        {
          requestDidStart({ request }) {
            //console.log(request.http);
            return {
              willSendResponse({ response }) {
               // console.log(response);
              },
            };
          },
        },
      ],

});
// Exports
export default APOLLOSERVER;