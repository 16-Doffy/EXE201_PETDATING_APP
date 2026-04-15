import { apiRequest } from './api';

// Likes API
export async function likePost(postId: string) {
  return apiRequest<{ success: boolean; message: string }>('/api/likes', {
    method: 'POST',
    body: { postId },
  });
}

export async function unlikePost(postId: string) {
  return apiRequest<{ success: boolean; message: string }>(`/api/likes/${postId}`, {
    method: 'DELETE',
  });
}

export async function hasLikedPost(postId: string) {
  return apiRequest<boolean>(`/api/likes/check/${postId}`, {
    method: 'GET',
  });
}

export async function getPostLikes(postId: string) {
  return apiRequest<any[]>(`/api/likes/post/${postId}`, {
    method: 'GET',
  });
}

export async function getUserLikedPosts() {
  return apiRequest<any[]>('/api/likes/user/posts', {
    method: 'GET',
  });
}

// Follows API
export async function followUser(userId: string) {
  return apiRequest<{ success: boolean; message: string }>('/api/follows', {
    method: 'POST',
    body: { userId },
  });
}

export async function unfollowUser(userId: string) {
  return apiRequest<{ success: boolean; message: string }>(`/api/follows/${userId}`, {
    method: 'DELETE',
  });
}

export async function isFollowing(userId: string) {
  return apiRequest<boolean>(`/api/follows/check/${userId}`, {
    method: 'GET',
  });
}

export async function getFollowers(userId: string) {
  return apiRequest<any[]>(`/api/follows/followers/${userId}`, {
    method: 'GET',
  });
}

export async function getFollowing(userId: string) {
  return apiRequest<any[]>(`/api/follows/following/${userId}`, {
    method: 'GET',
  });
}

export async function getFollowerCount(userId: string) {
  return apiRequest<number>(`/api/follows/count/followers/${userId}`, {
    method: 'GET',
  });
}

export async function getFollowingCount(userId: string) {
  return apiRequest<number>(`/api/follows/count/following/${userId}`, {
    method: 'GET',
  });
}

// Comments API
export async function addComment(postId: string, content: string) {
  return apiRequest<{ id: string; content: string; userName: string; createdAt: string }>(`/api/posts/${postId}/comments`, {
    method: 'POST',
    body: { content },
  });
}

export async function getComments(postId: string) {
  return apiRequest<any[]>(`/api/posts/${postId}/comments`, {
    method: 'GET',
  });
}

export async function deleteComment(postId: string, commentId: string) {
  return apiRequest<{ success: boolean; message: string }>(`/api/posts/${postId}/comments/${commentId}`, {
    method: 'DELETE',
  });
}

// Posts API
export async function createPost(content: string, imageUrl?: string, petId?: string) {
  return apiRequest<{ id: string; content: string; imageUrl?: string; likesCount: number; commentsCount: number }>(
    '/api/posts',
    {
      method: 'POST',
      body: { content, imageUrl, petId },
    }
  );
}

export async function getFeed() {
  return apiRequest<any[]>('/api/posts', {
    method: 'GET',
  });
}

export async function getPost(postId: string) {
  return apiRequest<any>(`/api/posts/${postId}`, {
    method: 'GET',
  });
}

export async function updatePost(postId: string, content: string, imageUrl?: string) {
  return apiRequest<any>(`/api/posts/${postId}`, {
    method: 'PUT',
    body: { content, imageUrl },
  });
}

export async function deletePost(postId: string) {
  return apiRequest<{ success: boolean; message: string }>(`/api/posts/${postId}`, {
    method: 'DELETE',
  });
}

// Subscriptions API
export enum SubscriptionPlan {
  FREE = 'FREE',
  WEEKLY = 'WEEKLY',
  MONTHLY = 'MONTHLY',
}

export async function createSubscription(planName: string) {
  return apiRequest<{ id: string; plan: string; startDate: string; endDate: string; isActive: boolean }>(
    '/api/subscriptions',
    {
      method: 'POST',
      body: { planName },
    }
  );
}

export async function getActiveSubscription() {
  return apiRequest<any>('/api/subscriptions', {
    method: 'GET',
  });
}

export async function upgradeSubscription(planName: string) {
  return apiRequest<any>('/api/subscriptions/upgrade', {
    method: 'PUT',
    body: { planName },
  });
}

export async function hasFeature(feature: string) {
  return apiRequest<boolean>(`/api/subscriptions/has-feature/${feature}`, {
    method: 'GET',
  });
}
