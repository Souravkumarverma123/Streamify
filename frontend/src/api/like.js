import api from './axios'

export const likeAPI = {
    // Toggle like on a video
    toggleVideoLike: async (videoId) => {
        const response = await api.post(`/likes/toggle/v/${videoId}`)
        return response.data
    },

    // Toggle like on a comment
    toggleCommentLike: async (commentId) => {
        const response = await api.post(`/likes/toggle/c/${commentId}`)
        return response.data
    },

    // Toggle like on a tweet
    toggleTweetLike: async (tweetId) => {
        const response = await api.post(`/likes/toggle/t/${tweetId}`)
        return response.data
    },

    // Get user's liked videos
    getLikedVideos: async (params = {}) => {
        const response = await api.get('/likes/videos', { params })
        return response.data
    }
}
