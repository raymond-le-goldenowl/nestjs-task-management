import { IsEnum, IsOptional, IsString } from 'class-validator';

import { TaskStatus } from '@tasks/task-status.enum';

export class GetTasksFilterDto {
  @IsOptional()
  @IsString()
  search?: string;

  @IsOptional()
  @IsEnum(TaskStatus)
  status?: TaskStatus;
}
