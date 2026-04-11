import { apiService, ApiResponse, PaginatedResponse } from './api';
import type { User } from '../types';

export interface UserFilters {
  role?: string;
  status?: string;
  search?: string;
  page?: number;
  limit?: number;
}

export interface UserStats {
  totalUsers: number;
  activeUsers: number;
  newUsersThisMonth: number;
  usersByRole: Record<string, number>;
}

class UserService {
  // Get all users (paginated)
  async getUsers(filters: UserFilters = {}): Promise<PaginatedResponse<User[]>> {
    const params = {
      page: filters.page || 1,
      limit: filters.limit || 20,
      ...(filters.role && { role: filters.role }),
      ...(filters.status && { status: filters.status }),
      ...(filters.search && { search: filters.search }),
    };
    
    return await apiService.get<PaginatedResponse<User[]>>('/users', params) as PaginatedResponse<User[]>;
  }

  // Get user by ID
  async getUser(id: string): Promise<ApiResponse<User>> {
    return await apiService.get<User>(`/users/${id}`);
  }

  // Create new user
  async createUser(userData: Omit<User, 'id'>): Promise<ApiResponse<User>> {
    return await apiService.post<User>('/users', userData);
  }

  // Update user
  async updateUser(id: string, userData: Partial<User>): Promise<ApiResponse<User>> {
    return await apiService.put<User>(`/users/${id}`, userData);
  }

  // Delete user
  async deleteUser(id: string): Promise<ApiResponse<void>> {
    return await apiService.delete<void>(`/users/${id}`);
  }

  // Search users
  async searchUsers(query: string, limit: number = 10): Promise<ApiResponse<User[]>> {
    return await apiService.get<User[]>('/users/search', { q: query, limit });
  }

  // Get user statistics
  async getUserStatistics(): Promise<ApiResponse<UserStats>> {
    return await apiService.get<UserStats>('/users/statistics');
  }

  // Update user role
  async updateUserRole(id: string, role: string): Promise<ApiResponse<User>> {
    return await apiService.put<User>(`/users/${id}/role`, { role });
  }

  // Activate/deactivate user
  async updateUserStatus(id: string, status: 'active' | 'inactive'): Promise<ApiResponse<User>> {
    return await apiService.put<User>(`/users/${id}/status`, { status });
  }

  // Reset user password
  async resetUserPassword(id: string): Promise<ApiResponse<{ tempPassword: string }>> {
    return await apiService.put<{ tempPassword: string }>(`/users/${id}/reset-password`);
  }

  // Get user activity log
  async getUserActivityLog(id: string, page: number = 1, limit: number = 20): Promise<PaginatedResponse<any[]>> {
    return await apiService.get<PaginatedResponse<any[]>>(`/users/${id}/activity`, { page, limit }) as PaginatedResponse<any[]>;
  }

  // Get user progress
  async getUserProgress(id: string): Promise<ApiResponse<{
    completedTopics: number;
    savedNotes: number;
    totalTime: number;
    achievements: string[];
    recentActivity: any[];
  }>> {
    return await apiService.get(`/users/${id}/progress`);
  }

  // Update user preferences
  async updateUserPreferences(id: string, preferences: any): Promise<ApiResponse<User>> {
    return await apiService.put<User>(`/users/${id}/preferences`, preferences);
  }

  // Upload user profile picture
  async uploadProfilePicture(id: string, file: File): Promise<ApiResponse<{ profilePicture: string }>> {
    const formData = new FormData();
    formData.append('profilePicture', file);
    
    return await apiService.upload<{ profilePicture: string }>(`/users/${id}/profile-picture`, formData);
  }

  // Get user permissions
  async getUserPermissions(id: string): Promise<ApiResponse<string[]>> {
    return await apiService.get<string[]>(`/users/${id}/permissions`);
  }

  // Update user permissions
  async updateUserPermissions(id: string, permissions: string[]): Promise<ApiResponse<User>> {
    return await apiService.put<User>(`/users/${id}/permissions`, { permissions });
  }

  // Get online users
  async getOnlineUsers(): Promise<ApiResponse<User[]>> {
    return await apiService.get<User[]>('/users/online');
  }

  // Export users to CSV
  async exportUsers(filters: UserFilters = {}): Promise<ApiResponse<{ downloadUrl: string }>> {
    const params = {
      ...(filters.role && { role: filters.role }),
      ...(filters.status && { status: filters.status }),
    };
    
    return await apiService.get<{ downloadUrl: string }>('/users/export', params);
  }

  // Import users from CSV
  async importUsers(file: File): Promise<ApiResponse<{
    imported: number;
    failed: number;
    errors: string[];
  }>> {
    const formData = new FormData();
    formData.append('users', file);
    
    return await apiService.upload<{
      imported: number;
      failed: number;
      errors: string[];
    }>('/users/import', formData);
  }

  // Get user login history
  async getUserLoginHistory(id: string, page: number = 1, limit: number = 20): Promise<PaginatedResponse<any[]>> {
    return await apiService.get<PaginatedResponse<any[]>>(`/users/${id}/login-history`, { page, limit }) as PaginatedResponse<any[]>;
  }

  // Force user logout
  async forceUserLogout(id: string): Promise<ApiResponse<void>> {
    return await apiService.post<void>(`/users/${id}/force-logout`);
  }
}

export const userService = new UserService();
export default userService;
