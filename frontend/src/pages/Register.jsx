import { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { useAuth } from '../context/AuthContext'
import Button from '../components/ui/Button'
import Input from '../components/ui/Input'
import { AlertCircle, Upload, ArrowRight } from 'lucide-react'
import { motion } from 'framer-motion'
import logo from '../assets/logo.png'

const Register = () => {
  const [formData, setFormData] = useState({
    fullName: '',
    username: '',
    email: '',
    password: '',
    avatar: null,
    coverImage: null,
  })
  const [previews, setPreviews] = useState({
    avatar: null,
    coverImage: null,
  })
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(false)

  const { register } = useAuth()
  const navigate = useNavigate()

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    })
    setError('')
  }

  const handleFileChange = (e) => {
    const file = e.target.files[0]
    const fieldName = e.target.name

    if (file) {
      setFormData({
        ...formData,
        [fieldName]: file,
      })

      const reader = new FileReader()
      reader.onloadend = () => {
        setPreviews({
          ...previews,
          [fieldName]: reader.result,
        })
      }
      reader.readAsDataURL(file)
    }
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    setError('')

    if (!formData.avatar) {
      setError('Avatar image is required')
      return
    }

    setLoading(true)

    const data = new FormData()
    data.append('fullName', formData.fullName)
    data.append('username', formData.username)
    data.append('email', formData.email)
    data.append('password', formData.password)
    data.append('avatar', formData.avatar)
    if (formData.coverImage) {
      data.append('coverImage', formData.coverImage)
    }

    const result = await register(data)

    if (result.success) {
      navigate('/')
    } else {
      setError(result.error)
    }

    setLoading(false)
  }

  return (
    <div className="min-h-screen w-full flex">
      {/* Left Side - Form */}
      <div className="w-full lg:w-1/2 flex flex-col justify-center items-center p-8 lg:p-12 bg-background overflow-y-auto">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="w-full max-w-md space-y-8 my-auto"
        >
          <div className="flex items-center gap-2 text-primary mb-8">
            <img src={logo} alt="Streamify" className="h-10 w-10 rounded-lg object-cover" />
            <span className="font-bold text-2xl">Streamify</span>
          </div>

          <div className="space-y-2">
            <h1 className="text-3xl font-bold tracking-tight">Create an account</h1>
            <p className="text-muted-foreground">
              Enter your details to create your account
            </p>
          </div>

          <form onSubmit={handleSubmit} className="space-y-6">
            {error && (
              <motion.div
                initial={{ opacity: 0, height: 0 }}
                animate={{ opacity: 1, height: 'auto' }}
                className="flex items-center gap-2 text-sm text-destructive bg-destructive/10 p-3 rounded-xl"
              >
                <AlertCircle className="h-4 w-4 shrink-0" />
                <span>{error}</span>
              </motion.div>
            )}

            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <label className="text-sm font-medium leading-none">Full Name</label>
                <Input
                  name="fullName"
                  placeholder="John Doe"
                  value={formData.fullName}
                  onChange={handleChange}
                  required
                  disabled={loading}
                />
              </div>
              <div className="space-y-2">
                <label className="text-sm font-medium leading-none">Username</label>
                <Input
                  name="username"
                  placeholder="johndoe"
                  value={formData.username}
                  onChange={handleChange}
                  required
                  disabled={loading}
                />
              </div>
            </div>

            <div className="space-y-2">
              <label className="text-sm font-medium leading-none">Email</label>
              <Input
                name="email"
                type="email"
                placeholder="name@example.com"
                value={formData.email}
                onChange={handleChange}
                required
                disabled={loading}
              />
            </div>

            <div className="space-y-2">
              <label className="text-sm font-medium leading-none">Password</label>
              <Input
                name="password"
                type="password"
                placeholder="••••••••"
                value={formData.password}
                onChange={handleChange}
                required
                disabled={loading}
              />
            </div>

            <div className="space-y-4">
              <div className="space-y-2">
                <label className="text-sm font-medium leading-none">
                  Avatar Image <span className="text-destructive">*</span>
                </label>
                <label className="flex items-center gap-4 p-4 border-2 border-dashed border-input rounded-xl cursor-pointer hover:bg-accent/50 transition-colors group">
                  {previews.avatar ? (
                    <img
                      src={previews.avatar}
                      alt="Avatar preview"
                      className="h-16 w-16 rounded-full object-cover ring-2 ring-primary/20"
                    />
                  ) : (
                    <div className="h-16 w-16 rounded-full bg-secondary flex items-center justify-center group-hover:bg-secondary/80 transition-colors">
                      <Upload className="h-6 w-6 text-muted-foreground" />
                    </div>
                  )}
                  <div className="flex-1">
                    <p className="text-sm font-medium">Upload avatar</p>
                    <p className="text-xs text-muted-foreground">JPG, PNG or GIF. Max 2MB.</p>
                  </div>
                  <Input
                    name="avatar"
                    type="file"
                    accept="image/*"
                    onChange={handleFileChange}
                    className="hidden"
                    disabled={loading}
                  />
                </label>
              </div>

              <div className="space-y-2">
                <label className="text-sm font-medium leading-none">
                  Cover Image (Optional)
                </label>
                <label className="flex items-center justify-center h-32 border-2 border-dashed border-input rounded-xl cursor-pointer hover:bg-accent/50 transition-colors overflow-hidden group relative">
                  {previews.coverImage ? (
                    <img
                      src={previews.coverImage}
                      alt="Cover preview"
                      className="w-full h-full object-cover"
                    />
                  ) : (
                    <div className="text-center">
                      <Upload className="h-8 w-8 mx-auto mb-2 text-muted-foreground group-hover:scale-110 transition-transform" />
                      <span className="text-sm text-muted-foreground">Upload Cover Image</span>
                    </div>
                  )}
                  <Input
                    name="coverImage"
                    type="file"
                    accept="image/*"
                    onChange={handleFileChange}
                    className="hidden"
                    disabled={loading}
                  />
                </label>
              </div>
            </div>

            <Button type="submit" className="w-full" loading={loading}>
              Create account
              <ArrowRight className="ml-2 h-4 w-4" />
            </Button>

            <div className="text-center text-sm">
              <span className="text-muted-foreground">Already have an account? </span>
              <Link to="/login" className="font-medium text-primary hover:underline">
                Sign in
              </Link>
            </div>
          </form>
        </motion.div>
      </div>

      {/* Right Side - Image/Pattern */}
      <div className="hidden lg:block w-1/2 bg-muted relative overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-bl from-primary/20 to-secondary/20 backdrop-blur-3xl" />
        <div className="absolute inset-0 flex items-center justify-center p-12">
          <div className="relative w-full max-w-lg aspect-square">
            <div className="absolute inset-0 bg-gradient-to-bl from-primary to-purple-500 rounded-full opacity-20 blur-3xl animate-pulse" />
            <div className="relative z-10 bg-card/30 backdrop-blur-xl border border-white/10 p-8 rounded-3xl shadow-2xl">
              <div className="space-y-4">
                <div className="flex gap-4">
                  <div className="h-32 w-32 rounded-full bg-gradient-to-br from-primary/40 to-purple-500/40 animate-shimmer" />
                  <div className="flex-1 space-y-2 py-4">
                    <div className="h-4 w-3/4 rounded bg-white/10" />
                    <div className="h-4 w-1/2 rounded bg-white/10" />
                  </div>
                </div>
                <div className="h-32 rounded-2xl bg-white/5" />
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

export default Register
