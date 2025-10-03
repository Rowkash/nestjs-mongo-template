import { isObjectIdOrHexString } from 'mongoose';
import { TransformFnParams } from 'class-transformer';

export const escapeRegExp = ({ value }: TransformFnParams) => {
  if (typeof value === 'string') {
    return value.replace(/[-/\\^$*+?.()|[\]{}]/g, '\\$&');
  }
};

export const transformToStringOrClass = (EntityClass: any) => {
  return ({ value }: TransformFnParams) => {
    if (Array.isArray(value)) {
      return value.map((item) => {
        if (isObjectIdOrHexString(item)) {
          return item.toString();
        } else if (typeof item === 'object' && item._id) {
          return new EntityClass(item);
        }
        return item;
      });
    }

    if (isObjectIdOrHexString(value)) {
      return value.toString();
    } else if (typeof value === 'object' && value._id) {
      return new EntityClass(value);
    }
    return value;
  };
};
