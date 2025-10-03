import { Module } from '@nestjs/common';

import { MinioModule } from '@/minio/minio.module';
import { MediaProcessingService } from '@/media/media-processing.service';
import { MediaProcessingConsumer } from '@/media/consumers/media-processing.consumer';

@Module({
  imports: [MinioModule],
  providers: [MediaProcessingConsumer, MediaProcessingService],
  exports: [MediaProcessingConsumer, MediaProcessingService],
})
export class MediaModule {}
