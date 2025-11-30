import { useState, useEffect, useRef } from 'react'
import { videoAPI } from '../api/video'
import { Heart, MessageCircle, Share2, MoreVertical, Play, Pause, Volume2, VolumeX, Loader2 } from 'lucide-react'
import { Button } from '../components/ui/Button'
import { motion, AnimatePresence } from 'framer-motion'

const Shorts = () => {
    const [shorts, setShorts] = useState([])
    const [currentIndex, setCurrentIndex] = useState(0)
    const [isPlaying, setIsPlaying] = useState(true)
    const [isMuted, setIsMuted] = useState(true)
    const [loading, setLoading] = useState(true)
    const containerRef = useRef(null)

    useEffect(() => {
        const fetchShorts = async () => {
            try {
                const response = await videoAPI.getShorts({ limit: 20 })
                setShorts(response.data?.docs || [])
            } catch (error) {
                console.error('Error fetching shorts:', error)
            } finally {
                setLoading(false)
            }
        }
        fetchShorts()
    }, [])

    const handleScroll = () => {
        if (containerRef.current) {
            const { scrollTop, clientHeight } = containerRef.current
            const newIndex = Math.round(scrollTop / clientHeight)
            if (newIndex !== currentIndex) {
                setCurrentIndex(newIndex)
            }
        }
    }

    const togglePlay = () => setIsPlaying(!isPlaying)
    const toggleMute = () => setIsMuted(!isMuted)

    if (loading) {
        return (
            <div className="flex items-center justify-center h-[calc(100vh-64px)]">
                <Loader2 className="h-8 w-8 animate-spin text-primary" />
            </div>
        )
    }

    if (shorts.length === 0) {
        return (
            <div className="flex flex-col items-center justify-center h-[calc(100vh-64px)] gap-4">
                <p className="text-muted-foreground">No shorts available yet</p>
            </div>
        )
    }

    return (
        <div
            ref={containerRef}
            onScroll={handleScroll}
            className="h-[calc(100vh-64px)] w-full max-w-[500px] mx-auto overflow-y-scroll snap-y snap-mandatory no-scrollbar bg-black rounded-xl"
        >
            {shorts.map((short, index) => (
                <div
                    key={short._id}
                    className="relative h-full w-full snap-start snap-always flex items-center justify-center bg-black"
                >
                    {/* Video Placeholder (Image for now as we don't have real vertical videos) */}
                    <div className="relative w-full h-full">
                        <img
                            src={short.thumbnail}
                            alt={short.title}
                            className="w-full h-full object-cover opacity-80"
                        />

                        {/* Play/Pause Overlay */}
                        <div
                            className="absolute inset-0 flex items-center justify-center cursor-pointer"
                            onClick={togglePlay}
                        >
                            {!isPlaying && index === currentIndex && (
                                <div className="h-16 w-16 rounded-full bg-black/40 flex items-center justify-center backdrop-blur-sm">
                                    <Play className="h-8 w-8 text-white fill-white" />
                                </div>
                            )}
                        </div>

                        {/* Controls & Info Overlay */}
                        <div className="absolute inset-0 pointer-events-none flex flex-col justify-between p-4 pb-20 md:pb-4">
                            {/* Top Controls */}
                            <div className="flex justify-between items-start pointer-events-auto">
                                <div />
                                <Button variant="ghost" size="icon" className="text-white hover:bg-white/20 rounded-full" onClick={toggleMute}>
                                    {isMuted ? <VolumeX /> : <Volume2 />}
                                </Button>
                            </div>

                            {/* Bottom Info & Actions */}
                            <div className="flex items-end justify-between gap-4">
                                {/* Info */}
                                <div className="flex-1 space-y-3 pointer-events-auto">
                                    <div className="flex items-center gap-2">
                                        <div className="h-10 w-10 rounded-full border-2 border-white overflow-hidden">
                                            <img src={short.owner.avatar} alt={short.owner.username} className="w-full h-full object-cover" />
                                        </div>
                                        <span className="font-semibold text-white drop-shadow-md">@{short.owner.username}</span>
                                        <Button size="sm" variant="secondary" className="h-7 px-3 rounded-full bg-white text-black hover:bg-white/90">
                                            Subscribe
                                        </Button>
                                    </div>
                                    <h2 className="text-white font-medium line-clamp-2 drop-shadow-md">
                                        {short.title}
                                    </h2>
                                    <div className="flex items-center gap-2 text-white/90 text-sm">
                                        <div className="px-2 py-1 rounded bg-white/20 backdrop-blur-md">
                                            🎵 Original Sound
                                        </div>
                                    </div>
                                </div>

                                {/* Right Actions */}
                                <div className="flex flex-col items-center gap-4 pointer-events-auto pb-4">
                                    <ActionButton icon={Heart} label="124K" />
                                    <ActionButton icon={MessageCircle} label="1.2K" />
                                    <ActionButton icon={Share2} label="Share" />
                                    <Button variant="ghost" size="icon" className="text-white hover:bg-white/20 rounded-full">
                                        <MoreVertical />
                                    </Button>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            ))}
        </div>
    )
}

const ActionButton = ({ icon: Icon, label }) => (
    <div className="flex flex-col items-center gap-1">
        <Button variant="ghost" size="icon" className="h-12 w-12 rounded-full bg-black/40 hover:bg-black/60 text-white backdrop-blur-sm">
            <Icon className="h-6 w-6" />
        </Button>
        <span className="text-xs font-medium text-white drop-shadow-md">{label}</span>
    </div>
)

export default Shorts
