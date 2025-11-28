import api from './axios'

export const subscriptionAPI = {
    // Toggle subscription to a channel
    toggleSubscription: async (channelId) => {
        const response = await api.post(`/subscriptions/c/${channelId}`)
        return response.data
    },

    // Get channel's subscribers
    getChannelSubscribers: async (channelId, params = {}) => {
        const response = await api.get(`/subscriptions/u/${channelId}`, { params })
        return response.data
    },

    // Get channels user is subscribed to
    getSubscribedChannels: async (subscriberId, params = {}) => {
        const response = await api.get(`/subscriptions/c/${subscriberId}`, { params })
        return response.data
    }
}
