import { apiRequest } from './api';

export interface LikeResponse {
  id: string;
  userId: string;
  postId: string;
  userName: string;
  userAvatar: string;
  createdAt: string;
}

export interface LikeRequest {
  postId: string;
}

export const likeService = {
  async likePost(postId: string): Promise<LikeResponse> {
    return apiRequest('/likes', {
      method: 'POST',
      body: { postId },
    });
  },

  async unlikePost(postId: string): Promise<void> {
    return apiRequest(`/likes/${postId}`, {
      method: 'DELETE',
    });
  },

  async hasLiked(postId: string): Promise<boolean> {
    return apiRequest(`/likes/check/${postId}`, {
      method: 'GET',
    });
  },

  async getPostLikes(postId: string): Promise<LikeResponse[]> {
    return apiRequest(`/likes/post/${postId}`, {
      method: 'GET',
    });
  },

  async getUserLikedPosts(): Promise<LikeResponse[]> {
    return apiRequest('/likes/user/posts', {
      method: 'GET',
    });
  },

  async getPostLikeCount(postId: string): Promise<number> {
    return apiRequest(`/likes/post/${postId}/count`, {
      method: 'GET',
    });
  },
};
