import { apiRequest } from './api';

export interface LoginRequest {
  email: string;
  password: string;
}

export interface LoginResponse {
  success: boolean;
  data: {
    token: string;
    user: {
      id: string;
      email: string;
      name: string;
      avatar?: string;
    };
  };
}

export interface RegisterRequest {
  email: string;
  password: string;
  name: string;
}

export interface AuthUser {
  id: string;
  email: string;
  name: string;
  avatar?: string;
  token?: string;
}

let cachedToken: string | null = null;
let cachedUser: AuthUser | null = null;

export const authService = {
  setToken(token: string | null) {
    cachedToken = token;
  },

  getToken(): string | null {
    return cachedToken;
  },

  setUser(user: AuthUser | null) {
    cachedUser = user;
  },

  getUser(): AuthUser | null {
    return cachedUser;
  },

  isAuthenticated(): boolean {
    return !!cachedToken && !!cachedUser;
  },

  async login(email: string, password: string): Promise<AuthUser> {
    try {
      const response = await apiRequest<LoginResponse>('/auth/login', {
        method: 'POST',
        body: { email, password },
      });

      if (response.success && response.data?.token) {
        cachedToken = response.data.token;
        cachedUser = {
          ...response.data.user,
          token: response.data.token,
        };
        return cachedUser;
      }

      throw new Error('Login failed: Invalid response');
    } catch (error) {
      console.error('Login error:', error);
      throw error;
    }
  },

  async register(name: string, email: string, password: string): Promise<AuthUser> {
    try {
      const response = await apiRequest<LoginResponse>('/auth/register', {
        method: 'POST',
        body: { name, email, password },
      });

      if (response.success && response.data?.token) {
        cachedToken = response.data.token;
        cachedUser = {
          ...response.data.user,
          token: response.data.token,
        };
        return cachedUser;
      }

      throw new Error('Registration failed: Invalid response');
    } catch (error) {
      console.error('Registration error:', error);
      throw error;
    }
  },

  async logout(): Promise<void> {
    cachedToken = null;
    cachedUser = null;
  },

  async getCurrentUser(): Promise<AuthUser | null> {
    if (!cachedToken) {
      return null;
    }

    try {
      const user = await apiRequest<any>('/auth/me', {
        method: 'GET',
      });

      if (user) {
        cachedUser = {
          id: user.id,
          email: user.email,
          name: user.name,
          avatar: user.avatar,
          token: cachedToken,
        };
        return cachedUser;
      }
    } catch (error) {
      cachedToken = null;
      cachedUser = null;
    }

    return null;
  },

  async updateProfile(updates: { name?: string; avatar?: string }): Promise<AuthUser> {
    if (!cachedUser) {
      throw new Error('Not authenticated');
    }

    const updated = await apiRequest<AuthUser>('/auth/profile', {
      method: 'PUT',
      body: updates,
    });

    cachedUser = { ...cachedUser, ...updated };
    return cachedUser;
  },
};
