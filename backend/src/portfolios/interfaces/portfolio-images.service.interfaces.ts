export interface IImageDataCreation {
  name: string;
  description: string;
  user: string;
  portfolio: string;
  file: Express.Multer.File;
}

export interface IPortfolioImageDataUpdate {
  id: string;
  user: string;
  portfolio: string;
  name?: string;
  description?: string;
  file?: Express.Multer.File;
}

export interface IGetPortfolioImageFilterOptions {
  id?: string;
  portfolio?: string;
}

export interface IGetPortfolioImagePopulateOptions {
  portfolio?: boolean;
}

export interface IGetOnePortfolioImageOptions {
  id?: string;
  name?: string;
  portfolio?: string;
  user?: string;
  populate?: IGetPortfolioImagePopulateOptions;
}

export interface IPortfolioDataRemoving {
  imageId: string;
  userId: string;
  portfolioId: string;
}

export interface IPortfolioDataRemovingByPortfolio {
  userId: string;
  portfolioId: string;
}
