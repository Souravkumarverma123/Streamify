import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom'
import { AuthProvider } from './context/AuthContext'
import { ProtectedRoute } from './components/ProtectedRoute'
import Layout from './components/Layout'
import Login from './pages/Login'
import Register from './pages/Register'
import Home from './pages/Home'
import Profile from './pages/Profile'
import Channel from './pages/Channel'
import WatchHistory from './pages/WatchHistory'
import Settings from './pages/Settings'
import Upload from './pages/Upload'
import Playlists from './pages/Playlists'
import Watch from './pages/Watch'
import Videos from './pages/Videos'
import Dashboard from './pages/Dashboard'

function App() {
  return (
    <AuthProvider>
      <Router>
        <Routes>
          <Route path="/login" element={<Login />} />
          <Route path="/register" element={<Register />} />

          <Route path="/" element={<Layout />}>
            {/* Public Routes */}
            <Route index element={<Home />} />
            <Route path="channel/:username" element={<Channel />} />
            <Route path="watch/:videoId" element={<Watch />} />
            <Route path="videos" element={<Videos />} />

            {/* Protected Routes */}
            <Route path="profile" element={<ProtectedRoute><Profile /></ProtectedRoute>} />
            <Route path="channel" element={<ProtectedRoute><Channel /></ProtectedRoute>} />
            <Route path="history" element={<ProtectedRoute><WatchHistory /></ProtectedRoute>} />
            <Route path="settings" element={<ProtectedRoute><Settings /></ProtectedRoute>} />
            <Route path="upload" element={<ProtectedRoute><Upload /></ProtectedRoute>} />
            <Route path="playlists" element={<ProtectedRoute><Playlists /></ProtectedRoute>} />
            <Route path="dashboard" element={<ProtectedRoute><Dashboard /></ProtectedRoute>} />
          </Route>

          <Route path="*" element={<Navigate to="/" replace />} />
        </Routes>
      </Router>
    </AuthProvider>
  )
}

export default App
