import { ConfigService } from '@nestjs/config';
import { getModelToken } from '@nestjs/mongoose';
import { Test, TestingModule } from '@nestjs/testing';

import { MinioService } from '@/minio/minio.service';
import {
  IGetPortfolioImageFilterOptions,
  IGetPortfolioImagePopulateOptions,
} from '@/portfolios/interfaces/portfolio-images.service.interfaces';
import { PortfoliosService } from '@/portfolios/services/portfolios.service';
import { PortfolioImage } from '@/portfolios/schemas/portfolio-image.schema';
import { PortfolioImagesService } from '@/portfolios/services/portfolio-images.service';

describe('PortfolioImagesService', () => {
  let portfolioImagesService: PortfolioImagesService;

  const mockMinIoConfig = {
    endpoint: 'http://localhost:9000',
    bucketName: 'storage',
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        PortfolioImagesService,
        {
          provide: getModelToken(PortfolioImage.name),
          useValue: {},
        },
        { provide: PortfoliosService, useValue: {} },
        { provide: MinioService, useValue: {} },
        {
          provide: ConfigService,
          useValue: { get: jest.fn().mockReturnValue(mockMinIoConfig) },
        },
      ],
    }).compile();

    portfolioImagesService = module.get(PortfolioImagesService);
  });

  it('should be defined', () => {
    expect(PortfolioImagesService).toBeDefined();
  });

  describe('getFilter()', () => {
    it.each`
      payload                                                                      | expectedResult
      ${{}}                                                                        | ${{}}
      ${{ id: '68b807bbd618232b492878db' }}                                        | ${{ _id: '68b807bbd618232b492878db' }}
      ${{ portfolio: '68b807bbd618232b492878db' }}                                 | ${{ portfolio: '68b807bbd618232b492878db' }}
      ${{ id: '68b807bbd618232b492878db', portfolio: '68b807bbd618232b492878db' }} | ${{ _id: '68b807bbd618232b492878db', portfolio: '68b807bbd618232b492878db' }}
    `(
      'should return correct filter $payload',
      ({ payload, expectedResult }) => {
        const result = portfolioImagesService.getFilter(
          payload as IGetPortfolioImageFilterOptions,
        );
        expect(result).toEqual(expectedResult);
      },
    );
  });

  describe('getPopulate()', () => {
    it.each`
      payload                | expectedResult
      ${{}}                  | ${[]}
      ${{ portfolio: true }} | ${['portfolio']}
    `(
      'should return correct filter $payload',
      ({ payload, expectedResult }) => {
        const result = portfolioImagesService.getPopulate(
          payload as IGetPortfolioImagePopulateOptions,
        );
        expect(result).toEqual(expectedResult);
      },
    );
  });

  describe('getImagePathFromS3()', () => {
    const { endpoint, bucketName } = mockMinIoConfig;
    it.each`
      payload                                   | expectedResult
      ${'eb0f7d63-974c-4b79-87cf-f1e154c8ec36'} | ${`${endpoint}/${bucketName}/eb0f7d63-974c-4b79-87cf-f1e154c8ec36`}
      ${'ac8f81cf-5e10-4a0b-b7e7-e5049cd4d701'} | ${`${endpoint}/${bucketName}/ac8f81cf-5e10-4a0b-b7e7-e5049cd4d701`}
    `(
      'should return correct filter $payload',
      ({ payload, expectedResult }) => {
        const result = portfolioImagesService.getImagePathFromS3(
          payload as string,
        );
        expect(result).toEqual(expectedResult);
      },
    );
  });
});
