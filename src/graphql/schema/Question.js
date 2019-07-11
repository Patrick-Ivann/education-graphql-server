import {
    gql
} from "apollo-server-core";

export const typeDef = gql `

type Question {
    id: ID!
    title:String!
    possibilities: [String!]!
    answer: String!
    articleId:String!
    moduleId:String! 
    createdAt:String!
    updatedAt:String!
}


extend type Query {
    questions: [Question!]!
    question(id:String!):Question!
}




extend type Mutation {
    
    pushQuestion(title:String!,
        possibilities:String!,
        articleId:String!,
        moduleId: String!,
        answer:String!): Question!
        
        updateQuestion(id:String  title:String!,
            possibilities:String!
            articleId:String!
            moduleId: String!
            answer:String!): Question!
        
    popQuestion(title: String!, id:ID!): ID
}

`