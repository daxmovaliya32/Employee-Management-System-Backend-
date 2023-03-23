import { Controller, Get, Post, Body, Patch, Param, Delete, UseGuards,Request, Query } from '@nestjs/common';
import { OrgenizationService } from './orgenization.service';
import { Organization } from 'src/models/organizaton.interface';
import { FormDataRequest } from 'nestjs-form-data';
import { RolesGuarduser } from 'src/guard/roles.guard';
import { filterdto } from 'src/user/user.dto';

@Controller('orgenization')
export class OrgenizationController {
  constructor(private readonly orgenizationService: OrgenizationService) {}

  @UseGuards(RolesGuarduser)
  @Post('creation')
  @FormDataRequest()
  create(@Request() req:RolesGuarduser,@Body() createOrgenizationDto: Organization) {
    return this.orgenizationService.create(createOrgenizationDto,req);
  }

  @UseGuards(RolesGuarduser)
  @Get('findall')
  findAll(@Query() query:filterdto) {
    return this.orgenizationService.findall(query);
  }

  @UseGuards(RolesGuarduser)
  @Get('findbyid/:id')
  findOne(@Param('id') id: string) {
    return this.orgenizationService.findbyid(id);
  }

  @UseGuards(RolesGuarduser)
  @Patch(':id')
  update(@Param('id') id: string, @Body() updateOrgenizationDto: any) {
    return this.orgenizationService.update(+id, updateOrgenizationDto);
  }

  @UseGuards(RolesGuarduser)
  @Delete('deleteorg/:id')
  remove(@Param('id') id: string) {
    return this.orgenizationService.remove(id);
  }
}
