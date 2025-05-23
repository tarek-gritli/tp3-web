import { LoginDto } from './dto/login.dto';
import { Injectable, UnauthorizedException } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { UserService } from '../user/user.service';
import * as bcrypt from 'bcrypt';
import { RegisterUserDto } from './dto/register-user.dto';
import { Roles } from './enums/auth.enum';

@Injectable()
export class AuthService {
  constructor(
    private userService: UserService,
    private jwtService: JwtService,
  ) {}

  async register(registerUserDto: RegisterUserDto): Promise<any> {
    const hashedPassword = await bcrypt.hash(registerUserDto.password, 10);

    const user = await this.userService.create({
      ...registerUserDto,
      password: hashedPassword,
    });

    return {
      result: 'User registered successfully',
      user: {
        id: user.id,
        email: user.email,
        name: user.username,
      },
    };
  }

  async validateUser(username: string, password: string) {
    const user = await this.userService.findByUsername(username);

    const isPasswordValid = await bcrypt.compare(password, user.password);

    if (user && isPasswordValid) {
      const { password, ...result } = user;
      return result;
    }

    return null;
  }

  async login(loginDto: LoginDto) {
    const user = await this.validateUser(loginDto.username, loginDto.password);

    const payload = {
      username: user!.username,
      sub: user!.id,
      role: user!.role,
    };

    return {
      access_token: this.jwtService.sign(payload),
    };
  }

  getUserFromToken(token: string) {
    try {
      const decoded: { sub: number; username: string; role: Roles } =
        this.jwtService.verify(token);

      return {
        userId: decoded.sub,
        username: decoded.username,
        role: decoded.role,
      };
    } catch (error) {
      throw new UnauthorizedException(error, 'Invalid token');
    }
  }
}
