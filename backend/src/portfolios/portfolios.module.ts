import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';

import {
  Portfolio,
  PortfolioSchema,
} from '@/portfolios/schemas/portfolio.schema';
import { MinioModule } from '@/minio/minio.module';
import { MediaModule } from '@/media/media.module';
import {
  PortfolioImage,
  PortfolioImageSchema,
} from '@/portfolios/schemas/portfolio-image.schema';
import { BullQueueModule } from '@/bull/bull-queue.module';
import { PortfoliosService } from '@/portfolios/services/portfolios.service';
import { PortfoliosController } from '@/portfolios/controllers/portfolios.controller';
import { PortfolioImagesService } from '@/portfolios/services/portfolio-images.service';
import { PortfolioImagesController } from '@/portfolios/controllers/portfolio-images.controller';

@Module({
  imports: [
    MongooseModule.forFeature([
      { name: Portfolio.name, schema: PortfolioSchema },
      { name: PortfolioImage.name, schema: PortfolioImageSchema },
    ]),
    MinioModule,
    MediaModule,
    BullQueueModule,
  ],
  controllers: [PortfoliosController, PortfolioImagesController],
  providers: [PortfoliosService, PortfolioImagesService],
  exports: [PortfoliosService, PortfolioImagesService],
})
export class PortfoliosModule {}
