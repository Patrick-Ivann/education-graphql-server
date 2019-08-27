import {
    gql
} from "apollo-server-core";

export const typeDef = gql `


type Module { # on risque de là aussi tous les renseigner à la création du course unique pour le début et juste venir remplir par la suite le tableau d'article
    id: ID!
    title: String!
    subtitle: String! # ou genre petitre intro du modules
    introduction : String! #text
    firstArticle: Article
    chapters: [Article!]! #le nerf de la guerre le champs qui va se faire update le plus souvent certainement 
    questions: [Question!]!
    objectives: [String!] #string to split
    requirements: [String!] #string to split
}

extend type Query {
    modules: [Module!]!
    module(id: ID!): Module!
    moduleByCourse(courseId: String!):[Module!]
}

extend type Mutation {
    pushModule(title:String!
        subtitle:String!
        introduction:String!
        #chapters:String!
        objectives:String!
        requirements:String!,
        courseId: ID!): Module
        
        
        updateModule(id: String!
            title:String
            subtitle:String
            introduction:String
            chapters:String
            objectives:String
            requirements:String
            courseId: ID!): Module
            
        
        
        
        popModule(title: String!, id:ID!): ID
        }
extend type Subscription {
     newModule: Module
 }


`