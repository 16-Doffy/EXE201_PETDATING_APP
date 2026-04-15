/**
 * Message/Chat Service
 * Handles messaging, conversations, and real-time chat
 */

interface Message {
  id: string;
  senderId: string;
  senderName: string;
  content: string;
  timestamp: string;
  isRead: boolean;
}

interface Conversation {
  id: string;
  participantId: string;
  participantName: string;
  participantAvatar?: string;
  lastMessage?: string;
  lastMessageTime?: string;
  unreadCount: number;
}

interface ApiResponse<T> {
  success: boolean;
  data?: T;
  message?: string;
}

export class MessageService {
  private static API_BASE_URL = 'http://localhost:8080/api';
  private static wsConnection: WebSocket | null = null;
  private static wsConnected: boolean = false;
  private static messageHandlers: Array<(data: any) => void> = [];
  private static typingHandlers: Array<(data: any) => void> = [];

  private static getHeaders(): HeadersInit {
    const headers: HeadersInit = {
      'Content-Type': 'application/json',
    };
    
    // Get token from localStorage if available
    if (typeof window !== 'undefined') {
      const token = localStorage.getItem('authToken');
      if (token) {
        headers['Authorization'] = `Bearer ${token}`;
      }
    }
    
    return headers;
  }

  /**
   * Initialize WebSocket connection for real-time chat
   * @param userId - Current user ID
   * @param onMessage - Callback for new messages
   * @param onTyping - Callback for typing indicators
   */
  static initWebSocket(
    userId: string,
    onMessage?: (data: Message) => void,
    onTyping?: (data: any) => void
  ): Promise<WebSocket> {
    return new Promise((resolve, reject) => {
      try {
        const wsUrl = 'ws://localhost:8080/api/ws-chat';
        this.wsConnection = new WebSocket(wsUrl);

        this.wsConnection.onopen = () => {
          console.log('WebSocket connected');
          this.wsConnected = true;
          if (onMessage) this.messageHandlers.push(onMessage);
          if (onTyping) this.typingHandlers.push(onTyping);
          resolve(this.wsConnection!);
        };

        this.wsConnection.onmessage = (event: MessageEvent) => {
          try {
            const data = JSON.parse(event.data);
            
            if (data.type === 'message') {
              this.messageHandlers.forEach(handler => handler(data.payload));
            } else if (data.type === 'typing') {
              this.typingHandlers.forEach(handler => handler(data.payload));
            }
          } catch (error) {
            console.error('Error parsing WebSocket message:', error);
          }
        };

        this.wsConnection.onerror = (error: Event) => {
          console.error('WebSocket error:', error);
          this.wsConnected = false;
          reject(error);
        };

        this.wsConnection.onclose = () => {
          console.log('WebSocket disconnected');
          this.wsConnected = false;
        };
      } catch (error) {
        reject(error);
      }
    });
  }

  /**
   * Get conversation history
   * @param conversationId - Conversation ID
   * @param limit - Number of messages to fetch
   */
  static async getConversation(conversationId: string, limit: number = 50): Promise<Message[]> {
    try {
      const response = await fetch(
        `${this.API_BASE_URL}/messages/${conversationId}?limit=${limit}`,
        {
          method: 'GET',
          headers: this.getHeaders(),
        }
      );

      if (!response.ok) {
        throw new Error(`Failed to fetch conversation: ${response.statusText}`);
      }

      const result: ApiResponse<Message[]> = await response.json();
      if (result.success && result.data) {
        return result.data;
      }
      throw new Error(result.message || 'Failed to fetch conversation');
    } catch (error) {
      console.error('Get conversation error:', error);
      throw error;
    }
  }

  /**
   * Get user's conversations list
   */
  static async getConversations(): Promise<Conversation[]> {
    try {
      const response = await fetch(`${this.API_BASE_URL}/conversations`, {
        method: 'GET',
        headers: this.getHeaders(),
      });

      if (!response.ok) {
        throw new Error(`Failed to fetch conversations: ${response.statusText}`);
      }

      const result: ApiResponse<Conversation[]> = await response.json();
      if (result.success && result.data) {
        return result.data;
      }
      throw new Error(result.message || 'Failed to fetch conversations');
    } catch (error) {
      console.error('Get conversations error:', error);
      throw error;
    }
  }

  /**
   * Send a new message
   * @param conversationId - Conversation ID
   * @param content - Message content
   */
  static async sendMessage(conversationId: string, content: string): Promise<Message> {
    try {
      const response = await fetch(`${this.API_BASE_URL}/messages/${conversationId}`, {
        method: 'POST',
        headers: this.getHeaders(),
        body: JSON.stringify({ content }),
      });

      if (!response.ok) {
        throw new Error(`Failed to send message: ${response.statusText}`);
      }

      const result: ApiResponse<Message> = await response.json();
      if (result.success && result.data) {
        return result.data;
      }
      throw new Error(result.message || 'Failed to send message');
    } catch (error) {
      console.error('Send message error:', error);
      throw error;
    }
  }

  /**
   * Update conversation (e.g., mark as read)
   * @param conversationId - Conversation ID
   * @param data - Update data
   */
  static async updateConversation(
    conversationId: string,
    data: Partial<Conversation>
  ): Promise<Conversation> {
    try {
      const response = await fetch(`${this.API_BASE_URL}/conversations/${conversationId}`, {
        method: 'PUT',
        headers: this.getHeaders(),
        body: JSON.stringify(data),
      });

      if (!response.ok) {
        throw new Error(`Failed to update conversation: ${response.statusText}`);
      }

      const result: ApiResponse<Conversation> = await response.json();
      if (result.success && result.data) {
        return result.data;
      }
      throw new Error(result.message || 'Failed to update conversation');
    } catch (error) {
      console.error('Update conversation error:', error);
      throw error;
    }
  }

  /**
   * Close WebSocket connection
   */
  static closeWebSocket(): void {
    if (this.wsConnection) {
      this.wsConnection.close();
      this.wsConnected = false;
      this.messageHandlers = [];
      this.typingHandlers = [];
    }
  }

  /**
   * Check if WebSocket is connected
   */
  static isConnected(): boolean {
    return this.wsConnected;
  }
}

export default MessageService;
