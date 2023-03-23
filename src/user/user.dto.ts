import { IsEmail,IsNotEmpty, IsNumber, IsString, Matches, MaxLength, MinLength } from "class-validator";

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

    @IsString()
    f_name: string;

    @IsString()
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

export class carddto
{
    @IsNotEmpty()
    number:number
    
    @IsNotEmpty()
    exp_month:number

    @IsNotEmpty()
    exp_year:number

    @MinLength(3)
    @MaxLength(3)
    cvc:string
}
