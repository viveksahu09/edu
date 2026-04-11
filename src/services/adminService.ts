import { apiService, ApiResponse } from './api';
import type { User } from '../types';

export interface DashboardStats {
  totalUsers: number;
  totalContributions: number;
  pendingContributions: number;
  totalTopics: number;
  recentActivity: any[];
  userGrowth: {
    daily: number[];
    weekly: number[];
    monthly: number[];
  };
  contributionStats: {
    byStatus: Record<string, number>;
    byType: Record<string, number>;
    bySubject: Record<string, number>;
  };
}

export interface SystemInfo {
  version: string;
  uptime: number;
  memory: {
    used: number;
    total: number;
    percentage: number;
  };
  cpu: {
    usage: number;
  };
  database: {
    status: string;
    connections: number;
  };
}

export interface AdminLog {
  id: string;
  action: string;
  resource: string;
  resourceId: string;
  userId: string;
  timestamp: string;
  details: any;
  ipAddress: string;
  userAgent: string;
}

class AdminService {
  // Get dashboard statistics
  async getDashboardStats(): Promise<ApiResponse<DashboardStats>> {
    return await apiService.get<DashboardStats>('/admin/dashboard');
  }

  // Get system information
  async getSystemInfo(): Promise<ApiResponse<SystemInfo>> {
    return await apiService.get<SystemInfo>('/admin/system');
  }

  // Get admin logs
  async getAdminLogs(page: number = 1, limit: number = 50, action?: string): Promise<ApiResponse<{
    logs: AdminLog[];
    total: number;
    page: number;
    totalPages: number;
  }>> {
    const params = { page, limit, ...(action && { action }) };
    return await apiService.get('/admin/logs', params);
  }

  // Get user management data
  async getUserManagementData(): Promise<ApiResponse<{
    users: User[];
    stats: {
      total: number;
      active: number;
      inactive: number;
      byRole: Record<string, number>;
      recent: User[];
    };
  }>> {
    return await apiService.get('/admin/users');
  }

  // Get contribution management data
  async getContributionManagementData(): Promise<ApiResponse<{
    pending: any[];
    approved: any[];
    rejected: any[];
    stats: {
      total: number;
      pending: number;
      approved: number;
      rejected: number;
      thisWeek: number;
      thisMonth: number;
    };
  }>> {
    return await apiService.get('/admin/contributions');
  }

  // Bulk approve contributions
  async bulkApproveContributions(contributionIds: string[]): Promise<ApiResponse<{
    approved: string[];
    failed: string[];
  }>> {
    return await apiService.post('/admin/contributions/bulk-approve', { contributionIds });
  }

  // Bulk reject contributions
  async bulkRejectContributions(contributionIds: string[], reason?: string): Promise<ApiResponse<{
    rejected: string[];
    failed: string[];
  }>> {
    return await apiService.post('/admin/contributions/bulk-reject', { contributionIds, reason });
  }

  // Export contributions
  async exportContributions(status?: string, dateFrom?: string, dateTo?: string): Promise<ApiResponse<{
    downloadUrl: string;
    filename: string;
  }>> {
    const params = {
      ...(status && { status }),
      ...(dateFrom && { dateFrom }),
      ...(dateTo && { dateTo }),
    };
    
    return await apiService.get('/admin/contributions/export', params);
  }

  // Get content moderation data
  async getContentModerationData(): Promise<ApiResponse<{
    flaggedContent: any[];
    spam: any[];
    reports: any[];
    stats: {
      totalFlagged: number;
      totalSpam: number;
      totalReports: number;
      pending: number;
    };
  }>> {
    return await apiService.get('/admin/content-moderation');
  }

  // Approve flagged content
  async approveContent(contentId: string, contentType: string): Promise<ApiResponse<void>> {
    return await apiService.post(`/admin/content/${contentType}/${contentId}/approve`);
  }

  // Remove flagged content
  async removeContent(contentId: string, contentType: string, reason?: string): Promise<ApiResponse<void>> {
    return await apiService.post(`/admin/content/${contentType}/${contentId}/remove`, { reason });
  }

