import { PipeTransform, Injectable, BadRequestException } from '@nestjs/common';

@Injectable()
export class FileImageValidationPipe implements PipeTransform {
  constructor(private readonly isRequired: boolean = false) {}
  transform(file: Express.Multer.File) {
    if (this.isRequired && !file)
      throw new BadRequestException('You should chose image file');
    if (file) {
      const fileType = file.mimetype;
      if (!fileType.startsWith('image/'))
        throw new BadRequestException(
          'Invalid image type. Only images (.jpg, .jpeg, .png, etc.) are allowed.',
        );
      return file;
    }
    return;
  }
}
