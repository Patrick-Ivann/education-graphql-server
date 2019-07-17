import { gql } from "apollo-server-core";

export const typeDef = gql`

directive @isAuthenticated  on QUERY | FIELD | FIELD_DEFINITION
#enum questionTypeError {
#    CHAPTER
#    MODULE
#  }

type User {
    id: ID!
    username: String!
    mail: String!
    firstname: String!
    lastname: String!
    password: String!
    rank: Int! # 0 = user, 1 = admin
    #courses: [Course!] # Les cours qu'il a payé
    enrolledCourse : [String!]
    tracking : Tracking
    createdAt: String!
    updatedAt: String!
}

type Token {
    token: String!
    refreshToken : String!
  }

type Tracking {
    test : String,
surveyReport : [SurveyReport!]
#surveyFailure: [SurveyReport!],
#surveySucces: [SurveyReport]
progress: [Progress!]


} 
type SurveyReport {
    userId: String!,
    articleId:String,
    moduleId: String,
    questionId :String!,
    surveyType: String!,
    answerType: String!
}

type Progress {
    userId: String!,
    articleId: String!,
    moduleId: String!
    courseId: String!
}

extend type Query {
    users: [User!]
    user(id:ID): User
    himself: User @isAuthenticated
    isAuthenticated: String @isAuthenticated

    userOnCourse(courseId:String!):User
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

     refreshToken(token : String): String
     signUp(
         username :String!
         mail: String!
         firstname :String!
         lastname: String!
         password: String!
       ): User
 
       signIn(mail: String!, password: String!): Token

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


pushError( articleId: String, moduleId:String, surveyType:String!, questionId:String! ):User
pushSucces( articleId: String, moduleId:String, surveyType:String!, questionId:String! ):User

pushProgress( articleId: String!, moduleId: String!,courseId:String!):User
updateProgress( articleId:String,ModuleId:String):User
enrolledToCourse(courseId: String):User
 }



extend type Subscription {
     newUser: User
 }


`