import { useAuth } from '../context/AuthContext'
import { Button } from '../components/ui/Button'
import { Input } from '../components/ui/Input' // Assuming you have a reusable Input component
import { Camera, Mail, User, Calendar, Edit2, Save } from 'lucide-react'
import { useState } from 'react'
import { motion } from 'framer-motion'

const Profile = () => {
  const { user } = useAuth()
  const [isEditing, setIsEditing] = useState(false)
  const [formData, setFormData] = useState({
    fullName: user?.fullName || '',
    email: user?.email || '',
    username: user?.username || ''
  })

  const handleSave = () => {
    // Implement save logic here
    console.log('Saving profile...', formData)
    setIsEditing(false)
  }

  return (
    <div className="min-h-screen pb-12">
      {/* Cover Image Section */}
      <div className="relative h-48 md:h-64 lg:h-80 w-full overflow-hidden bg-muted group">
        {user?.coverImage ? (
          <img
            src={user.coverImage}
            alt="Cover"
            className="w-full h-full object-cover"
          />
        ) : (
          <div className="w-full h-full bg-gradient-to-r from-primary/20 to-purple-500/20 flex items-center justify-center">
            <Camera className="h-12 w-12 text-muted-foreground/50" />
          </div>
        )}
        <div className="absolute inset-0 bg-black/0 group-hover:bg-black/10 transition-colors" />
        <button className="absolute bottom-4 right-4 bg-black/50 hover:bg-black/70 text-white p-2 rounded-full backdrop-blur-sm transition-all opacity-0 group-hover:opacity-100">
          <Camera className="h-5 w-5" />
        </button>
      </div>

      <div className="container max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="relative -mt-16 mb-8 flex flex-col md:flex-row items-end gap-6">
          {/* Avatar */}
          <div className="relative group">
            <div className="h-32 w-32 md:h-40 md:w-40 rounded-full border-4 border-background bg-background overflow-hidden shadow-xl">
              {user?.avatar ? (
                <img
                  src={user.avatar}
                  alt={user.username}
                  className="w-full h-full object-cover"
                />
              ) : (
                <div className="w-full h-full bg-primary flex items-center justify-center text-4xl font-bold text-primary-foreground">
                  {user?.username?.[0]?.toUpperCase()}
                </div>
              )}
            </div>
            <button className="absolute bottom-2 right-2 bg-primary text-primary-foreground p-2 rounded-full shadow-lg hover:bg-primary/90 transition-all opacity-0 group-hover:opacity-100">
              <Edit2 className="h-4 w-4" />
            </button>
          </div>

          {/* Header Info */}
          <div className="flex-1 pb-4 text-center md:text-left space-y-1">
            <h1 className="text-3xl font-bold">{user?.fullName}</h1>
            <p className="text-muted-foreground">@{user?.username}</p>
          </div>

          {/* Actions */}
          <div className="pb-4 w-full md:w-auto flex justify-center md:justify-end gap-3">
            {isEditing ? (
              <>
                <Button variant="outline" onClick={() => setIsEditing(false)}>Cancel</Button>
                <Button onClick={handleSave}>
                  <Save className="mr-2 h-4 w-4" />
                  Save Changes
                </Button>
              </>
            ) : (
              <Button onClick={() => setIsEditing(true)}>
                <Edit2 className="mr-2 h-4 w-4" />
                Edit Profile
              </Button>
            )}
          </div>
        </div>

        {/* Content Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Left Column: Personal Info */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="lg:col-span-2 space-y-6"
          >
            <div className="bg-card rounded-xl border border-border/50 shadow-sm p-6 space-y-6">
              <h2 className="text-xl font-semibold flex items-center gap-2">
                <User className="h-5 w-5 text-primary" />
                Personal Information
              </h2>

              <div className="grid gap-6">
                <div className="grid gap-2">
                  <label className="text-sm font-medium text-muted-foreground">Full Name</label>
                  {isEditing ? (
                    <Input
                      value={formData.fullName}
                      onChange={(e) => setFormData({ ...formData, fullName: e.target.value })}
                    />
                  ) : (
                    <p className="text-lg">{user?.fullName}</p>
                  )}
                </div>

                <div className="grid gap-2">
                  <label className="text-sm font-medium text-muted-foreground">Email Address</label>
                  <div className="flex items-center gap-2">
                    <Mail className="h-4 w-4 text-muted-foreground" />
                    {isEditing ? (
                      <Input
                        value={formData.email}
                        onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                      />
                    ) : (
                      <p className="text-lg">{user?.email}</p>
                    )}
                  </div>
                </div>

                <div className="grid gap-2">
                  <label className="text-sm font-medium text-muted-foreground">Username</label>
                  <div className="flex items-center gap-2">
                    <span className="text-muted-foreground">@</span>
                    {isEditing ? (
                      <Input
                        value={formData.username}
                        onChange={(e) => setFormData({ ...formData, username: e.target.value })}
                      />
                    ) : (
                      <p className="text-lg">{user?.username}</p>
                    )}
                  </div>
                </div>
              </div>
            </div>

            {/* Account Stats */}
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
              {[
                { label: 'Videos', value: '0' },
                { label: 'Subscribers', value: '0' },
                { label: 'Total Views', value: '0' }
              ].map((stat, index) => (
                <div key={index} className="bg-card p-6 rounded-xl border border-border/50 shadow-sm text-center">
                  <div className="text-3xl font-bold text-primary mb-1">{stat.value}</div>
                  <div className="text-sm text-muted-foreground">{stat.label}</div>
                </div>
              ))}
            </div>
          </motion.div>

          {/* Right Column: Account Details */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
            className="space-y-6"
          >
            <div className="bg-card rounded-xl border border-border/50 shadow-sm p-6 space-y-4">
              <h2 className="text-lg font-semibold">Account Details</h2>

              <div className="space-y-4 pt-2">
                <div className="flex items-center justify-between text-sm">
                  <span className="text-muted-foreground">Joined</span>
                  <span className="font-medium flex items-center gap-2">
                    <Calendar className="h-4 w-4" />
                    {new Date(user?.createdAt || Date.now()).toLocaleDateString()}
                  </span>
                </div>
                <div className="flex items-center justify-between text-sm">
                  <span className="text-muted-foreground">Status</span>
                  <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-400">
                    Active
                  </span>
                </div>
              </div>

              <div className="pt-4 border-t border-border">
                <Button variant="outline" className="w-full text-destructive hover:text-destructive hover:bg-destructive/10">
                  Delete Account
                </Button>
              </div>
            </div>
          </motion.div>
        </div>
      </div>
    </div>
  )
}

export default Profile
