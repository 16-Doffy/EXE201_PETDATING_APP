import { apiRequest } from './api';

export interface PostResponse {
  id: string;
  userId: string;
  petId: string;
  content: string;
  imageUrl: string;
  likesCount: number;
  commentsCount: number;
  likedByMe: boolean;
  createdAt: string;
  updatedAt: string;
}

export interface CreatePostRequest {
  petId: string;
  content: string;
  imageUrl?: string;
}

export interface UpdatePostRequest {
  content?: string;
  imageUrl?: string;
}

export const postService = {
  async createPost(petId: string, content: string, imageUrl?: string): Promise<PostResponse> {
    return apiRequest('/posts', {
      method: 'POST',
      body: { petId, content, imageUrl },
    });
  },

  async getPosts(): Promise<PostResponse[]> {
    return apiRequest('/posts', {
      method: 'GET',
    });
  },

  async getPost(postId: string): Promise<PostResponse> {
    return apiRequest(`/posts/${postId}`, {
      method: 'GET',
    });
  },

  async updatePost(postId: string, updates: UpdatePostRequest): Promise<PostResponse> {
    return apiRequest(`/posts/${postId}`, {
      method: 'PUT',
      body: updates,
    });
  },

  async deletePost(postId: string): Promise<void> {
    return apiRequest(`/posts/${postId}`, {
      method: 'DELETE',
    });
  },

  async getFeed(): Promise<PostResponse[]> {
    return apiRequest('/posts', {
      method: 'GET',
    });
  },
};
