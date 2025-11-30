import { useState } from 'react'
import { NavLink, useLocation } from 'react-router-dom'
import { motion, AnimatePresence } from 'framer-motion'
import {
    Home,
    UploadCloud, // Changed from Upload to UploadCloud
    Film,         // Added Film
    Compass,      // Added Compass
    PlaySquare,   // Added PlaySquare
    History,
    Users,
    Settings,
    ChevronLeft,
    ChevronRight,
    LogOut,
    Menu,
    LayoutDashboard
} from 'lucide-react'
import { useAuth } from '../context/AuthContext'
import { cn } from '@/lib/utils'

const Sidebar = () => {
    const [isCollapsed, setIsCollapsed] = useState(false)
    const { logout } = useAuth()
    const location = useLocation()

    const navItems = [
        { path: '/', label: 'Home', icon: Home },
        { path: '/dashboard', label: 'Dashboard', icon: LayoutDashboard },
        { path: '/shorts', label: 'Shorts', icon: Film },
        { path: '/upload', label: 'Upload', icon: UploadCloud },
        { path: '/videos', label: 'Browse', icon: Compass },
        { path: '/playlists', label: 'Playlists', icon: PlaySquare },
        { path: '/history', label: 'History', icon: History },
        { icon: Users, label: 'Channel', path: '/channel' },
        { icon: Settings, label: 'Settings', path: '/settings' },
    ]

    const sidebarVariants = {
        expanded: { width: 240 },
        collapsed: { width: 80 }
    }

    return (
        <motion.aside
            initial="expanded"
            animate={isCollapsed ? "collapsed" : "expanded"}
            variants={sidebarVariants}
            className="sticky top-0 h-screen bg-card border-r border-border z-40 hidden md:flex flex-col transition-all duration-300 ease-in-out"
        >
            {/* Toggle Button */}
            <button
                onClick={() => setIsCollapsed(!isCollapsed)}
                className="absolute -right-3 top-6 bg-primary text-primary-foreground rounded-full p-1 shadow-md hover:bg-primary/90 transition-colors z-50"
            >
                {isCollapsed ? <ChevronRight size={16} /> : <ChevronLeft size={16} />}
            </button>

            {/* Logo Area */}
            <div className={cn(
                "h-16 flex items-center px-6 border-b border-border",
                isCollapsed ? "justify-center" : "justify-start"
            )}>
                <div className="flex items-center gap-2 text-primary font-bold text-xl">
                    <div className="bg-primary text-primary-foreground p-1.5 rounded-lg">
                        <Menu size={20} />
                    </div>
                    {!isCollapsed && (
                        <motion.span
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            exit={{ opacity: 0 }}
                            className="whitespace-nowrap"
                        >
                            Chai Video
                        </motion.span>
                    )}
                </div>
            </div>

            {/* Navigation Items */}
            <nav className="flex-1 py-6 px-3 space-y-2 overflow-y-auto custom-scrollbar">
                {navItems.map((item) => (
                    <NavLink
                        key={item.path}
                        to={item.path}
                        className={({ isActive }) => cn(
                            "flex items-center gap-3 px-3 py-3 rounded-xl transition-all duration-200 group relative overflow-hidden",
                            isActive
                                ? "bg-primary text-primary-foreground shadow-lg shadow-primary/25"
                                : "text-muted-foreground hover:bg-accent hover:text-accent-foreground"
                        )}
                    >
                        <item.icon size={20} className="shrink-0" />
                        {!isCollapsed && (
                            <motion.span
                                initial={{ opacity: 0, x: -10 }}
                                animate={{ opacity: 1, x: 0 }}
                                exit={{ opacity: 0, x: -10 }}
                                className="font-medium whitespace-nowrap"
                            >
                                {item.label}
                            </motion.span>
                        )}

                        {/* Active Indicator for Collapsed State */}
                        {isCollapsed && location.pathname === item.path && (
                            <motion.div
                                layoutId="activeIndicator"
                                className="absolute left-0 top-0 bottom-0 w-1 bg-primary-foreground rounded-r-full"
                            />
                        )}
                    </NavLink>
                ))}
            </nav>

            {/* Footer / Logout */}
            <div className="p-4 border-t border-border">
                <button
                    onClick={logout}
                    className={cn(
                        "flex items-center gap-3 w-full px-3 py-3 rounded-xl text-destructive hover:bg-destructive/10 transition-colors",
                        isCollapsed && "justify-center"
                    )}
                >
                    <LogOut size={20} className="shrink-0" />
                    {!isCollapsed && (
                        <motion.span
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            className="font-medium whitespace-nowrap"
                        >
                            Logout
                        </motion.span>
                    )}
                </button>
            </div>
        </motion.aside>
    )
}

export default Sidebar
