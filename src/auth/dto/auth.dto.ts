import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty, IsString } from 'class-validator';

export class AuthDto {
  @ApiProperty({ description: 'User email', required: true })
  @IsNotEmpty()
  @IsString()
  email: string;

  @ApiProperty({ description: 'User password', required: true })
  @IsNotEmpty()
  @IsString()
  password: string;
}
