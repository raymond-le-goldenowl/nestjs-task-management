import { createParamDecorator, ExecutionContext } from '@nestjs/common';

import { User } from './entities/auth.entity';

export const GetUser = createParamDecorator(
  (data, ctx: ExecutionContext): User => {
    const req = ctx.switchToHttp().getRequest();
    const user = req.user;
    return data ? user?.[data] : user;
  },
);
