import { ApiProperty } from '@nestjs/swagger';
import {
  IsEmail,
  IsEnum,
  IsNotEmpty,
  IsString,
  MinLength,
} from 'class-validator';

export class CreateUserDto {
  @ApiProperty({ description: "The user's name", required: true })
  @IsNotEmpty()
  @IsString()
  @MinLength(2)
  name: string;

  @ApiProperty({ description: "The user's username", required: true })
  @IsNotEmpty()
  @MinLength(3)
  username: string;

  @ApiProperty({ description: "The user's email", required: true })
  @IsNotEmpty()
  @IsEmail()
  email: string;

  @ApiProperty({ description: "The user's age", required: true })
  @IsNotEmpty()
  @IsString()
  age: number;

  @ApiProperty({
    description: 'The user role (either "user" or "admin)", required: true',
  })
  @IsNotEmpty()
  @IsString()
  @IsEnum(['user', 'admin'])
  role: string;

  @ApiProperty({ description: "The user's password", required: true })
  @IsNotEmpty()
  password: string;

  refreshToken: string;
}
