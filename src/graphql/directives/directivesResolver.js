



import {
  AuthenticationError
} from 'apollo-server-core';
import { tradeTokenForUser } from '../resolver/utils/authHelpers';
import { defaultFieldResolver } from "graphql"

import { SchemaDirectiveVisitor } from 'graphql-tools';


 export class isAuthenticated extends SchemaDirectiveVisitor {



  visitFieldDefinition(field) {

    const { resolve = defaultFieldResolver } = field;

    field.resolve = async function (...args) {


      const [,,context] = args
      const result = await resolve.apply(this, args);






      let  currentUser = null 

      if (!context || !context.req || !context.req.session.userId) {
        throw new Error(`Unauthorized`);
      }
  
      const authToken = context.req.session.userId;
  
      if (authToken) {
         currentUser = await tradeTokenForUser(authToken);
  
      }
      if (currentUser) {


  
        return result;

      }



    }
  }
} 




/* 
export const directiveResolvers = {
  isAuthenticated: async(next, source, args, context) => {

    console.log("object")

    if (!context || !context.req || !context.req.session.userId) {
      throw new Error(`Unauthorized`);
    }

    authToken = req.session.userId;

    if (authToken) {
      currentUser = await tradeTokenForUser(authToken);

      console.log(currentUser)
    }
    if (currentUser) {

      return next();
    }

  },
  hasRole: (next, source, {
    role
  }, ctx) => {
    const user = ctx.currentUser
    if (role === user.role) return next();
    throw new Error(`Must have role: ${role}, you have role: ${user.role}`)
  },
} */