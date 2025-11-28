import { useEffect, useState } from 'react'
import { Link } from 'react-router-dom'
import { videoAPI } from '../api/video'
import { Loader2, Play, TrendingUp, Film } from 'lucide-react'
import { Button } from '../components/ui/Button'
import VideoCard from '../components/VideoCard'
import ShortsCard from '../components/ShortsCard'
import { motion } from 'framer-motion'
import { generateMockVideos, generateMockShorts } from '../lib/mockData'

const Home = () => {
  const [videos, setVideos] = useState([])
  const [shorts, setShorts] = useState([])
  const [loading, setLoading] = useState(true)
  const [featuredVideo, setFeaturedVideo] = useState(null)

  useEffect(() => {
    const fetchContent = async () => {
      try {
        // Fetch real videos from backend
        const response = await videoAPI.getAllVideos({
          page: 1,
          limit: 12,
          sortBy: 'views',
          sortType: 'desc'
        })

        let realVideos = []
        if (response.data) {
          realVideos = response.data.docs
          if (realVideos.length > 0) {
            setFeaturedVideo(realVideos[0])
          }
        }

        // Generate mock content to fill the page
        // Pass real videos as seeds to make mock data look related
        const mockVideos = generateMockVideos(20, realVideos)
        const mockShorts = generateMockShorts(8)

        // Combine real and mock videos (excluding featured from grid if desired, but keeping for now)
        setVideos([...realVideos, ...mockVideos])
        setShorts(mockShorts)

      } catch (error) {
        console.error('Error fetching content:', error)
        // Fallback to purely mock data if backend fails
        setVideos(generateMockVideos(24))
        setShorts(generateMockShorts(8))
      } finally {
        setLoading(false)
      }
    }

    fetchContent()
  }, [])

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-[50vh]">
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
      </div>
    )
  }

  return (
    <div className="space-y-12 pb-8">
      {/* Hero Section */}
      {featuredVideo && (
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="relative w-full h-[400px] md:h-[500px] rounded-3xl overflow-hidden group"
        >
          <div className="absolute inset-0">
            <img
              src={featuredVideo.thumbnail}
              alt={featuredVideo.title}
              className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-background via-background/60 to-transparent" />
            <div className="absolute inset-0 bg-gradient-to-r from-background/90 via-background/40 to-transparent" />
          </div>

          <div className="absolute bottom-0 left-0 p-8 md:p-12 w-full md:max-w-3xl space-y-6">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-primary/20 text-primary text-sm font-medium backdrop-blur-sm border border-primary/20">
              <TrendingUp className="h-4 w-4" />
              Featured Video
            </div>

            <h1 className="text-3xl md:text-5xl font-bold text-foreground leading-tight line-clamp-2">
              {featuredVideo.title}
            </h1>

            <p className="text-lg text-muted-foreground line-clamp-2 max-w-2xl">
              {featuredVideo.description}
            </p>

            <div className="flex items-center gap-4 pt-2">
              <Link to={`/watch/${featuredVideo._id}`}>
                <Button size="lg" className="rounded-full text-lg px-8">
                  <Play className="mr-2 h-5 w-5 fill-current" />
                  Watch Now
                </Button>
              </Link>
              <div className="flex items-center gap-3 ml-2">
                {featuredVideo.owner?.avatar ? (
                  <img
                    src={featuredVideo.owner.avatar}
                    alt={featuredVideo.owner.username}
                    className="h-10 w-10 rounded-full object-cover ring-2 ring-primary/20"
                  />
                ) : (
                  <div className="h-10 w-10 rounded-full bg-primary flex items-center justify-center text-primary-foreground">
                    {featuredVideo.owner?.username?.[0]?.toUpperCase()}
                  </div>
                )}
                <div>
                  <p className="font-medium">{featuredVideo.owner?.fullName}</p>
                  <p className="text-sm text-muted-foreground">{featuredVideo.views} views</p>
                </div>
              </div>
            </div>
          </div>
        </motion.div>
      )}

      {/* Shorts Strip */}
      <div className="space-y-4">
        <div className="flex items-center gap-2">
          <Film className="h-6 w-6 text-primary" />
          <h2 className="text-2xl font-bold tracking-tight">Shorts</h2>
        </div>

        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 xl:grid-cols-8 gap-4">
          {shorts.map((short) => (
            <ShortsCard key={short._id} short={short} />
          ))}
        </div>
      </div>

      {/* Recommended Videos Grid */}
      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <h2 className="text-2xl font-bold tracking-tight">Recommended</h2>
          <Link to="/videos">
            <Button variant="ghost" className="text-primary hover:text-primary/80">
              View All
            </Button>
          </Link>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
          {videos.map((video) => (
            <VideoCard key={video._id} video={video} />
          ))}
        </div>
      </div>
    </div>
  )
}

export default Home
