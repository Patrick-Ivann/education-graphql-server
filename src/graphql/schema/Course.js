import {
    gql
} from "apollo-server-core";

export const typeDef = gql `

type Course { #pour le moment on en a qu'un on peut limiter pousser ça en dur dans la BDD on va juster Update un des document à chaque fois 
    id: ID!
    title: String!
    subtitle: String!
    introduction : String!
    modules: [Module!]!
    objectives: [String!]
    requirements: [String!]
}


extend type Query {
    courses: [Course!]!
    course(id:String!) :Course!
}

extend type Mutation {
    
    pushCourse(title:String!,
        subtitle:String!,
        objectives:String!, #to split
        requirements:String!, #to split
        introduction:String!): Course!
        
        updateCourse(id:String!,
            title:String!,
            subtitle:String!,
            objectives:String!, #to split
            requirements:String!, #to split
            introduction:String!
        ): Course!
        
    popCourse(title: String!, id:ID!): ID
}



`