  // Get system settings
  async getSystemSettings(): Promise<ApiResponse<Record<string, any>>> {
    return await apiService.get('/admin/settings');
  }

  // Update system settings
  async updateSystemSettings(settings: Record<string, any>): Promise<ApiResponse<Record<string, any>>> {
    return await apiService.put('/admin/settings', settings);
  }

  // Get backup data
  async getBackupData(): Promise<ApiResponse<{
    backups: Array<{
      id: string;
      filename: string;
      size: number;
      createdAt: string;
      type: string;
    }>;
    nextBackup: string;
  }>> {
    return await apiService.get('/admin/backup');
  }

  // Create backup
  async createBackup(type: 'full' | 'database' | 'files'): Promise<ApiResponse<{
    backupId: string;
    message: string;
  }>> {
    return await apiService.post('/admin/backup', { type });
  }

  // Restore backup
  async restoreBackup(backupId: string): Promise<ApiResponse<void>> {
    return await apiService.post(`/admin/backup/${backupId}/restore`);
  }

  // Download backup
  async downloadBackup(backupId: string): Promise<ApiResponse<{ downloadUrl: string }>> {
    return await apiService.get(`/admin/backup/${backupId}/download`);
  }

  // Get security settings
  async getSecuritySettings(): Promise<ApiResponse<{
    passwordPolicy: {
      minLength: number;
      requireUppercase: boolean;
      requireLowercase: boolean;
      requireNumbers: boolean;
      requireSpecialChars: boolean;
    };
    sessionTimeout: number;
    maxLoginAttempts: number;
    lockoutDuration: number;
    twoFactorAuth: boolean;
  }>> {
    return await apiService.get('/admin/security');
  }

  // Update security settings
  async updateSecuritySettings(settings: any): Promise<ApiResponse<void>> {
    return await apiService.put('/admin/security', settings);
  }

  // Get audit logs
  async getAuditLogs(filters: {
    userId?: string;
    action?: string;
    resource?: string;
    dateFrom?: string;
    dateTo?: string;
    page?: number;
    limit?: number;
  } = {}): Promise<ApiResponse<{
    logs: AdminLog[];
    total: number;
    page: number;
    totalPages: number;
  }>> {
    const params = {
      page: filters.page || 1,
      limit: filters.limit || 50,
      ...(filters.userId && { userId: filters.userId }),
      ...(filters.action && { action: filters.action }),
      ...(filters.resource && { resource: filters.resource }),
      ...(filters.dateFrom && { dateFrom: filters.dateFrom }),
      ...(filters.dateTo && { dateTo: filters.dateTo }),
    };
    
    return await apiService.get('/admin/audit-logs', params);
  }

  // Get performance metrics
  async getPerformanceMetrics(): Promise<ApiResponse<{
    responseTime: number;
    throughput: number;
    errorRate: number;
    uptime: number;
    memoryUsage: number;
    cpuUsage: number;
    databaseConnections: number;
    cacheHitRate: number;
  }>> {
    return await apiService.get('/admin/performance');
  }

  // Clear cache
  async clearCache(cacheType?: string): Promise<ApiResponse<{ message: string }>> {
    return await apiService.post('/admin/cache/clear', { cacheType });
  }

  // Send system notification
  async sendSystemNotification(notification: {
    title: string;
    message: string;
    type: 'info' | 'warning' | 'error' | 'success';
    targetUsers?: string[];
    sendEmail?: boolean;
  }): Promise<ApiResponse<void>> {
    return await apiService.post('/admin/notifications', notification);
  }

  // Get notification history
  async getNotificationHistory(page: number = 1, limit: number = 20): Promise<ApiResponse<{
    notifications: any[];
    total: number;
    page: number;
    totalPages: number;
  }>> {
    return await apiService.get('/admin/notifications/history', { page, limit });
  }
}

export const adminService = new AdminService();
export default adminService;
