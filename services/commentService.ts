import { apiRequest } from './api';

export interface CommentResponse {
  id: string;
  userId: string;
  postId: string;
  content: string;
  userName: string;
  userAvatar: string;
  createdAt: string;
}

export interface CommentRequest {
  content: string;
}

export const commentService = {
  async addComment(postId: string, content: string): Promise<CommentResponse> {
    return apiRequest(`/posts/${postId}/comments`, {
      method: 'POST',
      body: { content },
    });
  },

  async getComments(postId: string): Promise<CommentResponse[]> {
    return apiRequest(`/posts/${postId}/comments`, {
      method: 'GET',
    });
  },

  async deleteComment(postId: string, commentId: string): Promise<void> {
    return apiRequest(`/posts/${postId}/comments/${commentId}`, {
      method: 'DELETE',
    });
  },

  async getCommentCount(postId: string): Promise<number> {
    return apiRequest(`/posts/${postId}/comments/count`, {
      method: 'GET',
    });
  },
};
