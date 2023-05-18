import AWS from "aws-sdk";
import path from "path";


//reading .env file
require('dotenv').config({ path: path.resolve(__dirname, '../.env') });
// connection check

AWS.config.update({
  accessKeyId: process.env.accessKeyId,
  secretAccessKey:  process.env.secretAccessKey,
  region: "us-east-1",
});
//  var db =  new AWS.DynamoDB.DocumentClient();
const Table: string = "usersDB";
const DynamoDB = new AWS.DynamoDB.DocumentClient();
console.log(`connection with Dynamo DB is sucess!`);

export { Table, DynamoDB };
