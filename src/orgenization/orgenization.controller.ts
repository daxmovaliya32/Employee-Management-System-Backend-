import { Controller, Get, Post, Body, Patch, Param, Delete } from '@nestjs/common';
import { OrgenizationService } from './orgenization.service';
import { CreateOrgenizationDto } from './dto/create-orgenization.dto';
import { UpdateOrgenizationDto } from './dto/update-orgenization.dto';
import { Organization } from 'src/models/organizaton.interface';

@Controller('orgenization')
export class OrgenizationController {
  constructor(private readonly orgenizationService: OrgenizationService) {}

  @Post('creation')
  create(@Body() createOrgenizationDto: Organization) {
    return this.orgenizationService.create(createOrgenizationDto);
  }

  @Get()
  findAll() {
    return this.orgenizationService.findAll();
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.orgenizationService.findOne(+id);
  }

  @Patch(':id')
  update(@Param('id') id: string, @Body() updateOrgenizationDto: UpdateOrgenizationDto) {
    return this.orgenizationService.update(+id, updateOrgenizationDto);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.orgenizationService.remove(+id);
  }
}
