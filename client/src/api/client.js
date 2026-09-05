const API = import.meta.env.VITE_API_URL || 'http://localhost:5050/api';

export async function request(path, options = {}) {
  const response = await fetch(`${API}${path}`, {
    ...options,
    headers: { ...(options.body instanceof FormData ? {} : { 'Content-Type': 'application/json' }), ...options.headers }
  });
  if (!response.ok) {
    const body = await response.json().catch(() => ({}));
    throw new Error(body.error || `Request failed (${response.status})`);
  }
  return response.json();
}

export const queryString = (values) => {
  const params = new URLSearchParams();
  Object.entries(values).forEach(([key, value]) => value && params.set(key, value));
  return params.toString();
};

export const reportUrl = (path, filters) => `${API}${path}?${queryString(filters)}`;
