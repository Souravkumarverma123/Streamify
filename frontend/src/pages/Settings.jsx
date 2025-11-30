import { useState } from 'react'
import { useAuth } from '../context/AuthContext'
import { userAPI } from '../api/user'
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '../components/ui/Card'
import Button from '../components/ui/Button'
import Input from '../components/ui/Input'
import { AlertCircle, CheckCircle, Upload, Loader2 } from 'lucide-react'

const Settings = () => {
  const { user, updateUser } = useAuth()
  const [activeTab, setActiveTab] = useState('account')

  return (
    <div className="max-w-4xl mx-auto space-y-6">
      <div>
        <h1 className="text-3xl font-bold tracking-tight">Settings</h1>
        <p className="text-muted-foreground mt-2">Manage your account settings and preferences</p>
      </div>

      {/* Tabs */}
      <div className="flex gap-2 border-b">
        <button
          onClick={() => setActiveTab('account')}
          className={`px-4 py-2 font-medium transition-colors border-b-2 ${
            activeTab === 'account'
              ? 'border-primary text-primary'
              : 'border-transparent text-muted-foreground hover:text-foreground'
          }`}
        >
          Account
        </button>
        <button
          onClick={() => setActiveTab('password')}
          className={`px-4 py-2 font-medium transition-colors border-b-2 ${
            activeTab === 'password'
              ? 'border-primary text-primary'
              : 'border-transparent text-muted-foreground hover:text-foreground'
          }`}
        >
          Password
        </button>
        <button
          onClick={() => setActiveTab('images')}
          className={`px-4 py-2 font-medium transition-colors border-b-2 ${
            activeTab === 'images'
              ? 'border-primary text-primary'
              : 'border-transparent text-muted-foreground hover:text-foreground'
          }`}
        >
          Images
        </button>
      </div>

      {activeTab === 'account' && <AccountSettings user={user} updateUser={updateUser} />}
      {activeTab === 'password' && <PasswordSettings />}
      {activeTab === 'images' && <ImageSettings user={user} updateUser={updateUser} />}
    </div>
  )
}

const AccountSettings = ({ user, updateUser }) => {
  const [formData, setFormData] = useState({
    fullName: user?.fullName || '',
    email: user?.email || '',
  })
  const [loading, setLoading] = useState(false)
  const [message, setMessage] = useState({ type: '', text: '' })

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    })
    setMessage({ type: '', text: '' })
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    setLoading(true)
    setMessage({ type: '', text: '' })

    try {
      const response = await userAPI.updateAccountDetails(formData)
      updateUser(response.data)
      setMessage({ type: 'success', text: 'Account updated successfully!' })
    } catch (error) {
      setMessage({
        type: 'error',
        text: error.response?.data?.message || 'Failed to update account',
      })
    } finally {
      setLoading(false)
    }
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle>Account Information</CardTitle>
        <CardDescription>Update your account details</CardDescription>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSubmit} className="space-y-4">
          {message.text && (
            <div
              className={`flex items-center gap-2 text-sm p-3 rounded-md ${
                message.type === 'success'
                  ? 'bg-green-50 text-green-700 dark:bg-green-950 dark:text-green-400'
                  : 'bg-destructive/10 text-destructive'
              }`}
            >
              {message.type === 'success' ? (
                <CheckCircle className="h-4 w-4" />
              ) : (
                <AlertCircle className="h-4 w-4" />
              )}
              <span>{message.text}</span>
            </div>
          )}

          <div className="space-y-2">
            <label htmlFor="fullName" className="text-sm font-medium">
              Full Name
            </label>
            <Input
              id="fullName"
              name="fullName"
              type="text"
              value={formData.fullName}
              onChange={handleChange}
              required
              disabled={loading}
            />
          </div>

          <div className="space-y-2">
            <label htmlFor="email" className="text-sm font-medium">
              Email
            </label>
            <Input
              id="email"
              name="email"
              type="email"
              value={formData.email}
              onChange={handleChange}
              required
              disabled={loading}
            />
          </div>

          <div className="space-y-2">
            <label className="text-sm font-medium text-muted-foreground">Username</label>
            <Input value={user?.username} disabled />
            <p className="text-xs text-muted-foreground">Username cannot be changed</p>
          </div>

          <Button type="submit" disabled={loading}>
            {loading ? (
              <>
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                Updating...
              </>
            ) : (
              'Save Changes'
            )}
          </Button>
        </form>
      </CardContent>
    </Card>
  )
}

