import { compare } from "bcryptjs";
import { Table, DynamoDB } from "../config/dynamoDB.connect";
import { userdbInstance } from "../controllers/users.controller";
import {userAuth} from "../utils/Auth";
import jwt from "jsonwebtoken";

// Building connection with Dynamo Db
const SECRET_KEY = "CRUDAPI";

// Creating instance of Users Credantials Authentication
const userValdChk =  new userAuth();

interface IupdateuserService {
  updateUser(id: Number, username: String, password: string,  toUpdateValue: String): any;
}

// Get all user from Dynamo DB
export class updateuserService implements IupdateuserService {
  async updateUser(
    id: Number,
    username: String,
    password: string,
    toUpdateValue: String
  ) {
    const data = { id, username, password, toUpdateValue };
    const params = {
      TableName: "usersDB",
      Key:{
        id:data.id,
      },
      UpdateExpression: "SET username = :updateVal",
      ExpressionAttributeValues: {
        ":updateVal": data.toUpdateValue,
    },
    ReturnValues: "UPDATED_NEW"
      }
      // console.log(params);
      const resp = await userdbInstance.getOneUser(data.id);
      if(resp){
        const isValidUser = userValdChk.userCred(
          data.username,
          resp.username,
          data.password,
          resp.password
        );
        // verfication of generated token
        const Token = jwt.verify(resp.Token, SECRET_KEY);
       if( (await isValidUser) && Token){
        if((resp.role == "admin")){
          return await DynamoDB.update(params).promise();
        }else{
          console.log(`not an admin user!`);
          
        }
      }
    else{
      console.log(`invalid cred!`);
      
    }
  }else {
    console.log(`Record not Found!!`);
  }
      
      
    
    
  }
}
