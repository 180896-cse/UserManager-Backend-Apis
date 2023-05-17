"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
// import { ApolloServer } from "@apollo/server";
const apollo_server_1 = require("apollo-server");
const apollo_server_core_1 = require("apollo-server-core");
const path_1 = __importDefault(require("path"));
//importing typedefs/ model from model folder
const dynamoDB_model_1 = require("./models/dynamoDB.model");
//importing resolvers of type defs
const users_controller_1 = require("./controllers/users.controller");
//reading .env file
require('dotenv').config({ path: path_1.default.resolve(__dirname, './.env') });
// assigning port to run server
const port = process.env.PORT;
//instance of typedefs/schema
const DbSchema = new dynamoDB_model_1.dbSchema();
const typeDefs = DbSchema.dbTypedefs();
//instance of resolver
const userResolver = new users_controller_1.userSchemaResolver();
const resolvers = userResolver.schemaResolver();
// creating instance of an apollo server, containing typedefs, resolvers, plugins
const apolloServer = new apollo_server_1.ApolloServer({
    typeDefs,
    resolvers,
    // introspection: process.env.NODE_ENV !== 'production',
    plugins: [(0, apollo_server_core_1.ApolloServerPluginLandingPageGraphQLPlayground)()],
    context: ({ req }) => ({
        token: req.headers.authorization
    })
});
// Starting the apollo server
apolloServer.listen(port).then(({ url }) => { console.log(`Graph Ql Server is live over: ${url}`); }).catch((err) => {
    console.log(`error occured at creation of server ${err}`);
});
// This final export 
//   export const graphqlHandler = startServerAndCreateLambdaHandler(
//     apolloServer,
//     // We will be using the Proxy V2 handler
//     handlers.createAPIGatewayProxyEventV2RequestHandler(),
//   );
