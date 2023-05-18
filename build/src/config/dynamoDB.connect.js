"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.DynamoDB = exports.Table = void 0;
const aws_sdk_1 = __importDefault(require("aws-sdk"));
const path_1 = __importDefault(require("path"));
//reading .env file
require('dotenv').config({ path: path_1.default.resolve(__dirname, '../.env') });
// connection check
aws_sdk_1.default.config.update({
    accessKeyId: process.env.accessKeyId,
    secretAccessKey: process.env.secretAccessKey,
    region: "us-east-1",
});
//  var db =  new AWS.DynamoDB.DocumentClient();
const Table = "usersDB";
exports.Table = Table;
const DynamoDB = new aws_sdk_1.default.DynamoDB.DocumentClient();
exports.DynamoDB = DynamoDB;
console.log(`connection with Dynamo DB is sucess!`);
