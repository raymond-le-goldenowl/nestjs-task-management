import { Column, Entity, ManyToOne, PrimaryGeneratedColumn } from 'typeorm';

import { Exclude } from 'class-transformer';
import { User } from '@auth/entities/auth.entity';
import { TaskStatus } from '@tasks/task-status.enum';

@Entity()
export class Task {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column()
  title: string;

  @Column()
  description: string;

  @Column()
  status: TaskStatus;

  @ManyToOne(() => User, (user) => user.tasks, { eager: false })
  @Exclude({ toPlainOnly: true })
  user: User;
}
