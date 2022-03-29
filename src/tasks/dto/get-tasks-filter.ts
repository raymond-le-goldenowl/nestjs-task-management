import { TaskStatus } from '../tasks.model';

export class GetTasksFilter {
  search: string;
  status: TaskStatus;
}
