import { apiRequest } from './api';

export interface FollowResponse {
  id: string;
  followerId: string;
  followingId: string;
  followerName: string;
  followerAvatar: string;
  followingName: string;
  followingAvatar: string;
  isFollowing: boolean;
  createdAt: string;
}

export interface FollowRequest {
  userId: string;
}

export const followService = {
  async followUser(userId: string): Promise<FollowResponse> {
    return apiRequest('/follows', {
      method: 'POST',
      body: { userId },
    });
  },

  async unfollowUser(userId: string): Promise<void> {
    return apiRequest(`/follows/${userId}`, {
      method: 'DELETE',
    });
  },

  async isFollowing(userId: string): Promise<boolean> {
    return apiRequest(`/follows/check/${userId}`, {
      method: 'GET',
    });
  },

  async getFollowers(userId: string): Promise<FollowResponse[]> {
    return apiRequest(`/follows/followers/${userId}`, {
      method: 'GET',
    });
  },

  async getFollowing(userId: string): Promise<FollowResponse[]> {
    return apiRequest(`/follows/following/${userId}`, {
      method: 'GET',
    });
  },

  async getFollowerCount(userId: string): Promise<number> {
    return apiRequest(`/follows/count/followers/${userId}`, {
      method: 'GET',
    });
  },

  async getFollowingCount(userId: string): Promise<number> {
    return apiRequest(`/follows/count/following/${userId}`, {
      method: 'GET',
    });
  },
};
