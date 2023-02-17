import { Controller, Delete, Patch,Query,UploadedFile,UseGuards, UseInterceptors} from '@nestjs/common';
import { Body,Get,Param,Request } from '@nestjs/common';
import { FileInterceptor } from '@nestjs/platform-express';
import { FormDataRequest } from 'nestjs-form-data';
import { RolesGuarduser } from 'src/guard/roles.guard';
import { filterdto, resetpassword,updateusername } from './user.dto';
import { userservice } from './user.service';

@Controller('user')
export class UsercontrollerController {
    constructor(private readonly Userservice:userservice){}
    
    @UseGuards(RolesGuarduser) 
    @Get(':id')
    async findUserbyid(@Param('id') id:string) {
        return this.Userservice.finduser(id)
    }
    
    @UseGuards(RolesGuarduser)
    @Get()
    async findalluser(@Query() query:filterdto){
        return this.Userservice.findall(query);
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
        return this.Userservice.updateprofile(req);
    }
}


