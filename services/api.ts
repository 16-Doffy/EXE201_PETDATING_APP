import { Platform } from 'react-native';

const ENV_API_URL = process.env.EXPO_PUBLIC_ADMIN_API_URL;

// Detect if running in web browser
const isWeb = typeof window !== 'undefined' && !Platform.OS;

// For web (Vercel deployment), use relative path (backend on same domain)
// For mobile, use specific backend URLs
const DEFAULT_BASE_URLS = isWeb
  ? [
      '', // Empty string = relative path to same domain (/api/v1/admin)
      'https://exe-201-petdating-app.vercel.app/api',
      'http://localhost:8080',
      'http://127.0.0.1:8080',
    ]
  : Platform.select({
      android: ['http://10.0.2.2:8080', 'http://127.0.0.1:8080', 'http://localhost:8080'],
      default: ['http://127.0.0.1:8080', 'http://localhost:8080'],
    }) ?? ['http://127.0.0.1:8080'];

const API_BASE_URLS = [ENV_API_URL, ...DEFAULT_BASE_URLS].filter((url) => url !== undefined) as string[];

type RequestOptions = {
  method?: 'GET' | 'POST' | 'PUT' | 'PATCH' | 'DELETE';
  body?: unknown;
};

export const API_BASE_URL = API_BASE_URLS[0];

export async function apiRequest<T>(path: string, options: RequestOptions = {}): Promise<T> {
  const method = options.method ?? 'GET';
  const headers: Record<string, string> = {};

  if (options.body !== undefined) {
    headers['Content-Type'] = 'application/json';
  }

  let lastError: Error | null = null;

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
      const data = raw ? JSON.parse(raw) : null;

      if (!response.ok) {
        const message =
          typeof data === 'object' && data !== null && 'message' in data
            ? String((data as { message?: string }).message)
            : `Request failed: ${response.status}`;
        throw new Error(message);
      }

      return data as T;
    } catch (error: any) {
      if (error?.name === 'AbortError') {
        lastError = new Error('Admin API timeout. Check whether the backend is running.');
      } else {
        lastError = new Error(error?.message || 'Cannot connect to admin backend.');
      }
    } finally {
      clearTimeout(timeout);
    }
  }

  throw lastError ?? new Error('Cannot connect to admin backend.');
}
