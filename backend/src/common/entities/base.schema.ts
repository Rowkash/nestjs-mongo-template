import { Types } from 'mongoose';
import { ApiProperty } from '@nestjs/swagger';
import { Exclude, Expose, Transform } from 'class-transformer';

export abstract class BaseSchema {
  @ApiProperty({
    description: 'Document ID',
    example: '63c3e4e527b68db444854d59',
  })
  @Expose()
  @Transform(({ value }) => value?.toString())
  id: string;

  @ApiProperty({
    description: 'Timestamps of document creation',
    example: '2023-01-13T08:48:08.089Z',
  })
  @Expose()
  createdAt: Date;

  @ApiProperty({
    description: 'Timestamps of document updation',
    example: '2023-01-13T08:48:08.089Z',
  })
  @Exclude()
  updatedAt: Date;

  @Exclude()
  readonly _id: Types.ObjectId;

  @Exclude()
  readonly __v: number;
}
