import { Play } from 'lucide-react'
import { motion } from 'framer-motion'
import { Link } from 'react-router-dom'

const ShortsCard = ({ short }) => {
    return (
        <Link to={`/shorts`}>
            <motion.div
                whileHover={{ y: -5 }}
                className="relative aspect-[9/16] rounded-xl overflow-hidden group cursor-pointer"
            >
                <img
                    src={short.thumbnail}
                    alt={short.title}
                    className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-105"
                />
                <div className="absolute inset-0 bg-gradient-to-b from-transparent via-transparent to-black/60" />

                <div className="absolute bottom-0 left-0 p-3 w-full">
                    <h3 className="text-white font-semibold text-sm line-clamp-2 mb-1 drop-shadow-md">
                        {short.title}
                    </h3>
                    <p className="text-white/80 text-xs drop-shadow-md">
                        {short.views} views
                    </p>
                </div>

                <div className="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity bg-black/20 backdrop-blur-[2px]">
                    <div className="h-10 w-10 rounded-full bg-white/20 backdrop-blur-md flex items-center justify-center">
                        <Play className="h-5 w-5 text-white fill-white" />
                    </div>
                </div>
            </motion.div>
        </Link>
    )
}

export default ShortsCard
