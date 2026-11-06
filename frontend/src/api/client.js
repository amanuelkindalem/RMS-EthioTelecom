// API client for EthioTelecom RMS Backend

const API_BASE = '/api';

export const getAuthToken = () => {
  return localStorage.getItem('rms_jwt_token') || '';
};

export const setAuthToken = (token) => {
  if (token) {
    localStorage.setItem('rms_jwt_token', token);
  } else {
    localStorage.removeItem('rms_jwt_token');
  }
};

async function request(endpoint, options = {}) {
  const token = getAuthToken();
  const headers = {
    'Content-Type': 'application/json',
    ...(token ? { Authorization: `Bearer ${token}` } : {}),
    ...options.headers,
  };

  try {
    const response = await fetch(`${API_BASE}${endpoint}`, {
      ...options,
      headers,
    });

    if (!response.ok) {
      const errorData = await response.json().catch(() => ({}));
      throw new Error(errorData.message || `HTTP error! status: ${response.status}`);
    }

    return await response.json();
  } catch (err) {
    // Check if network error or backend offline - return helpful message
    console.warn(`API call failed for ${endpoint}:`, err.message);
    throw err;
  }
}

// ================= USER APIs =================
export const userApi = {
  getUsers: () => request('/users'),
  getUserById: (id) => request(`/users/${id}`),
  createUser: (data) => request('/users', { method: 'POST', body: JSON.stringify(data) }),
  deactivateUser: (id) => request(`/users/${id}/deactivate`, { method: 'PATCH' }),
};

// ================= BRANCH APIs =================
export const branchApi = {
  getBranches: () => request('/branches'),
  createBranch: (data) => request('/branches', { method: 'POST', body: JSON.stringify(data) }),
};

// ================= VEHICLE APIs =================
export const vehicleApi = {
  getVehicles: () => request('/vehicles'),
  createVehicle: (data) => request('/vehicles', { method: 'POST', body: JSON.stringify(data) }),
  updateVehicle: (id, data) => request(`/vehicles/${id}`, { method: 'PATCH', body: JSON.stringify(data) }),
};

// ================= FUEL SESSION APIs =================
export const fuelSessionApi = {
  getSession: (id) => request(`/fuel-session/${id}`),
  
  createSession: (data) =>
    request('/fuel-session', { method: 'POST', body: JSON.stringify(data) }),

  recordInitialState: (sessionId, data) =>
    request(`/fuel-session/${sessionId}/initial-state`, {
      method: 'PATCH',
      body: JSON.stringify(data),
    }),

  createMetadata: (sessionId, data) =>
    request(`/fuel-session/${sessionId}/metadata`, {
      method: 'POST',
      body: JSON.stringify(data),
    }),

  updateMetadata: (sessionId, data) =>
    request(`/fuel-session/${sessionId}/metadata`, {
      method: 'PATCH',
      body: JSON.stringify(data),
    }),

  requestFuel: (sessionId, amount) =>
    request(`/fuel-session/${sessionId}/request-fuel`, {
      method: 'POST',
      body: JSON.stringify({ amount }),
    }),

  approveRequest: (requestId, approvedAmount, comment) =>
    request(`/fuel-session/fuel-request/${requestId}/approve`, {
      method: 'PATCH',
      body: JSON.stringify({ approvedAmount, comment }),
    }),

  rejectRequest: (requestId, comment) =>
    request(`/fuel-session/fuel-request/${requestId}/reject`, {
      method: 'PATCH',
      body: JSON.stringify({ comment }),
    }),

  closeSession: (sessionId) =>
    request(`/fuel-session/${sessionId}/close`, { method: 'PATCH' }),
};

// ================= FINANCE APIs =================
export const financeApi = {
  createTransaction: (userId, data) =>
    request(`/finance/transaction/${userId}`, {
      method: 'POST',
      body: JSON.stringify(data),
    }),

  getBranchCostReport: (branchId) =>
    request(`/finance/reports/branch/${branchId}`),
};

// ================= REPORT APIs =================
export const reportsApi = {
  getBranchReport: (branchId) => request(`/reports/branch?branchId=${branchId}`),
  getVehicleReport: (vehicleId) => request(`/reports/vehicle?vehicleId=${vehicleId}`),
  getDriverReport: (driverId) => request(`/reports/driver?driverId=${driverId}`),
  getFinanceSummary: () => request('/reports/finance'),
  getFraudReport: () => request('/reports/fraud'),
};

