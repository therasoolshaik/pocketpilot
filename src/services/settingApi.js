const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || 'http://localhost:5000/api';

async function requestSettings(path, { method = 'GET', token, payload } = {}) {
  const response = await fetch(`${API_BASE_URL}/settings${path}`, {
    method,
    headers: {
      'Content-Type': 'application/json',
      Authorization: `Bearer ${token}`,
    },
    body: payload ? JSON.stringify(payload) : undefined,
  });

  const data = await response.json().catch(() => ({}));

  if (!response.ok) {
    throw new Error(data.message || 'Setting request failed');
  }

  return data;
}

export function fetchSettings(token) {
  return requestSettings('', { token });
}

export function createSetting(token, setting) {
  return requestSettings('', {
    method: 'POST',
    token,
    payload: setting,
  });
}

export function updateSetting(token, setting) {
  return requestSettings(`/${setting.id}`, {
    method: 'PUT',
    token,
    payload: setting,
  });
}

export function deleteSetting(token, settingId) {
  return requestSettings(`/${settingId}`, {
    method: 'DELETE',
    token,
  });
}
