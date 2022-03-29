import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';

import { Task } from './entities/task.entity';
import { TaskStatus } from './task-status.enum';
import { TasksRepository } from './tasks.repository';

import { CreateTaskDto } from './dto/create-task.dto';
import { GetTasksFilterDto } from './dto/get-tasks-filter.dto';

@Injectable()
export class TasksService {
  constructor(
    @InjectRepository(TasksRepository) private tasksRepository: TasksRepository,
  ) {}

  getTasks(getTasksFilter: GetTasksFilterDto): Promise<Task[]> {
    return this.tasksRepository.getTasks(getTasksFilter);
  }

  createTask(createTaskDto: CreateTaskDto): Promise<Task> {
    return this.tasksRepository.createTask(createTaskDto);
  }

  findById(id: string): Promise<Task> {
    return this.tasksRepository.findById(id);
  }

  deleteTask(id: string): Promise<Task> {
    return this.tasksRepository.deleteTask(id);
  }

  updateTaskStatus(id: string, status: TaskStatus): Promise<Task> {
    return this.tasksRepository.updateTaskStatus(id, status);
  }
}
