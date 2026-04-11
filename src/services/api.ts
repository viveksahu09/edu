// API Configuration and Service Layer
const API_BASE_URL = 'http://localhost:5000/api';

// API Response Types
export interface ApiResponse<T = any> {
  success: boolean;
  data?: T;
  message?: string;
  error?: string;
}

export interface PaginatedResponse<T> extends ApiResponse<T[]> {
  pagination: {
    page: number;
    limit: number;
    total: number;
    totalPages: number;
  };
}

// Request Headers Configuration
const getHeaders = (contentType: string = 'application/json') => {
  const headers: HeadersInit = {
    'Content-Type': contentType,
  };
  
  // Add auth token if available
  const token = localStorage.getItem('authToken');
  if (token) {
    headers['Authorization'] = `Bearer ${token}`;
  }
  
  return headers;
};

// Generic API Request Handler
class ApiService {
  private baseURL: string;

  constructor(baseURL: string) {
    this.baseURL = baseURL;
  }

  // HTTP Methods
  async get<T>(endpoint: string, params?: Record<string, any>): Promise<ApiResponse<T>> {
    try {
      const url = new URL(`${this.baseURL}${endpoint}`);
      if (params) {
        Object.entries(params).forEach(([key, value]) => {
          if (value !== undefined && value !== null) {
            url.searchParams.append(key, String(value));
          }
        });
      }

      const response = await fetch(url.toString(), {
        method: 'GET',
        headers: getHeaders(),
      });

      return await this.handleResponse<T>(response);
    } catch (error) {
      return this.handleError(error);
    }
  }

  async post<T>(endpoint: string, data?: any): Promise<ApiResponse<T>> {
    try {
      const response = await fetch(`${this.baseURL}${endpoint}`, {
        method: 'POST',
        headers: getHeaders(),
        body: data ? JSON.stringify(data) : undefined,
      });

      return await this.handleResponse<T>(response);
    } catch (error) {
      return this.handleError(error);
    }
  }

  async put<T>(endpoint: string, data?: any): Promise<ApiResponse<T>> {
    try {
      const response = await fetch(`${this.baseURL}${endpoint}`, {
        method: 'PUT',
        headers: getHeaders(),
        body: data ? JSON.stringify(data) : undefined,
      });

      return await this.handleResponse<T>(response);
    } catch (error) {
      return this.handleError(error);
    }
  }

  async delete<T>(endpoint: string): Promise<ApiResponse<T>> {
    try {
      const response = await fetch(`${this.baseURL}${endpoint}`, {
        method: 'DELETE',
        headers: getHeaders(),
      });

      return await this.handleResponse<T>(response);
    } catch (error) {
      return this.handleError(error);
    }
  }

  async upload<T>(endpoint: string, formData: FormData): Promise<ApiResponse<T>> {
    try {
      const headers: HeadersInit = {};
      const token = localStorage.getItem('authToken');
      if (token) {
        headers['Authorization'] = `Bearer ${token}`;
      }

      const response = await fetch(`${this.baseURL}${endpoint}`, {
        method: 'POST',
        headers,
        body: formData,
      });

      return await this.handleResponse<T>(response);
    } catch (error) {
      return this.handleError(error);
    }
  }

  // Response Handler
  private async handleResponse<T>(response: Response): Promise<ApiResponse<T>> {
    const contentType = response.headers.get('content-type');
    
    if (!response.ok) {
      let errorMessage = `HTTP Error: ${response.status}`;
      
      if (contentType?.includes('application/json')) {
        const errorData = await response.json();
        errorMessage = errorData.message || errorData.error || errorMessage;
      } else {
        const errorText = await response.text();
        errorMessage = errorText || errorMessage;
      }
      
      return {
        success: false,
        error: errorMessage,
      };
    }

    if (contentType?.includes('application/json')) {
      const data = await response.json();
      return {
        success: true,
        data,
      };
    } else {
      const text = await response.text();
      return {
        success: true,
        data: text as T,
      };
    }
  }

  // Error Handler
  private handleError(error: any): ApiResponse {
    console.error('API Error:', error);
    return {
      success: false,
      error: error.message || 'Network error occurred',
    };
  }
}

// Create API Service Instance
export const apiService = new ApiService(API_BASE_URL);

// Specific API Endpoints
export const apiEndpoints = {
  // Auth endpoints
  auth: {
    login: '/auth/login',
    register: '/auth/register',
    logout: '/auth/logout',
    refresh: '/auth/refresh',
    profile: '/auth/profile',
  },
  
  // Users endpoints
  users: {
    list: '/users',
    create: '/users',
    get: (id: string) => `/users/${id}`,
    update: (id: string) => `/users/${id}`,
    delete: (id: string) => `/users/${id}`,
    search: '/users/search',
  },
  
  // Research endpoints
  research: {
    subjects: '/research/subjects',
    topics: '/research/topics',
    contributions: '/research/contributions',
    submitContribution: '/research/contributions/submit',
    approveContribution: (id: string) => `/research/contributions/${id}/approve`,
    rejectContribution: (id: string) => `/research/contributions/${id}/reject`,
  },
  
  // Documents endpoints
  documents: {
    list: '/documents',
    upload: '/documents/upload',
    get: (id: string) => `/documents/${id}`,
    delete: (id: string) => `/documents/${id}`,
  },
  
  // Admin endpoints
  admin: {
    dashboard: '/admin/dashboard',
    users: '/admin/users',
    contributions: '/admin/contributions',
    statistics: '/admin/statistics',
  },
};

// Export default API service
export default apiService;
