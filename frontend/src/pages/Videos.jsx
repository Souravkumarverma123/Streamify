import { useEffect, useState } from 'react'
import { useSearchParams } from 'react-router-dom'
import { videoAPI } from '../api/video'
import { Loader2, Search, Filter, X } from 'lucide-react'
import { Button } from '../components/ui/Button'
import Input from '../components/ui/Input'
import VideoCard from '../components/VideoCard'
import { motion, AnimatePresence } from 'framer-motion'

const Videos = () => {
    const [searchParams, setSearchParams] = useSearchParams()
    const [videos, setVideos] = useState([])
    const [loading, setLoading] = useState(true)
    const [pagination, setPagination] = useState({
        page: 1,
        limit: 12,
        totalPages: 1,
        totalDocs: 0
    })

    // Filter states
    const [query, setQuery] = useState(searchParams.get('query') || '')
    const [sortBy, setSortBy] = useState(searchParams.get('sortBy') || 'createdAt')
    const [sortType, setSortType] = useState(searchParams.get('sortType') || 'desc')
    const [showFilters, setShowFilters] = useState(false)

    const fetchVideos = async () => {
        setLoading(true)
        try {
            const response = await videoAPI.getAllVideos({
                page: pagination.page,
                limit: pagination.limit,
                query,
                sortBy,
                sortType
            })

            if (response.data) {
                setVideos(response.data.docs)
                setPagination({
                    page: response.data.page,
                    limit: response.data.limit,
                    totalPages: response.data.totalPages,
                    totalDocs: response.data.totalDocs
                })
            }
        } catch (error) {
            console.error('Error fetching videos:', error)
        } finally {
            setLoading(false)
        }
    }

    useEffect(() => {
        // Debounce search
        const timer = setTimeout(() => {
            setSearchParams({ query, sortBy, sortType })
            fetchVideos()
        }, 500)

        return () => clearTimeout(timer)
    }, [query, sortBy, sortType, pagination.page])

    const handleSearch = (e) => {
        setQuery(e.target.value)
        setPagination(prev => ({ ...prev, page: 1 })) // Reset to first page on search
    }

    const clearFilters = () => {
        setQuery('')
        setSortBy('createdAt')
        setSortType('desc')
        setPagination(prev => ({ ...prev, page: 1 }))
    }

    return (
        <div className="space-y-8 pb-8">
            {/* Header & Filters */}
            <div className="space-y-4">
                <div className="flex flex-col md:flex-row gap-4 items-center justify-between">
                    <h1 className="text-3xl font-bold tracking-tight">Browse Videos</h1>

                    <div className="flex items-center gap-2 w-full md:w-auto">
                        <div className="relative flex-1 md:w-80">
                            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                            <Input
                                placeholder="Search videos..."
                                value={query}
                                onChange={handleSearch}
                                className="pl-10"
                            />
                            {query && (
                                <button
                                    onClick={() => setQuery('')}
                                    className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground"
                                >
                                    <X className="h-4 w-4" />
                                </button>
                            )}
                        </div>
                        <Button
                            variant={showFilters ? "secondary" : "outline"}
                            size="icon"
                            onClick={() => setShowFilters(!showFilters)}
                        >
                            <Filter className="h-4 w-4" />
                        </Button>
                    </div>
                </div>

                <AnimatePresence>
                    {showFilters && (
                        <motion.div
                            initial={{ height: 0, opacity: 0 }}
                            animate={{ height: 'auto', opacity: 1 }}
                            exit={{ height: 0, opacity: 0 }}
                            className="overflow-hidden"
                        >
                            <div className="p-4 border rounded-xl bg-card/50 space-y-4">
                                <div className="flex flex-wrap gap-4">
                                    <div className="space-y-2">
                                        <label className="text-sm font-medium">Sort By</label>
                                        <div className="flex gap-2">
                                            {['createdAt', 'views', 'duration'].map((option) => (
                                                <button
                                                    key={option}
                                                    onClick={() => setSortBy(option)}
                                                    className={`px-3 py-1.5 rounded-lg text-sm transition-colors ${sortBy === option
                                                            ? 'bg-primary text-primary-foreground'
                                                            : 'bg-secondary hover:bg-secondary/80'
                                                        }`}
                                                >
                                                    {option === 'createdAt' ? 'Date' : option.charAt(0).toUpperCase() + option.slice(1)}
                                                </button>
                                            ))}
                                        </div>
                                    </div>

                                    <div className="space-y-2">
                                        <label className="text-sm font-medium">Order</label>
                                        <div className="flex gap-2">
                                            <button
                                                onClick={() => setSortType('desc')}
                                                className={`px-3 py-1.5 rounded-lg text-sm transition-colors ${sortType === 'desc'
                                                        ? 'bg-primary text-primary-foreground'
                                                        : 'bg-secondary hover:bg-secondary/80'
                                                    }`}
                                            >
                                                Descending
                                            </button>
                                            <button
                                                onClick={() => setSortType('asc')}
                                                className={`px-3 py-1.5 rounded-lg text-sm transition-colors ${sortType === 'asc'
                                                        ? 'bg-primary text-primary-foreground'
                                                        : 'bg-secondary hover:bg-secondary/80'
                                                    }`}
                                            >
                                                Ascending
                                            </button>
                                        </div>
                                    </div>
                                </div>

                                <div className="flex justify-end">
                                    <Button variant="ghost" size="sm" onClick={clearFilters} className="text-muted-foreground">
                                        Clear Filters
                                    </Button>
                                </div>
                            </div>
                        </motion.div>
                    )}
                </AnimatePresence>
            </div>

            {/* Video Grid */}
            {loading ? (
                <div className="flex items-center justify-center min-h-[40vh]">
                    <Loader2 className="h-8 w-8 animate-spin text-primary" />
                </div>
            ) : videos.length > 0 ? (
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
                    {videos.map((video) => (
                        <VideoCard key={video._id} video={video} />
                    ))}
                </div>
            ) : (
                <div className="flex flex-col items-center justify-center min-h-[40vh] text-center space-y-4">
                    <div className="p-4 rounded-full bg-secondary/50">
                        <Search className="h-8 w-8 text-muted-foreground" />
                    </div>
                    <div>
                        <h3 className="text-lg font-semibold">No videos found</h3>
                        <p className="text-muted-foreground">Try adjusting your search or filters</p>
                    </div>
                    <Button variant="outline" onClick={clearFilters}>
                        Clear all filters
                    </Button>
                </div>
            )}

            {/* Pagination */}
            {!loading && videos.length > 0 && pagination.totalPages > 1 && (
                <div className="flex justify-center gap-2 pt-8">
                    <Button
                        variant="outline"
                        disabled={pagination.page === 1}
                        onClick={() => setPagination(prev => ({ ...prev, page: prev.page - 1 }))}
                    >
                        Previous
                    </Button>
                    <div className="flex items-center px-4 font-medium">
                        Page {pagination.page} of {pagination.totalPages}
                    </div>
                    <Button
                        variant="outline"
                        disabled={pagination.page === pagination.totalPages}
                        onClick={() => setPagination(prev => ({ ...prev, page: prev.page + 1 }))}
                    >
                        Next
                    </Button>
                </div>
            )}
        </div>
    )
}

export default Videos
