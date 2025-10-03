import * as sharp from 'sharp';
import { Injectable } from '@nestjs/common';

import { MinioService } from '@/minio/minio.service';

@Injectable()
export class MediaProcessingService {
  constructor(private readonly minioService: MinioService) {}
  async processImage(fileName: string) {
    const allowedFormats = ['jpg', 'jpeg'];
    const buffer = await this.minioService.getFileBuffer(fileName);
    if (!buffer) throw new Error('No file in storage');
    const meta = await sharp(buffer).metadata();
    if (!allowedFormats.includes(meta.format)) {
      const editedImageBuffer = await sharp(buffer)
        .toFormat(sharp.format.jpeg)
        .toBuffer();

      const newFile = {
        buffer: editedImageBuffer,
        mimetype: 'image/jpeg',
      } as Express.Multer.File;
      await this.minioService.uploadFile({
        key: fileName,
        file: newFile,
      });
    }
    return;
  }
}
