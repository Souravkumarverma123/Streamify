import { Outlet, Link, useNavigate } from 'react-router-dom'
import { useAuth } from '../context/AuthContext'
import { Video, Upload, Search, Menu, User } from 'lucide-react'
import { useState } from 'react'
import Sidebar from './Sidebar'
import NotificationBell from './NotificationBell'
import { Button } from './ui/Button'
import Input from './ui/Input'
import { motion } from 'framer-motion'

const Layout = () => {
  const { user } = useAuth()
  const navigate = useNavigate()
  const [showUserMenu, setShowUserMenu] = useState(false)
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false)

  return (
    <div className="min-h-screen bg-background flex">
      {/* Desktop Sidebar */}
      <Sidebar />

      {/* Main Content Wrapper */}
      <div className="flex-1 flex flex-col min-w-0">
        {/* Header */}
        <header className="sticky top-0 z-30 w-full border-b border-border bg-background/80 backdrop-blur-xl supports-[backdrop-filter]:bg-background/60">
          <div className="flex h-16 items-center justify-between px-4 md:px-6 gap-4">
            {/* Mobile Menu Toggle & Logo */}
            <div className="flex items-center gap-4 md:hidden">
              <Button variant="ghost" size="icon" onClick={() => setMobileMenuOpen(!mobileMenuOpen)}>
                <Menu className="h-5 w-5" />
              </Button>
              <Link to="/" className="flex items-center gap-2 font-bold text-xl text-primary">
                <Video className="h-6 w-6" />
                <span>Chai Video</span>
              </Link>
            </div>

            {/* Search Bar */}
            <div className="hidden md:flex flex-1 max-w-xl mx-auto">
              <div className="relative w-full">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                <Input
                  placeholder="Search videos..."
                  className="pl-10 bg-secondary/50 border-transparent focus:bg-background focus:border-primary"
                />
              </div>
            </div>

            {/* Right Actions */}
            <div className="flex items-center gap-2 md:gap-4">
              {user && <NotificationBell />}
              <Button
                variant="default"
                size="sm"
                className="hidden md:flex gap-2"
                onClick={() => navigate('/upload')}
              >
                <Upload className="h-4 w-4" />
                <span>Upload</span>
              </Button>

              {/* User Menu */}
              <div className="relative">
                <button
                  onClick={() => setShowUserMenu(!showUserMenu)}
                  className="flex items-center gap-2 rounded-full p-1 hover:bg-accent transition-colors"
                >
                  {user?.avatar ? (
                    <img
                      src={user.avatar}
                      alt={user.username}
                      className="h-8 w-8 rounded-full object-cover ring-2 ring-primary/20"
                    />
                  ) : (
                    <div className="h-8 w-8 rounded-full bg-primary flex items-center justify-center text-primary-foreground">
                      {user?.username?.[0]?.toUpperCase() || 'U'}
                    </div>
                  )}
                </button>

                {showUserMenu && (
                  <>
                    <div
                      className="fixed inset-0 z-40"
                      onClick={() => setShowUserMenu(false)}
                    />
                    <motion.div
                      initial={{ opacity: 0, y: 10, scale: 0.95 }}
                      animate={{ opacity: 1, y: 0, scale: 1 }}
                      exit={{ opacity: 0, y: 10, scale: 0.95 }}
                      className="absolute right-0 mt-2 w-56 rounded-xl border border-border bg-popover shadow-xl z-50 overflow-hidden"
                    >
                      <div className="p-4 border-b border-border bg-accent/50">
                        <p className="font-semibold text-sm">{user?.fullName}</p>
                        <p className="text-xs text-muted-foreground">@{user?.username}</p>
                      </div>
                      <div className="p-2 space-y-1">
                        <Link
                          to="/profile"
                          onClick={() => setShowUserMenu(false)}
                          className="flex items-center px-3 py-2 text-sm hover:bg-accent rounded-lg transition-colors"
                        >
                          <User className="h-4 w-4 mr-2" />
                          Profile
                        </Link>
                        {/* Add more menu items here */}
                      </div>
                    </motion.div>
                  </>
                )}
              </div>
            </div>
          </div>
        </header>

        {/* Main Content Area */}
        <main className="flex-1 p-4 md:p-6 overflow-y-auto custom-scrollbar">
          <Outlet />
        </main>
      </div>
    </div>
  )
}

export default Layout
