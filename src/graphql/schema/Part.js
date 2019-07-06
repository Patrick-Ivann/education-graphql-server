import { gql } from "apollo-server-core";

export const typeDef = gql`



type Part {
    id :ID!
    title: String! #sommaire 
    articleId: String!
    content: String! #contenu de l'éditeur
    createdAt: String!
    updatedAt: String!
}


extend type Query {
    parts: [Part!]!
    part(id: ID!): Part
    
}

extend type Mutation {
    pushPart(content: String!, title: String!, articleId: ID!): Part
    updatePart(id:String!,content: String, title: String): Part
    popPart(title: String!, id:ID!): ID

 }



extend type Subscription {
     newPart: Part
 }

`

