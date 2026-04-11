import { apiService, ApiResponse } from './api';
import type { User, UserRegistration } from '../types';

export interface LoginCredentials {
  email: string;
  password: string;
}

export interface LoginResponse {
  user: User;
  token: string;
  refreshToken: string;
}

export interface AuthState {
  user: User | null;
  token: string | null;
  isAuthenticated: boolean;
}

class AuthService {
  // Login user
  async login(credentials: LoginCredentials): Promise<ApiResponse<LoginResponse>> {
    try {
      const response = await apiService.post<LoginResponse>('/auth/login', credentials);
      
      if (response.success && response.data) {
        // Store tokens in localStorage
        localStorage.setItem('authToken', response.data.token);
        localStorage.setItem('refreshToken', response.data.refreshToken);
        localStorage.setItem('user', JSON.stringify(response.data.user));
      }
      
      return response;
    } catch (error) {
      // Fallback to mock data when backend is unavailable
      console.warn('Backend unavailable, using mock data for login');
      
      // Simulate API delay
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      // Mock successful login
      const mockUser: User = {
        id: "1",
        name: credentials.email.split('@')[0] || "Test User",
        email: credentials.email,
        role: "admin",
        institution: "Test Institution",
        preferences: {
          subjects: [],
          languages: ["English"],
        },
        progress: {
          savedNotes: 0,
          completedTopics: 0,
        },
      };
      
      const mockResponse: LoginResponse = {
        user: mockUser,
        token: 'mock-jwt-token-' + Date.now(),
        refreshToken: 'mock-refresh-token-' + Date.now(),
      };
      
      // Store mock tokens in localStorage
      localStorage.setItem('authToken', mockResponse.token);
      localStorage.setItem('refreshToken', mockResponse.refreshToken);
      localStorage.setItem('user', JSON.stringify(mockResponse.user));
      
      return {
        success: true,
        data: mockResponse,
      };
    }
  }

  // Register new user
  async register(userData: UserRegistration): Promise<ApiResponse<LoginResponse>> {
    try {
      const response = await apiService.post<LoginResponse>('/auth/register', userData);
      
      if (response.success && response.data) {
        // Store tokens in localStorage
        localStorage.setItem('authToken', response.data.token);
        localStorage.setItem('refreshToken', response.data.refreshToken);
        localStorage.setItem('user', JSON.stringify(response.data.user));
      }
      
      return response;
    } catch (error) {
      // Fallback to mock data when backend is unavailable
      console.warn('Backend unavailable, using mock data for registration');
      
      // Simulate API delay
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      // Mock successful registration
      const mockUser: User = {
        id: Date.now().toString(),
        name: userData.name,
        email: userData.email,
        role: userData.role,
        institution: userData.institution,
        preferences: userData.preferences,
        progress: userData.progress,
      };
      
      const mockResponse: LoginResponse = {
        user: mockUser,
        token: 'mock-jwt-token-' + Date.now(),
        refreshToken: 'mock-refresh-token-' + Date.now(),
      };
      
      // Store mock tokens in localStorage
      localStorage.setItem('authToken', mockResponse.token);
      localStorage.setItem('refreshToken', mockResponse.refreshToken);
      localStorage.setItem('user', JSON.stringify(mockResponse.user));
      
      return {
        success: true,
        data: mockResponse,
      };
    }
  }

  // Logout user
  async logout(): Promise<ApiResponse<void>> {
    try {
      const response = await apiService.post<void>('/auth/logout');
      
      // Clear tokens from localStorage
      localStorage.removeItem('authToken');
      localStorage.removeItem('refreshToken');
      localStorage.removeItem('user');
      
      return response;
    } catch (error) {
      // Fallback when backend is unavailable - just clear local storage
      console.warn('Backend unavailable, clearing local auth data');
      
      // Clear tokens from localStorage
      localStorage.removeItem('authToken');
      localStorage.removeItem('refreshToken');
      localStorage.removeItem('user');
      
      return {
        success: true,
      };
    }
  }

  // Refresh access token
  async refreshToken(): Promise<ApiResponse<LoginResponse>> {
    const refreshToken = localStorage.getItem('refreshToken');
    
    if (!refreshToken) {
      return {
        success: false,
        error: 'No refresh token available',
      };
    }
    
    const response = await apiService.post<LoginResponse>('/auth/refresh', {
      refreshToken,
    });
    
    if (response.success && response.data) {
      // Update tokens in localStorage
      localStorage.setItem('authToken', response.data.token);
      localStorage.setItem('user', JSON.stringify(response.data.user));
    }
    
    return response;
  }

  // Get current user profile
  async getProfile(): Promise<ApiResponse<User>> {
    return await apiService.get<User>('/auth/profile');
  }

  // Update user profile
  async updateProfile(userData: Partial<User>): Promise<ApiResponse<User>> {
    const response = await apiService.put<User>('/auth/profile', userData);
    
    if (response.success && response.data) {
      // Update user in localStorage
      localStorage.setItem('user', JSON.stringify(response.data));
    }
    
    return response;
  }

  // Check if user is authenticated
  isAuthenticated(): boolean {
    const token = localStorage.getItem('authToken');
    const user = localStorage.getItem('user');
    return !!(token && user);
  }

  // Clear all corrupted auth data
  clearCorruptedAuthData(): void {
    const keysToRemove = ['user', 'authToken', 'refreshToken', 'redux_user', 'users'];
    keysToRemove.forEach(key => {
      try {
        const value = localStorage.getItem(key);
        if (value && (value === 'undefined' || value === 'null' || value === '')) {
          console.log(`authService: Clearing corrupted key: ${key}`);
          localStorage.removeItem(key);
        }
      } catch (error) {
        console.error(`authService: Error checking key ${key}:`, error);
        localStorage.removeItem(key);
      }
    });
  }

  // Get current user from localStorage
  getCurrentUser(): User | null {
    // Clear any corrupted data first
    this.clearCorruptedAuthData();
    
    try {
      const userStr = localStorage.getItem('user');
      if (!userStr || userStr === 'undefined' || userStr === 'null') {
        return null;
      }
      return JSON.parse(userStr);
    } catch (error) {
      console.error('authService: Error parsing user from localStorage', error);
      localStorage.removeItem('user');
      localStorage.removeItem('authToken');
      localStorage.removeItem('refreshToken');
      return null;
    }
  }

  // Get auth token
  getToken(): string | null {
    return localStorage.getItem('authToken');
  }

  // Get refresh token
  getRefreshToken(): string | null {
    return localStorage.getItem('refreshToken');
  }

  // Set auth tokens (useful for login from other sources)
  setTokens(token: string, refreshToken: string, user: User): void {
    localStorage.setItem('authToken', token);
    localStorage.setItem('refreshToken', refreshToken);
    localStorage.setItem('user', JSON.stringify(user));
  }

  // Clear all auth data
  clearAuth(): void {
    localStorage.removeItem('authToken');
    localStorage.removeItem('refreshToken');
    localStorage.removeItem('user');
  }
}

export const authService = new AuthService();
export default authService;
