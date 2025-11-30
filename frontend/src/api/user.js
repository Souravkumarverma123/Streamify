import api from './axios'

export const userAPI = {
  changePassword: async (passwordData) => {
    const response = await api.post('/users/change-password', passwordData)
    return response.data
  },

  updateAccountDetails: async (details) => {
    const response = await api.patch('/users/update-account', details)
    return response.data
  },

  updateAvatar: async (formData) => {
    const response = await api.patch('/users/avatar', formData, {
      headers: {
        'Content-Type': 'multipart/form-data',
      },
    })
    return response.data
  },

  updateCoverImage: async (formData) => {
    const response = await api.patch('/users/cover-image', formData, {
      headers: {
        'Content-Type': 'multipart/form-data',
      },
    })
    return response.data
  },

  getUserChannelProfile: async (username) => {
    const response = await api.get(`/users/c/${username}`)
    return response.data
  },

  // Alias for better readability
  getChannelProfile: async (username) => {
    const response = await api.get(`/users/c/${username}`)
    return response.data
  },

  getWatchHistory: async () => {
    const response = await api.get('/users/history')
    return response.data
  },
}
