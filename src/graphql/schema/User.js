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
    userTrackingByCourse : UserTrackingByCourse
    tracking : Tracking
    createdAt: String!
    updatedAt: String!
}

type UserTrackingByCourse {
    enrolledCourseTest : [String]
    nestTracking : Tracking
}

type CurrentReading {
    moduleId:String
    articleId: String
}

type Token {
    token: String!
    refreshToken : String!
    user: User
  }

type Tracking {
    currentArticle: CurrentReading
    totalTime:String
    chapterTime: String
    courseProgress: String
    test : String,
    chapterGrade:String,
    moduleGrade:String,

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
    answerType(type:String): String!
}

type Progress {
    userId: String!,
    articleId: String,
    timeSpent:String!
    moduleId: String!
    courseId: String!
}

extend type Query {
    users: [User!]
    user(id:ID): User
    himself: User @isAuthenticated
    isAuthenticated: String @isAuthenticated

    userOnCourse(courseId:String!):User

    userTracking(courseId:String!userId:String):Tracking
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
pushSuccess( articleId: String, moduleId:String, surveyType:String!, questionId:String! ):Boolean

pushProgress( articleId: String!, moduleId: String!,courseId:String!):Boolean
updateProgress( articleId:String,ModuleId:String):User
updateProgressTime(timeSpent:String, articleId:String):User
enrolledToCourse(courseId: String):User
 }



extend type Subscription {
     newUser: User
 }


`