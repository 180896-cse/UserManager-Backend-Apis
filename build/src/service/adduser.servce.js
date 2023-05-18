"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.adduserService = void 0;
const dynamoDB_connect_1 = require("../config/dynamoDB.connect");
const users_controller_1 = require("../controllers/users.controller");
// Get all user from Dynamo DB
class adduserService {
    async addUser(id, name, username, password, Token, role) {
        const data = { id, name, username, password, Token, role };
        const params = {
            TableName: "usersDB",
            Item: data,
            ReturnValue: "ALL_NEW"
        };
        if (await users_controller_1.userdbInstance.getOneUser(id)) {
            console.log(`user already existed!`);
        }
        else {
            const result = await dynamoDB_connect_1.DynamoDB.put(params).promise();
            return result;
        }
    }
}
exports.adduserService = adduserService;
