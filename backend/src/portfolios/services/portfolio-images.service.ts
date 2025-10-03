import {
  ForbiddenException,
  forwardRef,
  Inject,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { Queue } from 'bullmq';
import { v4 as uuidv4 } from 'uuid';
import { InjectQueue } from '@nestjs/bullmq';
import { ConfigService } from '@nestjs/config';
import { InjectModel } from '@nestjs/mongoose';
import { FilterQuery, isValidObjectId, Model, QueryOptions } from 'mongoose';

import { JobEnum } from '@/bull/enums/job.enum';
import { QueueEnum } from '@/bull/enums/queue.enum';
import { MinioService } from '@/minio/minio.service';
import { IMinioConfig } from '@/configs/minio.config';
import {
  PortfolioImage,
  PortfolioImageDocument,
} from '@/portfolios/schemas/portfolio-image.schema';
import {
  IGetOnePortfolioImageOptions,
  IPortfolioDataRemoving,
  IGetPortfolioImageFilterOptions,
  IImageDataCreation,
  IGetPortfolioImagePopulateOptions,
  IPortfolioImageDataUpdate,
  IPortfolioDataRemovingByPortfolio,
} from '@/portfolios/interfaces/portfolio-images.service.interfaces';
import { PortfoliosService } from '@/portfolios/services/portfolios.service';

@Injectable()
export class PortfolioImagesService {
  constructor(
    @InjectModel(PortfolioImage.name)
    private readonly portfolioImageModel: Model<PortfolioImageDocument>,
    @Inject(forwardRef(() => PortfoliosService))
    private readonly portfoliosService: PortfoliosService,
    private readonly storage: MinioService,
    private readonly configService: ConfigService,
    @InjectQueue(QueueEnum.MEDIA_PROCESSING_QUEUE)
    private readonly mediaProcessingQueue: Queue,
  ) {}

  async create(data: IImageDataCreation) {
    const { file, ...createData } = data;
    await this.portfoliosService.findOne({
      id: createData.portfolio,
      user: createData.user,
    });
    const fileName = uuidv4();
    const storageKey = `${createData.user}/${fileName}`;
    await this.storage.uploadFile({ file, key: storageKey });
    const url = this.getImagePathFromS3(storageKey);
    const image = await this.portfolioImageModel.create({
      ...createData,
      fileName,
      url,
    });
    await this.mediaProcessingQueue.add(JobEnum.PROCESS_MEDIA_JOB, storageKey, {
      removeOnComplete: true,
      attempts: 2,
      delay: 10000,
    });
    return image.toJSON();
  }

  async update(data: IPortfolioImageDataUpdate) {
    const { id, user, portfolio, file, ...updateData } = data;
    const image = await this.portfolioImageModel.findOneAndUpdate(
      { _id: id, user, portfolio },
      updateData,
    );
    if (!image) throw new NotFoundException('Portfolio image not found');
    if (file) {
      const storageKey = `${user}/${image.fileName}`;
      await this.storage.uploadFile({ key: storageKey, file });
      await this.mediaProcessingQueue.add(
        JobEnum.PROCESS_MEDIA_JOB,
        storageKey,
        {
          removeOnComplete: true,
          attempts: 2,
          delay: 10000,
        },
      );
    }
  }

  async findOne(
    options: IGetOnePortfolioImageOptions,
  ): Promise<PortfolioImage> {
    const filter = this.getFilter(options);
    const findOneOptions: QueryOptions<PortfolioImageDocument> = {};
    if (options.populate) {
      findOneOptions.populate = this.getPopulate(options.populate);
    }
    const image = await this.portfolioImageModel.findOne(
      filter,
      {},
      findOneOptions,
    );
    if (!image) throw new NotFoundException('Image not found');
    return image.toJSON();
  }

  async remove(options: IPortfolioDataRemoving) {
    const { portfolioId, imageId, userId } = options;
    const image = await this.findOne({
      id: imageId,
      portfolio: portfolioId,
    });
    // eslint-disable-next-line @typescript-eslint/no-base-to-string
    if (isValidObjectId(image.user) && image.user.toString() !== userId)
      throw new ForbiddenException('Permissions error');

    await Promise.all([
      this.storage.deleteFile(image.fileName),
      this.portfolioImageModel.deleteOne({ _id: imageId }),
    ]);
  }

  async removeByPortfolio(options: IPortfolioDataRemovingByPortfolio) {
    const { portfolioId, userId } = options;
    const images = await this.portfolioImageModel
      .find(
        {
          portfolio: portfolioId,
          user: userId,
        },
        { fileName: 1 },
      )
      .lean();
    if (images.length > 0) {
      const fileNames = images.map((image) => image.fileName);
      await this.storage.deleteFiles(fileNames);
      await this.portfolioImageModel.deleteMany({
        portfolio: portfolioId,
        user: userId,
      });
    }
  }

  getFilter(
    options: IGetPortfolioImageFilterOptions,
  ): FilterQuery<PortfolioImage> {
    const filter: FilterQuery<PortfolioImage> = {};

    if (options.id != null) filter._id = options.id;
    if (options.portfolio != null) filter.portfolio = options.portfolio;

    return filter;
  }

  getPopulate(options: IGetPortfolioImagePopulateOptions): string[] {
    const populate: string[] = [];

    if (options.portfolio && options.portfolio === true) {
      populate.push('portfolio');
    }

    return populate;
  }

  getImagePathFromS3(key: string) {
    const minioConfig: IMinioConfig = this.configService.get<IMinioConfig>(
      'minio',
      {
        infer: true,
      },
    );

    return `${minioConfig.endpoint}/${minioConfig.bucketName}/${key}`;
  }
}
