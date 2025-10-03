import { isObjectIdOrHexString } from 'mongoose';
import {
  ArgumentMetadata,
  BadRequestException,
  PipeTransform,
} from '@nestjs/common';

export class MongoIdValidationPipe implements PipeTransform {
  transform(value: any, metadata: ArgumentMetadata) {
    if (!isObjectIdOrHexString(value)) {
      throw new BadRequestException(
        `${metadata.data} must be a valid Mongo ID string`,
      );
    }
    return value;
  }
}
