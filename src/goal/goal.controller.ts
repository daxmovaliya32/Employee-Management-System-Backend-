import { Controller, Get, Post, Body, Patch, Param, Delete, UseGuards,Request, Query } from '@nestjs/common';
import { GoalService } from './goal.service';
import { UpdateGoalDto } from './dto/update-goal.dto';
import { Goal } from 'src/models/goal.interface';
import { RolesGuarduser } from 'src/guard/roles.guard';
import { FormDataRequest } from 'nestjs-form-data';
import { filterdto } from 'src/goal/dto/filter.dto';

@Controller('goal')
export class GoalController {
  constructor(private readonly goalService: GoalService) {}

  @UseGuards(RolesGuarduser)
  @Post('add_goal')
  @FormDataRequest()
  create(@Request() req:RolesGuarduser,@Body() createGoalDto:Goal) {
    return this.goalService.create(createGoalDto,req);
  }

  @UseGuards(RolesGuarduser)
  @Get()
  findAll(@Query() query:filterdto) {
    return this.goalService.findAll(query);
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.goalService.findOne(+id);
  }

  @Patch(':id')
  update(@Param('id') id: string, @Body() updateGoalDto: UpdateGoalDto) {
    return this.goalService.update(+id, updateGoalDto);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.goalService.remove(+id);
  }
}
