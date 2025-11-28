import { cn } from '@/lib/utils'
import { motion } from 'framer-motion'

const Input = ({ className, type, ...props }) => {
  return (
    <motion.div
      initial={false}
      animate={{ scale: 1 }}
      whileFocus={{ scale: 1.01 }}
      className="relative"
    >
      <input
        type={type}
        className={cn(
          "flex h-11 w-full rounded-xl border-2 border-input bg-background px-3 py-2 text-sm ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:border-transparent disabled:cursor-not-allowed disabled:opacity-50 transition-all duration-200",
          className
        )}
        {...props}
      />
    </motion.div>
  )
}

export { Input }
export default Input
