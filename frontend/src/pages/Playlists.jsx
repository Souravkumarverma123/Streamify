import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { Card, CardContent, CardHeader, CardTitle } from '../components/ui/Card'
import { Button } from '../components/ui/Button'
import { Input } from '../components/ui/Input'
import { 
  Plus, 
  List, 
  Play, 
  MoreVertical,
  Edit,
  Trash2,
  Share2,
  Clock,
  Users,
  ArrowLeft,
  Search,
  Filter
} from 'lucide-react'

const Playlists = () => {
  const navigate = useNavigate()
  const [showCreateForm, setShowCreateForm] = useState(false)
  const [searchQuery, setSearchQuery] = useState('')
  const [newPlaylist, setNewPlaylist] = useState({
    name: '',
    description: ''
  })

  // Mock playlists data
  const [playlists, setPlaylists] = useState([
    {
      id: 1,
      name: 'React Tutorials',
      description: 'Complete React.js tutorial series for beginners',
      videoCount: 12,
      totalDuration: '2h 34m',
      thumbnail: 'https://images.unsplash.com/photo-1633356122544-f134324a6cee?w=300&h=200&fit=crop',
      lastUpdated: '2 days ago',
      isPublic: true
    },
    {
      id: 2,
      name: 'JavaScript Tips',
      description: 'Advanced JavaScript techniques and best practices',
      videoCount: 8,
      totalDuration: '1h 45m',
      thumbnail: 'https://images.unsplash.com/photo-1579468118864-1b9ea3c0db4a?w=300&h=200&fit=crop',
      lastUpdated: '1 week ago',
      isPublic: true
    },
    {
      id: 3,
      name: 'Private Collection',
      description: 'My personal learning videos',
      videoCount: 5,
      totalDuration: '45m',
      thumbnail: 'https://images.unsplash.com/photo-1555066931-4365d14bab8c?w=300&h=200&fit=crop',
      lastUpdated: '3 days ago',
      isPublic: false
    }
  ])

  const handleCreatePlaylist = (e) => {
    e.preventDefault()
    if (newPlaylist.name.trim()) {
      const playlist = {
        id: Date.now(),
        name: newPlaylist.name,
        description: newPlaylist.description,
        videoCount: 0,
        totalDuration: '0m',
        thumbnail: 'https://images.unsplash.com/photo-1555066931-4365d14bab8c?w=300&h=200&fit=crop',
        lastUpdated: 'Just now',
        isPublic: true
      }
      setPlaylists(prev => [playlist, ...prev])
      setNewPlaylist({ name: '', description: '' })
      setShowCreateForm(false)
    }
  }

  const handleDeletePlaylist = (id) => {
    setPlaylists(prev => prev.filter(playlist => playlist.id !== id))
  }

  const filteredPlaylists = playlists.filter(playlist =>
    playlist.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
    playlist.description.toLowerCase().includes(searchQuery.toLowerCase())
  )

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-slate-100 dark:from-slate-900 dark:to-slate-800">
      <div className="container mx-auto px-4 py-8">
        {/* Header */}
        <div className="mb-8">
          <div className="flex items-center gap-4 mb-4">
            <Button 
              variant="outline" 
              onClick={() => navigate('/')}
              className="flex items-center gap-2"
            >
              <ArrowLeft className="w-4 h-4" />
              Back to Dashboard
            </Button>
          </div>
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-3xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
                My Playlists
              </h1>
              <p className="text-muted-foreground mt-2">
                Organize your favorite videos into collections
              </p>
            </div>
            <Button 
              onClick={() => setShowCreateForm(true)}
              className="bg-gradient-to-r from-blue-500 to-purple-500 hover:from-blue-600 hover:to-purple-600"
            >
              <Plus className="w-4 h-4 mr-2" />
              Create Playlist
            </Button>
          </div>
        </div>

        {/* Search and Filter */}
        <div className="mb-6">
          <div className="flex items-center gap-4">
            <div className="relative flex-1 max-w-md">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
              <Input
                placeholder="Search playlists..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="pl-10"
              />
            </div>
            <Button variant="outline">
              <Filter className="w-4 h-4 mr-2" />
              Filter
            </Button>
          </div>
        </div>

        {/* Create Playlist Modal */}
        {showCreateForm && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
            <Card className="w-full max-w-md mx-4">
              <CardHeader>
                <CardTitle>Create New Playlist</CardTitle>
              </CardHeader>
              <CardContent>
                <form onSubmit={handleCreatePlaylist} className="space-y-4">
                  <div>
                    <label className="block text-sm font-medium mb-2">Playlist Name *</label>
                    <Input
                      value={newPlaylist.name}
                      onChange={(e) => setNewPlaylist(prev => ({ ...prev, name: e.target.value }))}
                      placeholder="Enter playlist name"
                      required
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium mb-2">Description</label>
                    <textarea
                      value={newPlaylist.description}
                      onChange={(e) => setNewPlaylist(prev => ({ ...prev, description: e.target.value }))}
                      placeholder="Describe your playlist..."
                      rows={3}
                      className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent resize-none"
                    />
                  </div>
                  <div className="flex justify-end gap-3">
                    <Button 
                      type="button"
                      variant="outline"
                      onClick={() => setShowCreateForm(false)}
                    >
                      Cancel
                    </Button>
                    <Button 
                      type="submit"
                      className="bg-gradient-to-r from-blue-500 to-purple-500 hover:from-blue-600 hover:to-purple-600"
                    >
                      Create Playlist
                    </Button>
                  </div>
                </form>
              </CardContent>
            </Card>
          </div>
        )}

        {/* Playlists Grid */}
        {filteredPlaylists.length === 0 ? (
          <Card className="text-center py-12">
            <CardContent>
              <List className="w-16 h-16 text-gray-400 mx-auto mb-4" />
              <h3 className="text-xl font-semibold mb-2">No playlists found</h3>
              <p className="text-muted-foreground mb-4">
                {searchQuery ? 'Try adjusting your search terms' : 'Create your first playlist to get started'}
              </p>
              {!searchQuery && (
                <Button 
                  onClick={() => setShowCreateForm(true)}
                  className="bg-gradient-to-r from-blue-500 to-purple-500 hover:from-blue-600 hover:to-purple-600"
                >
                  <Plus className="w-4 h-4 mr-2" />
                  Create Playlist
                </Button>
              )}
            </CardContent>
          </Card>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredPlaylists.map((playlist) => (
              <Card key={playlist.id} className="overflow-hidden hover:shadow-lg transition-shadow group">
                <div className="relative">
                  <img 
                    src={playlist.thumbnail} 
                    alt={playlist.name}
                    className="w-full h-48 object-cover"
                  />
                  <div className="absolute inset-0 bg-black bg-opacity-0 group-hover:bg-opacity-20 transition-all duration-300 flex items-center justify-center">
                    <Button 
                      size="lg"
                      className="opacity-0 group-hover:opacity-100 transition-opacity bg-white text-black hover:bg-gray-100"
                    >
                      <Play className="w-5 h-5 mr-2" />
                      Play All
                    </Button>
                  </div>
                  <div className="absolute top-2 right-2">
                    <div className="flex gap-1">
                      <Button size="sm" variant="secondary" className="h-8 w-8 p-0 opacity-0 group-hover:opacity-100 transition-opacity">
                        <Share2 className="w-4 h-4" />
                      </Button>
                      <Button size="sm" variant="secondary" className="h-8 w-8 p-0 opacity-0 group-hover:opacity-100 transition-opacity">
                        <MoreVertical className="w-4 h-4" />
                      </Button>
                    </div>
                  </div>
                  <div className="absolute bottom-2 left-2 bg-black bg-opacity-75 text-white text-xs px-2 py-1 rounded">
                    {playlist.totalDuration}
                  </div>
                </div>
                <CardContent className="p-4">
                  <div className="flex items-start justify-between mb-2">
                    <h3 className="font-semibold text-lg line-clamp-2 flex-1">{playlist.name}</h3>
                    <div className="flex gap-1 ml-2">
                      <Button size="sm" variant="ghost" className="h-8 w-8 p-0">
                        <Edit className="w-4 h-4" />
                      </Button>
                      <Button 
                        size="sm" 
                        variant="ghost" 
                        className="h-8 w-8 p-0 text-red-500 hover:text-red-700"
                        onClick={() => handleDeletePlaylist(playlist.id)}
                      >
                        <Trash2 className="w-4 h-4" />
                      </Button>
                    </div>
                  </div>
                  <p className="text-sm text-muted-foreground mb-3 line-clamp-2">
                    {playlist.description}
                  </p>
                  <div className="flex items-center justify-between text-sm text-muted-foreground">
                    <div className="flex items-center gap-4">
                      <span className="flex items-center gap-1">
                        <List className="w-4 h-4" />
                        {playlist.videoCount} videos
                      </span>
                      <span className="flex items-center gap-1">
                        <Clock className="w-4 h-4" />
                        {playlist.totalDuration}
                      </span>
                    </div>
                    <span className="text-xs">{playlist.lastUpdated}</span>
                  </div>
                  <div className="mt-3 flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <div className={`w-2 h-2 rounded-full ${playlist.isPublic ? 'bg-green-500' : 'bg-gray-400'}`} />
                      <span className="text-xs text-muted-foreground">
                        {playlist.isPublic ? 'Public' : 'Private'}
                      </span>
                    </div>
                    <Button 
                      size="sm"
                      onClick={() => navigate(`/playlist/${playlist.id}`)}
                      className="bg-gradient-to-r from-blue-500 to-purple-500 hover:from-blue-600 hover:to-purple-600"
                    >
                      View Playlist
                    </Button>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        )}

        {/* Stats Summary */}
        <Card className="mt-8 bg-gradient-to-r from-blue-50 to-purple-50 dark:from-blue-900/20 dark:to-purple-900/20 border-blue-200 dark:border-blue-700">
          <CardContent className="py-6">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 text-center">
              <div>
                <div className="text-2xl font-bold text-blue-600">{playlists.length}</div>
                <div className="text-sm text-muted-foreground">Total Playlists</div>
              </div>
              <div>
                <div className="text-2xl font-bold text-green-600">
                  {playlists.reduce((sum, playlist) => sum + playlist.videoCount, 0)}
                </div>
                <div className="text-sm text-muted-foreground">Total Videos</div>
              </div>
              <div>
                <div className="text-2xl font-bold text-purple-600">
                  {playlists.filter(p => p.isPublic).length}
                </div>
                <div className="text-sm text-muted-foreground">Public Playlists</div>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}

export default Playlists
