export interface IGetUserFilterOptions {
  id?: string;
  name?: string;
  email?: string;
}
export interface IUserDataCreation {
  name: string;
  lastName: string;
  email: string;
  password: string;
}

export interface IUserDataRemoving {
  id: string;
  password: string;
}
export interface TGetOneUserOptions {
  id?: string;
  email?: string;
}

export interface IUserDataUpdate {
  id: string;
  name?: string;
  lastName?: string;
}
