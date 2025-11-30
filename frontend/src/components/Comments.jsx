import { useState, useEffect, useRef } from 'react'
import { commentAPI } from '../api/comment'
import { useAuth } from '../context/AuthContext'
import { X, Send, Loader2, Trash2, MoreVertical } from 'lucide-react'
import { Button } from './ui/Button'
import { motion } from 'framer-motion'
import { formatDistanceToNow } from 'date-fns'

import { useSocket } from '../context/SocketContext'

const Comments = ({ videoId, onClose, onCommentAdded, onCommentDeleted, variant = "modal" }) => {

    const [comments, setComments] = useState([])
    const [loading, setLoading] = useState(true)
    const [newComment, setNewComment] = useState('')
    const [submitting, setSubmitting] = useState(false)
    const { user } = useAuth()
    const { socket } = useSocket()
    const commentsEndRef = useRef(null)

    useEffect(() => {
        fetchComments()
    }, [videoId])

    useEffect(() => {
        if (!socket) return

        const handleNewComment = (data) => {
            const { videoId: eventVideoId, comment } = data
            if (eventVideoId === videoId) {
                // Check if comment already exists to prevent duplicates (e.g. from optimistic update or own submission)
                setComments(prev => {
                    if (prev.some(c => c._id === comment._id)) return prev
                    return [comment, ...prev]
                })
                if (onCommentAdded) onCommentAdded()
            }
        }

        const handleCommentDeleted = ({ videoId: eventVideoId, commentId }) => {
            if (eventVideoId === videoId) {
                setComments(prev => prev.filter(c => c._id !== commentId))
                if (onCommentDeleted) onCommentDeleted()
            }
        }

        socket.on('video:new-comment', handleNewComment)
        socket.on('video:comment-deleted', handleCommentDeleted)

        return () => {
            socket.off('video:new-comment', handleNewComment)
            socket.off('video:comment-deleted', handleCommentDeleted)
        }
    }, [socket, videoId, onCommentAdded, onCommentDeleted])

    const fetchComments = async () => {
        try {
            const response = await commentAPI.getVideoComments(videoId)
            setComments(response.data.docs)
        } catch (error) {
            console.error('Error fetching comments:', error)
        } finally {
            setLoading(false)
        }
    }

    const handleSubmit = async (e) => {
        e.preventDefault()
        if (!newComment.trim() || !user) return

        setSubmitting(true)
        try {
            const response = await commentAPI.addComment(videoId, newComment)
            setComments(prev => {
                if (prev.some(c => c._id === response.data._id)) return prev
                return [response.data, ...prev]
            })
            setNewComment('')
            if (onCommentAdded) onCommentAdded()
        } catch (error) {
            console.error('Error adding comment:', error)
        } finally {
            setSubmitting(false)
        }
    }

    const handleDelete = async (commentId) => {
        try {
            await commentAPI.deleteComment(commentId)
            setComments(prev => prev.filter(c => c._id !== commentId))
            if (onCommentDeleted) onCommentDeleted()
        } catch (error) {
            console.error('Error deleting comment:', error)
        }
    }

    return (
        <motion.div
            initial={variant === 'modal' ? { y: '100%' } : {}}
            animate={variant === 'modal' ? { y: 0 } : {}}
            exit={variant === 'modal' ? { y: '100%' } : {}}
            transition={variant === 'modal' ? { type: 'spring', damping: 25, stiffness: 200 } : {}}
            className={`${variant === 'modal' ? 'absolute inset-x-0 bottom-0 h-[70%] rounded-t-2xl shadow-2xl z-50' : 'h-auto'} bg-white dark:bg-slate-900 flex flex-col`}
            onClick={(e) => e.stopPropagation()}
        >
            {/* Header */}
            <div className={`flex items-center justify-between ${variant === 'modal' ? 'p-4 border-b dark:border-slate-800' : 'mb-6'}`}>
                <h3 className={`${variant === 'modal' ? 'font-semibold text-lg' : 'text-xl font-bold'}`}>
                    Comments <span className="text-muted-foreground text-sm">({comments.length})</span>
                </h3>
                {variant === 'modal' && (
                    <Button variant="ghost" size="icon" onClick={onClose} className="rounded-full">
                        <X className="w-5 h-5" />
                    </Button>
                )}
            </div>

            {/* Comments List */}
            <div className="flex-1 overflow-y-auto p-4 space-y-4">
                {loading ? (
                    <div className="flex justify-center py-8">
                        <Loader2 className="w-6 h-6 animate-spin text-primary" />
                    </div>
                ) : comments.length === 0 ? (
                    <div className="text-center py-8 text-muted-foreground">
                        <p>No comments yet. Be the first to say something!</p>
                    </div>
                ) : (
                    comments.map(comment => (
                        <div key={comment._id} className="flex gap-3">
                            <div className="w-8 h-8 rounded-full overflow-hidden flex-shrink-0 bg-slate-200">
                                <img
                                    src={comment.owner?.avatar || `https://ui-avatars.com/api/?name=${comment.owner?.username}`}
                                    alt={comment.owner?.username}
                                    className="w-full h-full object-cover"
                                />
                            </div>
                            <div className="flex-1">
                                <div className="flex items-baseline justify-between">
                                    <span className="font-semibold text-sm">@{comment.owner?.username}</span>
                                    <span className="text-xs text-muted-foreground">
                                        {formatDistanceToNow(new Date(comment.createdAt), { addSuffix: true })}
                                    </span>
                                </div>
                                <p className="text-sm mt-1 text-slate-700 dark:text-slate-300">{comment.content}</p>
                            </div>
                            {user && user._id === comment.owner?._id && (
                                <Button
                                    variant="ghost"
                                    size="icon"
                                    className="h-6 w-6 text-muted-foreground hover:text-red-500"
                                    onClick={() => handleDelete(comment._id)}
                                >
                                    <Trash2 className="w-3 h-3" />
                                </Button>
                            )}
                        </div>
                    ))
                )}
                <div ref={commentsEndRef} />
            </div>

            {/* Input Area */}
            <div className="p-4 border-t dark:border-slate-800 bg-slate-50 dark:bg-slate-900/50">
                {user ? (
                    <form onSubmit={handleSubmit} className="flex gap-2">
                        <div className="w-8 h-8 rounded-full overflow-hidden flex-shrink-0 bg-slate-200">
                            <img
                                src={user.avatar}
                                alt={user.username}
                                className="w-full h-full object-cover"
                            />
                        </div>
                        <div className="flex-1 relative">
                            <input
                                type="text"
                                value={newComment}
                                onChange={(e) => setNewComment(e.target.value)}
                                placeholder="Add a comment..."
                                className="w-full bg-white dark:bg-slate-800 border-none rounded-full py-2 pl-4 pr-10 text-sm focus:ring-2 focus:ring-blue-500 outline-none"
                            />
                            <button
                                type="submit"
                                disabled={!newComment.trim() || submitting}
                                className="absolute right-2 top-1/2 -translate-y-1/2 p-1 text-blue-500 disabled:text-slate-400 hover:bg-blue-50 dark:hover:bg-slate-700 rounded-full transition-colors"
                            >
                                {submitting ? <Loader2 className="w-4 h-4 animate-spin" /> : <Send className="w-4 h-4" />}
                            </button>
                        </div>
                    </form>
                ) : (
                    <div className="text-center text-sm text-muted-foreground">
                        Please login to comment
                    </div>
                )}
            </div>
        </motion.div>
    )
}

export default Comments
