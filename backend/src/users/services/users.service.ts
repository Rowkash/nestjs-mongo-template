import {
  BadRequestException,
  Injectable,
  NotFoundException,
  ForbiddenException,
} from '@nestjs/common';
import { verify } from 'argon2';
import { FilterQuery, Model } from 'mongoose';
import { InjectModel } from '@nestjs/mongoose';

import {
  IUserDataCreation,
  IUserDataRemoving,
  IGetUserFilterOptions,
  TGetOneUserOptions,
  IUserDataUpdate,
} from '@/users/interfaces/user.service.interfaces';
import { User, UserDocument } from '@/users/schemas/user.schema';

@Injectable()
export class UsersService {
  constructor(
    @InjectModel(User.name)
    private readonly userModel: Model<UserDocument>,
  ) {}
  async create(data: IUserDataCreation) {
    const user = await this.userModel.create(data);
    return user.toJSON();
  }

  async update(data: IUserDataUpdate) {
    const { id, ...updateData } = data;
    const { matchedCount } = await this.userModel
      .updateOne({ _id: id }, updateData)
      .exec();
    if (matchedCount === 0) throw new ForbiddenException('Permission error');
    return;
  }

  async remove({ id, password }: IUserDataRemoving) {
    const user = await this.getOne({ id });
    const verifyPass = await verify(user.password, password);
    if (!verifyPass) throw new BadRequestException('Wrong password');
    await this.userModel.deleteOne({ _id: id });
  }

  async getOne(options: TGetOneUserOptions): Promise<User> {
    const filter = this.getFilter(options);
    const user = await this.userModel.findOne(filter);
    if (!user) throw new NotFoundException('User not found');
    return user.toJSON();
  }

  async checkUserEmailExists(email: string) {
    const user = await this.userModel.findOne({ email });
    if (user) throw new BadRequestException('User email already exist');
    return;
  }

  getFilter(options: IGetUserFilterOptions): FilterQuery<User> {
    const filter: FilterQuery<User> = {};

    if (options.id != null) filter._id = options.id;
    if (options.email != null) filter.email = options.email;

    return filter;
  }
}
