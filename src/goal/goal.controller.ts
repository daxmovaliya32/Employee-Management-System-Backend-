import { Controller, Get, Post, Body, Patch, Param, Delete, UseGuards,Request, Query } from '@nestjs/common';
import { GoalService } from './goal.service';
import { UpdateGoalDto } from './dto/update-goal.dto';
import { Goal } from 'src/models/goal.interface';
import { RolesGuardadmin } from 'src/guard/roles.guard';
import { FormDataRequest } from 'nestjs-form-data';
import { filterdto } from 'src/user/user.dto';

@Controller('goal')
export class GoalController {
  constructor(private readonly goalService: GoalService) {}

  @UseGuards(RolesGuardadmin)
  @Post('add_goal')
  @FormDataRequest()
  create(@Request() req:RolesGuardadmin,@Body() createGoalDto:Goal) {
    console.log(createGoalDto.goal_members,createGoalDto.goal_manager);
    
    return this.goalService.create(createGoalDto,req);
  }

  @UseGuards(RolesGuardadmin)
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
