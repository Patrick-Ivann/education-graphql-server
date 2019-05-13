import { gql } from "apollo-server-core";

export const typeDef = gql`



type Image {
    id: ID!
    title: String!
    path: String!
    filename: String!
    mimetype: String!
    encoding: String!
    createdAt : String!
}


extend type Query {
        images: [Image]

}


 extend type Mutation {
     uploadSingleFile(file: Upload!,title:String!): Image!
 }



 extend type Subscription {
     newImage: Image
 }


`