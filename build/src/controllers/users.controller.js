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
exports.userSchemaResolver = exports.userdbInstance = void 0;
const bcryptjs_1 = __importDefault(require("bcryptjs"));
const jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
// import {request} from "graphql-request";
const userdb_servce_1 = require("../service/userdb.servce");
const adduser_servce_1 = require("../service/adduser.servce");
const deleteuser_servce_1 = require("../service/deleteuser.servce");
const updateuser_servce_1 = require("../service/updateuser.servce");
const Auth_1 = require("../utils/Auth");
// Building connection with Dynamo Db
const SECRET_KEY = "CRUDAPI";
// Creating instance of service class
exports.userdbInstance = new userdb_servce_1.userdbService();
// Creating instance of addservice class
const adduserInstance = new adduser_servce_1.adduserService();
// Creating instance of updateservice class
const updateuserInstance = new updateuser_servce_1.updateuserService();
// Creating instance of deleteservice class
const deleteuserInstance = new deleteuser_servce_1.deleteuserService();
// Creating instance of Users Credantials Authentication
const userValdChk = new Auth_1.userAuth();
class userSchemaResolver {
    schemaResolver() {
        const resolvers = {
            Query: {
                isServerUp: () => {
                    return `Test ok!`;
                },
                getUsers: () => __awaiter(this, void 0, void 0, function* () {
                    return yield exports.userdbInstance.getAllUsers();
                }),
                getUser: (parents, args) => __awaiter(this, void 0, void 0, function* () {
                    return yield exports.userdbInstance.getOneUser(args.id);
                }),
                userLogin: (parents, args, context) => __awaiter(this, void 0, void 0, function* () {
                    var response = yield exports.userdbInstance.getOneUser(args.id);
                    if (response) {
                        const isValidUser = userValdChk.userCred(args.username, response.username, args.password, response.password);
                        // verfication of generated token
                        const Token = jsonwebtoken_1.default.verify(response.Token, SECRET_KEY);
                        if ((yield isValidUser) && Token) {
                            return yield exports.userdbInstance.getAllUsers();
                        }
                        else {
                            console.error(`invalid Cred!!`);
                        }
                    }
                    else {
                        console.log(`user not Present!!`);
                    }
                }),
            },
            Mutation: {
                addUser: (parents, args) => __awaiter(this, void 0, void 0, function* () {
                    const hashedpassword = yield bcryptjs_1.default.hash(args.password, 12);
                    const { id, name, username, role } = args;
                    // Token generation for authirization
                    const Token = jsonwebtoken_1.default.sign({ username: username, id: id }, SECRET_KEY);
                    const res = yield adduserInstance.addUser(id, name, username, hashedpassword, Token, role);
                    return { success: true };
                }),
                updateUser: (parents, args) => __awaiter(this, void 0, void 0, function* () {
                    const { id, username, password, toUpdateValue } = args;
                    return yield updateuserInstance.updateUser(id, username, password, toUpdateValue);
                }),
                deleteUser: (parents, args) => __awaiter(this, void 0, void 0, function* () {
                    return yield deleteuserInstance.deleteOneUser(args.id, args.username, args.password, args.tobeDeleteId);
                }),
            },
        };
        return resolvers;
    }
}
exports.userSchemaResolver = userSchemaResolver;
