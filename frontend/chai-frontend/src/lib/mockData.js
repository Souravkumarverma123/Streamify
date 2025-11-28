import { faker } from '@faker-js/faker'

// Helper to generate random number between min and max
const randomInt = (min, max) => Math.floor(Math.random() * (max - min + 1) + min)

// Helper to generate random time ago string
const randomTimeAgo = () => {
    const units = ['minutes', 'hours', 'days', 'weeks', 'months', 'years']
    const unit = units[randomInt(0, units.length - 1)]
    const value = randomInt(1, 10)
    return `${value} ${unit} ago`
}

// Helper to format large numbers
const formatViews = (views) => {
    if (views >= 1000000) return `${(views / 1000000).toFixed(1)}M`
    if (views >= 1000) return `${(views / 1000).toFixed(1)}K`
    return views.toString()
}

// Generate mock videos based on a seed video or completely random
export const generateMockVideos = (count = 20, seedVideos = []) => {
    return Array.from({ length: count }).map((_, index) => {
        // If we have seed videos, use them as a base sometimes
        const seedVideo = seedVideos.length > 0 && Math.random() > 0.5
            ? seedVideos[index % seedVideos.length]
            : null

        return {
            _id: `mock_${index}_${Date.now()}`,
            title: seedVideo ? `(Recommended) ${seedVideo.title}` : faker.lorem.sentence(randomInt(3, 8)),
            thumbnail: seedVideo?.thumbnail || `https://picsum.photos/seed/${index}/640/360`,
            videoFile: seedVideo?.videoFile || 'http://commondatastorage.googleapis.com/gtv-videos-bucket/sample/BigBuckBunny.mp4', // Fallback to a sample video
            description: seedVideo?.description || faker.lorem.paragraph(),
            duration: seedVideo?.duration || randomInt(60, 600),
            views: formatViews(randomInt(1000, 5000000)),
            isPublished: true,
            createdAt: new Date().toISOString(), // Use current date for sorting logic if needed, or random past date
            owner: {
                _id: `user_${index}`,
                username: seedVideo?.owner?.username || faker.internet.userName(),
                fullName: seedVideo?.owner?.fullName || faker.person.fullName(),
                avatar: seedVideo?.owner?.avatar || `https://api.dicebear.com/7.x/avataaars/svg?seed=${index}`
            },
            // Add some extra mock fields for UI
            timeAgo: randomTimeAgo(),
            isMock: true
        }
    })
}

export const generateMockShorts = (count = 10) => {
    return Array.from({ length: count }).map((_, index) => ({
        _id: `short_${index}_${Date.now()}`,
        title: faker.lorem.sentence(randomInt(3, 6)),
        thumbnail: `https://picsum.photos/seed/short_${index}/360/640`, // Vertical aspect ratio
        videoFile: 'http://commondatastorage.googleapis.com/gtv-videos-bucket/sample/ForBiggerJoyrides.mp4', // Sample vertical-ish video
        views: formatViews(randomInt(10000, 10000000)),
        owner: {
            _id: `user_${index}`,
            username: faker.internet.userName(),
            avatar: `https://api.dicebear.com/7.x/avataaars/svg?seed=${index}`
        }
    }))
}
