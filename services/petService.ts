/**
 * Pet Service
 * Handles pet creation, retrieval, and management
 */

interface PetData {
  name: string;
  species: string;
  breed: string;
  age: number;
  gender: string;
  photos: string[];
  bio: string;
  [key: string]: any;
}

interface ApiResponse<T> {
  success: boolean;
  data?: T;
  message?: string;
}

interface NearbyPetsFilters {
  distance?: number;
  species?: string;
  gender?: string;
  age?: number;
  [key: string]: any;
}

export class PetService {
  private static API_BASE_URL = 'http://localhost:8080/api';

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
   * Create a new pet profile
   * @param data - Pet profile data
   */
  static async createPet(data: PetData): Promise<any> {
    try {
      const response = await fetch(`${this.API_BASE_URL}/pets`, {
        method: 'POST',
        headers: this.getHeaders(),
        body: JSON.stringify(data),
      });

      if (!response.ok) {
        throw new Error(`Failed to create pet: ${response.statusText}`);
      }

      const result: ApiResponse<any> = await response.json();
      if (result.success && result.data) {
        return result.data;
      }
      throw new Error(result.message || 'Failed to create pet');
    } catch (error) {
      console.error('Create pet error:', error);
      throw error;
    }
  }

  /**
   * Get own pets
   */
  static async getMyPets(): Promise<PetData[]> {
    try {
      const response = await fetch(`${this.API_BASE_URL}/pets/me`, {
        method: 'GET',
        headers: this.getHeaders(),
      });

      if (!response.ok) {
        throw new Error(`Failed to fetch pets: ${response.statusText}`);
      }

      const result: ApiResponse<PetData[]> = await response.json();
      if (result.success && result.data) {
        return result.data;
      }
      throw new Error(result.message || 'Failed to fetch pets');
    } catch (error) {
      console.error('Get pets error:', error);
      throw error;
    }
  }

  /**
   * Get single pet details
   * @param petId - Pet ID
   */
  static async getPetById(petId: string): Promise<PetData> {
    try {
      const response = await fetch(`${this.API_BASE_URL}/pets/${petId}`, {
        method: 'GET',
        headers: this.getHeaders(),
      });

      if (!response.ok) {
        throw new Error(`Failed to fetch pet: ${response.statusText}`);
      }

      const result: ApiResponse<PetData> = await response.json();
      if (result.success && result.data) {
        return result.data;
      }
      throw new Error(result.message || 'Failed to fetch pet');
    } catch (error) {
      console.error('Get pet error:', error);
      throw error;
    }
  }

  /**
   * Update pet profile
   * @param petId - Pet ID
   * @param data - Updated pet data
   */
  static async updatePet(petId: string, data: Partial<PetData>): Promise<PetData> {
    try {
      const response = await fetch(`${this.API_BASE_URL}/pets/${petId}`, {
        method: 'PUT',
        headers: this.getHeaders(),
        body: JSON.stringify(data),
      });

      if (!response.ok) {
        throw new Error(`Failed to update pet: ${response.statusText}`);
      }

      const result: ApiResponse<PetData> = await response.json();
      if (result.success && result.data) {
        return result.data;
      }
      throw new Error(result.message || 'Failed to update pet');
    } catch (error) {
      console.error('Update pet error:', error);
      throw error;
    }
  }

  /**
   * Delete pet
   * @param petId - Pet ID
   */
  static async deletePet(petId: string): Promise<any> {
    try {
      const response = await fetch(`${this.API_BASE_URL}/pets/${petId}`, {
        method: 'DELETE',
        headers: this.getHeaders(),
      });

      if (!response.ok) {
        throw new Error(`Failed to delete pet: ${response.statusText}`);
      }

      const result: ApiResponse<any> = await response.json();
      if (result.success) {
        return result.data;
      }
      throw new Error(result.message || 'Failed to delete pet');
    } catch (error) {
      console.error('Delete pet error:', error);
      throw error;
    }
  }

  /**
   * Get nearby pets for matching
   * @param filters - { distance, species, gender, age }
   */
  static async getNearbyPets(filters: NearbyPetsFilters = {}): Promise<PetData[]> {
    try {
      const queryString = new URLSearchParams(
        filters as Record<string, string>
      ).toString();
      const url = queryString 
        ? `${this.API_BASE_URL}/pets/nearby?${queryString}`
        : `${this.API_BASE_URL}/pets/nearby`;

      const response = await fetch(url, {
        method: 'GET',
        headers: this.getHeaders(),
      });

      if (!response.ok) {
        throw new Error(`Failed to fetch nearby pets: ${response.statusText}`);
      }

      const result: ApiResponse<PetData[]> = await response.json();
      if (result.success && result.data) {
        return result.data;
      }
      throw new Error(result.message || 'Failed to fetch nearby pets');
    } catch (error) {
      console.error('Get nearby pets error:', error);
      throw error;
    }
  }
}

export default PetService;
