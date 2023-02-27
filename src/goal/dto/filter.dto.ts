import { IsString } from "class-validator"

export class filterdto
{
    @IsString()
    name:String

    @IsString()
     page:string
    
    @IsString()
     limit:string
}