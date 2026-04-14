export type ApiEnvelope<T> = {
  success: boolean;
  message: string;
  data: T;
};

export type PaginatedResponse<T> = {
  content: T[];
  page: number;
  size: number;
  totalElements: number;
  totalPages: number;
  hasNext: boolean;
  hasPrevious: boolean;
};

export type UserStatus = 'ACTIVE' | 'SUSPENDED' | 'BANNED';
export type PetStatus = 'ACTIVE' | 'ARCHIVED';
export type PetSpecies = 'DOG' | 'CAT' | 'BIRD' | 'OTHER';
export type PetGender = 'MALE' | 'FEMALE';

export type AdminDashboardResponse = {
  totalUsers: number;
  activeUsers: number;
  suspendedUsers: number;
  totalPets: number;
  visiblePets: number;
  totalMatches: number;
  totalConversations: number;
  totalMessages: number;
};

export type AdminUserResponse = {
  id: string;
  username?: string;
  email: string;
  name: string;
  avatarUrl?: string;
  phone?: string;
  roles: string[];
  status: UserStatus;
  hasCompletedOnboarding?: boolean;
  lastActiveAt?: string;
  city?: string;
  district?: string;
  createdAt?: string;
  updatedAt?: string;
};

export type AdminPetResponse = {
  id: string;
  ownerId: string;
  ownerName?: string;
  name: string;
  species: PetSpecies;
  breed: string;
  ageInMonths?: number;
  gender: PetGender;
  bio?: string;
  traits?: string[];
  isOnline?: boolean;
  isVisible?: boolean;
  status: PetStatus;
  city?: string;
  district?: string;
  createdAt?: string;
  updatedAt?: string;
};
