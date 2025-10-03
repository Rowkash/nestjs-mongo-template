import { ApiProperty } from '@nestjs/swagger';
import { HydratedDocument, Schema as MongooseSchema } from 'mongoose';
import { Expose, Transform } from 'class-transformer';
import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';

import { User } from '@/users/schemas/user.schema';
import { BaseSchema } from '@/common/entities/base.schema';
import { transformToStringOrClass } from '@/common/serialization';
import { PortfolioImage } from '@/portfolios/schemas/portfolio-image.schema';

@Schema({ timestamps: true, collection: 'portfolios' })
export class Portfolio extends BaseSchema {
  constructor(partial: Partial<Portfolio>) {
    super();
    Object.assign(this, partial);
  }

  @ApiProperty({ example: 'My Portfolio', description: `Portfolio's name` })
  @Expose()
  @Prop({ type: String, required: true })
  name: string;

  @ApiProperty({
    example: 'This is my Portfolio',
    description: `Portfolio's description`,
  })
  @Expose()
  @Prop({ type: String, required: true })
  description: string;

  @ApiProperty({ example: '68b70e107bf4291e2eecee36', description: 'User ID' })
  @Expose()
  @Prop({
    type: MongooseSchema.Types.ObjectId,
    ref: 'User',
    required: true,
  })
  @Transform(transformToStringOrClass(User))
  user: string | User;

  @ApiProperty({ type: () => [PortfolioImage] })
  @Expose()
  @Transform(transformToStringOrClass(PortfolioImage))
  images?: [MongooseSchema.Types.ObjectId] | PortfolioImage[];
}

export type PortfolioDocument = HydratedDocument<Portfolio>;
export const PortfolioSchema = SchemaFactory.createForClass(Portfolio);
PortfolioSchema.virtual('id').get(function () {
  return this._id.toHexString();
});
PortfolioSchema.virtual('images', {
  ref: 'PortfolioImage',
  localField: '_id',
  foreignField: 'portfolio',
});
PortfolioSchema.set('toJSON', { virtuals: true });
PortfolioSchema.set('toObject', { virtuals: true });
