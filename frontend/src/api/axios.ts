const API_BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:8080';

interface RequestOptions {
  method: string;
  headers: Record<string, string>;
  body?: BodyInit | null;
}

class ApiClient {
  private baseURL: string;

  constructor(baseURL: string) {
    this.baseURL = baseURL;
  }

  private getAuthHeader(): Record<string, string> {
    const token = localStorage.getItem('token');
    return token ? { Authorization: `Bearer ${token}` } : {};
  }

  async request<T>(endpoint: string, options: Partial<RequestOptions> = {}): Promise<T> {
    const url = `${this.baseURL}${endpoint}`;
    const isFormData = options.body instanceof FormData;
    const headers: Record<string, string> = {
      ...(!isFormData ? { 'Content-Type': 'application/json' } : {}),
      ...this.getAuthHeader(),
      ...options.headers,
    };

    const config: RequestInit = {
      method: options.method || 'GET',
      headers,
      body: options.body,
    };

    try {
      const response = await fetch(url, config);
      
      if (!response.ok) {
        const error = await response.json().catch(() => ({ message: 'Request failed' }));
        throw new Error(error.message || `HTTP ${response.status}`);
      }

      if (response.status === 204) {
        return undefined as T;
      }

      const contentLength = response.headers.get('content-length');
      if (contentLength === '0') {
        return undefined as T;
      }

      const contentType = response.headers.get('content-type') || '';
      if (contentType.includes('application/json')) {
        return await response.json();
      }

      const text = await response.text();
      return text as unknown as T;
    } catch (error) {
      if (error instanceof Error) {
        throw error;
      }
      throw new Error('Network error occurred');
    }
  }

  get<T>(endpoint: string): Promise<T> {
    return this.request<T>(endpoint);
  }

  post<T>(endpoint: string, data: unknown): Promise<T> {
    return this.request<T>(endpoint, {
      method: 'POST',
      body: JSON.stringify(data),
    });
  }

  put<T>(endpoint: string, data: unknown): Promise<T> {
    return this.request<T>(endpoint, {
      method: 'PUT',
      body: JSON.stringify(data),
    });
  }

  delete(endpoint: string): Promise<void> {
    return this.request<void>(endpoint, {
      method: 'DELETE',
    });
  }

  async uploadCSV<T>(endpoint: string, file: File): Promise<T> {
    const url = `${this.baseURL}${endpoint}`;
    const formData = new FormData();
    formData.append('file', file);

    const response = await fetch(url, {
      method: 'POST',
      headers: this.getAuthHeader(),
      body: formData,
    });

    if (!response.ok) {
      const error = await response.json().catch(() => ({ message: 'Upload failed' }));
      throw new Error(error.message || `HTTP ${response.status}`);
    }

    return await response.json();
  }

  async downloadCSV(endpoint: string): Promise<Blob> {
    const url = `${this.baseURL}${endpoint}`;
    const response = await fetch(url, {
      headers: this.getAuthHeader(),
    });

    if (!response.ok) {
      throw new Error(`HTTP ${response.status}`);
    }

    return await response.blob();
  }
}

export const apiClient = new ApiClient(API_BASE_URL);