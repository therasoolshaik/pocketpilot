const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || 'http://localhost:5000/api';

async function requestGoals(path, { method = 'GET', token, payload } = {}) {
  const response = await fetch(`${API_BASE_URL}/goals${path}`, {
    method,
    headers: {
      'Content-Type': 'application/json',
      Authorization: `Bearer ${token}`,
    },
    body: payload ? JSON.stringify(payload) : undefined,
  });

  const data = await response.json().catch(() => ({}));

  if (!response.ok) {
    throw new Error(data.message || 'Goal request failed');
  }

  return data;
}

export function fetchGoals(token) {
  return requestGoals('', { token });
}

export function createGoal(token, goal) {
  return requestGoals('', {
    method: 'POST',
    token,
    payload: goal,
  });
}

export function updateGoal(token, goal) {
  return requestGoals(`/${goal.id}`, {
    method: 'PUT',
    token,
    payload: goal,
  });
}

export function deleteGoal(token, goalId) {
  return requestGoals(`/${goalId}`, {
    method: 'DELETE',
    token,
  });
}
