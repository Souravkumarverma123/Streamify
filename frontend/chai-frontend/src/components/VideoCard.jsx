import { Link } from 'react-router-dom'
import { formatDuration, formatTimeAgo } from '@/lib/utils'
import { motion } from 'framer-motion'

const VideoCard = ({ video }) => {
    return (
        <Link to={`/watch/${video._id}`} className="group">
            <motion.div
                whileHover={{ y: -5 }}
                className="flex flex-col gap-3"
            >
                {/* Thumbnail Container */}
                <div className="relative aspect-video rounded-xl overflow-hidden bg-muted">
                    <img
                        src={video.thumbnail}
                        alt={video.title}
                        className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-105"
                    />
                    <div className="absolute bottom-2 right-2 bg-black/80 px-2 py-1 rounded text-xs font-medium text-white">
                        {formatDuration(video.duration)}
                    </div>
                    <div className="absolute inset-0 bg-black/0 group-hover:bg-black/10 transition-colors duration-300" />
                </div>

                {/* Info */}
                <div className="flex gap-3">
                    <div className="shrink-0">
                        {video.owner?.avatar ? (
                            <img
                                src={video.owner.avatar}
                                alt={video.owner.username}
                                className="h-9 w-9 rounded-full object-cover ring-2 ring-transparent group-hover:ring-primary/20 transition-all"
                            />
                        ) : (
                            <div className="h-9 w-9 rounded-full bg-primary flex items-center justify-center text-primary-foreground font-medium">
                                {video.owner?.username?.[0]?.toUpperCase()}
                            </div>
                        )}
                    </div>

                    <div className="flex flex-col">
                        <h3 className="font-semibold line-clamp-2 leading-tight group-hover:text-primary transition-colors">
                            {video.title}
                        </h3>
                        <div className="text-sm text-muted-foreground mt-1">
                            <p className="font-medium hover:text-foreground transition-colors">
                                {video.owner?.fullName || video.owner?.username}
                            </p>
                            <div className="flex items-center gap-1 text-xs">
                                <span>{video.views} views</span>
                                <span>•</span>
                                <span>{formatTimeAgo(video.createdAt)}</span>
                            </div>
                        </div>
                    </div>
                </div>
            </motion.div>
        </Link>
    )
}

export default VideoCard
