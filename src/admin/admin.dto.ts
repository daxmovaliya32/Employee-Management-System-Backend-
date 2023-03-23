import { Prop } from "@nestjs/mongoose";
import { IsEmail, IsEnum, IsNotEmpty, IsString, Matches, MinLength } from "class-validator";

enum role {
    ADMIN='Admin',
    USER='User',
    MEMBER='Member',
    PROJECT_MANAGER='Project_Manager',
    TASK_MANAGER='Task_Manager',
    DEPARTMENT_MANAGER='Department_Manager',
    TEAM_MANAGER='Team_Manager',
    Goal_MANAGER='Goal_Manager',
    PROJECT_MEMBER='Project_Member',
    TASK_MEMBER='Task_Member',
    GOAL_MEMBER='Goal_Member'
 }

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

export class updaterole {
  
    @IsEnum(role)
    role:role;
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
