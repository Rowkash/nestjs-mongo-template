import { getModelToken } from '@nestjs/mongoose';
import { Test, TestingModule } from '@nestjs/testing';

import {
  IGetPortfolioFilterOptions,
  IGetPortfolioPopulateOptions,
} from '@/portfolios/interfaces/portfolio.service.interfaces';
import { Portfolio } from '@/portfolios/schemas/portfolio.schema';
import { PortfoliosService } from '@/portfolios/services/portfolios.service';
import { PortfolioImagesService } from '@/portfolios/services/portfolio-images.service';

describe('PortfoliosService', () => {
  let portfoliosService: PortfoliosService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        PortfoliosService,
        {
          provide: getModelToken(Portfolio.name),
          useValue: {},
        },
        {
          provide: PortfolioImagesService,
          useValue: {},
        },
      ],
    }).compile();

    portfoliosService = module.get(PortfoliosService);
  });

  it('should be defined', () => {
    expect(PortfoliosService).toBeDefined();
  });

  describe('getFilter()', () => {
    it.each`
      payload                                                                 | expectedResult
      ${{}}                                                                   | ${{}}
      ${{ id: '68b807bbd618232b492878db' }}                                   | ${{ _id: '68b807bbd618232b492878db' }}
      ${{ user: '68b807bbd618232b492878db' }}                                 | ${{ user: '68b807bbd618232b492878db' }}
      ${{ name: 'John' }}                                                     | ${{ name: { $regex: 'John', $options: 'i' } }}
      ${{ id: '68b807bbd618232b492878db', user: '68b807bbd618232b492878db' }} | ${{ _id: '68b807bbd618232b492878db', user: '68b807bbd618232b492878db' }}
    `(
      'should return correct filter $payload',
      ({ payload, expectedResult }) => {
        const result = portfoliosService.getFilter(
          payload as IGetPortfolioFilterOptions,
        );
        expect(result).toEqual(expectedResult);
      },
    );
  });

  describe('getPopulate()', () => {
    it.each`
      payload             | expectedResult
      ${{}}               | ${[]}
      ${{ images: true }} | ${['images']}
    `(
      'should return correct filter $payload',
      ({ payload, expectedResult }) => {
        const result = portfoliosService.getPopulate(
          payload as IGetPortfolioPopulateOptions,
        );
        expect(result).toEqual(expectedResult);
      },
    );
  });
});
