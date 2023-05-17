import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
// import {request} from "graphql-request";
import { userdbService } from "../service/userdb.servce";
import { adduserService } from "../service/adduser.servce";
import { deleteuserService } from "../service/deleteuser.servce";
import { updateuserService } from "../service/updateuser.servce";
import {userAuth} from "../utils/Auth";

// Building connection with Dynamo Db
const SECRET_KEY = "CRUDAPI";
// Creating instance of service class
export const userdbInstance = new userdbService();

// Creating instance of addservice class
const adduserInstance = new adduserService();

// Creating instance of updateservice class
const updateuserInstance = new updateuserService();

// Creating instance of deleteservice class
const deleteuserInstance = new deleteuserService();

// Creating instance of Users Credantials Authentication
const userValdChk =  new userAuth();




// resolver for schema /typedefs of user

interface Iresolver {
  schemaResolver(): any;
}

export class userSchemaResolver implements Iresolver {
  public schemaResolver() {
    const resolvers = {
      Query: {
        isServerUp: () => {
          return `Test ok!`;
        },

        getUsers: async () => {
          return await userdbInstance.getAllUsers();
        },

        getUser: async (parents: any, args: any) => {
          return await userdbInstance.getOneUser(args.id);
        },

        userLogin: async (parents: any, args: any, context: any) => {
          var response = await userdbInstance.getOneUser(args.id);

          if (response) {
            const isValidUser = userValdChk.userCred(
              args.username,
              response.username,
              args.password,
              response.password
            );

            // verfication of generated token
            const Token = jwt.verify(response.Token, SECRET_KEY);

            if ((await isValidUser) && Token) {
              return await userdbInstance.getAllUsers();
            } else {
              console.error(`invalid Cred!!`);
            }
          } else {
            console.log(`user not Present!!`);
          }
        },
      },
      Mutation: {
        addUser: async (parents: any, args: any) => {
          const hashedpassword = await bcrypt.hash(args.password, 12);
          const { id, name, username, role } = args;
          // Token generation for authirization
          const Token = jwt.sign({ username: username, id: id }, SECRET_KEY);
          const res = await adduserInstance.addUser(
            id,
            name,
            username,
            hashedpassword,
            Token,
            role
          );
          return { success: true };
        },
        updateUser: async (parents: any, args: any) => {
          const { id, username, password, toUpdateValue } = args;
          return await updateuserInstance.updateUser(
            id,
            username,
            password,
            toUpdateValue
          );
        },
        deleteUser: async (parents: any, args: any) => {
          return await deleteuserInstance.deleteOneUser(
            args.id,
            args.username,
            args.password,
            args.tobeDeleteId
          );
        },
      },
    };
    return resolvers;
  }
}
