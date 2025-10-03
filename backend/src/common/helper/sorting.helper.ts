import { Expression } from 'mongoose';

import { PageDto } from '@/common/dto/page.dto';

export class SortingDbHelper {
  readonly sortBy: string;
  readonly orderSort: string;

  constructor(partial: Partial<PageDto>) {
    Object.assign(this, partial);
  }

  // For multi sorting
  get sort(): Record<string, 1 | -1 | Expression.Meta> {
    const sortBy = this.sortBy.split(',');
    const sortDesc = this.orderSort.split(',');
    const sort: Record<string, 1 | -1 | Expression.Meta> = {};

    sortBy.forEach((el: string) => {
      const key = el !== 'id' ? el : '_id';
      sort[key] = sortDesc[el] === 'true' ? -1 : 1;
    });

    return sort;
  }
}