const PasswordSettings = () => {
  const [formData, setFormData] = useState({
    oldPassword: '',
    newPassword: '',
    confirmPassword: '',
  })
  const [loading, setLoading] = useState(false)
  const [message, setMessage] = useState({ type: '', text: '' })

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    })
    setMessage({ type: '', text: '' })
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    setLoading(true)
    setMessage({ type: '', text: '' })

    if (formData.newPassword !== formData.confirmPassword) {
      setMessage({ type: 'error', text: 'Passwords do not match' })
      setLoading(false)
      return
    }

    try {
      await userAPI.changePassword({
        oldPassword: formData.oldPassword,
        newPassword: formData.newPassword,
      })
      setMessage({ type: 'success', text: 'Password changed successfully!' })
      setFormData({ oldPassword: '', newPassword: '', confirmPassword: '' })
    } catch (error) {
      setMessage({
        type: 'error',
        text: error.response?.data?.message || 'Failed to change password',
      })
    } finally {
      setLoading(false)
    }
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle>Change Password</CardTitle>
        <CardDescription>Update your password to keep your account secure</CardDescription>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSubmit} className="space-y-4">
          {message.text && (
            <div
              className={`flex items-center gap-2 text-sm p-3 rounded-md ${
                message.type === 'success'
                  ? 'bg-green-50 text-green-700 dark:bg-green-950 dark:text-green-400'
                  : 'bg-destructive/10 text-destructive'
              }`}
            >
              {message.type === 'success' ? (
                <CheckCircle className="h-4 w-4" />
              ) : (
                <AlertCircle className="h-4 w-4" />
              )}
              <span>{message.text}</span>
            </div>
          )}

          <div className="space-y-2">
            <label htmlFor="oldPassword" className="text-sm font-medium">
              Current Password
            </label>
            <Input
              id="oldPassword"
              name="oldPassword"
              type="password"
              value={formData.oldPassword}
              onChange={handleChange}
              required
              disabled={loading}
            />
          </div>

          <div className="space-y-2">
            <label htmlFor="newPassword" className="text-sm font-medium">
              New Password
            </label>
            <Input
              id="newPassword"
              name="newPassword"
              type="password"
              value={formData.newPassword}
              onChange={handleChange}
              required
              disabled={loading}
            />
          </div>

          <div className="space-y-2">
            <label htmlFor="confirmPassword" className="text-sm font-medium">
              Confirm New Password
            </label>
            <Input
              id="confirmPassword"
              name="confirmPassword"
              type="password"
              value={formData.confirmPassword}
              onChange={handleChange}
              required
              disabled={loading}
            />
          </div>

          <Button type="submit" disabled={loading}>
            {loading ? (
              <>
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                Changing Password...
              </>
            ) : (
              'Change Password'
            )}
          </Button>
        </form>
      </CardContent>
    </Card>
  )
}

