import {
    ApolloServer
} from 'apollo-server-express';
// Imports: GraphQL TypeDefs & Resolvers
import TYPEDEFS from './Types.js';
import RESOLVERS from './Resolvers.js';

import {typeDef as Article} from './schema/Article'
import {typeDef as Image} from './schema/Image'
import { typeDef as User } from './schema/User';
import { typeDef as Module } from './schema/Module'
import { typeDef as Course } from './schema/Course'
import { typeDef as Part } from './schema/Part'

// GraphQL: Schema



const APOLLOSERVER = new ApolloServer({
    
    typeDefs: [TYPEDEFS,Article,Image,User,Module,Course,Part],
    resolvers: RESOLVERS,
    context : async () =>({
        secret: process.env.JWT_SECRET,

    }),
    subscriptions: {
        path:'/subscription',
        onConnect: () => console.log('Connected to websocket'),
  },
    playground: {
        endpoint: `http://localhost:4000/graphql`,
        settings: {
            'editor.theme': 'dark'
        }
    },
    debug:true,
      tracing: true,

});
// Exports
export default APOLLOSERVER;