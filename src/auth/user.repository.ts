import * as bcrypt from 'bcrypt';
import { ConflictException } from '@nestjs/common';
import { EntityRepository, Repository } from 'typeorm';

import { User } from './entities/auth.entity';
import { AuthCredentialsDto } from './dto/auth-credentials.dto';

@EntityRepository(User)
export class UsersRepository extends Repository<User> {
  async createUser(authCredentialsDto: AuthCredentialsDto): Promise<User> {
    // destruct data from request body
    const { username, password } = authCredentialsDto;

    // finding user by username
    const found = await this.findOne({ where: { username } });

    // throw error if username has already been taken
    if (found) {
      throw new ConflictException(
        `The username ${username} has already been taken`,
      );
    }

    // generate salt and hash password
    const saltRounds = 10;
    const salt = bcrypt.genSaltSync(saltRounds);
    const hashedPassword = bcrypt.hashSync(password, salt);

    // create a new user with username not conflict
    const user = this.create({ username, password: hashedPassword });

    // save user created
    const saved = await this.save(user);

    // return a user created
    return saved;
  }
}
