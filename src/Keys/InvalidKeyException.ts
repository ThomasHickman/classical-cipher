import {Exception} from "../util"

class InvalidKeyException extends Exception{
    name = "InvalidKeyException"
    constructor(invalidKey: any, message?: string, noIt = false){
        super(`${invalidKey} is an invalid key${message == undefined?"" : `, ${noIt?"":"it "}${message}`}`)
    }
}

export default InvalidKeyException
