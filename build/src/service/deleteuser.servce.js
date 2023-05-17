"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
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
    deleteOneUser(id, username, password, tobeDeleteId) {
        return __awaiter(this, void 0, void 0, function* () {
            const data = { id, username, password, tobeDeleteId };
            const params = {
                TableName: "usersDB",
                Key: {
                    id: tobeDeleteId,
                },
            };
            const resp = yield users_controller_1.userdbInstance.getOneUser(id);
            if (resp) {
                const isValidUser = userValdChk.userCred(data.username, resp.username, data.password, resp.password);
                // verfication of generated token
                const Token = jsonwebtoken_1.default.verify(resp.Token, SECRET_KEY);
                if ((yield isValidUser) && Token) {
                    if (resp.role == "admin") {
                        const result = yield dynamoDB_connect_1.DynamoDB.delete(params).promise();
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
        });
    }
}
exports.deleteuserService = deleteuserService;
