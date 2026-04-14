import { apiRequest } from '@/services/api';
import {
  AdminDashboardResponse,
  AdminPetResponse,
  AdminUserResponse,
  ApiEnvelope,
  PaginatedResponse,
  PetStatus,
  UserStatus,
} from '@/types/admin';

function buildQuery(params: Record<string, string | number | boolean | undefined>) {
  const entries = Object.entries(params).filter(([, value]) => value !== undefined && value !== '');
  if (entries.length === 0) return '';
  return `?${entries
    .map(([key, value]) => `${encodeURIComponent(key)}=${encodeURIComponent(String(value))}`)
    .join('&')}`;
}

export async function getAdminDashboard() {
  const response = await apiRequest<ApiEnvelope<AdminDashboardResponse>>('/api/v1/admin/dashboard');
  return response.data;
}

export async function getAdminUsers(
  status?: UserStatus,
  search?: string,
  page: number = 0,
  size: number = 20,
  sortBy: string = 'createdAt',
  sortDirection: string = 'DESC'
) {
  const response = await apiRequest<ApiEnvelope<PaginatedResponse<AdminUserResponse>>>(
    `/api/v1/admin/users${buildQuery({ status, search, page, size, sortBy, sortDirection })}`
  );
  return response.data;
}

export async function updateAdminUserStatus(userId: string, status: UserStatus) {
  const response = await apiRequest<ApiEnvelope<AdminUserResponse>>(`/api/v1/admin/users/${userId}/status`, {
    method: 'PATCH',
    body: { status },
  });
  return response.data;
}

export async function getAdminPets(
  status?: PetStatus,
  search?: string,
  visible?: boolean,
  page: number = 0,
  size: number = 20,
  sortBy: string = 'createdAt',
  sortDirection: string = 'DESC'
) {
  const response = await apiRequest<ApiEnvelope<PaginatedResponse<AdminPetResponse>>>(
    `/api/v1/admin/pets${buildQuery({ status, search, visible, page, size, sortBy, sortDirection })}`
  );
  return response.data;
}

export async function updateAdminPetModeration(petId: string, isVisible: boolean, status: PetStatus) {
  const response = await apiRequest<ApiEnvelope<AdminPetResponse>>(`/api/v1/admin/pets/${petId}/moderation`, {
    method: 'PATCH',
    body: { isVisible, status },
  });
  return response.data;
}
