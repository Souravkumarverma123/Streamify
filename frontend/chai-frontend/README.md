# Streamify - Frontend

A modern, full-featured video streaming platform frontend built with React, Vite, and Tailwind CSS.

## 🚀 Features

- **Authentication System**
  - User registration with avatar and cover image upload
  - Login with email or username
  - JWT-based authentication with automatic token refresh
  - Protected routes

- **User Management**
  - View and edit profile
  - Update account details (name, email)
  - Change password
  - Update avatar and cover images

- **Channel System**
  - View channel profiles with subscriber counts
  - Channel statistics display
  - Subscribe/unsubscribe functionality (UI ready)

- **Watch History**
  - Track and display watched videos
  - View video details and thumbnails

- **Modern UI/UX**
  - Responsive design for all screen sizes
  - Dark mode support
  - Beautiful gradient backgrounds
  - Smooth animations and transitions
  - Professional card-based layouts

## 🛠️ Tech Stack

- **React 18.3** - UI library
- **Vite 5.4** - Build tool and dev server
- **React Router 6** - Client-side routing
- **Tailwind CSS 3.4** - Utility-first CSS framework
- **Axios** - HTTP client
- **Lucide React** - Icon library

## 📦 Installation

1. **Install dependencies:**
   ```bash
   npm install
   ```

2. **Start the development server:**
   ```bash
   npm run dev
   ```

   The app will be available at `http://localhost:3000`

3. **Build for production:**
   ```bash
   npm run build
   ```

4. **Preview production build:**
   ```bash
   npm run preview
   ```

## 🔧 Configuration

### Backend Connection

The frontend is configured to proxy API requests to the backend server. The proxy is set up in `vite.config.js`:

```javascript
server: {
  port: 3000,
  proxy: {
    '/api': {
      target: 'http://localhost:8000',
      changeOrigin: true,
    },
  },
}
```

**Make sure your backend server is running on `http://localhost:8000`** before starting the frontend.

### Environment Variables

Create a `.env` file (optional) if you need custom configuration:

```env
VITE_API_URL=http://localhost:8000/api/v1
```

## 📁 Project Structure

```
chai-frontend/
├── src/
│   ├── api/              # API service layers
│   │   ├── axios.js      # Axios instance with interceptors
│   │   ├── auth.js       # Authentication API calls
│   │   └── user.js       # User-related API calls
│   ├── components/       # Reusable components
│   │   ├── ui/          # UI components (Button, Input, Card)
│   │   ├── Layout.jsx   # Main layout with header
│   │   └── ProtectedRoute.jsx
│   ├── context/         # React Context
│   │   └── AuthContext.jsx
│   ├── lib/             # Utility functions
│   │   └── utils.js
│   ├── pages/           # Page components
│   │   ├── Login.jsx
│   │   ├── Register.jsx
│   │   ├── Home.jsx
│   │   ├── Profile.jsx
│   │   ├── Channel.jsx
│   │   ├── WatchHistory.jsx
│   │   └── Settings.jsx
│   ├── App.jsx          # Main app component
│   ├── main.jsx         # Entry point
│   └── index.css        # Global styles
├── public/              # Static assets
├── index.html           # HTML template
├── vite.config.js       # Vite configuration
├── tailwind.config.js   # Tailwind configuration
└── package.json
```

## 🎯 Available Routes

- `/login` - Login page
- `/register` - Registration page
- `/` - Home dashboard (protected)
- `/profile` - User profile page (protected)
- `/channel/:username` - Channel profile page (protected)
- `/history` - Watch history (protected)
- `/settings` - Account settings (protected)

## 🔐 Authentication Flow

1. User registers or logs in
2. Backend returns JWT tokens (access + refresh)
3. Tokens are stored in HTTP-only cookies
4. Axios interceptor automatically handles token refresh
5. Protected routes check authentication status

## 🎨 UI Components

### Custom Components

- **Button** - Multiple variants (default, outline, destructive, ghost, link)
- **Input** - Styled form inputs with focus states
- **Card** - Container components with header, content, and footer

### Icons

Using Lucide React for beautiful, consistent icons:
- User, Video, Settings, History, Home, etc.

## 🚧 Features in Development

The following features have UI placeholders but need backend implementation:

- Video upload and management
- Comment system
- Like/unlike functionality
- Tweet/post creation
- Playlist management
- Search functionality
- Video recommendations

## 🤝 Backend Integration

This frontend is designed to work with the Streamify Backend API. Ensure the backend is running with the following endpoints:

**Auth:**
- `POST /api/v1/users/register`
- `POST /api/v1/users/login`
- `POST /api/v1/users/logout`
- `POST /api/v1/users/refresh-token`
- `GET /api/v1/users/current-user`

**User:**
- `POST /api/v1/users/change-password`
- `PATCH /api/v1/users/update-account`
- `PATCH /api/v1/users/avatar`
- `PATCH /api/v1/users/cover-image`
- `GET /api/v1/users/c/:username`
- `GET /api/v1/users/history`

## 📝 Development Tips

1. **Hot Module Replacement (HMR)** is enabled - changes will reflect instantly
2. **Console errors** are displayed in the browser console
3. **Network requests** can be monitored in browser DevTools
4. **Responsive design** can be tested using browser DevTools device toolbar

## 🎨 Customization

### Colors

Edit `tailwind.config.js` and `src/index.css` to customize the color scheme.

### Components

All UI components are in `src/components/ui/` and can be easily customized.

## 🐛 Troubleshooting

**Issue:** API requests fail with CORS errors
- **Solution:** Ensure backend has CORS enabled for `http://localhost:3000`

**Issue:** Login redirects to login page repeatedly
- **Solution:** Check if backend cookies are being set with correct domain/path

**Issue:** Images not uploading
- **Solution:** Verify backend accepts `multipart/form-data` and Cloudinary is configured

## 📄 License

ISC

## 👨‍💻 Author

Sourav Kumar Verma

---

Built with ❤️ using React + Vite + Tailwind CSS
