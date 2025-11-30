import api from './axios'

export const authAPI = {
  register: async (formData) => {
    const response = await api.post('/users/register', formData, {
      headers: {
        'Content-Type': 'multipart/form-data',
      },
    })
    return response.data
  },

  login: async (credentials) => {
    const response = await api.post('/users/login', credentials)
    return response.data
  },

  logout: async () => {
    const response = await api.post('/users/logout')
    return response.data
  },

  getCurrentUser: async () => {
    const response = await api.get('/users/current-user')
    return response.data
  },

  refreshToken: async () => {
    const response = await api.post('/users/refresh-token')
    return response.data
  },
}
