import { Platform } from 'react-native';
import { getSessionAuthorizationHeader } from '@/services/appSession';

const ENV_API_URL = normalizeUrl(process.env.EXPO_PUBLIC_ADMIN_API_URL);
const LOCALHOSTS = new Set(['localhost', '127.0.0.1']);

function normalizeUrl(url?: string) {
  return url?.trim().replace(/\/+$/, '');
}

const isWeb = Platform.OS === 'web';

function getBrowserOrigin() {
  if (!isWeb || typeof window === 'undefined') return undefined;
  return normalizeUrl(window.location.origin);
}

function isRemoteWebBuild() {
  if (!isWeb || typeof window === 'undefined') return false;
  return !LOCALHOSTS.has(window.location.hostname);
}

function uniqueUrls(urls: Array<string | undefined>) {
  return [...new Set(urls.filter((url): url is string => Boolean(url)))];
}

function getBackendUrls() {
  if (isWeb) {
    if (isRemoteWebBuild()) {
      return uniqueUrls([ENV_API_URL]);
    }

    return uniqueUrls([
      ENV_API_URL,
      getBrowserOrigin(),
      'http://localhost:8080',
      'http://127.0.0.1:8080',
    ]);
  }

  return uniqueUrls(
    Platform.select({
      android: ['http://10.0.2.2:8080', 'http://localhost:8080', 'http://127.0.0.1:8080'],
      default: ['http://localhost:8080', 'http://127.0.0.1:8080'],
    }) ?? ['http://localhost:8080']
  );
}

const API_BASE_URLS = getBackendUrls();

type RequestOptions = {
  method?: 'GET' | 'POST' | 'PUT' | 'PATCH' | 'DELETE';
  body?: unknown;
  headers?: Record<string, string>;
  authHeader?: string;
};

export const API_BASE_URL = API_BASE_URLS[0] ?? 'Admin API is not configured';

function parseBody(raw: string) {
  if (!raw) return null;

  try {
    return JSON.parse(raw);
  } catch {
    return raw;
  }
}

export async function apiRequest<T>(path: string, options: RequestOptions = {}): Promise<T> {
  const method = options.method ?? 'GET';
  const headers: Record<string, string> = { ...(options.headers ?? {}) };
  const authHeader = options.authHeader ?? getSessionAuthorizationHeader();

  if (options.body !== undefined) {
    headers['Content-Type'] = 'application/json';
  }

  if (authHeader) {
    headers.Authorization = authHeader;
  }

  let lastError: Error | null = null;

  if (API_BASE_URLS.length === 0) {
    throw new Error('Admin API is not configured. Set EXPO_PUBLIC_ADMIN_API_URL for your deployed app.');
  }

  for (const baseUrl of API_BASE_URLS) {
    const controller = new AbortController();
    const timeout = setTimeout(() => controller.abort(), 8000);

    try {
      const response = await fetch(`${baseUrl}${path}`, {
        method,
        headers,
        body: options.body !== undefined ? JSON.stringify(options.body) : undefined,
        signal: controller.signal,
      });

      const raw = await response.text();
      const data = parseBody(raw);

      if (!response.ok) {
        const message =
          typeof data === 'object' && data !== null && 'message' in data
            ? String((data as { message?: string }).message)
            : typeof data === 'string' && data.trim().length > 0
              ? data
              : `Request failed: ${response.status}`;
        throw new Error(response.status === 401 ? 'Admin credentials were rejected. Please sign in again.' : message);
      }

      return data as T;
    } catch (error: any) {
      if (error?.name === 'AbortError') {
        lastError = new Error(`Admin API timeout at ${baseUrl}. Check whether the backend is running.`);
      } else if (error instanceof Error) {
        lastError = error;
      } else {
        lastError = new Error('Cannot connect to admin backend.');
      }
    } finally {
      clearTimeout(timeout);
    }
  }

  throw lastError ?? new Error('Cannot connect to admin backend.');
}
