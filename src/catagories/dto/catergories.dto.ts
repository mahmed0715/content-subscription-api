import { ApiProperty } from '@nestjs/swagger';
import { IsArray, IsNotEmpty } from 'class-validator';

export class SubscribeDto {
  @ApiProperty({ example: ['Tech', 'Health'] })
  @IsArray()
  @IsNotEmpty()
  categories: string[];
}
