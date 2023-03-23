import { Controller, Get, Post, Body, Patch, Param, Delete, UseGuards, Query, Request } from '@nestjs/common';
import { TaskService } from './task.service';
import { UpdateTaskDto } from './dto/update-task.dto';
import { RolesGuarduser } from 'src/guard/roles.guard';
import { FormDataRequest } from 'nestjs-form-data';
import { Task } from 'src/models/task.interface';
import { filterdto } from 'src/task/dto/filter.dto';

@Controller('task')
export class TaskController {
  constructor(private readonly taskService: TaskService) {}

  @UseGuards(RolesGuarduser)
  @Post('add_task')
  @FormDataRequest()
  create(@Request() req:RolesGuarduser,@Body() createGoalDto:Task) {    
    return this.taskService.create(createGoalDto,req);
  }

  @UseGuards(RolesGuarduser)
  @Get()
  findAll(@Query() query:filterdto) {
    return this.taskService.findAll(query);
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.taskService.findOne(+id);
  }

  @Patch(':id')
  update(@Param('id') id: string, @Body() updateTaskDto: UpdateTaskDto) {
    return this.taskService.update(+id, updateTaskDto);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.taskService.remove(+id);
  }
}
