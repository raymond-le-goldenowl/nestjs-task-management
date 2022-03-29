import { v4 as uuid } from 'uuid';
import { Injectable } from '@nestjs/common';

import { Task, TaskStatus } from './tasks.model';
import { CreateTaskDto } from './dto/create-task.dto';
import { GetTasksFilter } from './dto/get-tasks-filter';

@Injectable()
export class TasksService {
  private tasks: Task[] = [];

  getAllTasks(): Task[] {
    return this.tasks;
  }

  getTasksWithFilters(getTasksFilter: GetTasksFilter): Task[] {
    let tasks = this.getAllTasks();

    if (getTasksFilter.search) {
      tasks = tasks.filter((task) => {
        if (
          task.title.includes(getTasksFilter.search) ||
          task.description.includes(getTasksFilter.search)
        ) {
          return true;
        }
        return false;
      });
    }

    if (getTasksFilter.status) {
      tasks = tasks.filter((task) => task.status === getTasksFilter.status);
    }

    return tasks;
  }
  createTask(createTaskDto: CreateTaskDto): Task {
    const task: Task = {
      id: uuid(),
      title: createTaskDto.title,
      description: createTaskDto.description,
      status: TaskStatus.OPEN,
    };

    this.tasks.push(task);

    return task;
  }

  findById(id: string): Task {
    return this.tasks.find((task) => task.id === id);
  }

  deleteTask(id: string): Task {
    // get task deleted
    const taskDeleted = this.tasks.find((task) => task.id === id);

    // delete task
    const tasksFiltered = this.tasks.filter((task) => task.id !== id);

    // set tasks after deleted
    this.tasks = tasksFiltered;

    return taskDeleted;
  }

  updateTaskStatus(id: string, status: TaskStatus): Task {
    // get task
    const taskById = this.findById(id);

    // change status
    taskById.status = status;

    return taskById;
  }
}
