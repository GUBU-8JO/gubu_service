import { IsString, IsNotEmpty, IsOptional } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class SetCacheDto {
  @ApiProperty({ description: 'Cache key' })
  @IsString()
  @IsNotEmpty()
  key: string;

  @ApiProperty({ description: 'Cache value' })
  @IsOptional() // value가 선택적일 경우
  value: any;
}
