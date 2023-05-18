"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.deleteuserService = void 0;
const dynamoDB_connect_1 = require("../config/dynamoDB.connect");
const users_controller_1 = require("../controllers/users.controller");
const Auth_1 = require("../utils/Auth");
const jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
// Building connection with Dynamo Db
const SECRET_KEY = "CRUDAPI";
// Creating instance of Users Credantials Authentication
const userValdChk = new Auth_1.userAuth();
// Get all user from Dynamo DB
class deleteuserService {
    async deleteOneUser(id, username, password, tobeDeleteId) {
        const data = { id, username, password, tobeDeleteId };
        const params = {
            TableName: "usersDB",
            Key: {
                id: tobeDeleteId,
            },
        };
        const resp = await users_controller_1.userdbInstance.getOneUser(id);
        if (resp) {
            const isValidUser = userValdChk.userCred(data.username, resp.username, data.password, resp.password);
            // verfication of generated token
            const Token = jsonwebtoken_1.default.verify(resp.Token, SECRET_KEY);
            if ((await isValidUser) && Token) {
                if (resp.role == "admin") {
                    const result = await dynamoDB_connect_1.DynamoDB.delete(params).promise();
                    return result;
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
            console.log(`Record not Present!`);
        }
    }
}
exports.deleteuserService = deleteuserService;
