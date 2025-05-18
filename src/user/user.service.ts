import {
  ConflictException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { BaseService } from 'src/common/services/base.service';
import { User } from './entities/user.entity';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { RegisterUserDto } from 'src/auth/dto/register-user.dto';

@Injectable()
export class UserService extends BaseService<User> {
  constructor(@InjectRepository(User) private userRepo: Repository<User>) {
    super(userRepo);
  }

  async create(registerUserDto: RegisterUserDto) {
    const { email, username } = registerUserDto;

    const existingUser = await this.userRepo.findOne({
      where: [{ username }, { email }],
    });

    if (existingUser) {
      throw new ConflictException(
        'User with this username or email already exists',
      );
    }

    const user = this.userRepo.create(registerUserDto);

    return this.userRepo.save(user);
  }

  async findByUsername(username: string) {
    const user = await this.userRepo.findOne({ where: { username } });
    if (!user)
      throw new NotFoundException(`User with this ${username} not found`);
    return user;
  }
}
