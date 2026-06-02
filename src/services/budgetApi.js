const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || 'http://localhost:5000/api';

async function requestBudgets(path, { method = 'GET', token, payload } = {}) {
  const response = await fetch(`${API_BASE_URL}/budgets${path}`, {
    method,
    headers: {
      'Content-Type': 'application/json',
      Authorization: `Bearer ${token}`,
    },
    body: payload ? JSON.stringify(payload) : undefined,
  });

  const data = await response.json().catch(() => ({}));

  if (!response.ok) {
    throw new Error(data.message || 'Budget request failed');
  }

  return data;
}

export function fetchBudgets(token) {
  return requestBudgets('', { token });
}

export function createBudget(token, budget) {
  return requestBudgets('', {
    method: 'POST',
    token,
    payload: budget,
  });
}

export function updateBudget(token, budget) {
  return requestBudgets(`/${budget.id}`, {
    method: 'PUT',
    token,
    payload: budget,
  });
}

export function deleteBudget(token, budgetId) {
  return requestBudgets(`/${budgetId}`, {
    method: 'DELETE',
    token,
  });
}
