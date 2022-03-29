import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Patch,
  Post,
  Query,
} from '@nestjs/common';

import { CreateTaskDto } from './dto/create-task.dto';
import { GetTasksFilter } from './dto/get-tasks-filter';
import { UpdateTaskStatusDto } from './dto/update-task-status.dto';

import { TasksService } from './tasks.service';

import { Task, TaskStatus } from './tasks.model';

@Controller('tasks')
export class TasksController {
  constructor(private taskService: TasksService) {}

  @Get()
  getTasks(@Query() getTasksFilter: GetTasksFilter): Task[] {
    if (Object.keys(getTasksFilter).length > 0) {
      return this.taskService.getTasksWithFilters(getTasksFilter);
    }
    return this.taskService.getAllTasks();
  }

  @Post()
  createTask(@Body() createTaskDto: CreateTaskDto): Task {
    return this.taskService.createTask(createTaskDto);
  }

  @Get(':id')
  getTaskById(@Param('id') id: string): Task {
    return this.taskService.findById(id);
  }

  @Delete(':id')
  deleteTaskById(@Param('id') id: string): Task {
    return this.taskService.deleteTask(id);
  }

  @Patch(':id/status')
  updateTaskStatusById(
    @Param('id') id: string,
    @Body() updateTaskStatusDto: UpdateTaskStatusDto,
  ) {
    const { status } = updateTaskStatusDto;
    return this.taskService.updateTaskStatus(id, status);
  }
}
