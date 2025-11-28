import { useEffect, useState } from 'react'
import { useParams, Link } from 'react-router-dom'
import { videoAPI } from '../api/video'
import { commentAPI } from '../api/comment'
import { likeAPI } from '../api/like'
import { Loader2, ThumbsUp, ThumbsDown, Share2, MoreVertical, MessageSquare } from 'lucide-react'
import { Button } from '../components/ui/Button'
import VideoCard from '../components/VideoCard'
import { formatTimeAgo } from '@/lib/utils'
import { motion } from 'framer-motion'
import Input from '../components/ui/Input'

const Watch = () => {
    const { videoId } = useParams()
    const [video, setVideo] = useState(null)
    const [relatedVideos, setRelatedVideos] = useState([])
    const [loading, setLoading] = useState(true)
    const [isSubscribed, setIsSubscribed] = useState(false)
    const [comments, setComments] = useState([])
    const [commentsLoading, setCommentsLoading] = useState(false)
    const [newComment, setNewComment] = useState('')
    const [isLiked, setIsLiked] = useState(false)
    const [isDisliked, setIsDisliked] = useState(false)
    const [likeCount, setLikeCount] = useState(0)

    useEffect(() => {
        const fetchVideoData = async () => {
            setLoading(true)
            try {
                // Fetch main video
                const response = await videoAPI.getVideoById(videoId)
                if (response.data) {
                    setVideo(response.data)
                    setLikeCount(response.data.likes || 0)

                    // Fetch related videos
                    const relatedResponse = await videoAPI.getAllVideos({ limit: 10 })
                    if (relatedResponse.data) {
                        setRelatedVideos(relatedResponse.data.docs.filter(v => v._id !== videoId))
                    }

                    // Fetch comments
                    fetchComments()
                }
            } catch (error) {
                console.error('Error fetching video:', error)
            } finally {
                setLoading(false)
            }
        }

        if (videoId) {
            fetchVideoData()
        }
    }, [videoId])

    const fetchComments = async () => {
        setCommentsLoading(true)
        try {
            const response = await commentAPI.getVideoComments(videoId, { page: 1, limit: 20 })
            if (response.data) {
                setComments(response.data.docs || [])
            }
        } catch (error) {
            console.error('Error fetching comments:', error)
            setComments([])
        } finally {
            setCommentsLoading(false)
        }
    }

    const handleAddComment = async (e) => {
        e.preventDefault()
        if (!newComment.trim()) return

        try {
            const response = await commentAPI.addComment(videoId, newComment)
            if (response.data) {
                setComments(prev => [response.data, ...prev])
                setNewComment('')
            }
        } catch (error) {
            console.error('Error adding comment:', error)
            alert('Failed to add comment. Please try again.')
        }
    }

    const handleLike = async () => {
        try {
            const response = await likeAPI.toggleVideoLike(videoId)
            if (response.data) {
                setIsLiked(response.data.isLiked)
                if (response.data.isLiked) {
                    setLikeCount(prev => prev + 1)
                    setIsDisliked(false)
                } else {
                    setLikeCount(prev => prev - 1)
                }
            }
        } catch (error) {
            console.error('Error toggling like:', error)
        }
    }

    if (loading) {
        return (
            <div className="flex items-center justify-center min-h-[60vh]">
                <Loader2 className="h-8 w-8 animate-spin text-primary" />
            </div>
        )
    }

    if (!video) {
        return (
            <div className="flex flex-col items-center justify-center min-h-[60vh] space-y-4">
                <h2 className="text-2xl font-bold">Video not found</h2>
                <p className="text-muted-foreground">The video you are looking for does not exist or has been removed.</p>
                <Link to="/">
                    <Button>Go Home</Button>
                </Link>
            </div>
        )
    }

    return (
        <div className="max-w-[1800px] mx-auto">
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 lg:gap-8">
                {/* Main Content */}
                <div className="lg:col-span-2 space-y-4">
                    {/* Video Player */}
                    <div className="relative aspect-video bg-black rounded-xl overflow-hidden shadow-2xl">
                        <video
                            src={video.videoFile}
                            poster={video.thumbnail}
                            controls
                            autoPlay
                            className="w-full h-full object-contain"
                        >
                            Your browser does not support the video tag.
                        </video>
                    </div>

                    {/* Video Info */}
                    <div className="space-y-4">
                        <h1 className="text-xl md:text-2xl font-bold leading-tight">
                            {video.title}
                        </h1>

                        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                            {/* Channel Info */}
                            <div className="flex items-center gap-4">
                                <Link to={`/channel/${video.owner?.username}`} className="shrink-0">
                                    {video.owner?.avatar ? (
                                        <img
                                            src={video.owner.avatar}
                                            alt={video.owner.username}
                                            className="h-10 w-10 md:h-12 md:w-12 rounded-full object-cover ring-2 ring-transparent hover:ring-primary/20 transition-all"
                                        />
                                    ) : (
                                        <div className="h-10 w-10 md:h-12 md:w-12 rounded-full bg-primary flex items-center justify-center text-primary-foreground font-medium text-lg">
                                            {video.owner?.username?.[0]?.toUpperCase()}
                                        </div>
                                    )}
                                </Link>
                                <div>
                                    <Link
                                        to={`/channel/${video.owner?.username}`}
                                        className="font-semibold hover:text-primary transition-colors block"
                                    >
                                        {video.owner?.fullName || video.owner?.username}
                                    </Link>
                                    <p className="text-xs text-muted-foreground">1.2M subscribers</p>
                                </div>
                                <Button
                                    variant={isSubscribed ? "secondary" : "default"}
                                    className="ml-4 rounded-full"
                                    onClick={() => setIsSubscribed(!isSubscribed)}
                                >
                                    {isSubscribed ? 'Subscribed' : 'Subscribe'}
                                </Button>
                            </div>

                            {/* Actions */}
                            <div className="flex items-center gap-2 overflow-x-auto pb-2 md:pb-0 no-scrollbar">
                                <div className="flex items-center bg-secondary/50 rounded-full p-1">
                                    <Button
                                        variant="ghost"
                                        size="sm"
                                        className={`rounded-l-full gap-2 hover:bg-background ${isLiked ? 'text-primary' : ''}`}
                                        onClick={handleLike}
                                    >
                                        <ThumbsUp className={`h-4 w-4 ${isLiked ? 'fill-current' : ''}`} />
                                        <span className="font-medium">{likeCount > 0 ? likeCount : '0'}</span>
                                    </Button>
                                    <div className="w-px h-6 bg-border" />
                                    <Button
                                        variant="ghost"
                                        size="sm"
                                        className={`rounded-r-full hover:bg-background ${isDisliked ? 'text-primary' : ''}`}
                                        onClick={() => setIsDisliked(!isDisliked)}
                                    >
                                        <ThumbsDown className={`h-4 w-4 ${isDisliked ? 'fill-current' : ''}`} />
                                    </Button>
                                </div>

                                <Button variant="secondary" size="sm" className="rounded-full gap-2">
                                    <Share2 className="h-4 w-4" />
                                    Share
                                </Button>

                                <Button variant="ghost" size="icon" className="rounded-full">
                                    <MoreVertical className="h-4 w-4" />
                                </Button>
                            </div>
                        </div>

                        {/* Description */}
                        <div className="bg-secondary/30 rounded-xl p-4 text-sm space-y-2 hover:bg-secondary/50 transition-colors cursor-pointer">
                            <div className="flex items-center gap-2 font-medium">
                                <span>{video.views} views</span>
                                <span>•</span>
                                <span>{formatTimeAgo(video.createdAt)}</span>
                            </div>
                            <p className="whitespace-pre-wrap leading-relaxed text-muted-foreground">
                                {video.description}
                            </p>
                        </div>

                        {/* Comments Section */}
                        <div className="pt-6 border-t border-border">
                            <div className="flex items-center gap-2 mb-6">
                                <h3 className="text-xl font-bold">Comments</h3>
                                <span className="text-muted-foreground">{comments.length}</span>
                            </div>

                            <form onSubmit={handleAddComment} className="flex gap-4 mb-8">
                                <div className="h-10 w-10 rounded-full bg-secondary shrink-0" />
                                <div className="flex-1">
                                    <Input
                                        placeholder="Add a comment..."
                                        className="w-full"
                                        value={newComment}
                                        onChange={(e) => setNewComment(e.target.value)}
                                    />
                                    <div className="flex justify-end mt-2 gap-2">
                                        <Button
                                            type="button"
                                            variant="ghost"
                                            size="sm"
                                            onClick={() => setNewComment('')}
                                        >
                                            Cancel
                                        </Button>
                                        <Button
                                            type="submit"
                                            size="sm"
                                            disabled={!newComment.trim()}
                                        >
                                            Comment
                                        </Button>
                                    </div>
                                </div>
                            </form>

                            {commentsLoading ? (
                                <div className="flex justify-center py-8">
                                    <Loader2 className="h-6 w-6 animate-spin text-primary" />
                                </div>
                            ) : comments.length === 0 ? (
                                <div className="text-center py-8 text-muted-foreground">
                                    <MessageSquare className="h-12 w-12 mx-auto mb-2 opacity-50" />
                                    <p>No comments yet. Be the first to comment!</p>
                                </div>
                            ) : (
                                <div className="space-y-6">
                                    {comments.map((comment) => (
                                        <div key={comment._id} className="flex gap-4">
                                            {comment.owner?.avatar ? (
                                                <img
                                                    src={comment.owner.avatar}
                                                    alt={comment.owner.username}
                                                    className="h-10 w-10 rounded-full object-cover shrink-0"
                                                />
                                            ) : (
                                                <div className="h-10 w-10 rounded-full bg-secondary shrink-0 flex items-center justify-center text-xs font-medium">
                                                    {comment.owner?.username?.[0]?.toUpperCase() || 'U'}
                                                </div>
                                            )}
                                            <div className="space-y-1 flex-1">
                                                <div className="flex items-center gap-2">
                                                    <span className="font-semibold text-sm">
                                                        {comment.owner?.fullName || comment.owner?.username || 'User'}
                                                    </span>
                                                    <span className="text-xs text-muted-foreground">
                                                        {formatTimeAgo(comment.createdAt)}
                                                    </span>
                                                </div>
                                                <p className="text-sm">{comment.content}</p>
                                                <div className="flex items-center gap-4 pt-1">
                                                    <button className="flex items-center gap-1 text-xs text-muted-foreground hover:text-foreground">
                                                        <ThumbsUp className="h-3 w-3" />
                                                    </button>
                                                    <button className="flex items-center gap-1 text-xs text-muted-foreground hover:text-foreground">
                                                        <ThumbsDown className="h-3 w-3" />
                                                    </button>
                                                    <button className="text-xs font-medium hover:bg-secondary px-2 py-1 rounded-full">
                                                        Reply
                                                    </button>
                                                </div>
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            )}
                        </div>
                    </div>
                </div>

                {/* Sidebar / Related Videos */}
                <div className="space-y-4">
                    <h3 className="font-bold text-lg px-1">Up Next</h3>
                    <div className="flex flex-col gap-3">
                        {relatedVideos.map((relatedVideo) => (
                            <Link
                                key={relatedVideo._id}
                                to={`/watch/${relatedVideo._id}`}
                                className="group flex gap-3 hover:bg-secondary/50 p-2 rounded-xl transition-colors"
                            >
                                <div className="relative w-40 aspect-video rounded-lg overflow-hidden bg-muted shrink-0">
                                    <img
                                        src={relatedVideo.thumbnail}
                                        alt={relatedVideo.title}
                                        className="w-full h-full object-cover"
                                    />
                                    <div className="absolute bottom-1 right-1 bg-black/80 text-[10px] text-white px-1 rounded">
                                        {relatedVideo.duration ? `${Math.floor(relatedVideo.duration / 60)}:${String(Math.floor(relatedVideo.duration % 60)).padStart(2, '0')}` : '0:00'}
                                    </div>
                                </div>
                                <div className="flex flex-col min-w-0 py-1">
                                    <h4 className="font-semibold text-sm line-clamp-2 leading-tight group-hover:text-primary transition-colors">
                                        {relatedVideo.title}
                                    </h4>
                                    <p className="text-xs text-muted-foreground mt-1">
                                        {relatedVideo.owner?.fullName || relatedVideo.owner?.username}
                                    </p>
                                    <div className="flex items-center gap-1 text-[10px] text-muted-foreground mt-0.5">
                                        <span>{relatedVideo.views} views</span>
                                        <span>•</span>
                                        <span>{formatTimeAgo(relatedVideo.createdAt)}</span>
                                    </div>
                                </div>
                            </Link>
                        ))}
                    </div>
                </div>
            </div>
        </div>
    )
}

export default Watch
