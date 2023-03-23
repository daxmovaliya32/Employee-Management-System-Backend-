import { Prop } from "@nestjs/mongoose";
import { IsEmail,IsNotEmpty, IsNumber, IsString, IS_LENGTH, Matches, MaxLength, min, minLength, MinLength } from "class-validator";

export class authorguser {
  
    @IsNotEmpty()
    @IsEmail()
    email: string;
  
    @IsNotEmpty()
    @MinLength(4)
    password: string;
  
  }

  export class authuser {
  
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

export class updateorgusername {
  
   @IsString() 
   name: string;
}

export class verifydto {
  
    @IsNotEmpty()
    @IsEmail()
    email: string;

    @IsNotEmpty()
    otp:number
  
}

export class updateprofile {
  
    @Prop()
    image: string;
      
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

