export interface IUserCacheData {
  id: string;
  email: string;
}

export interface ICacheData {
  user: IUserCacheData;
  refreshToken: string;
}

export interface ISessionData {
  userId: string;
  email: string;
}

export interface IUpdateSessionsData {
  sessions: string[];
  cacheData: ICacheData;
}
