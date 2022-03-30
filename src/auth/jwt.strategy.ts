import { InjectRepository } from '@nestjs/typeorm';
import { PassportStrategy } from '@nestjs/passport';
import { ExtractJwt, Strategy } from 'passport-jwt';
import { Injectable, UnauthorizedException } from '@nestjs/common';

import { User } from './entities/auth.entity';
import { UsersRepository } from './user.repository';
import { JwtPayload } from './jst-payload.interface';

@Injectable()
export class JwtStrategy extends PassportStrategy(Strategy) {
  constructor(
    @InjectRepository(UsersRepository) private usersRepository: UsersRepository,
  ) {
    super({
      jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
      ignoreExpiration: false,
      secretOrKey:
        'raymondle-secret-9131e0055e6272e24371b7a24448a58f7fecc270f4bed804364f3c1db805dd79c5741968dda8ecc6766317e9617c26b1a4e90185ea343395862e4a2da6891e0a',
    });
  }

  async validate(payload: JwtPayload) {
    // destruct data from request
    const { username } = payload;

    // get a user by username
    const user: User = await this.usersRepository.findOne({
      where: { username },
    });

    // if user not exists will throw new error
    if (!user) {
      throw new UnauthorizedException();
    }

    // return user found
    return user;
  }
}
