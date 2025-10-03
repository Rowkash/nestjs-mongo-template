import { Transform } from 'class-transformer';
import { ApiPropertyOptional } from '@nestjs/swagger';
import { IsEnum, IsNotEmpty, IsOptional } from 'class-validator';

import { PageDto } from '@/common/dto/page.dto';
import { escapeRegExp } from '@/common/serialization';

export enum PortfolioPageSortByEnum {
  CREATED_AT = 'createdAt',
  NAME = 'name',
}

export class PortfolioPageDto extends PageDto {
  @ApiPropertyOptional({
    example: 'My portfolio',
    description: 'Portfolio name filter',
  })
  @IsOptional()
  @IsNotEmpty()
  @Transform(escapeRegExp)
  name?: string;

  @ApiPropertyOptional({
    enum: PortfolioPageSortByEnum,
    default: PortfolioPageSortByEnum.CREATED_AT,
  })
  @IsOptional()
  @IsEnum(PortfolioPageSortByEnum)
  readonly sortBy?: string = PortfolioPageSortByEnum.CREATED_AT;
}
