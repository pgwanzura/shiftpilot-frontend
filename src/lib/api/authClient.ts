import { BaseClient } from './baseClient';
import {
  LoginCredentials,
  RegisterData,
  ApiResponse,
  AuthUserResponse,
  LoginResponse,
} from './types';

export class AuthClient extends BaseClient {
  protected baseURL: string;

  constructor(baseURL?: string) {
    super();
    this.baseURL =
      baseURL || process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8000';
  }

  async login(
    credentials: LoginCredentials
  ): Promise<ApiResponse<LoginResponse>> {
    return this.post<ApiResponse<LoginResponse>>('/auth/login', credentials);
  }

  async logout(): Promise<ApiResponse<undefined>> {
    return this.post<ApiResponse<undefined>>('/auth/logout');
  }

  async getUser(): Promise<ApiResponse<AuthUserResponse>> {
    return this.get<ApiResponse<AuthUserResponse>>('/auth/user');
  }

  async register(data: RegisterData): Promise<ApiResponse<AuthUserResponse>> {
    return this.post<ApiResponse<AuthUserResponse>>('/auth/register', data);
  }

  async registerAgency(
    data: RegisterData
  ): Promise<ApiResponse<AuthUserResponse>> {
    return this.post<ApiResponse<AuthUserResponse>>(
      '/auth/register/agency',
      data
    );
  }

  async registerEmployer(
    data: RegisterData
  ): Promise<ApiResponse<AuthUserResponse>> {
    return this.post<ApiResponse<AuthUserResponse>>(
      '/auth/register/employer',
      data
    );
  }
}
