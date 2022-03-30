import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';

import { Task } from './entities/task.entity';
import { TaskStatus } from './task-status.enum';
import { User } from '@auth/entities/auth.entity';
import { TasksRepository } from './tasks.repository';
import { CreateTaskDto } from './dto/create-task.dto';
import { GetTasksFilterDto } from './dto/get-tasks-filter.dto';

@Injectable()
export class TasksService {
  constructor(
    @InjectRepository(TasksRepository) private tasksRepository: TasksRepository,
  ) {}

  getTasks(getTasksFilter: GetTasksFilterDto, user: User): Promise<Task[]> {
    return this.tasksRepository.getTasks(getTasksFilter, user);
  }

  createTask(createTaskDto: CreateTaskDto, user: User): Promise<Task> {
    return this.tasksRepository.createTask(createTaskDto, user);
  }

  findById(id: string, user: User): Promise<Task> {
    return this.tasksRepository.findById(id, user);
  }

  deleteTask(id: string, user: User): Promise<Task> {
    return this.tasksRepository.deleteTask(id, user);
  }

  updateTaskStatus(id: string, status: TaskStatus, user: User): Promise<Task> {
    return this.tasksRepository.updateTaskStatus(id, status, user);
  }
}
