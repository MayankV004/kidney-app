const API_ROOT = import.meta.env.VITE_API_ROOT || 'http://localhost:5000';

async function request(path: string, data: any) {
  const res = await fetch(`${API_ROOT}${path}`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    credentials: 'include',
    body: JSON.stringify(data),
  });
  return res.json();
}

// Using routes /api/auth/signup and /api/auth/login
export const signup = (data: { name: string; email: string; password: string }) =>
  request('/api/auth/signup', data);

export const login = (data: { email: string; password: string }) =>
  request('/api/auth/login', data);