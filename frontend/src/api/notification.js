import api from './axios'

export const notificationAPI = {
    // Get notifications
    getNotifications: async (params = {}) => {
        const response = await api.get('/notifications', { params })
        return response.data
    },

    // Mark notification as read
    markAsRead: async (notificationId) => {
        const response = await api.patch(`/notifications/${notificationId}/read`)
        return response.data
    },

    // Mark all notifications as read
    markAllAsRead: async () => {
        const response = await api.patch('/notifications/read-all')
        return response.data
    },

    // Delete notification
    deleteNotification: async (notificationId) => {
        const response = await api.delete(`/notifications/${notificationId}`)
        return response.data
    }
}
