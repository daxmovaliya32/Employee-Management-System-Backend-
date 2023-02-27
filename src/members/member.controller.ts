import { Controller, Delete, Patch,Query,UploadedFile,UseGuards, UseInterceptors} from '@nestjs/common';
import { Body,Get,Param,Request } from '@nestjs/common';
import { FileInterceptor } from '@nestjs/platform-express';
import { FormDataRequest } from 'nestjs-form-data';
import { RolesGuardMember } from 'src/guard/roles.guard';
import { filterdto, resetpassword,updatemembername } from './member.dto';
import { memberservice } from './member.service';

@Controller('member')
export class membercontrollerController {
    constructor(private readonly memberservice:memberservice){}
    
    @UseGuards(RolesGuardMember) 
    @Get(':id')
    async findmemberbyid(@Param('id') id:string) {
        return this.memberservice.findmember(id)
    }
    
    @UseGuards(RolesGuardMember)
    @Get()
    async findallmember(@Query() query:filterdto){
        return this.memberservice.findall(query);
    }

    @UseGuards(RolesGuardMember)
    @Patch('updatemembername')
    @FormDataRequest()
    async updatemembersname(@Request() req:RolesGuardMember,@Body() updatedata:updatemembername) {
        return this.memberservice.updatemember(req,updatedata);
    }

    @UseGuards(RolesGuardMember)
    @Patch('resetpassword')
    @FormDataRequest()
    async memberresetpassword(@Request() req:RolesGuardMember,@Body() memberpass:resetpassword) {
        return this.memberservice.resetpassword(req,memberpass);
    }
    
    @UseGuards(RolesGuardMember)
    @Patch('updateprofile')
    @UseInterceptors(FileInterceptor('file'))
    async changememberprofile(@Request() req:RolesGuardMember,@UploadedFile() file: Express.Multer.File) {
        return this.memberservice.updateprofile(req);
    }
}


