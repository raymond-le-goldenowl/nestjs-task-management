import { GetTasksFilterDto } from './dto/get-tasks-filter.dto';
import { NotFoundException } from '@nestjs/common';
import { EntityRepository, Repository } from 'typeorm';

import { Task } from './task.entity';
import { TaskStatus } from './task-status.enum';
import { CreateTaskDto } from './dto/create-task.dto';

@EntityRepository(Task)
export class TasksRepository extends Repository<Task> {
  async createTask(createTaskDto: CreateTaskDto): Promise<Task> {
    // Destructuring
    const { title, description } = createTaskDto;

    // create a task
    const task = this.create({
      title,
      description,
      status: TaskStatus.OPEN,
    });

    // save a task
    const saved = await this.save(task);

    // return task saved on server
    return saved;
  }

  async findById(id: string): Promise<Task> {
    // get task by id
    const found = await this.findOne({ where: { id } });

    // is task found
    if (!found) {
      throw new NotFoundException(`Task with ID ${id} not found!`);
    }

    // return task found
    return found;
  }

  async deleteTask(id: string): Promise<Task> {
    // get task deleted
    const found = await this.findById(id);

    // delete task
    const deleted = await this.delete(found);

    // handle error exception delete task
    if (deleted.affected < 0) {
      throw new NotFoundException(`Task with ID ${id} not found`);
    }

    // return task found
    return found;
  }

  async updateTaskStatus(id: string, status: TaskStatus): Promise<Task> {
    // get task
    const found = await this.findById(id);
    // change status

    found.status = status;

    const updated = await this.save(found);

    return updated;
  }

  async getTasks(getTasksFilterDto: GetTasksFilterDto): Promise<Task[]> {
    const query = this.createQueryBuilder('task');

    const { status, search } = getTasksFilterDto;

    if (status) {
      query.andWhere('task.status = :status', { status });
    }

    if (search) {
      query.andWhere(
        'LOWER(task.title) LIKE LOWER(:search) OR LOWER(task.description) LIKE LOWER(:search)',
        { search: `%${search}%` },
      );
    }

    const tasks: Task[] = await query.getMany();

    return tasks;
  }
}
