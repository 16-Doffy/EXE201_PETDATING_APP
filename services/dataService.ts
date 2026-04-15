// Data service - fetches real data from API, falls back to mock data
import { mockPets, mockConversations, mockMatches } from '@/constants/mockData';

const API_URL = 'http://localhost:8080/api';
const authToken = () => (global as any).authToken;

// Helper to make API calls with auth
async function apiCall(endpoint: string, options: any = {}) {
  try {
    const headers = {
      'Content-Type': 'application/json',
      ...(authToken() && { 'Authorization': `Bearer ${authToken()}` }),
      ...options.headers,
    };

    const response = await fetch(`${API_URL}${endpoint}`, {
      ...options,
      headers,
    });

    if (response.ok) {
      return await response.json();
    } else if (response.status === 401) {
      // Unauthorized - clear token
      (global as any).authToken = null;
      throw new Error('Unauthorized');
    }
    return null;
  } catch (error: any) {
    console.warn(`API call failed for ${endpoint}:`, error.message);
    return null;
  }
}

// Fetch pets - try API first, fall back to mock
export async function getPets() {
  try {
    const data = await apiCall('/pets');
    if (data && data.data) {
      console.log('✅ Fetched real pets from API:', data.data.length);
      return data.data;
    }
  } catch (error) {
    console.warn('Failed to fetch pets from API');
  }
  console.log('📦 Using mock pets data');
  return mockPets;
}

// Fetch matches - try API first, fall back to mock
export async function getMatches() {
  try {
    const data = await apiCall('/matches');
    if (data && data.data) {
      console.log('✅ Fetched real matches from API:', data.data.length);
      return data.data;
    }
  } catch (error) {
    console.warn('Failed to fetch matches from API');
  }
  console.log('📦 Using mock matches data');
  return mockMatches;
}

// Fetch conversations/messages
export async function getConversations() {
  try {
    const data = await apiCall('/messages');
    if (data && data.data) {
      console.log('✅ Fetched real conversations from API:', data.data.length);
      return data.data;
    }
  } catch (error) {
    console.warn('Failed to fetch conversations from API');
  }
  console.log('📦 Using mock conversations data');
  return mockConversations;
}

// Fetch posts (Social)
export async function getPosts() {
  try {
    const data = await apiCall('/posts');
    if (data && data.data) {
      console.log('✅ Fetched real posts from API:', data.data.length);
      return data.data;
    }
  } catch (error) {
    console.warn('Failed to fetch posts from API');
  }
  console.log('📦 Using mock posts data (demo)');
  return [];
}

// Fetch user profile
export async function getUserProfile() {
  try {
    const data = await apiCall('/user/profile');
    if (data) {
      console.log('✅ Fetched real user profile from API');
      return data;
    }
  } catch (error) {
    console.warn('Failed to fetch user profile from API');
  }
  console.log('📦 Using mock user profile');
  return (global as any).currentUser || null;
}

// Like a pet
export async function likePet(petId: string) {
  try {
    const data = await apiCall(`/likes`, {
      method: 'POST',
      body: JSON.stringify({ petId }),
    });
    return data ? true : false;
  } catch (error) {
    console.warn('Failed to like pet');
    return false;
  }
}

// Send message
export async function sendMessage(conversationId: string, message: string) {
  try {
    const data = await apiCall(`/messages/${conversationId}`, {
      method: 'POST',
      body: JSON.stringify({ content: message }),
    });
    return data ? true : false;
  } catch (error) {
    console.warn('Failed to send message');
    return false;
  }
}

// Create post
export async function createPost(content: string) {
  try {
    const data = await apiCall(`/posts`, {
      method: 'POST',
      body: JSON.stringify({ content }),
    });
    return data ? true : false;
  } catch (error) {
    console.warn('Failed to create post');
    return false;
  }
}

// Like post
export async function likePost(postId: string) {
  try {
    const data = await apiCall(`/posts/${postId}/like`, {
      method: 'POST',
    });
    return data ? true : false;
  } catch (error) {
    console.warn('Failed to like post');
    return false;
  }
}

// Add comment
export async function addComment(postId: string, content: string) {
  try {
    const data = await apiCall(`/posts/${postId}/comments`, {
      method: 'POST',
      body: JSON.stringify({ content }),
    });
    return data ? true : false;
  } catch (error) {
    console.warn('Failed to add comment');
    return false;
  }
}

export default {
  getPets,
  getMatches,
  getConversations,
  getPosts,
  getUserProfile,
  likePet,
  sendMessage,
  createPost,
  likePost,
  addComment,
};
