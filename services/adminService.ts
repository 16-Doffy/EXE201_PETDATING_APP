import { apiRequest } from '@/services/api';
import {
  AdminDashboardResponse,
  AdminPetResponse,
  AdminUserResponse,
  ApiEnvelope,
  PetStatus,
  UserStatus,
} from '@/types/admin';

function buildQuery(params: Record<string, string | boolean | undefined>) {
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

export async function getAdminUsers(status?: UserStatus, search?: string) {
  const response = await apiRequest<ApiEnvelope<AdminUserResponse[]>>(
    `/api/v1/admin/users${buildQuery({ status, search })}`
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

export async function getAdminPets(status?: PetStatus, search?: string, visible?: boolean) {
  const response = await apiRequest<ApiEnvelope<AdminPetResponse[]>>(
    `/api/v1/admin/pets${buildQuery({ status, search, visible })}`
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
