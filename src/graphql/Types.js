import {
  makeExecutableSchema
} from 'graphql-tools';
// Imports: GraphQL
import {
    gql
} from 'apollo-server-express';

// GraphQL: TypeDefs
const TYPEDEFSLINKSCHEMA = gql `

#directive @isAuthenticated on FIELD | FIELD_DEFINITION
directive @hasRole(role: String) on FIELD | FIELD_DEFINITION




type Query {

  _:Boolean
  date : String
}


type Mutation {

  _: Boolean
}

type Subscription {

  _:Boolean
}
` 

// const TYPEDEFS = gql `
// type Query {
//   articles: [Article]
// }
// type Article {
//   title: String
//   content: String
// }

//   type Mutation {
//     pushArticle(content: String!, title: String!): Article
//       uploadSingleFile(file: Upload!):Image!
//   }


  
//   type Subscription {
//     newArticle: Article
//     newFile : Image
//   }




// type Image {
//   id: ID!
//     path: String!
//     filename: String!
//     mimetype: String!
//     encoding: String!
// }



// `;



// Exports
export default TYPEDEFSLINKSCHEMA;