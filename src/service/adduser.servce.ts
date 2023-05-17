import { Table, DynamoDB } from "../config/dynamoDB.connect";
import {userdbInstance} from "../controllers/users.controller";


interface IadduserService {
  addUser(id: Number, name: String, username: String, password: String,Token:String, role:String): any;
}

// Get all user from Dynamo DB
export class adduserService implements IadduserService {
  async addUser(id: Number, name: String, username: String, password: String,Token:String, role: String) {
    const data = { id, name, username, password,Token, role };
    const params = {
      TableName: "usersDB",
      Item: data,
      ReturnValue : "ALL_NEW"
    };
    if (await userdbInstance.getOneUser(id)) {
      console.log(`user already existed!`);
    } else {
      const result = await DynamoDB.put(params).promise();
      return result;
    }
  }
}
