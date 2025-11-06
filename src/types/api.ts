import { User } from './models';

export interface ApiResponse<T> {
  success: boolean;
  data?: T;
  error?: string;
}

export interface AuthResponse {
  user: Pick<User, 'id' | 'username' | 'email'>;
  token: string;
}

