import api from './axios'

export const videoAPI = {
  // Upload a new video
  uploadVideo: async (formData) => {
    const response = await api.post('/videos', formData, {
      headers: {
        'Content-Type': 'multipart/form-data',
      },
    })
    return response.data
  },

  // Get all videos
  getAllVideos: async (params = {}) => {
    const response = await api.get('/videos', { params })
    return response.data
  },

  // Get video by ID
  getVideoById: async (videoId) => {
    const response = await api.get(`/videos/${videoId}`)
    return response.data
  },

  // Update video
  updateVideo: async (videoId, formData) => {
    const response = await api.patch(`/videos/${videoId}`, formData, {
      headers: {
        'Content-Type': 'multipart/form-data',
      },
    })
    return response.data
  },

  // Delete video
  deleteVideo: async (videoId) => {
    const response = await api.delete(`/videos/${videoId}`)
    return response.data
  },

  // Toggle publish status
  togglePublishStatus: async (videoId) => {
    const response = await api.patch(`/videos/toggle/publish/${videoId}`)
    return response.data
  },

  // Get user's videos
  getUserVideos: async (userId) => {
    const response = await api.get('/videos', {
      params: { userId }
    })
    return response.data
  },

  // Get shorts
  getShorts: async (params = {}) => {
    const response = await api.get('/videos/shorts', { params })
    return response.data
  },

  // Track watch progress
  trackWatch: async (videoId, progress, completed = false) => {
    const response = await api.post(`/videos/watch/${videoId}`, {
      progress,
      completed
    })
    return response.data
  }
}
