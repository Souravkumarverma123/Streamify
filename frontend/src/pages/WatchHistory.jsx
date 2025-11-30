import { useState, useEffect } from 'react'
import { useAuth } from '../context/AuthContext'
import { Card, CardContent, CardHeader, CardTitle } from '../components/ui/Card'
import { Button } from '../components/ui/Button'
import { Input } from '../components/ui/Input'
import { 
  Video, 
  Clock, 
  Trash2, 
  Play, 
  Search,
  Filter,
  ArrowLeft,
  History,
  Eye,
  Calendar,
  MoreVertical,
  Download,
  Share2,
  Heart
} from 'lucide-react'

const WatchHistory = () => {
  const { user } = useAuth()
  const [searchQuery, setSearchQuery] = useState('')
  const [filterBy, setFilterBy] = useState('all')
  const [selectedVideos, setSelectedVideos] = useState([])

  // Mock watch history data
  const [watchHistory, setWatchHistory] = useState([
    {
      id: 1,
      title: 'Getting Started with React - Complete Tutorial',
      channel: 'CodeMaster',
      channelAvatar: 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=40&h=40&fit=crop&crop=face',
      thumbnail: 'https://images.unsplash.com/photo-1633356122544-f134324a6cee?w=300&h=200&fit=crop',
      duration: '12:34',
      watchedAt: '2 hours ago',
      progress: 100,
      views: '125K',
      likes: '2.1K',
      category: 'Programming'
    },
    {
      id: 2,
      title: 'Advanced JavaScript Tips and Tricks',
      channel: 'WebDev Pro',
      channelAvatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=40&h=40&fit=crop&crop=face',
      thumbnail: 'https://images.unsplash.com/photo-1579468118864-1b9ea3c0db4a?w=300&h=200&fit=crop',
      duration: '8:45',
      watchedAt: '1 day ago',
      progress: 75,
      views: '89K',
      likes: '1.5K',
      category: 'Programming'
    },
    {
      id: 3,
      title: 'Building Full-Stack Applications with Node.js',
      channel: 'TechTutorials',
      channelAvatar: 'https://images.unsplash.com/photo-1494790108755-2616b612b786?w=40&h=40&fit=crop&crop=face',
      thumbnail: 'https://images.unsplash.com/photo-1555066931-4365d14bab8c?w=300&h=200&fit=crop',
      duration: '15:22',
      watchedAt: '3 days ago',
      progress: 100,
      views: '210K',
      likes: '3.2K',
      category: 'Programming'
    },
    {
      id: 4,
      title: 'UI/UX Design Principles for Developers',
      channel: 'DesignHub',
      channelAvatar: 'https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=40&h=40&fit=crop&crop=face',
      thumbnail: 'https://images.unsplash.com/photo-1558655146-d09347e92766?w=300&h=200&fit=crop',
      duration: '10:15',
      watchedAt: '1 week ago',
      progress: 60,
      views: '95K',
      likes: '1.8K',
      category: 'Design'
    },
    {
      id: 5,
      title: 'Database Design Best Practices',
      channel: 'DataGuru',
      channelAvatar: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=40&h=40&fit=crop&crop=face',
      thumbnail: 'https://images.unsplash.com/photo-1544383835-bda2bc66a55d?w=300&h=200&fit=crop',
      duration: '18:30',
      watchedAt: '2 weeks ago',
      progress: 45,
      views: '67K',
      likes: '1.2K',
      category: 'Database'
    }
  ])

  const handleRemoveVideo = (videoId) => {
    setWatchHistory(prev => prev.filter(video => video.id !== videoId))
  }

  const handleClearHistory = () => {
    setWatchHistory([])
  }

  const handleSelectVideo = (videoId) => {
    setSelectedVideos(prev => 
      prev.includes(videoId) 
        ? prev.filter(id => id !== videoId)
        : [...prev, videoId]
    )
  }

  const handleRemoveSelected = () => {
    setWatchHistory(prev => prev.filter(video => !selectedVideos.includes(video.id)))
    setSelectedVideos([])
  }

  const filteredHistory = watchHistory.filter(video => {
    const matchesSearch = video.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
                         video.channel.toLowerCase().includes(searchQuery.toLowerCase())
    const matchesFilter = filterBy === 'all' || video.category.toLowerCase() === filterBy.toLowerCase()
    return matchesSearch && matchesFilter
  })

  const categories = ['all', 'Programming', 'Design', 'Database']

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-slate-100 dark:from-slate-900 dark:to-slate-800">
      <div className="container mx-auto px-4 py-8">
        {/* Header */}
        <div className="mb-8">
          <div className="flex items-center gap-4 mb-4">
            <Button 
              variant="outline" 
              onClick={() => window.history.back()}
              className="flex items-center gap-2"
            >
              <ArrowLeft className="w-4 h-4" />
              Back
            </Button>
          </div>
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-3xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent flex items-center gap-3">
                <History className="w-8 h-8" />
                Watch History
              </h1>
              <p className="text-muted-foreground mt-2">
                Your recently watched videos and viewing activity
              </p>
            </div>
            <div className="flex items-center gap-3">
              {selectedVideos.length > 0 && (
                <Button 
                  variant="destructive" 
                  onClick={handleRemoveSelected}
                  className="flex items-center gap-2"
                >
                  <Trash2 className="w-4 h-4" />
                  Remove Selected ({selectedVideos.length})
                </Button>
              )}
              <Button 
                variant="outline" 
                onClick={handleClearHistory}
                className="flex items-center gap-2"
              >
                <Trash2 className="w-4 h-4" />
                Clear All
              </Button>
            </div>
          </div>
        </div>

        {/* Search and Filter */}
        <div className="mb-6">
          <div className="flex items-center gap-4 mb-4">
            <div className="relative flex-1 max-w-md">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
              <Input
                placeholder="Search watch history..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="pl-10"
              />
            </div>
            <div className="flex items-center gap-2">
              <Filter className="w-4 h-4 text-muted-foreground" />
              <select 
                value={filterBy}
                onChange={(e) => setFilterBy(e.target.value)}
                className="px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              >
                {categories.map(category => (
                  <option key={category} value={category}>
                    {category === 'all' ? 'All Categories' : category}
                  </option>
                ))}
              </select>
            </div>
          </div>
          
          {/* Stats */}
          <div className="flex items-center gap-6 text-sm text-muted-foreground">
            <span className="flex items-center gap-1">
              <Video className="w-4 h-4" />
              {filteredHistory.length} videos
            </span>
            <span className="flex items-center gap-1">
              <Clock className="w-4 h-4" />
              {Math.round(filteredHistory.reduce((sum, video) => sum + video.progress, 0) / filteredHistory.length)}% avg completion
            </span>
          </div>
        </div>

        {/* Watch History List */}
        {filteredHistory.length === 0 ? (
          <Card className="text-center py-12">
            <CardContent>
              <History className="w-16 h-16 text-gray-400 mx-auto mb-4" />
              <h3 className="text-xl font-semibold mb-2">No watch history found</h3>
              <p className="text-muted-foreground mb-4">
                {searchQuery ? 'Try adjusting your search terms' : 'Start watching videos to build your history'}
              </p>
              <Button 
                onClick={() => window.history.back()}
                className="bg-gradient-to-r from-blue-500 to-purple-500 hover:from-blue-600 hover:to-purple-600"
              >
                Browse Videos
              </Button>
            </CardContent>
          </Card>
        ) : (
          <div className="space-y-4">
            {filteredHistory.map((video) => (
              <Card key={video.id} className="hover:shadow-lg transition-all duration-300 group">
                <CardContent className="p-4">
                  <div className="flex items-start gap-4">
                    <div className="relative flex-shrink-0">
                      <input
                        type="checkbox"
                        checked={selectedVideos.includes(video.id)}
                        onChange={() => handleSelectVideo(video.id)}
                        className="absolute top-2 left-2 z-10 w-4 h-4"
                      />
                      <img 
                        src={video.thumbnail} 
                        alt={video.title}
                        className="w-40 h-24 object-cover rounded cursor-pointer"
                      />
                      <div className="absolute bottom-1 right-1 bg-black bg-opacity-75 text-white text-xs px-1 py-0.5 rounded">
                        {video.duration}
                      </div>
                      <div className="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity bg-black bg-opacity-50 rounded">
                        <Button size="sm" className="bg-white text-black hover:bg-gray-100">
                          <Play className="w-4 h-4" />
                        </Button>
                      </div>
                    </div>
                    
                    <div className="flex-1 min-w-0">
                      <div className="flex items-start justify-between mb-2">
                        <div className="flex-1">
                          <h3 className="font-semibold text-lg mb-1 line-clamp-2 group-hover:text-blue-600 transition-colors cursor-pointer">
                            {video.title}
                          </h3>
                          <div className="flex items-center gap-2 mb-2">
                            <img 
                              src={video.channelAvatar} 
                              alt={video.channel}
                              className="w-6 h-6 rounded-full"
                            />
                            <span className="text-sm text-muted-foreground">{video.channel}</span>
                            <span className="text-xs bg-gray-100 dark:bg-gray-800 px-2 py-1 rounded">
                              {video.category}
                            </span>
                          </div>
                        </div>
                        <div className="flex items-center gap-1 ml-4">
                          <Button variant="ghost" size="sm" className="opacity-0 group-hover:opacity-100 transition-opacity">
                            <Share2 className="w-4 h-4" />
                          </Button>
                          <Button variant="ghost" size="sm" className="opacity-0 group-hover:opacity-100 transition-opacity">
                            <Heart className="w-4 h-4" />
                          </Button>
                          <Button 
                            variant="ghost" 
                            size="sm" 
                            onClick={() => handleRemoveVideo(video.id)}
                            className="opacity-0 group-hover:opacity-100 transition-opacity text-red-500 hover:text-red-700"
                          >
                            <Trash2 className="w-4 h-4" />
                          </Button>
                        </div>
                      </div>
                      
                      <div className="flex items-center gap-4 text-sm text-muted-foreground mb-2">
                        <span className="flex items-center gap-1">
                          <Calendar className="w-4 h-4" />
                          {video.watchedAt}
                        </span>
                        <span className="flex items-center gap-1">
                          <Eye className="w-4 h-4" />
                          {video.views} views
                        </span>
                        <span className="flex items-center gap-1">
                          <Heart className="w-4 h-4" />
                          {video.likes} likes
                        </span>
                        <span className="font-medium text-blue-600">
                          {video.progress}% watched
                        </span>
                      </div>
                      
                      <div className="w-full bg-gray-200 rounded-full h-1.5">
                        <div 
                          className="bg-gradient-to-r from-blue-500 to-purple-500 h-1.5 rounded-full transition-all duration-300"
                          style={{ width: `${video.progress}%` }}
                        />
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        )}

        {/* Summary Stats */}
        <Card className="mt-8 bg-gradient-to-r from-blue-50 to-purple-50 dark:from-blue-900/20 dark:to-purple-900/20 border-blue-200 dark:border-blue-700">
          <CardContent className="py-6">
            <div className="grid grid-cols-1 md:grid-cols-4 gap-6 text-center">
              <div>
                <div className="text-2xl font-bold text-blue-600">{watchHistory.length}</div>
                <div className="text-sm text-muted-foreground">Total Videos</div>
              </div>
              <div>
                <div className="text-2xl font-bold text-green-600">
                  {Math.round(watchHistory.reduce((sum, video) => sum + video.progress, 0) / watchHistory.length)}%
                </div>
                <div className="text-sm text-muted-foreground">Avg Completion</div>
              </div>
              <div>
                <div className="text-2xl font-bold text-purple-600">
                  {watchHistory.filter(v => v.progress === 100).length}
                </div>
                <div className="text-sm text-muted-foreground">Fully Watched</div>
              </div>
              <div>
                <div className="text-2xl font-bold text-orange-600">
                  {new Set(watchHistory.map(v => v.category)).size}
                </div>
                <div className="text-sm text-muted-foreground">Categories</div>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}

export default WatchHistory