const ImageSettings = ({ user, updateUser }) => {
  const [avatarPreview, setAvatarPreview] = useState(null)
  const [coverPreview, setCoverPreview] = useState(null)
  const [loading, setLoading] = useState({ avatar: false, cover: false })
  const [message, setMessage] = useState({ type: '', text: '' })

  const handleAvatarChange = async (e) => {
    const file = e.target.files[0]
    if (!file) return

    setLoading({ ...loading, avatar: true })
    setMessage({ type: '', text: '' })

    // Create preview
    const reader = new FileReader()
    reader.onloadend = () => {
      setAvatarPreview(reader.result)
    }
    reader.readAsDataURL(file)

    try {
      const formData = new FormData()
      formData.append('avatar', file)
      const response = await userAPI.updateAvatar(formData)
      updateUser(response.data)
      setMessage({ type: 'success', text: 'Avatar updated successfully!' })
    } catch (error) {
      setMessage({
        type: 'error',
        text: error.response?.data?.message || 'Failed to update avatar',
      })
      setAvatarPreview(null)
    } finally {
      setLoading({ ...loading, avatar: false })
    }
  }

  const handleCoverChange = async (e) => {
    const file = e.target.files[0]
    if (!file) return

    setLoading({ ...loading, cover: true })
    setMessage({ type: '', text: '' })

    // Create preview
    const reader = new FileReader()
    reader.onloadend = () => {
      setCoverPreview(reader.result)
    }
    reader.readAsDataURL(file)

    try {
      const formData = new FormData()
      formData.append('coverImage', file)
      const response = await userAPI.updateCoverImage(formData)
      updateUser(response.data)
      setMessage({ type: 'success', text: 'Cover image updated successfully!' })
    } catch (error) {
      setMessage({
        type: 'error',
        text: error.response?.data?.message || 'Failed to update cover image',
      })
      setCoverPreview(null)
    } finally {
      setLoading({ ...loading, cover: false })
    }
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle>Profile Images</CardTitle>
        <CardDescription>Update your avatar and cover image</CardDescription>
      </CardHeader>
      <CardContent className="space-y-6">
        {message.text && (
          <div
            className={`flex items-center gap-2 text-sm p-3 rounded-md ${
              message.type === 'success'
                ? 'bg-green-50 text-green-700 dark:bg-green-950 dark:text-green-400'
                : 'bg-destructive/10 text-destructive'
            }`}
          >
            {message.type === 'success' ? (
              <CheckCircle className="h-4 w-4" />
            ) : (
              <AlertCircle className="h-4 w-4" />
            )}
            <span>{message.text}</span>
          </div>
        )}

        {/* Avatar */}
        <div className="space-y-4">
          <label className="text-sm font-medium">Avatar</label>
          <div className="flex items-center gap-4">
            <div className="relative">
              {avatarPreview || user?.avatar ? (
                <img
                  src={avatarPreview || user.avatar}
                  alt="Avatar"
                  className="h-24 w-24 rounded-full object-cover"
                />
              ) : (
                <div className="h-24 w-24 rounded-full bg-primary flex items-center justify-center text-primary-foreground text-2xl font-bold">
                  {user?.username?.[0]?.toUpperCase() || 'U'}
                </div>
              )}
              {loading.avatar && (
                <div className="absolute inset-0 bg-background/50 rounded-full flex items-center justify-center">
                  <Loader2 className="h-6 w-6 animate-spin" />
                </div>
              )}
            </div>
            <label htmlFor="avatar" className="cursor-pointer">
              <div className="flex items-center gap-2 px-4 py-2 border rounded-md hover:bg-accent">
                <Upload className="h-4 w-4" />
                <span className="text-sm">Upload new avatar</span>
              </div>
              <Input
                id="avatar"
                type="file"
                accept="image/*"
                onChange={handleAvatarChange}
                className="hidden"
                disabled={loading.avatar}
              />
            </label>
          </div>
        </div>

        {/* Cover Image */}
        <div className="space-y-4">
          <label className="text-sm font-medium">Cover Image</label>
          <div className="space-y-4">
            <div className="relative">
              {coverPreview || user?.coverImage ? (
                <img
                  src={coverPreview || user.coverImage}
                  alt="Cover"
                  className="w-full h-48 rounded-lg object-cover"
                />
              ) : (
                <div className="w-full h-48 rounded-lg bg-gradient-to-r from-primary/20 to-primary/10" />
              )}
              {loading.cover && (
                <div className="absolute inset-0 bg-background/50 rounded-lg flex items-center justify-center">
                  <Loader2 className="h-6 w-6 animate-spin" />
                </div>
              )}
            </div>
            <label htmlFor="cover" className="cursor-pointer inline-block">
              <div className="flex items-center gap-2 px-4 py-2 border rounded-md hover:bg-accent w-fit">
                <Upload className="h-4 w-4" />
                <span className="text-sm">Upload new cover image</span>
              </div>
              <Input
                id="cover"
                type="file"
                accept="image/*"
                onChange={handleCoverChange}
                className="hidden"
                disabled={loading.cover}
              />
            </label>
          </div>
        </div>
      </CardContent>
    </Card>
  )
}

export default Settings
