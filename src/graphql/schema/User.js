import { gql } from "apollo-server-core";

export const typeDef = gql`

directive @isAuthenticated  on QUERY | FIELD | FIELD_DEFINITION


type User {
    id: ID!
    username: String!
    mail: String!
    firstname: String!
    lastname: String!
    password: String!
    rank: Int! # 0 = user, 1 = admin
    #courses: [Course!] # Les cours qu'il a payé
    createdAt : String!
}

type Token {
    token: String!
  }


extend type Query {
    users: [User!]
    user(id:ID): User
    himself: User @isAuthenticated
    isAuthenticated: String @isAuthenticated
   # deleteUser(password: String!, id:ID!): ID
}

 extend type Mutation {


popUser(password: String!, id:ID!): ID
    #signUp(
       # username :String!
       # mail: String!
       # firstname :String!
       # lastname: String!
       # password: String!
      #): Token

     # signIn(mail: String!, password: String!): Token

     signUp(
         username :String!
         mail: String!
         firstname :String!
         lastname: String!
         password: String!
       ): User
 
       signIn(mail: String!, password: String!): User

      signOut: Boolean





     pushUser(username :String!
        mail: String!
        firstname :String!
        lastname: String!
        password: String!): Token!

updateUser(username :String
        mail: String
        firstname :String
        lastname: String
        password: String): User
 }



extend type Subscription {
     newUser: User
 }


`