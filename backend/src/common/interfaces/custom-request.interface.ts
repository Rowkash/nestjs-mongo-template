import { Request } from 'express';

export interface ICustomRequest extends Request {
  user: IRequestUser | null;
}

export interface IRequestUser {
  id: string;
}
