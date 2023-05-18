"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.graphqlHandler = void 0;
const server_1 = require("@apollo/server");
const aws_lambda_1 = require("@as-integrations/aws-lambda");
const standalone_1 = require("@apollo/server/standalone");
const path_1 = __importDefault(require("path"));
//importing typedefs/ model from model folder
const dynamoDB_model_1 = require("./models/dynamoDB.model");
//importing resolvers of type defs
const users_controller_1 = require("./controllers/users.controller");
//reading .env file
require('dotenv').config({ path: path_1.default.resolve(__dirname, '../.env') });
// assigning port to run server
const port = process.env.PORT;
//instance of typedefs/schema
const DbSchema = new dynamoDB_model_1.dbSchema();
const typeDefs = DbSchema.dbTypedefs();
//instance of resolver
const userResolver = new users_controller_1.userSchemaResolver();
const resolvers = userResolver.schemaResolver();
// creating instance of an apollo server, containing typedefs, resolvers, plugins
const apolloServer = new server_1.ApolloServer({
    typeDefs,
    resolvers,
    introspection: process.env.NODE_ENV !== 'production',
    // context: async ({ req, res }) => ({token: req.headers.authorization}), 
    // plugins: [ApolloServerPluginLandingPageGraphQLPlayground()],
});
(0, standalone_1.startStandaloneServer)(apolloServer, {
    // Your async context function should async and
    // return an object
    context: async ({ req, res }) => ({ token: req.headers.authorization }),
});
// Starting the apollo server
// apolloServer.listen(port).then(({url})=>{console.log(`Graph Ql Server is live over: ${url}`)}).catch((err:String)=>{
//     console.log(`error occured at creation of server ${err}`);
// })
// This final export 
exports.graphqlHandler = (0, aws_lambda_1.startServerAndCreateLambdaHandler)(apolloServer, 
// We will be using the Proxy V2 handler
aws_lambda_1.handlers.createAPIGatewayProxyEventV2RequestHandler());
