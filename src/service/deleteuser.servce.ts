import { compare } from "bcryptjs";
import { Table, DynamoDB } from "../config/dynamoDB.connect";
import { userdbInstance } from "../controllers/users.controller";
import {userAuth} from "../utils/Auth";
import jwt from "jsonwebtoken";

// Building connection with Dynamo Db
const SECRET_KEY = "CRUDAPI";

// Creating instance of Users Credantials Authentication
const userValdChk =  new userAuth();



interface IdeleteuserService {
  deleteOneUser(
    id: Number,
    username: string,
    password: string,
    tobeDeleteId: Number
  ): any;
}
// Get all user from Dynamo DB
export class deleteuserService implements IdeleteuserService {
  async deleteOneUser(
    id: Number,
    username: string,
    password: string,
    tobeDeleteId: Number
  ) {
    const data = { id, username, password, tobeDeleteId };
    const params = {
      TableName: "usersDB",
      Key: {
        id: tobeDeleteId,
      },
    };
    const resp = await userdbInstance.getOneUser(id);
    if (resp) {
      const isValidUser = userValdChk.userCred(
        data.username,
        resp.username,
        data.password,
        resp.password
      );
      // verfication of generated token
      const Token = jwt.verify(resp.Token, SECRET_KEY);
     if( (await isValidUser) && Token){
        if (resp.role == "admin") {
          const result = await DynamoDB.delete(params).promise();
          return result;
        } else {
          console.log(`not an admin user!`);
        }
      } else {
        console.log(`invalid cred!`);
      }
    } else {
      console.log(`Record not Present!`);
    }
  }
}
