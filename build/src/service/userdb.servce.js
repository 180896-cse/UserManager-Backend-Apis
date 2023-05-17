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
exports.userdbService = void 0;
const dynamoDB_connect_1 = require("../config/dynamoDB.connect");
// Get all user from Dynamo DB
class userdbService {
    getAllUsers() {
        return __awaiter(this, void 0, void 0, function* () {
            const params = {
                TableName: "usersDB",
            };
            const result = yield dynamoDB_connect_1.DynamoDB.scan(params).promise();
            return result.Items;
        });
    }
    getOneUser(key) {
        return __awaiter(this, void 0, void 0, function* () {
            const params = {
                TableName: "usersDB",
                Key: {
                    id: key,
                },
            };
            const result = yield dynamoDB_connect_1.DynamoDB.get(params).promise();
            return result.Item;
        });
    }
    getUserLogin(key, password) {
        return __awaiter(this, void 0, void 0, function* () {
            const params = {
                TableName: "usersDB",
                Key: {
                    id: key,
                },
            };
            const result = yield dynamoDB_connect_1.DynamoDB.get(params).promise();
            return result.Item;
        });
    }
}
exports.userdbService = userdbService;
