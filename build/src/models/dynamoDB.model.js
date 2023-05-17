"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.dbSchema = void 0;
class dbSchema {
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
exports.dbSchema = dbSchema;
