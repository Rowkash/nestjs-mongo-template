import { InjectModel } from '@nestjs/mongoose';
import { FilterQuery, Model, QueryOptions } from 'mongoose';
import { Injectable, NotFoundException } from '@nestjs/common';

import { Page } from '@/common/dto/page.dto';
import {
  Portfolio,
  PortfolioDocument,
} from '@/portfolios/schemas/portfolio.schema';
import {
  IGetOnePortfolioOptions,
  IPortfolioDataCreation,
  IPortfolioDataUpdate,
  IGetPortfolioFilterOptions,
  IGetPortfolioPopulateOptions,
} from '@/portfolios/interfaces/portfolio.service.interfaces';
import { SortingDbHelper } from '@/common/helper/sorting.helper';
import { PortfolioPageDto } from '@/portfolios/dto/portfolio-page.dto';
import { PortfolioImagesService } from '@/portfolios/services/portfolio-images.service';

@Injectable()
export class PortfoliosService {
  constructor(
    @InjectModel(Portfolio.name)
    private readonly portfolioModel: Model<PortfolioDocument>,
    private readonly portfolioImagesService: PortfolioImagesService,
  ) {}

  async create(data: IPortfolioDataCreation) {
    const portfolio = await this.portfolioModel.create(data);
    return portfolio.toJSON();
  }

  async update(data: IPortfolioDataUpdate) {
    const { id, user, ...updateData } = data;
    const { matchedCount } = await this.portfolioModel
      .updateOne({ _id: id, user }, updateData)
      .exec();
    if (matchedCount === 0) throw new NotFoundException('Portfolio not found');
    return;
  }

  async getPage(options: PortfolioPageDto) {
    const { limit = 20, page = 1 } = options;
    const sorting = new SortingDbHelper(options);
    const filter = this.getFilter(options);
    const userLookup = [
      {
        $lookup: {
          from: 'users',
          localField: 'user',
          foreignField: '_id',
          as: 'user',
          pipeline: [
            {
              $addFields: {
                id: '$_id',
              },
            },
          ],
        },
      },
      { $unwind: { path: '$user', preserveNullAndEmptyArrays: true } },
    ];

    const imageLookup = [
      {
        $lookup: {
          from: 'images',
          localField: '_id',
          foreignField: 'portfolio',
          as: 'images',
          pipeline: [
            {
              $addFields: {
                id: '$_id',
              },
            },
          ],
        },
      },
      { $unwind: { path: '$images', preserveNullAndEmptyArrays: true } },
    ];
    const portfoliosDocs = await this.portfolioModel
      .aggregate()
      .allowDiskUse(true)
      .match(filter)
      .facet({
        models: [
          { $sort: sorting.sort },
          { $skip: (page - 1) * limit },
          { $limit: limit },
          ...userLookup,
          ...imageLookup,
          {
            $addFields: {
              id: '$_id',
            },
          },
        ],
        count: [{ $count: 'count' }],
      })
      .exec();

    const { models, count } = portfoliosDocs[0];

    const modelsSerialized: Portfolio[] = models.map(
      (model: Portfolio) => new Portfolio(model),
    );

    const totalCount = count.length ? Number(count[0].count) : 0;
    return new Page<Portfolio>(modelsSerialized, totalCount);
  }

  async findOne(options: IGetOnePortfolioOptions) {
    const filter = this.getFilter(options);
    const findOneOptions: QueryOptions = {};
    if (options.populate) {
      findOneOptions.populate = this.getPopulate(options.populate);
    }
    const portfolio = await this.portfolioModel.findOne(
      filter,
      {},
      findOneOptions,
    );
    if (!portfolio) throw new NotFoundException('Portfolio not found');
    return portfolio.toJSON();
  }

  async remove(id: string, user: string) {
    await this.findOne({
      id,
      user,
    });

    await this.portfolioImagesService.removeByPortfolio({
      portfolioId: id,
      userId: user,
    });

    await this.portfolioModel.deleteOne({ _id: id });
  }

  getFilter(options: IGetPortfolioFilterOptions): FilterQuery<Portfolio> {
    const filter: FilterQuery<Portfolio> = {};

    if (options.id != null) filter._id = options.id;
    if (options.user != null) filter.user = options.user;
    if (options.name != null)
      filter.name = {
        $regex: options.name,
        $options: 'i',
      };

    return filter;
  }

  getPopulate(options: IGetPortfolioPopulateOptions): string[] {
    const populate: string[] = [];

    if (options.images && options.images === true) {
      populate.push('images');
    }

    return populate;
  }
}
