import { HydratedDocument } from 'mongoose';
import { ApiProperty } from '@nestjs/swagger';
import { Exclude, Expose } from 'class-transformer';
import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';

import { BaseSchema } from '@/common/entities/base.schema';

@Schema({ timestamps: true, collection: 'users' })
export class User extends BaseSchema {
  constructor(partial: Partial<User>) {
    super();
    Object.assign(this, partial);
  }

  @ApiProperty({ example: 'Benjamin', description: 'User name' })
  @Expose()
  @Prop({
    type: String,
    required: true,
    min: 2,
  })
  name: string;

  @ApiProperty({ example: 'Franklin', description: 'User last name' })
  @Expose()
  @Prop({
    type: String,
    required: true,
    min: 2,
  })
  lastName: string;

  @ApiProperty({
    example: 'benfrank@protonmail.com',
    description: 'User email',
  })
  @Expose()
  @Prop({
    type: String,
    required: true,
  })
  email: string;

  @Exclude()
  @Prop({
    type: String,
    required: true,
  })
  password: string;
}

export type UserDocument = HydratedDocument<User>;
export const UserSchema = SchemaFactory.createForClass(User);
UserSchema.virtual('id').get(function () {
  return this._id.toHexString();
});
UserSchema.set('toJSON', { virtuals: true });
UserSchema.set('toObject', { virtuals: true });
