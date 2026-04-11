import { apiService, ApiResponse, PaginatedResponse } from './api';

export interface Subject {
  id: string;
  name: string;
  description: string;
  topicCount: number;
  icon?: string;
  color?: string;
}

export interface Topic {
  id: string;
  subjectId: string;
  title: string;
  description: string;
  difficulty: 'beginner' | 'intermediate' | 'advanced';
  estimatedTime: string;
  overview: string;
  keyConcepts: string[];
  relatedTopics: string[];
  problems: Problem[];
  tasks: Task[];
  resources: Resource[];
  notes: string[];
  status?: 'approved' | 'pending';
  author?: string;
  createdAt?: string;
}

export interface Problem {
  id: string;
  title: string;
  description: string;
  difficulty: 'easy' | 'medium' | 'hard';
  completed: boolean;
  hints: string[];
}

export interface Task {
  id: string;
  title: string;
  description: string;
  difficulty: 'easy' | 'medium' | 'hard';
  completed: boolean;
  estimatedTime: string;
}

export interface Resource {
  id: string;
  title: string;
  type: 'article' | 'video' | 'pdf' | 'external';
  url: string;
  description: string;
}

export interface Contribution {
  id: string;
  type: 'topic' | 'problem' | 'task';
  title: string;
  description: string;
  subject: string;
  customSubject?: string;
  difficulty: 'beginner' | 'intermediate' | 'advanced';
  estimatedTime?: string;
  overview?: string;
  keyConcepts?: string[];
  relatedTopics?: string[];
  practiceProblems?: string[];
  projectTasks?: string[];
  resources?: Resource[];
  notes?: string[];
  status: 'pending' | 'approved' | 'rejected';
  author: string;
  createdAt: string;
  reviewedAt?: string;
  reviewedBy?: string;
  rejectionReason?: string;
}

class ResearchService {
  // Get all subjects
  async getSubjects(): Promise<ApiResponse<Subject[]>> {
    return await apiService.get<Subject[]>('/research/subjects');
  }

  // Get subject by ID
  async getSubject(id: string): Promise<ApiResponse<Subject>> {
    return await apiService.get<Subject>(`/research/subjects/${id}`);
  }

  // Get all topics for a subject
  async getTopics(subjectId?: string): Promise<ApiResponse<Topic[]>> {
    const params = subjectId ? { subjectId } : {};
    return await apiService.get<Topic[]>('/research/topics', params);
  }

  // Get topic by ID
  async getTopic(id: string): Promise<ApiResponse<Topic>> {
    return await apiService.get<Topic>(`/research/topics/${id}`);
  }

  // Search topics
  async searchTopics(query: string, subjectId?: string): Promise<ApiResponse<Topic[]>> {
    const params = { q: query, subjectId };
    return await apiService.get<Topic[]>('/research/topics/search', params);
  }

  // Get trending topics
  async getTrendingTopics(limit: number = 10): Promise<ApiResponse<Topic[]>> {
    return await apiService.get<Topic[]>('/research/topics/trending', { limit });
  }

  // Submit new contribution
  async submitContribution(contribution: Omit<Contribution, 'id' | 'status' | 'createdAt' | 'author'>): Promise<ApiResponse<Contribution>> {
    return await apiService.post<Contribution>('/research/contributions', contribution);
  }

  // Get user's contributions
  async getUserContributions(userId?: string): Promise<ApiResponse<Contribution[]>> {
    const params = userId ? { userId } : {};
    return await apiService.get<Contribution[]>('/research/contributions/user', params);
  }

  // Get all contributions (for admin)
  async getAllContributions(status?: 'pending' | 'approved' | 'rejected', page: number = 1, limit: number = 20): Promise<PaginatedResponse<Contribution>> {
    const params = { status, page, limit };
    return await apiService.get<PaginatedResponse<Contribution>>('/research/contributions', params) as PaginatedResponse<Contribution>;
  }

  // Approve contribution
  async approveContribution(id: string): Promise<ApiResponse<Contribution>> {
    return await apiService.put<Contribution>(`/research/contributions/${id}/approve`);
  }

  // Reject contribution
  async rejectContribution(id: string, reason?: string): Promise<ApiResponse<Contribution>> {
    return await apiService.put<Contribution>(`/research/contributions/${id}/reject`, { reason });
  }

  // Update topic progress
  async updateTopicProgress(topicId: string, problemIds?: string[], taskIds?: string[]): Promise<ApiResponse<Topic>> {
    return await apiService.put<Topic>(`/research/topics/${topicId}/progress`, {
      completedProblems: problemIds,
      completedTasks: taskIds,
    });
  }

  // Bookmark topic
  async bookmarkTopic(topicId: string): Promise<ApiResponse<void>> {
    return await apiService.post<void>(`/research/topics/${topicId}/bookmark`);
  }

  // Remove topic bookmark
  async removeBookmark(topicId: string): Promise<ApiResponse<void>> {
    return await apiService.delete<void>(`/research/topics/${topicId}/bookmark`);
  }

  // Get bookmarked topics
  async getBookmarkedTopics(): Promise<ApiResponse<Topic[]>> {
    return await apiService.get<Topic[]>('/research/topics/bookmarked');
  }

  // Add note to topic
  async addTopicNote(topicId: string, note: string): Promise<ApiResponse<Topic>> {
    return await apiService.post<Topic>(`/research/topics/${topicId}/notes`, { note });
  }

  // Update note in topic
  async updateTopicNote(topicId: string, noteIndex: number, note: string): Promise<ApiResponse<Topic>> {
    return await apiService.put<Topic>(`/research/topics/${topicId}/notes/${noteIndex}`, { note });
  }

  // Delete note from topic
  async deleteTopicNote(topicId: string, noteIndex: number): Promise<ApiResponse<Topic>> {
    return await apiService.delete<Topic>(`/research/topics/${topicId}/notes/${noteIndex}`);
  }

  // Get topic statistics
  async getTopicStatistics(topicId: string): Promise<ApiResponse<{
    views: number;
    completions: number;
    averageTime: number;
    difficulty: string;
  }>> {
    return await apiService.get(`/research/topics/${topicId}/statistics`);
  }

  // Rate topic
  async rateTopic(topicId: string, rating: number): Promise<ApiResponse<void>> {
    return await apiService.post<void>(`/research/topics/${topicId}/rate`, { rating });
  }

  // Get topic ratings
  async getTopicRatings(topicId: string): Promise<ApiResponse<{
    averageRating: number;
    totalRatings: number;
    userRating?: number;
  }>> {
    return await apiService.get(`/research/topics/${topicId}/ratings`);
  }
}

export const researchService = new ResearchService();
export default researchService;
