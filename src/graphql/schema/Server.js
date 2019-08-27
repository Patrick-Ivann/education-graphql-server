import { gql } from "apollo-server-core";

export const typeDef = gql `
type Server {
    uptime:String!
   
}


extend type Query {
    servers: Server!
}


`