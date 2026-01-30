import axios, { AxiosError, AxiosInstance, AxiosResponse } from 'axios';
import { getSession, signOut } from 'next-auth/react';

import { Response } from '@/interfaces/response';
import { PaginatedResponse } from '@/interfaces/paginatedResponse';
import { GetAllOptions } from '@/interfaces/getAllOptions';

export abstract class BaseService {
  protected apiClient: AxiosInstance;
  protected abstract endpoint: string;
  protected servicePrefix: string;

  /**
   * @param servicePrefix - El prefijo del microservicio (ej: "/api/v1/auth", "/api/v1/lotteries")
   */
  constructor(servicePrefix: string) {
    this.servicePrefix = servicePrefix;
    const API_BASE_URL = process.env.NEXT_PUBLIC_API_BASE_URL || '';

    this.apiClient = axios.create({
      baseURL: API_BASE_URL,
      headers: {
        'Content-Type': 'application/json',
      },
    });

    this.setupInterceptors();
  }

  private setupInterceptors(): void {
    this.apiClient.interceptors.request.use(
      async config => {
        // Get access token from next-auth session
        const session = await getSession();
        const token = session?.accessToken;

        if (token) {
          config.headers.set('Authorization', `Bearer ${token}`);
        }

        if (globalThis.window !== undefined) {
          const language = localStorage.getItem('i18nextLng') || 'en';
          config.headers.set('Accept-Language', language.split('-')[0]);
        }

        return config;
      },
      error => {
        return Promise.reject(error instanceof Error ? error : new Error(String(error)));
      }
    );

    this.apiClient.interceptors.response.use(
      response => response,
      async error => {
        const originalRequest = error.config;

        if (error.response?.status === 401 && originalRequest.url !== 'auth') {
          // Trigger next-auth signOut on 401
          await signOut({ callbackUrl: '/login?error=session_expired' });
        }
        throw error instanceof Error ? error : new Error(String(error));
      }
    );
  }

  protected async handleResponse<T>(response: AxiosResponse<Response<T>>): Promise<T> {
    const { data } = response;

    if (!data.success || !data.data) {
      throw new Error(data.message || 'Error');
    }

    return data.data;
  }

  protected handleError(error: AxiosError<Response<any>>): never {
    const errorMessage = error.response?.data?.message || error.message || 'An error occurred';

    if (error.response?.status === 401) {
      if (error.config?.url !== this.endpoint) {
        // Session expired - signOut is handled by the interceptor
        throw new Error('The session has expired');
      }
    }

    throw new Error(errorMessage);
  }

  protected async getAll<T>(options: GetAllOptions = {}): Promise<T[]> {
    const { path = '', params } = options;
    try {
      let finalUrl = `${this.servicePrefix}/${this.endpoint}`;
      if (path) {
        finalUrl = finalUrl + '/' + path;
      }
      const response = await this.apiClient.get<Response<T[]>>(finalUrl, { params });

      return this.handleResponse(response);
    } catch (error) {
      throw this.handleError(error as AxiosError<Response<any>>);
    }
  }

  protected async getAllPaginated<T>(options: GetAllOptions = {}): Promise<PaginatedResponse<T>> {
    const { path = '', params } = options;
    try {
      let finalUrl = `${this.servicePrefix}/${this.endpoint}`;
      if (path) {
        finalUrl = finalUrl + '/' + path;
      }
      const response = await this.apiClient.get<PaginatedResponse<T>>(finalUrl, { params });
      return response.data;
    } catch (error) {
      throw this.handleError(error as AxiosError<Response<any>>);
    }
  }

  protected async getById<T>(id: string | number): Promise<T> {
    try {
      const response = await this.apiClient.get<Response<T>>(`${this.servicePrefix}/${this.endpoint}/${id}`);
      return this.handleResponse(response);
    } catch (error) {
      throw this.handleError(error as AxiosError<Response<any>>);
    }
  }

  protected async create<TRequest, TResponse = TRequest>(data: TRequest, route?: string): Promise<TResponse> {
    try {
      const url = route ? `${this.servicePrefix}/${this.endpoint}/${route}` : `${this.servicePrefix}/${this.endpoint}`;
      const response = await this.apiClient.post<Response<TResponse>>(url, data);
      return this.handleResponse(response);
    } catch (error) {
      throw this.handleError(error as AxiosError<Response<any>>);
    }
  }

  protected async update<TRequest, TResponse = TRequest>(
    id: string | number,
    data: TRequest,
    route?: string
  ): Promise<TResponse> {
    try {
      const url = route
        ? `${this.servicePrefix}/${this.endpoint}/${route}/${id}`
        : `${this.servicePrefix}/${this.endpoint}/${id}`;
      const response = await this.apiClient.put<Response<TResponse>>(url, data);
      return this.handleResponse(response);
    } catch (error) {
      throw this.handleError(error as AxiosError<Response<any>>);
    }
  }

  protected async delete(id: string | number): Promise<void> {
    try {
      await this.apiClient.delete(`${this.servicePrefix}/${this.endpoint}/${id}`);
    } catch (error) {
      throw this.handleError(error as AxiosError<Response<any>>);
    }
  }

  protected async patch<T>(url: string, data: any): Promise<T> {
    try {
      const response = await this.apiClient.patch<Response<T>>(`${this.servicePrefix}/${url}`, data);
      return this.handleResponse(response);
    } catch (error) {
      throw this.handleError(error as AxiosError<Response<any>>);
    }
  }
}
