import { ApiProperty } from '@nestjs/swagger';

export class CreateCvDto {
  @ApiProperty({
    description: 'Name of the user',
    example: 'John',
  })
  name: string;
  @ApiProperty({
    description: 'First name of the user',
    example: 'Doe',
  })
  firstname: string;
  @ApiProperty({
    description: 'Age of the user',
    example: 30,
  })
  age: number;
  @ApiProperty({
    description: 'CIN of the user',
    example: 'AB123456',
  })
  cin: string;
  @ApiProperty({
    description: 'Job of the user',
    example: 'Software Engineer',
  })
  job: string;
}
