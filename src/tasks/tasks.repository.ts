import { NotFoundException } from '@nestjs/common';
import { EntityRepository, Repository } from 'typeorm';

import { Task } from './entities/task.entity';
import { TaskStatus } from './task-status.enum';
import { User } from './../auth/entities/auth.entity';
import { CreateTaskDto } from './dto/create-task.dto';
import { GetTasksFilterDto } from './dto/get-tasks-filter.dto';

@EntityRepository(Task)
export class TasksRepository extends Repository<Task> {
  async createTask(createTaskDto: CreateTaskDto, user: User): Promise<Task> {
    // Destructuring
    const { title, description } = createTaskDto;

    // create a task
    const task = this.create({
      title,
      description,
      status: TaskStatus.OPEN,
      user,
    });

    // save a task
    const saved = await this.save(task);

    // return task saved on server
    return saved;
  }

  async findById(id: string, user: User): Promise<Task> {
    // get task by id
    const found = await this.findOne({ where: { id, user } });

    // is task found
    if (!found) {
      throw new NotFoundException(`Task with ID ${id} not found!`);
    }

    // return task found
    return found;
  }

  async deleteTask(id: string, user: User): Promise<Task> {
    // get task deleted
    const found = await this.findById(id, user);

    // delete task
    const deleted = await this.delete(found);

    // handle error exception delete task
    if (deleted.affected < 0) {
      throw new NotFoundException(`Task with ID ${id} not found`);
    }

    // return task found
    return found;
  }

  async updateTaskStatus(
    id: string,
    status: TaskStatus,
    user: User,
  ): Promise<Task> {
    // get task

    const found = await this.findById(id, user);
    // change status

    found.status = status;

    const updated = await this.save(found);

    return updated;
  }

  async getTasks(
    getTasksFilterDto: GetTasksFilterDto,
    user: User,
  ): Promise<Task[]> {
    // destruct data from request
    const { status, search } = getTasksFilterDto;

    // create query builder
    const query = this.createQueryBuilder('task');

    // get tasks where user is owner
    query.where({ user });

    // filter by status
    if (status) {
      query.andWhere('task.status = :status', { status });
    }

    // filter by search
    if (search) {
      query.andWhere(
        '(LOWER(task.title) LIKE LOWER(:search) OR LOWER(task.description) LIKE LOWER(:search))',
        { search: `%${search}%` },
      );
    }

    // get tasks
    const tasks: Task[] = await query.getMany();

    // return tasks on database
    return tasks;
  }
}
