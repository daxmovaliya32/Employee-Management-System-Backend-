import { Controller, Delete, Patch,Query,UploadedFile,UseGuards, UseInterceptors} from '@nestjs/common';
import { Body,Get,Param,Request } from '@nestjs/common';
import { FileInterceptor } from '@nestjs/platform-express';
import { FormDataRequest } from 'nestjs-form-data';
import { RolesGuardadmin } from 'src/guard/roles.guard';
import { filterdto, resetpassword, updaterole } from './admin.dto';
import { adminservice } from './admin.service';

@Controller('admin')
export class AdminController {
    constructor(private readonly Adminservice:adminservice){}
    
    @UseGuards(RolesGuardadmin)
    @Get(':id')
    async findUserbyid(@Param('id') id:string) {
        return this.Adminservice.finduser(id)
    }
    
    @UseGuards(RolesGuardadmin)
    @Get()
    async findalluser(@Query() query:filterdto){
        return this.Adminservice.findall(query);
    }

    @UseGuards(RolesGuardadmin)
    @Delete('deleteuser/:id')
    async deleteuserbyid(@Param('id') id:string) {
        return this.Adminservice.deleteusers(id);
    }

    
    @UseGuards(RolesGuardadmin)
    @Patch('updateadminname')
    @FormDataRequest()
    async updateusersname(@Request() req:RolesGuardadmin,@Body() updatedata:any) {
        return this.Adminservice.updateadmin(req,updatedata);
    }

    @UseGuards(RolesGuardadmin)
    @Patch('resetpassword')
    @FormDataRequest()
    async userresetpassword(@Request() req:RolesGuardadmin,@Body() userpass:resetpassword) {
        return this.Adminservice.resetpassword(req,userpass);
    }

    @UseGuards(RolesGuardadmin)
    @Patch('changerole/:id')
    @FormDataRequest()
    async changerole(@Param('id') id:string,@Body() role:updaterole) {
        return this.Adminservice.updaterole(id,role);
    }

    @UseGuards(RolesGuardadmin)
    @Patch('updateprofile')
    @UseInterceptors(FileInterceptor('file'))
    async changeuserprofile(@Request() req:RolesGuardadmin,@UploadedFile() file: Express.Multer.File) {
        return this.Adminservice.updateprofile(req);
    }
}


