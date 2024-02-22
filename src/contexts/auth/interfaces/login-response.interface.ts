import { User } from '../entities';

export interface ILoginResponse {
  user: User;
  token: string;
  refreshToken: string;
}
