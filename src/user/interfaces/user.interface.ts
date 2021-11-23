import { Role } from '../enums/role.enums';

export interface IUser {
  id?: string;
  name: string;
  email: string;
  password: string;
  roles?: Role[];
  refreshToken?: string;
}
