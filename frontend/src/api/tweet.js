import api from './axios'

export const tweetAPI = {
    // Create a new tweet
    createTweet: async (content) => {
        const response = await api.post('/tweets', { content })
        return response.data
    },

    // Get user's tweets
    getUserTweets: async (userId, params = {}) => {
        const response = await api.get(`/tweets/user/${userId}`, { params })
        return response.data
    },

    // Update a tweet
    updateTweet: async (tweetId, content) => {
        const response = await api.patch(`/tweets/${tweetId}`, { content })
        return response.data
    },

    // Delete a tweet
    deleteTweet: async (tweetId) => {
        const response = await api.delete(`/tweets/${tweetId}`)
        return response.data
    }
}
