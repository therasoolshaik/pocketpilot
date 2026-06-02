const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || 'http://localhost:5000/api';

async function requestCategories(path, { method = 'GET', token, payload } = {}) {
  const response = await fetch(`${API_BASE_URL}/categories${path}`, {
    method,
    headers: {
      'Content-Type': 'application/json',
      Authorization: `Bearer ${token}`,
    },
    body: payload ? JSON.stringify(payload) : undefined,
  });

  const data = await response.json().catch(() => ({}));

  if (!response.ok) {
    throw new Error(data.message || 'Category request failed');
  }

  return data;
}

export function fetchCategories(token) {
  return requestCategories('', { token });
}

export function createCategory(token, category) {
  return requestCategories('', {
    method: 'POST',
    token,
    payload: category,
  });
}

export function updateCategory(token, category) {
  return requestCategories(`/${category.id}`, {
    method: 'PUT',
    token,
    payload: category,
  });
}

export function deleteCategory(token, categoryId) {
  return requestCategories(`/${categoryId}`, {
    method: 'DELETE',
    token,
  });
}
