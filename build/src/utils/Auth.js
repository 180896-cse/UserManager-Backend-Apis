"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.userAuth = void 0;
const bcryptjs_1 = __importDefault(require("bcryptjs"));
class userAuth {
    async userCred(curUsrName, dbUsrName, curUsrPass, dbUsrPass) {
        let isVldUsr;
        let passWord = await bcryptjs_1.default.compare(curUsrPass, dbUsrPass);
        if ((curUsrName == dbUsrName) && (passWord)) {
            isVldUsr = true;
        }
        else {
            isVldUsr = false;
        }
        return isVldUsr;
    }
}
exports.userAuth = userAuth;
