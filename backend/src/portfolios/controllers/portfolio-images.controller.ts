import {
  Controller,
  Post,
  Body,
  Param,
  Delete,
  Req,
  UseInterceptors,
  ClassSerializerInterceptor,
  UploadedFile,
  UseGuards,
  Patch,
  Get,
} from '@nestjs/common';
import {
  ApiBearerAuth,
  ApiBody,
  ApiConsumes,
  ApiOkResponse,
  ApiOperation,
  ApiTags,
} from '@nestjs/swagger';
import { plainToInstance } from 'class-transformer';
import { FileInterceptor } from '@nestjs/platform-express';

import { AuthGuard } from '@/auth/guards/auth.guard';
import {
  ICustomRequest,
  IRequestUser,
} from '@/common/interfaces/custom-request.interface';
import { PortfolioImage } from '@/portfolios/schemas/portfolio-image.schema';
import { FileImageValidationPipe } from '@/common/pipes/file.validation.pipe';
import { MongoIdValidationPipe } from '@/common/pipes/mongo-id-validation.pipe';
import { CreatePortfolioImageDto } from '@/portfolios/dto/create-portfolio-image.dto';
import { PortfolioImagesService } from '@/portfolios/services/portfolio-images.service';
import { UpdatePortfolioImageDto } from '@/portfolios/dto/update-portfolio-image.dto';

@ApiTags('Portfolio Images')
@ApiBearerAuth()
@UseInterceptors(ClassSerializerInterceptor)
@UseGuards(AuthGuard)
@Controller('portfolios')
export class PortfolioImagesController {
  constructor(
    private readonly portfolioImagesService: PortfolioImagesService,
  ) {}

  @ApiOperation({ summary: 'Add image to portfolio' })
  @ApiConsumes('multipart/form-data')
  @ApiBody({
    schema: {
      type: 'object',
      properties: {
        name: {
          type: 'string',
          description: 'Portfolio image name',
          nullable: false,
        },
        description: {
          type: 'string',
          description: 'Portfolio image description',
        },
        file: {
          type: 'string',
          format: 'binary',
        },
      },
      required: ['name', 'description', 'file'],
    },
  })
  @UseInterceptors(FileInterceptor('file'))
  @Post(':portfolioId/images')
  async create(
    @Req() { user }: ICustomRequest,
    @Param('portfolioId', MongoIdValidationPipe) portfolioId: string,
    @UploadedFile(new FileImageValidationPipe(true)) file: Express.Multer.File,
    @Body() dto: CreatePortfolioImageDto,
  ) {
    const { id: userId } = user as IRequestUser;

    const image = await this.portfolioImagesService.create({
      ...dto,
      portfolio: portfolioId,
      user: userId,
      file,
    });

    return plainToInstance(PortfolioImage, image, {
      excludeExtraneousValues: true,
    });
  }

  @ApiOperation({ summary: 'Update portfolio image' })
  @ApiConsumes('multipart/form-data')
  @ApiBody({
    schema: {
      type: 'object',
      properties: {
        name: {
          type: 'string',
          description: 'Portfolio image name',
        },
        description: {
          type: 'string',
          description: 'Portfolio image description',
        },
        file: {
          type: 'string',
          format: 'binary',
        },
      },
    },
  })
  @UseInterceptors(FileInterceptor('file'))
  @Patch(':portfolioId/images/:imageId')
  update(
    @Req() { user }: ICustomRequest,
    @Param('portfolioId', MongoIdValidationPipe) portfolioId: string,
    @Param('imageId', MongoIdValidationPipe) imageId: string,
    @UploadedFile(new FileImageValidationPipe(false)) file: Express.Multer.File,
    @Body() dto: UpdatePortfolioImageDto,
  ) {
    const { id: userId } = user as IRequestUser;
    return this.portfolioImagesService.update({
      ...dto,
      user: userId,
      portfolio: portfolioId,
      id: imageId,
      file,
    });
  }

  @ApiOperation({ summary: 'Get portfolio image by id' })
  @ApiOkResponse({
    description: 'Return portfolio image by id',
    type: PortfolioImage,
  })
  @Get(':portfolioId/images/:imageId')
  async findById(
    @Param('portfolioId', MongoIdValidationPipe) portfolioId: string,
    @Param('imageId', MongoIdValidationPipe) imageId: string,
  ) {
    const image = await this.portfolioImagesService.findOne({
      id: imageId,
      portfolio: portfolioId,
    });

    return plainToInstance(PortfolioImage, image, {
      excludeExtraneousValues: true,
    });
  }

  @ApiOperation({ summary: 'Delete portfolio image' })
  @Delete(':portfolioId/images/:imageId')
  async delete(
    @Req() { user }: ICustomRequest,
    @Param('portfolioId', MongoIdValidationPipe) portfolioId: string,
    @Param('imageId', MongoIdValidationPipe) imageId: string,
  ) {
    const { id: userId } = user as IRequestUser;
    await this.portfolioImagesService.remove({ imageId, portfolioId, userId });
  }
}
