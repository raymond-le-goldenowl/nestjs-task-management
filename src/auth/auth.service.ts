import * as bcrypt from 'bcrypt';
import { JwtService } from '@nestjs/jwt';
import { InjectRepository } from '@nestjs/typeorm';
import { Injectable, UnauthorizedException } from '@nestjs/common';

import { User } from './entities/auth.entity';
import { UsersRepository } from './user.repository';
import { JwtPayload } from './jst-payload.interface';
import { AuthCredentialsDto } from './dto/auth-credentials.dto';

@Injectable()
export class AuthService {
  constructor(
    @InjectRepository(UsersRepository) private usersRepository: UsersRepository,
    private jwtService: JwtService,
  ) {}

  signUp(authCredentialsDto: AuthCredentialsDto): Promise<User> {
    return this.usersRepository.createUser(authCredentialsDto);
  }

  async signIn(
    authCredentialsDto: AuthCredentialsDto,
  ): Promise<{ accessToken: string }> {
    // destruct data from request body
    const { username, password } = authCredentialsDto;

    // find user by username
    const user = await this.usersRepository.findOne({ where: { username } });

    // check if is user unavailable
    if (!(user && bcrypt.compareSync(password, user?.password))) {
      throw new UnauthorizedException('Please check your login credentials');
    }

    // sign access token
    const payload: JwtPayload = { username };
    const accessToken: string = this.jwtService.sign(payload);

    // Return token string
    return { accessToken };
  }
}
