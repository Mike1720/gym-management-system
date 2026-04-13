import api from './api';

export const clientService = {
  getAll: (search = '') => {
    const params = search ? { search } : {};
    return api.get('/clients', { params });
  },

  getById: (id) => api.get(`/clients/${id}`),

  create: (data) => api.post('/clients', data),

  update: (id, data) => api.put(`/clients/${id}`, data),

  delete: (id) => api.delete(`/clients/${id}`),
};
