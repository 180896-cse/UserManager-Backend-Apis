import { ApolloServer } from "@apollo/server";

// Defining typedefs or Schema:

interface IdbSchema {
  dbTypedefs(): any;
}

export class dbSchema implements IdbSchema {
  dbTypedefs() {
    const typeDefs = `#graphql
      type User {
        id: Int!
        name: String!
        username: String!
        password: String!
        role:String!
      }
     
      type Query {
        isServerUp: String
        getUsers: [User]
        getUser(id: Int!): User
        userLogin(id:Int!,username: String!, password: String!):[User]
      }

      type Mutation {
        addUser(
          id: Int!
          name: String!
          username: String!
          password: String!
          role: String!
        ): User
        
        updateUser(id: Int!, username: String!, password: String!, toUpdateValue: String!): User

        deleteUser(id: Int!,username: String!, password: String!, tobeDeleteId: Int!): User
      } 
    `;
    return typeDefs;
  }
}
