import { cn } from '@/lib/utils'
import { motion } from 'framer-motion'
import { Loader2 } from 'lucide-react'

const Button = ({
  children,
  className,
  variant = 'default',
  size = 'default',
  disabled,
  loading = false,
  ...props
}) => {
  const baseStyles = 'inline-flex items-center justify-center rounded-xl font-medium transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring disabled:pointer-events-none disabled:opacity-50 active:scale-95'

  const variants = {
    default: 'bg-primary text-primary-foreground hover:bg-primary/90 shadow-lg shadow-primary/25',
    destructive: 'bg-destructive text-destructive-foreground hover:bg-destructive/90 shadow-lg shadow-destructive/25',
    outline: 'border-2 border-input bg-background hover:bg-accent hover:text-accent-foreground',
    secondary: 'bg-secondary text-secondary-foreground hover:bg-secondary/80',
    ghost: 'hover:bg-accent hover:text-accent-foreground',
    link: 'text-primary underline-offset-4 hover:underline',
  }

  const sizes = {
    default: 'h-11 px-6 py-2',
    sm: 'h-9 rounded-lg px-3 text-xs',
    lg: 'h-12 rounded-xl px-8 text-lg',
    icon: 'h-11 w-11',
  }

  return (
    <motion.button
      whileTap={{ scale: 0.95 }}
      className={cn(
        baseStyles,
        variants[variant],
        sizes[size],
        className
      )}
      disabled={disabled || loading}
      {...props}
    >
      {loading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
      {children}
    </motion.button>
  )
}

export { Button }
export default Button
