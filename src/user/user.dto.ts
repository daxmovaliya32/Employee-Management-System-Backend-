import { IsEmail,IsNotEmpty, IsString, Matches, MinLength } from "class-validator";

export class authUser {
  
    @IsNotEmpty()
    @IsEmail()
    email: string;
  
    @IsNotEmpty()
    @MinLength(4)
    password: string;
  
  }

export class resetpassword {
  
    @IsNotEmpty()
    oldpassword: string;
  
    @IsNotEmpty()
    @Matches(/((?=.*\d)|(?=.*\W+))(?![.\n])(?=.*[A-Z])(?=.*[a-z]).*$/, {message: 'password too weak'})
    newpassword:string;
}

export class updateusername {
  
    f_name: string;

    l_name: string; 
}

export class verifydto {
  
    @IsNotEmpty()
    @IsEmail()
    email: string;

    @IsNotEmpty()
    otp:number
  
}

export class filterdto
{
    @IsString()
    name:String

    @IsString()
     page:string
    
    @IsString()
     limit:string
}
