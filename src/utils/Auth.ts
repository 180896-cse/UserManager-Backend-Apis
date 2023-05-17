import bcrypt from "bcryptjs";


interface IuserAuth {
    userCred(curUsrName:String, dbUsrName:String, curUsrPass:string, dbUsrPass:string):any;
}


export class userAuth implements IuserAuth {
    public async userCred(curUsrName:String, dbUsrName:String, curUsrPass:string, dbUsrPass:string){
            let isVldUsr:boolean;
            let passWord = await bcrypt.compare(curUsrPass, dbUsrPass);
            
                if((curUsrName == dbUsrName) && (passWord)){
                    isVldUsr = true;
                }else{
                    isVldUsr = false;
                }
                return isVldUsr;
      }
}