import * as bcrypt from 'bcryptjs';

export const encryptpassword = async(password:string)=>{
    return await bcrypt.hash(password,10);
}

export const verifypassword = async(password:string,oldpass:string)=>{    
    return await bcrypt.compare(password,oldpass);
}