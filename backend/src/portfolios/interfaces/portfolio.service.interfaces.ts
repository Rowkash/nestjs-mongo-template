export interface IPortfolioDataCreation {
  name: string;
  description: string;
  user: string;
}

export interface IPortfolioDataUpdate {
  id: string;
  user: string;
  name?: string;
  description?: string;
}

export interface IGetPortfolioFilterOptions {
  id?: string;
  name?: string;
  user?: string;
}

export interface IGetPortfolioPopulateOptions {
  images?: boolean;
}

export interface IGetOnePortfolioOptions {
  id: string;
  user?: string;
  populate?: IGetPortfolioPopulateOptions;
}
