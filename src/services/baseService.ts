import axios, { AxiosError, AxiosInstance, AxiosResponse } from 'axios';

import { Response } from '@/interfaces/response';
import { PaginatedResponse } from '@/interfaces/paginatedResponse';
import { GetAllOptions } from '@/interfaces/getAllOptions';

export abstract class BaseService {
  protected apiClient: AxiosInstance;
  protected abstract endpoint: string;
  protected servicePrefix: string;
  private static isRefreshing = false;
  private static refreshSubscribers: Array<() => void> = [];

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
      withCredentials: true,
    });

    this.setupInterceptors();
  }

  private static onRefreshed(): void {
    BaseService.refreshSubscribers.forEach(cb => cb());
    BaseService.refreshSubscribers = [];
  }

  private static addRefreshSubscriber(callback: () => void): void {
    BaseService.refreshSubscribers.push(callback);
  }

  private setupInterceptors(): void {
    this.apiClient.interceptors.request.use(
      async config => {
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

        // Skip refresh logic for auth endpoints
        const isAuthEndpoint =
          originalRequest.url?.includes('/auth/login') ||
          originalRequest.url?.includes('/auth/google') ||
          originalRequest.url?.includes('/auth/refresh') ||
          originalRequest.url?.includes('/auth/2fa/verify');

        if (error.response?.status === 401 && !isAuthEndpoint && !originalRequest._retry) {
          if (BaseService.isRefreshing) {
            // Wait for the ongoing refresh to complete, then retry
            return new Promise(resolve => {
              BaseService.addRefreshSubscriber(() => {
                resolve(this.apiClient(originalRequest));
              });
            });
          }

          originalRequest._retry = true;
          BaseService.isRefreshing = true;

          try {
            const API_BASE_URL = process.env.NEXT_PUBLIC_API_BASE_URL || '';
            await axios.post(`${API_BASE_URL}/api/v1/auth/refresh`, {}, { withCredentials: true });
            BaseService.isRefreshing = false;
            BaseService.onRefreshed();
            return this.apiClient(originalRequest);
          } catch {
            BaseService.isRefreshing = false;
            BaseService.refreshSubscribers = [];
            // Refresh failed - clear auth state and redirect
            if (typeof globalThis.window !== 'undefined') {
              localStorage.removeItem('auth-storage');
              localStorage.removeItem('user-profile-storage');
              globalThis.location.href = '/login?error=session_expired';
            }
          }
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

  private isAxiosError(error: unknown): error is AxiosError<Response<any>> {
    return axios.isAxiosError(error);
  }

  protected handleError(error: unknown): never {
    if (this.isAxiosError(error)) {
      const errorMessage = error.response?.data?.message || error.message || 'An error occurred';

      if (error.response?.status === 401) {
        if (error.config?.url !== this.endpoint) {
          // Session expired - signOut is handled by the interceptor
          throw new Error('The session has expired');
        }
      }

      throw new Error(errorMessage);
    }

    if (error instanceof Error) {
      throw error;
    }

    throw new Error(String(error) || 'An unexpected error occurred');
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
      throw this.handleError(error);
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
      throw this.handleError(error);
    }
  }

  protected async getById<T>(id: string | number): Promise<T> {
    try {
      const response = await this.apiClient.get<Response<T>>(`${this.servicePrefix}/${this.endpoint}/${id}`);
      return this.handleResponse(response);
    } catch (error) {
      throw this.handleError(error);
    }
  }

  protected async create<TRequest, TResponse = TRequest>(data: TRequest, route?: string): Promise<TResponse> {
    try {
      const url = route ? `${this.servicePrefix}/${this.endpoint}/${route}` : `${this.servicePrefix}/${this.endpoint}`;
      const response = await this.apiClient.post<Response<TResponse>>(url, data);
      return this.handleResponse(response);
    } catch (error) {
      throw this.handleError(error);
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
      throw this.handleError(error);
    }
  }

  protected async delete(id: string | number): Promise<void> {
    try {
      await this.apiClient.delete(`${this.servicePrefix}/${this.endpoint}/${id}`);
    } catch (error) {
      throw this.handleError(error);
    }
  }

  protected async patch<T>(url: string, data: any): Promise<T> {
    try {
      const response = await this.apiClient.patch<Response<T>>(`${this.servicePrefix}/${url}`, data);
      return this.handleResponse(response);
    } catch (error) {
      throw this.handleError(error);
    }
  }
}
