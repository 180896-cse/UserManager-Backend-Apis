"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.updateuserService = void 0;
const dynamoDB_connect_1 = require("../config/dynamoDB.connect");
const users_controller_1 = require("../controllers/users.controller");
const Auth_1 = require("../utils/Auth");
const jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
// Building connection with Dynamo Db
const SECRET_KEY = "CRUDAPI";
// Creating instance of Users Credantials Authentication
const userValdChk = new Auth_1.userAuth();
// Get all user from Dynamo DB
class updateuserService {
    async updateUser(id, username, password, toUpdateValue) {
        const data = { id, username, password, toUpdateValue };
        const params = {
            TableName: "usersDB",
            Key: {
                id: data.id,
            },
            UpdateExpression: "SET username = :updateVal",
            ExpressionAttributeValues: {
                ":updateVal": data.toUpdateValue,
            },
            ReturnValues: "UPDATED_NEW"
        };
        // console.log(params);
        const resp = await users_controller_1.userdbInstance.getOneUser(data.id);
        if (resp) {
            const isValidUser = userValdChk.userCred(data.username, resp.username, data.password, resp.password);
            // verfication of generated token
            const Token = jsonwebtoken_1.default.verify(resp.Token, SECRET_KEY);
            if ((await isValidUser) && Token) {
                if ((resp.role == "admin")) {
                    return await dynamoDB_connect_1.DynamoDB.update(params).promise();
                }
                else {
                    console.log(`not an admin user!`);
                }
            }
            else {
                console.log(`invalid cred!`);
            }
        }
        else {
            console.log(`Record not Found!!`);
        }
    }
}
exports.updateuserService = updateuserService;
