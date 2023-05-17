import { Table, DynamoDB } from "../config/dynamoDB.connect";

interface IuserdbService {
  getAllUsers(): any;
  getOneUser(key: Number): any;
  getUserLogin(key: Number,username:String,password:String):any;
}


// Get all user from Dynamo DB
export class userdbService implements IuserdbService {
  async getAllUsers() {
    const params = {
      TableName: "usersDB",
    };

    const result = await DynamoDB.scan(params).promise();
    return result.Items;
  }

  async getOneUser(key: Number) {
    const params = {
      TableName: "usersDB",
      Key: {
        id: key,
      },
    };
    const result = await DynamoDB.get(params).promise();
    return result.Item;
  }

  async getUserLogin(key: Number,password:String) {
    const params = {
      TableName: "usersDB",
      Key: {
        id: key,
      },
    };
    const result = await DynamoDB.get(params).promise();
    return result.Item;
  }
}
