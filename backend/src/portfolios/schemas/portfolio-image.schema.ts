import { ApiProperty } from '@nestjs/swagger';
import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Exclude, Expose, Transform } from 'class-transformer';
import { HydratedDocument, Schema as MongooseSchema } from 'mongoose';

import { User } from '@/users/schemas/user.schema';
import { BaseSchema } from '@/common/entities/base.schema';
import { Portfolio } from '@/portfolios/schemas/portfolio.schema';
import { transformToStringOrClass } from '@/common/serialization';

@Schema({ timestamps: true, collection: 'images' })
export class PortfolioImage extends BaseSchema {
  constructor(partial: Partial<PortfolioImage>) {
    super();
    Object.assign(this, partial);
  }

  @ApiProperty({ example: 'My Portfolio', description: `Portfolio's name` })
  @Expose()
  @Prop({ type: String, required: true })
  name: string;

  @ApiProperty({
    example: 'This is my Portfolio image',
    description: `Portfolio image description`,
  })
  @Expose()
  @Prop({ type: String, required: true })
  description: string;

  @ApiProperty({
    example: '55669cac-0213-4388-9b26-4b275643e653.jpeg',
    description: `Image file name`,
  })
  @Exclude()
  @Prop({ type: String, required: true })
  fileName: string;

  @ApiProperty({
    example:
      'http://localhost:9000/storage/a74378d9-251d-4447-a669-74e8c5f8cc9a',
    description: `Image url`,
  })
  @Expose()
  @Prop({ type: String, required: true })
  url: string;

  @ApiProperty({
    example: '68b70e107bf4291e2eecee36',
    description: 'Portfolio ID',
  })
  @Transform(transformToStringOrClass(Portfolio))
  @Prop({
    type: MongooseSchema.Types.ObjectId,
    ref: 'Portfolio',
    required: true,
  })
  portfolio: MongooseSchema.Types.ObjectId | Portfolio;

  @ApiProperty({ example: '68b5c0a10e498e5e1a2e77e8', description: 'User ID' })
  @Expose()
  @Prop({
    type: MongooseSchema.Types.ObjectId,
    ref: 'User',
    required: true,
  })
  @Transform(transformToStringOrClass(User))
  user: MongooseSchema.Types.ObjectId | User;
}

export type PortfolioImageDocument = HydratedDocument<PortfolioImage>;
export const PortfolioImageSchema =
  SchemaFactory.createForClass(PortfolioImage);

PortfolioImageSchema.virtual('id').get(function () {
  return this._id.toHexString();
});
PortfolioImageSchema.set('toJSON', { virtuals: true });
PortfolioImageSchema.set('toObject', { virtuals: true });
