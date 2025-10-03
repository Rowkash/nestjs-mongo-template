import { Transform } from 'class-transformer';
import { IsEnum, IsNumber, IsOptional, Max, Min } from 'class-validator';
import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';

export enum OrderSortEnum {
  ASC = 'asc',
  DESC = 'desc',
}

export class PageDto {
  @ApiPropertyOptional({
    minimum: 1,
    default: 1,
  })
  @Min(1)
  @IsNumber(
    { allowNaN: false, maxDecimalPlaces: 0, allowInfinity: false },
    { message: 'Page must be a number' },
  )
  @IsOptional()
  @Transform(({ value }) => Number(value))
  readonly page: number;

  @ApiPropertyOptional({
    minimum: 1,
    maximum: 500,
    default: 20,
  })
  @Min(1)
  @Max(500)
  @IsNumber(
    { allowNaN: false, maxDecimalPlaces: 0, allowInfinity: false },
    { message: 'Limit must be a number' },
  )
  @IsOptional()
  @Transform(({ value }) => Number(value))
  readonly limit: number;

  @ApiPropertyOptional({ default: OrderSortEnum.DESC, enum: OrderSortEnum })
  @IsOptional()
  @IsEnum(OrderSortEnum)
  readonly orderSort?: string = OrderSortEnum.DESC;
}

export class Page<T> {
  constructor(models: T[], count: number) {
    this.models = models;
    this.count = count;
  }

  @ApiProperty({ type: Array })
  readonly models: T[];

  @ApiProperty({ type: Number })
  readonly count: number;
}
