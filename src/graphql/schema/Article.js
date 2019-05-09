import { gql } from "apollo-server-core";

export const typeDef = gql`





type Article { #complété par 1000 text input ainsi qu'un petit textArea pour la partie intruduction (Editor)
    id: ID!
    title: String!
    subtitle: String!
    version: Int!
    objectives: [String!]!
    encoding: String!
    time: String!
    requirements: [String!]
    difficulty: String!
    introduction : String!
    parts: [Part!]
}




extend type Query {
    articles: [Article!]!
    article(id : ID!): Article!

}

 extend type Mutation {
     pushArticle(title:String!,
        subtitle:String!,
        version:Int!,
        objectives:String!, #to split
        encoding:String!, 
        time:Int!,
        requirements:String!, #to split
        difficulty:String!, 
        introduction:String!
        moduleId: ID!): Article!

    updateArticle(id: String!,
        title:String,
        subtitle:String,
        version:Int,    
        objectives:String, #to split
        encoding:String, 
        time:Int,
        requirements:String, #to split
        difficulty:String, 
        introduction:String
        moduleId: ID!): Article!


    popArticle(title: String!, id: ID!): ID!

    
 }



extend type Subscription {
     newArticle: Article
 }












`