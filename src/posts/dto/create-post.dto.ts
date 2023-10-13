import { ApiProperty } from '@nestjs/swagger';
import { IsString, IsNotEmpty, MaxLength } from 'class-validator';

export class CreatePostDto {
  @ApiProperty({ description: 'The title of the post', required: true })
  @IsNotEmpty()
  @IsString()
  @MaxLength(100)
  title: string;

  @ApiProperty({ description: 'The content of the post', required: true })
  @IsNotEmpty()
  @IsString()
  content: string;
}
