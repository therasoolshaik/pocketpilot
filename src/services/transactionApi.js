const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || 'http://localhost:5000/api';

async function requestTransactions(path, { method = 'GET', token, payload } = {}) {
  const response = await fetch(`${API_BASE_URL}/transactions${path}`, {
    method,
    headers: {
      'Content-Type': 'application/json',
      Authorization: `Bearer ${token}`,
    },
    body: payload ? JSON.stringify(payload) : undefined,
  });

  const data = await response.json().catch(() => ({}));

  if (!response.ok) {
    throw new Error(data.message || 'Transaction request failed');
  }

  return data;
}

export function fetchTransactions(token) {
  return requestTransactions('', { token });
}

export function createTransaction(token, transaction) {
  return requestTransactions('', {
    method: 'POST',
    token,
    payload: transaction,
  });
}

export function updateTransaction(token, transaction) {
  return requestTransactions(`/${transaction.id}`, {
    method: 'PUT',
    token,
    payload: transaction,
  });
}

export function deleteTransaction(token, transactionId) {
  return requestTransactions(`/${transactionId}`, {
    method: 'DELETE',
    token,
  });
}
