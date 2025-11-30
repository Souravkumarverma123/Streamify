import api from './axios'

export const playlistAPI = {
    // Create a new playlist
    createPlaylist: async (name, description) => {
        const response = await api.post('/playlist', { name, description })
        return response.data
    },

    // Get user's playlists
    getUserPlaylists: async (userId, params = {}) => {
        const response = await api.get(`/playlist/user/${userId}`, { params })
        return response.data
    },

    // Get playlist by ID
    getPlaylistById: async (playlistId) => {
        const response = await api.get(`/playlist/${playlistId}`)
        return response.data
    },

    // Update playlist
    updatePlaylist: async (playlistId, data) => {
        const response = await api.patch(`/playlist/${playlistId}`, data)
        return response.data
    },

    // Delete playlist
    deletePlaylist: async (playlistId) => {
        const response = await api.delete(`/playlist/${playlistId}`)
        return response.data
    },

    // Add video to playlist
    addVideoToPlaylist: async (videoId, playlistId) => {
        const response = await api.patch(`/playlist/add/${videoId}/${playlistId}`)
        return response.data
    },

    // Remove video from playlist
    removeVideoFromPlaylist: async (videoId, playlistId) => {
        const response = await api.patch(`/playlist/remove/${videoId}/${playlistId}`)
        return response.data
    }
}
