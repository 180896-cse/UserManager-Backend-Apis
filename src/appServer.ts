import AWS, { Config } from "aws-sdk";
import { ApolloServer } from "@apollo/server";
// import { ApolloServer } from "apollo-server";
import { ApolloServerPluginLandingPageGraphQLPlayground } from "apollo-server-core";
import { startServerAndCreateLambdaHandler, handlers } from '@as-integrations/aws-lambda';
import serverless from 'serverless-http';
import { startStandaloneServer } from '@apollo/server/standalone';
import path from "path";


//importing typedefs/ model from model folder
import {dbSchema} from "./models/dynamoDB.model";

//importing resolvers of type defs
import {userSchemaResolver} from "./controllers/users.controller";


// Building connection with Dynamo Db
import {Table} from "./config/dynamoDB.connect";



//reading .env file
require('dotenv').config({ path: path.resolve(__dirname, '../.env') });




// assigning port to run server
const port = process.env.PORT;


//instance of typedefs/schema
const DbSchema = new dbSchema();
const typeDefs = DbSchema.dbTypedefs();


//instance of resolver
const userResolver = new userSchemaResolver();
const resolvers = userResolver.schemaResolver();




// creating instance of an apollo server, containing typedefs, resolvers, plugins

const apolloServer:ApolloServer = new ApolloServer({
  typeDefs,
  resolvers,
  introspection: process.env.NODE_ENV !== 'production',
 
  // context: async ({ req, res }) => ({token: req.headers.authorization}), 
  // plugins: [ApolloServerPluginLandingPageGraphQLPlayground()],

});
startStandaloneServer(apolloServer, {
  // Your async context function should async and
  // return an object
  context: async ({ req, res }) => ({token: req.headers.authorization}),
});

// Starting the apollo server
// apolloServer.listen(port).then(({url})=>{console.log(`Graph Ql Server is live over: ${url}`)}).catch((err:String)=>{
//     console.log(`error occured at creation of server ${err}`);
    
// })


 
  // This final export 
  export const graphqlHandler = startServerAndCreateLambdaHandler(
    apolloServer,
    // We will be using the Proxy V2 handler
    handlers.createAPIGatewayProxyEventV2RequestHandler(),
  );
  
  