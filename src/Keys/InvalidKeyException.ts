import {Exception} from "../util"

class InvalidKeyException extends Exception{
    name = "InvalidKeyException"
    constructor(invalidKey: any, message?: string){
        super(`${invalidKey} is an invalid key${message == undefined?"" : `, it ${message}`}`)
    }
}

export default InvalidKeyException
