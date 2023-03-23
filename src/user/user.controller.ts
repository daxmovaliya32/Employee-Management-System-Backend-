import { Controller,Patch,Post,Query,UploadedFile,UseGuards, UseInterceptors} from '@nestjs/common';
import { Body,Get,Param,Request } from '@nestjs/common';
import { FileInterceptor } from '@nestjs/platform-express';
import { FormDataRequest } from 'nestjs-form-data';
import { RolesGuarduser } from 'src/guard/roles.guard';
import { carddto, filterdto, resetpassword,updateusername } from './user.dto';
import { userservice } from './user.service';

@Controller('user')
export class UsercontrollerController {
    constructor(private readonly Userservice:userservice){}
    
    @UseGuards(RolesGuarduser) 
    @Get('findmemberbyid/:id')
    async findUserbyid(@Request() req:RolesGuarduser,@Param('id') id:string) {
        return this.Userservice.finduser(req,id)
    }
    
    @UseGuards(RolesGuarduser)
    @Get('findallmember')
    async findalluser(@Request() req:RolesGuarduser,@Query() query:filterdto){
        return this.Userservice.findall(req,query);
    }

    @UseGuards(RolesGuarduser)
    @Patch('updateusername')
    @FormDataRequest()
    async updateusersname(@Request() req:RolesGuarduser,@Body() updatedata:updateusername) {
        return this.Userservice.updateuser(req,updatedata);
    }

    @UseGuards(RolesGuarduser)
    @Patch('resetpassword')
    @FormDataRequest()
    async userresetpassword(@Request() req:RolesGuarduser,@Body() userpass:resetpassword) {
        return this.Userservice.resetpassword(req,userpass);
    }
    
    @UseGuards(RolesGuarduser)
    @Patch('updateprofile')
    @UseInterceptors(FileInterceptor('file'))
    async changeuserprofile(@Request() req:RolesGuarduser,@UploadedFile() file: Express.Multer.File) {
        console.log(req);
        
        // return this.Userservice.updateprofile(req);
    }

    @UseGuards(RolesGuarduser)
    @Post('subscribe/:subid')
    @FormDataRequest()
    async buysubcription(@Request() req:RolesGuarduser,@Param('subid') subid:string,@Body() carddto:carddto) {
        console.log(carddto);
        return this.Userservice.subscription(req,subid,carddto);
    }
} 


