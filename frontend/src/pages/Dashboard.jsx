import { useEffect, useState } from 'react'
import { dashboardAPI } from '../api/dashboard'
import { Loader2, Video, Users, Eye, Heart, MessageSquare, Plus, Edit, Trash2 } from 'lucide-react'
import { Card, CardContent, CardHeader, CardTitle } from '../components/ui/Card'
import { Button } from '../components/ui/Button'
import { formatTimeAgo } from '@/lib/utils'
import { Link } from 'react-router-dom'

const Dashboard = () => {
    const [stats, setStats] = useState(null)
    const [videos, setVideos] = useState([])
    const [loading, setLoading] = useState(true)

    useEffect(() => {
        const fetchDashboardData = async () => {
            try {
                const [statsResponse, videosResponse] = await Promise.all([
                    dashboardAPI.getChannelStats(),
                    dashboardAPI.getChannelVideos()
                ])
                console.log('Stats Response:', statsResponse)
                console.log('Videos Response:', videosResponse)
                setStats(statsResponse.data)
                setVideos(videosResponse.data?.docs || [])
                // Debug: Set raw response to state to view on UI
                setDebugInfo({ stats: statsResponse, videos: videosResponse })
            } catch (error) {
                console.error('Error fetching dashboard data:', error)
                setDebugInfo({ error: error.message })
            } finally {
                setLoading(false)
            }
        }

        fetchDashboardData()
    }, [])

    const [debugInfo, setDebugInfo] = useState(null)

    if (loading) {
        return (
            <div className="flex items-center justify-center min-h-[60vh]">
                <Loader2 className="h-8 w-8 animate-spin text-primary" />
            </div>
        )
    }

    return (
        <div className="container mx-auto px-4 py-8 space-y-8">
            {/* Header */}
            <div className="flex items-center justify-between">
                <div>
                    <h1 className="text-3xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
                        Channel Dashboard
                    </h1>
                    <p className="text-muted-foreground mt-2">
                        Overview of your channel performance and content
                    </p>
                </div>
                <Link to="/upload">
                    <Button className="bg-gradient-to-r from-blue-500 to-purple-500 hover:from-blue-600 hover:to-purple-600">
                        <Plus className="w-4 h-4 mr-2" />
                        Upload Video
                    </Button>
                </Link>
            </div>

            {/* Stats Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                <Card className="hover:shadow-lg transition-shadow">
                    <CardHeader className="flex flex-row items-center justify-between pb-2 space-y-0">
                        <CardTitle className="text-sm font-medium">Total Views</CardTitle>
                        <Eye className="h-4 w-4 text-muted-foreground" />
                    </CardHeader>
                    <CardContent>
                        <div className="text-2xl font-bold">{stats?.totalViews?.toLocaleString() || 0}</div>
                        <p className="text-xs text-muted-foreground">Lifetime channel views</p>
                    </CardContent>
                </Card>
                <Card className="hover:shadow-lg transition-shadow">
                    <CardHeader className="flex flex-row items-center justify-between pb-2 space-y-0">
                        <CardTitle className="text-sm font-medium">Subscribers</CardTitle>
                        <Users className="h-4 w-4 text-muted-foreground" />
                    </CardHeader>
                    <CardContent>
                        <div className="text-2xl font-bold">{stats?.totalSubscribers?.toLocaleString() || 0}</div>
                        <p className="text-xs text-muted-foreground">Total subscribers</p>
                    </CardContent>
                </Card>
                <Card className="hover:shadow-lg transition-shadow">
                    <CardHeader className="flex flex-row items-center justify-between pb-2 space-y-0">
                        <CardTitle className="text-sm font-medium">Total Likes</CardTitle>
                        <Heart className="h-4 w-4 text-muted-foreground" />
                    </CardHeader>
                    <CardContent>
                        <div className="text-2xl font-bold">{stats?.totalLikes?.toLocaleString() || 0}</div>
                        <p className="text-xs text-muted-foreground">Across all videos</p>
                    </CardContent>
                </Card>
                <Card className="hover:shadow-lg transition-shadow">
                    <CardHeader className="flex flex-row items-center justify-between pb-2 space-y-0">
                        <CardTitle className="text-sm font-medium">Total Videos</CardTitle>
                        <Video className="h-4 w-4 text-muted-foreground" />
                    </CardHeader>
                    <CardContent>
                        <div className="text-2xl font-bold">{stats?.totalVideos?.toLocaleString() || 0}</div>
                        <p className="text-xs text-muted-foreground">Uploaded videos</p>
                    </CardContent>
                </Card>
            </div>

            {/* Debug Info - Remove after fixing */}
            <div className="bg-slate-100 p-4 rounded overflow-auto max-h-60 text-xs font-mono">
                <h3 className="font-bold mb-2">Debug Info:</h3>
                <pre>{JSON.stringify(debugInfo, null, 2)}</pre>
            </div>

            {/* Videos Table */}
            <Card className="overflow-hidden">
                <CardHeader>
                    <CardTitle>Recent Videos</CardTitle>
                </CardHeader>
                <CardContent>
                    <div className="overflow-x-auto">
                        <table className="w-full text-sm text-left">
                            <thead className="text-xs text-muted-foreground uppercase bg-muted/50">
                                <tr>
                                    <th className="px-6 py-3">Video</th>
                                    <th className="px-6 py-3">Status</th>
                                    <th className="px-6 py-3">Date</th>
                                    <th className="px-6 py-3">Views</th>
                                    <th className="px-6 py-3">Likes</th>
                                    <th className="px-6 py-3">Comments</th>
                                    <th className="px-6 py-3 text-right">Actions</th>
                                </tr>
                            </thead>
                            <tbody>
                                {videos.length === 0 ? (
                                    <tr>
                                        <td colSpan="7" className="px-6 py-8 text-center text-muted-foreground">
                                            No videos found. Upload your first video to see stats!
                                        </td>
                                    </tr>
                                ) : (
                                    videos.map((video) => (
                                        <tr key={video._id} className="bg-background border-b hover:bg-muted/50 transition-colors">
                                            <td className="px-6 py-4 font-medium">
                                                <div className="flex items-center gap-3">
                                                    <div className="w-16 h-9 rounded bg-muted overflow-hidden shrink-0">
                                                        <img
                                                            src={video.thumbnail}
                                                            alt={video.title}
                                                            className="w-full h-full object-cover"
                                                        />
                                                    </div>
                                                    <div className="max-w-[200px] truncate" title={video.title}>
                                                        {video.title}
                                                    </div>
                                                </div>
                                            </td>
                                            <td className="px-6 py-4">
                                                <span className={`px-2 py-1 rounded-full text-xs font-medium ${video.isPublished
                                                    ? 'bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-400'
                                                    : 'bg-yellow-100 text-yellow-700 dark:bg-yellow-900/30 dark:text-yellow-400'
                                                    }`}>
                                                    {video.isPublished ? 'Published' : 'Draft'}
                                                </span>
                                            </td>
                                            <td className="px-6 py-4 text-muted-foreground">
                                                {formatTimeAgo(video.createdAt)}
                                            </td>
                                            <td className="px-6 py-4">
                                                {video.views?.toLocaleString()}
                                            </td>
                                            <td className="px-6 py-4">
                                                {video.likeCount?.toLocaleString()}
                                            </td>
                                            <td className="px-6 py-4">
                                                {video.commentCount?.toLocaleString()}
                                            </td>
                                            <td className="px-6 py-4 text-right">
                                                <div className="flex items-center justify-end gap-2">
                                                    <Button variant="ghost" size="icon" className="h-8 w-8">
                                                        <Edit className="h-4 w-4" />
                                                    </Button>
                                                    <Button variant="ghost" size="icon" className="h-8 w-8 text-destructive hover:text-destructive">
                                                        <Trash2 className="h-4 w-4" />
                                                    </Button>
                                                </div>
                                            </td>
                                        </tr>
                                    ))
                                )}
                            </tbody>
                        </table>
                    </div>
                </CardContent>
            </Card>
        </div>
    )
}

export default Dashboard
