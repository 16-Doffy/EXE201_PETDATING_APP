import { Platform } from 'react-native';

const STORAGE_KEY = 'petdating.admin.basic-auth';

export type AdminCredentials = {
  username: string;
  password: string;
};

let memoryCredentials: AdminCredentials | null = null;

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

export function buildBasicAuthorization(credentials: AdminCredentials) {
  return `Basic ${encodeBase64(`${credentials.username}:${credentials.password}`)}`;
}

export function getStoredAdminCredentials() {
  if (memoryCredentials) return memoryCredentials;

  const storage = getWebStorage();
  const raw = storage?.getItem(STORAGE_KEY);
  if (!raw) return null;

  try {
    const parsed = JSON.parse(raw) as Partial<AdminCredentials>;
    if (!parsed.username || !parsed.password) return null;

    memoryCredentials = { username: parsed.username, password: parsed.password };
    return memoryCredentials;
  } catch {
    storage?.removeItem(STORAGE_KEY);
    return null;
  }
}

export function setStoredAdminCredentials(credentials: AdminCredentials) {
  memoryCredentials = credentials;
  getWebStorage()?.setItem(STORAGE_KEY, JSON.stringify(credentials));
}

export function clearStoredAdminCredentials() {
  memoryCredentials = null;
  getWebStorage()?.removeItem(STORAGE_KEY);
}

export function getAdminAuthorizationHeader() {
  const credentials = getStoredAdminCredentials();
  return credentials ? buildBasicAuthorization(credentials) : undefined;
}
