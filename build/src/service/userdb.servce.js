"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.userdbService = void 0;
const dynamoDB_connect_1 = require("../config/dynamoDB.connect");
// Get all user from Dynamo DB
class userdbService {
    async getAllUsers() {
        const params = {
            TableName: "usersDB",
        };
        const result = await dynamoDB_connect_1.DynamoDB.scan(params).promise();
        return result.Items;
    }
    async getOneUser(key) {
        const params = {
            TableName: "usersDB",
            Key: {
                id: key,
            },
        };
        const result = await dynamoDB_connect_1.DynamoDB.get(params).promise();
        return result.Item;
    }
    async getUserLogin(key, password) {
        const params = {
            TableName: "usersDB",
            Key: {
                id: key,
            },
        };
        const result = await dynamoDB_connect_1.DynamoDB.get(params).promise();
        return result.Item;
    }
}
exports.userdbService = userdbService;
