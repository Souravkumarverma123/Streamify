import { useEffect, useState } from 'react'
import { useParams } from 'react-router-dom'
import { videoAPI } from '../api/video'
import { userAPI } from '../api/user'
import { Loader2, Users, Video, PlaySquare, Info, Edit, Camera } from 'lucide-react'
import { Button } from '../components/ui/Button'
import VideoCard from '../components/VideoCard'
import { motion, AnimatePresence } from 'framer-motion'
import { cn } from '@/lib/utils'

const Channel = () => {
  const { username } = useParams()
  const [channel, setChannel] = useState(null)
  const [videos, setVideos] = useState([])
  const [loading, setLoading] = useState(true)
  const [activeTab, setActiveTab] = useState('videos')

  useEffect(() => {
    const fetchChannelData = async () => {
      setLoading(true)
      try {
        // Fetch channel profile from backend
        const channelResponse = await userAPI.getChannelProfile(username)
        if (channelResponse.data) {
          setChannel(channelResponse.data)

          // Fetch channel videos using the owner's ID
          if (channelResponse.data._id) {
            const videosResponse = await videoAPI.getAllVideos({
              userId: channelResponse.data._id,
              limit: 20
            })
            if (videosResponse.data) {
              setVideos(videosResponse.data.docs || [])
            }
          }
        }
      } catch (error) {
        console.error('Error fetching channel:', error)
        // Set fallback data if API fails
        setChannel({
          username: username || 'User',
          fullName: 'Channel Name',
          avatar: null,
          coverImage: null,
          subscribersCount: 0,
          channelsSubscribedToCount: 0,
          isSubscribed: false
        })
      } finally {
        setLoading(false)
      }
    }

    fetchChannelData()
  }, [username])

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-[60vh]">
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
      </div>
    )
  }

  const tabs = [
    { id: 'videos', label: 'Videos', icon: Video },
    { id: 'playlists', label: 'Playlists', icon: PlaySquare },
    { id: 'about', label: 'About', icon: Info },
  ]

  return (
    <div className="min-h-screen pb-12">
      {/* Cover Image with Parallax Effect */}
      <div className="relative h-48 md:h-64 lg:h-80 w-full overflow-hidden bg-muted group">
        {channel?.coverImage ? (
          <img
            src={channel.coverImage}
            alt="Cover"
            className="w-full h-full object-cover"
          />
        ) : (
          <div className="w-full h-full bg-gradient-to-r from-primary/20 to-purple-500/20 flex items-center justify-center">
            <Camera className="h-12 w-12 text-muted-foreground/50" />
          </div>
        )}
        <div className="absolute inset-0 bg-black/0 group-hover:bg-black/10 transition-colors" />
      </div>

      {/* Channel Info Header */}
      <div className="container max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="relative -mt-12 mb-8 flex flex-col md:flex-row items-end md:items-center gap-6">
          {/* Avatar */}
          <div className="relative shrink-0">
            <div className="h-32 w-32 md:h-40 md:w-40 rounded-full border-4 border-background bg-background overflow-hidden shadow-xl">
              {channel?.avatar ? (
                <img
                  src={channel.avatar}
                  alt={channel.username}
                  className="w-full h-full object-cover"
                />
              ) : (
                <div className="w-full h-full bg-primary flex items-center justify-center text-4xl font-bold text-primary-foreground">
                  {channel?.username?.[0]?.toUpperCase()}
                </div>
              )}
            </div>
          </div>

          {/* Info */}
          <div className="flex-1 pb-2 text-center md:text-left">
            <h1 className="text-3xl font-bold">{channel?.fullName}</h1>
            <p className="text-muted-foreground">@{channel?.username}</p>
            <div className="flex items-center justify-center md:justify-start gap-4 mt-2 text-sm text-muted-foreground">
              <span>{channel?.subscribersCount} subscribers</span>
              <span>•</span>
              <span>{videos.length} videos</span>
            </div>
          </div>

          {/* Actions */}
          <div className="pb-4 w-full md:w-auto flex justify-center md:justify-end">
            <Button size="lg" className="rounded-full px-8">
              Subscribe
            </Button>
          </div>
        </div>

        {/* Tabs */}
        <div className="border-b border-border mb-8 sticky top-[64px] bg-background/95 backdrop-blur z-20">
          <div className="flex gap-8 overflow-x-auto no-scrollbar">
            {tabs.map((tab) => (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={cn(
                  "flex items-center gap-2 py-4 px-2 border-b-2 transition-colors whitespace-nowrap font-medium text-sm",
                  activeTab === tab.id
                    ? "border-primary text-primary"
                    : "border-transparent text-muted-foreground hover:text-foreground"
                )}
              >
                <tab.icon className="h-4 w-4" />
                {tab.label}
              </button>
            ))}
          </div>
        </div>

        {/* Tab Content */}
        <AnimatePresence mode="wait">
          <motion.div
            key={activeTab}
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            transition={{ duration: 0.2 }}
          >
            {activeTab === 'videos' && (
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
                {videos.map((video) => (
                  <VideoCard key={video._id} video={video} />
                ))}
              </div>
            )}

            {activeTab === 'playlists' && (
              <div className="text-center py-12 text-muted-foreground">
                <PlaySquare className="h-12 w-12 mx-auto mb-4 opacity-50" />
                <p>No playlists created yet</p>
              </div>
            )}

            {activeTab === 'about' && (
              <div className="max-w-2xl space-y-6">
                <div className="space-y-4">
                  <h3 className="font-semibold text-lg">Description</h3>
                  <p className="text-muted-foreground leading-relaxed">
                    Welcome to the official channel of {channel?.fullName}. Here you'll find amazing content about technology, coding, and more.
                  </p>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6 pt-6 border-t border-border">
                  <div>
                    <h3 className="font-semibold mb-2">Stats</h3>
                    <div className="space-y-2 text-sm text-muted-foreground">
                      <p>Joined {new Date().toLocaleDateString()}</p>
                      <p>1,234,567 views</p>
                    </div>
                  </div>
                </div>
              </div>
            )}
          </motion.div>
        </AnimatePresence>
      </div>
    </div>
  )
}

export default Channel