import { Platform } from 'react-native';

export type SessionRole = 'USER' | 'ADMIN';

export type SessionUser = {
  id: string;
  name: string;
  email: string;
  avatar: string;
  roles: SessionRole[];
};

export type SessionAdminCredentials = {
  username: string;
  password: string;
};

export type AppSession = {
  user: SessionUser | null;
  hasCompletedOnboarding: boolean;
  adminCredentials: SessionAdminCredentials | null;
};

const STORAGE_KEY = 'petdating.app.session';

let memorySession: AppSession | null = null;

function getWebStorage() {
  if (Platform.OS !== 'web' || typeof window === 'undefined') return null;

  try {
    return window.sessionStorage;
  } catch {
    return null;
  }
}

function encodeBase64(value: string) {
  if (typeof globalThis.btoa === 'function') {
    return globalThis.btoa(value);
  }

  const BufferCtor = (globalThis as { Buffer?: { from: (input: string, encoding: string) => { toString: (targetEncoding: string) => string } } }).Buffer;
  if (BufferCtor) {
    return BufferCtor.from(value, 'utf-8').toString('base64');
  }

  throw new Error('Base64 encoding is unavailable in this environment.');
}

function isSessionUser(value: unknown): value is SessionUser {
  if (!value || typeof value !== 'object') return false;

  const candidate = value as Partial<SessionUser>;
  return (
    typeof candidate.id === 'string' &&
    typeof candidate.name === 'string' &&
    typeof candidate.email === 'string' &&
    typeof candidate.avatar === 'string' &&
    Array.isArray(candidate.roles)
  );
}

function isAdminCredentials(value: unknown): value is SessionAdminCredentials {
  if (!value || typeof value !== 'object') return false;

  const candidate = value as Partial<SessionAdminCredentials>;
  return typeof candidate.username === 'string' && typeof candidate.password === 'string';
}

export function buildBasicAuthorization(credentials: SessionAdminCredentials) {
  return `Basic ${encodeBase64(`${credentials.username}:${credentials.password}`)}`;
}

export function getStoredAppSession() {
  if (memorySession) return memorySession;

  const storage = getWebStorage();
  const raw = storage?.getItem(STORAGE_KEY);
  if (!raw) return null;

  try {
    const parsed = JSON.parse(raw) as Partial<AppSession>;
    const session: AppSession = {
      user: isSessionUser(parsed.user) ? parsed.user : null,
      hasCompletedOnboarding: Boolean(parsed.hasCompletedOnboarding),
      adminCredentials: isAdminCredentials(parsed.adminCredentials) ? parsed.adminCredentials : null,
    };
    memorySession = session;
    return session;
  } catch {
    storage?.removeItem(STORAGE_KEY);
    return null;
  }
}

export function setStoredAppSession(session: AppSession) {
  memorySession = session;
  getWebStorage()?.setItem(STORAGE_KEY, JSON.stringify(session));
}

export function clearStoredAppSession() {
  memorySession = null;
  getWebStorage()?.removeItem(STORAGE_KEY);
}

export function getSessionAuthorizationHeader() {
  const session = getStoredAppSession();
  return session?.adminCredentials ? buildBasicAuthorization(session.adminCredentials) : undefined;
}
