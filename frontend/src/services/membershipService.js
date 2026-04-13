import api from './api';

export const membershipService = {
  getAll: (status = '') => {
    const params = status ? { status } : {};
    return api.get('/memberships', { params });
  },

  getById: (id) => api.get(`/memberships/${id}`),

  getByClient: (clientId) => api.get(`/memberships/client/${clientId}`),

  create: (data) => api.post('/memberships', data),

  delete: (id) => api.delete(`/memberships/${id}`),
};
