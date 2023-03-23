import { Controller, Patch,Post,Query,UploadedFile,UseGuards, UseInterceptors} from '@nestjs/common';
import { Body,Get,Param,Request } from '@nestjs/common';
import { FileInterceptor} from '@nestjs/platform-express';
import { FormDataRequest } from 'nestjs-form-data';
import { RolesGuardorguser, RolesGuarduser } from 'src/guard/roles.guard';
import { orguser } from 'src/models/organizationuser.interface';
import { authuser, filterdto, resetpassword,updateorgusername } from './orguser.dto';
import { orguserservice } from './orguser.service';

@Controller('orguser')
export class orgusercontrollerController {
    constructor(private readonly orguserservice:orguserservice){}

    @UseGuards(RolesGuarduser)
    @Post('add_orguser')
    @FormDataRequest()
    async reguser(@Request() req:RolesGuarduser,@Body() userdto:orguser) {
        return this.orguserservice.addorguser(req,userdto);
        
    }

    @Post('signin')
    @FormDataRequest()
    async loginuser(@Body() userdto:authuser) {
        return this.orguserservice.signinuser(userdto.email,userdto.password);
    }

    @UseGuards(RolesGuarduser) 
    @Get(':id')
    async findorguserbyid(@Param('id') id:string) {
        return this.orguserservice.findorguser(id)
    }
    
    @UseGuards(RolesGuarduser)
    @Get()
    async findallorguser(@Query() query:filterdto){
        return this.orguserservice.findall(query); 
    }

    @UseGuards(RolesGuardorguser)
    @Patch('updateorgusername')
    @FormDataRequest()
    async updateorgusersname(@Request() req:RolesGuardorguser,@Body() updatedata:updateorgusername) {
        return this.orguserservice.updateorguser(req,updatedata);
    }

    @UseGuards(RolesGuardorguser)
    @Patch('resetpassword')
    @FormDataRequest()
    async orguserresetpassword(@Request() req:RolesGuardorguser,@Body() orguserpass:resetpassword) {
        return this.orguserservice.resetpassword(req,orguserpass);
    }
    
    @UseGuards(RolesGuardorguser)
    @Patch('updateprofile')
    @UseInterceptors(FileInterceptor('file'))
    async changeuserprofile(@Request() req:RolesGuardorguser,@UploadedFile() file: Express.Multer.File) {
        return this.orguserservice.updateprofile(req);
    }

}


 