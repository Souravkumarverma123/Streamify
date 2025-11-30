import api from './axios'

export const dashboardAPI = {
    // Get channel statistics
    getChannelStats: async () => {
        const response = await api.get('/dashboard/stats')
        return response.data
    },

    // Get channel videos with analytics
    getChannelVideos: async (params = {}) => {
        const response = await api.get('/dashboard/videos', { params })
        return response.data
    }
}
