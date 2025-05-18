import {
  ConflictException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { BaseService } from 'src/common/services/base.service';
import { User } from './entities/user.entity';
import { InjectRepository } from '@nestjs/typeorm';
import { DeepPartial, Repository } from 'typeorm';
import * as bcrypt from 'bcrypt';

@Injectable()
export class UserService extends BaseService<User> {
  constructor(@InjectRepository(User) private userRepo: Repository<User>) {
    super(userRepo);
  }

  async create(createUserDto: CreateUserDto) {
    const { email, username, password } = createUserDto;

    const existingUser = await this.userRepo.findOne({
      where: [{ username }, { email }],
    });

    if (existingUser) {
      throw new ConflictException(
        'User with this username or email already exists',
      );
    }

    const hashedPassword: string = await bcrypt.hash(password, 10);

    const user = this.userRepo.create({
      email,
      password: hashedPassword,
      username,
    });

    return this.userRepo.save(user);
  }

  async findByEmailOrUsername(key: 'email' | 'username', value: string) {
    const user = await this.userRepo.findOne({ where: { [key]: value } });
    if (!user) throw new NotFoundException(`User with this ${key} not found`);
    return user;
  }
}
