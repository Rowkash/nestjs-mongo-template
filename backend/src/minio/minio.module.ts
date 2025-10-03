import { Module } from '@nestjs/common';

import { MinioService } from '@/minio/minio.service';
import { MinioProvider } from '@/minio/minio.provider';

@Module({
  providers: [MinioProvider, MinioService],
  exports: [MinioService],
})
export class MinioModule {}
