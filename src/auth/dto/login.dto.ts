import { ApiProperty } from '@nestjs/swagger';

export class LoginDto {
  @ApiProperty({
    description: 'username of the user',
    example: 'john_doe',
    type: String,
  })
  username: string;
  @ApiProperty({
    description: 'Password of the user',
    example: 'password123',
    type: String,
  })
  password: string;
}
