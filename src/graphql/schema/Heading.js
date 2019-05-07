import {
    gql
} from "apollo-server-core";

export const typeDef = gql `



type Heading {
    id: ID!
    title: String!
    subtitle: String!
    version: Int!
    objectives: [String]!
    encoding: String!
    readingTime : String!
    requirements: String!
    difficulty: String!

}


extend type Query {
        Heading: [Heading]

}


 extend type Mutation {
     AddHeading(file: Upload!title: String!
         subtitle: String!
         version: Int!
         objectives: [String] !
         encoding: String!
         readingTime: String!
         requirements: String!
         difficulty: String!): Heading!
 }






`