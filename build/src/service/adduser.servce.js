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
Object.defineProperty(exports, "__esModule", { value: true });
exports.adduserService = void 0;
const dynamoDB_connect_1 = require("../config/dynamoDB.connect");
const users_controller_1 = require("../controllers/users.controller");
// Get all user from Dynamo DB
class adduserService {
    addUser(id, name, username, password, Token, role) {
        return __awaiter(this, void 0, void 0, function* () {
            const data = { id, name, username, password, Token, role };
            const params = {
                TableName: "usersDB",
                Item: data,
                ReturnValue: "ALL_NEW"
            };
            if (yield users_controller_1.userdbInstance.getOneUser(id)) {
                console.log(`user already existed!`);
            }
            else {
                const result = yield dynamoDB_connect_1.DynamoDB.put(params).promise();
                return result;
            }
        });
    }
}
exports.adduserService = adduserService;
