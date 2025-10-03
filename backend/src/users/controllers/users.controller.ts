import {
  Body,
  ClassSerializerInterceptor,
  Controller,
  Delete,
  Get,
  HttpCode,
  HttpStatus,
  Param,
  Patch,
  Req,
  UseGuards,
  UseInterceptors,
} from '@nestjs/common';
import { plainToInstance } from 'class-transformer';
import { ApiBearerAuth, ApiOkResponse, ApiOperation } from '@nestjs/swagger';

import { User } from '@/users/schemas/user.schema';
import { AuthGuard } from '@/auth/guards/auth.guard';
import {
  ICustomRequest,
  IRequestUser,
} from '@/common/interfaces/custom-request.interface';
import { DeleteUserDto } from '@/users/dto/delete-user.dto';
import { UpdateUserDto } from '@/users/dto/update-user.dto';
import { UsersService } from '@/users/services/users.service';
import { MongoIdValidationPipe } from '@/common/pipes/mongo-id-validation.pipe';

@ApiBearerAuth()
@UseInterceptors(ClassSerializerInterceptor)
@UseGuards(AuthGuard)
@Controller('users')
export class UsersController {
  constructor(private readonly usersService: UsersService) {}

  @ApiOperation({ summary: 'Return self user' })
  @Get('me')
  async getSelfUser(@Req() req: ICustomRequest) {
    const { id } = req.user as IRequestUser;
    const userDoc = await this.usersService.getOne({ id });

    return plainToInstance(User, userDoc, { excludeExtraneousValues: true });
  }

  @ApiOperation({ summary: 'Return user' })
  @ApiOkResponse({ type: User })
  @Get(':id')
  async findOne(@Param('id', MongoIdValidationPipe) id: string) {
    const user = await this.usersService.getOne({ id });

    return plainToInstance(User, user, { excludeExtraneousValues: true });
  }

  @ApiOperation({ summary: 'Update self user' })
  @Patch('me')
  async update(@Req() { user }: ICustomRequest, @Body() dto: UpdateUserDto) {
    const { id } = user as IRequestUser;
    await this.usersService.update({ id, ...dto });
  }

  @ApiOperation({ summary: 'Delete user' })
  @HttpCode(HttpStatus.NO_CONTENT)
  @Delete()
  async remove(
    @Req() { user }: ICustomRequest,
    @Body() { password }: DeleteUserDto,
  ) {
    const { id } = user as IRequestUser;
    await this.usersService.remove({ id, password });
  }
}
