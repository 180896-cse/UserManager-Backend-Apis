"use strict";
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
                getUsers: async () => {
                    return await exports.userdbInstance.getAllUsers();
                },
                getUser: async (parents, args) => {
                    return await exports.userdbInstance.getOneUser(args.id);
                },
                userLogin: async (parents, args, context) => {
                    var response = await exports.userdbInstance.getOneUser(args.id);
                    if (response) {
                        const isValidUser = userValdChk.userCred(args.username, response.username, args.password, response.password);
                        // verfication of generated token
                        const Token = jsonwebtoken_1.default.verify(response.Token, SECRET_KEY);
                        if ((await isValidUser) && Token) {
                            return await exports.userdbInstance.getAllUsers();
                        }
                        else {
                            console.error(`invalid Cred!!`);
                        }
                    }
                    else {
                        console.log(`user not Present!!`);
                    }
                },
            },
            Mutation: {
                addUser: async (parents, args) => {
                    const hashedpassword = await bcryptjs_1.default.hash(args.password, 12);
                    const { id, name, username, role } = args;
                    // Token generation for authirization
                    const Token = jsonwebtoken_1.default.sign({ username: username, id: id }, SECRET_KEY);
                    const res = await adduserInstance.addUser(id, name, username, hashedpassword, Token, role);
                    return { success: true };
                },
                updateUser: async (parents, args) => {
                    const { id, username, password, toUpdateValue } = args;
                    return await updateuserInstance.updateUser(id, username, password, toUpdateValue);
                },
                deleteUser: async (parents, args) => {
                    return await deleteuserInstance.deleteOneUser(args.id, args.username, args.password, args.tobeDeleteId);
                },
            },
        };
        return resolvers;
    }
}
exports.userSchemaResolver = userSchemaResolver;
