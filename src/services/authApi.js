const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || 'http://localhost:5000/api';

async function requestAuth(path, payload) {
  const response = await fetch(`${API_BASE_URL}/auth/${path}`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json'
    },
    body: JSON.stringify(payload)
  });

  const data = await response.json().catch(() => ({}));

  if (!response.ok) {
    throw new Error(data.message || 'Authentication request failed');
  }

  return data;
}

export function signupUser({ name, email, password }) {
  return requestAuth('signup', { name, email, password });
}

export function loginUser({ email, password }) {
  return requestAuth('login', { email, password });
}
