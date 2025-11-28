# Chai Video - YouTube Clone

A full-stack YouTube clone built with React, Node.js, Express, and MongoDB. Features user authentication, video management, social features, and a modern responsive UI.

## 🚀 Quick Start

### Prerequisites
- Node.js (v16 or higher)
- npm or yarn
- MongoDB (local or Atlas)

### Installation

1. **Clone and setup:**
   ```bash
   git clone <your-repo-url>
   cd chai_youtube
   chmod +x setup.sh
   ./setup.sh
   ```

2. **Configure Environment:**
   
   Update `chai-backend/env` with your configuration:
   ```env
   # Database Configuration
   MONGODB_URL=mongodb://localhost:27017
   # OR for MongoDB Atlas:
   # MONGODB_URL=mongodb+srv://username:password@cluster.mongodb.net

   # JWT Configuration
   ACCESS_TOKEN_SECRET=your_very_long_and_secure_access_token_secret_key_here
   REFRESH_TOKEN_SECRET=your_very_long_and_secure_refresh_token_secret_key_here
   ACCESS_TOKEN_EXPIRY=15m
   REFRESH_TOKEN_EXPIRY=7d

   # Server Configuration
   PORT=8000
   CORS_ORIGIN=http://localhost:3000

   # Cloudinary Configuration (for file uploads)
   CLOUDINARY_CLOUD_NAME=your_cloudinary_cloud_name
   CLOUDINARY_API_KEY=your_cloudinary_api_key
   CLOUDINARY_API_SECRET=your_cloudinary_api_secret
   ```

3. **Start MongoDB:**
   
   **Option A: Local MongoDB**
   ```bash
   # Install MongoDB
   brew tap mongodb/brew
   brew install mongodb-community
   brew services start mongodb/brew/mongodb-community
   ```
   
   **Option B: MongoDB Atlas (Recommended)**
   - Go to [MongoDB Atlas](https://cloud.mongodb.com)
   - Create a free cluster
   - Get connection string
   - Update `MONGODB_URL` in `chai-backend/env`

4. **Start the applications:**
   
   **Terminal 1 - Backend:**
   ```bash
   cd chai-backend
   npm run dev
   ```
   
   **Terminal 2 - Frontend:**
   ```bash
   cd chai-frontend
   npm run dev
   ```

5. **Access the application:**
   - Frontend: http://localhost:3000
   - Backend API: http://localhost:8000

## 🏗️ Project Structure

```
chai_youtube/
├── chai-backend/          # Node.js/Express API
│   ├── src/
│   │   ├── controllers/   # Route handlers
│   │   ├── models/        # MongoDB schemas
│   │   ├── routes/        # API routes
│   │   ├── middlewares/   # Auth, file upload
│   │   └── utils/         # Helper functions
│   └── env               # Environment variables
├── chai-frontend/         # React application
│   ├── src/
│   │   ├── api/          # API service layer
│   │   ├── components/   # Reusable components
│   │   ├── pages/        # Page components
│   │   └── context/      # React context
└── setup.sh             # Setup script
```

## 🎯 Features

### ✅ Implemented:
- User authentication (register/login)
- User profile management
- Avatar and cover image uploads
- Channel profiles with subscription logic
- Watch history tracking
- Modern responsive UI
- JWT-based security

### 🚧 In Development:
- Video upload and streaming
- Comment system
- Like/unlike functionality
- Video recommendations
- Search functionality
- Playlist management

## 🔧 API Endpoints

### Authentication
- `POST /api/v1/users/register` - User registration
- `POST /api/v1/users/login` - User login
- `POST /api/v1/users/logout` - User logout
- `POST /api/v1/users/refresh-token` - Refresh access token

### User Management
- `GET /api/v1/users/current-user` - Get current user
- `PATCH /api/v1/users/update-account` - Update account details
- `POST /api/v1/users/change-password` - Change password
- `PATCH /api/v1/users/avatar` - Update avatar
- `PATCH /api/v1/users/cover-image` - Update cover image

### Channel & History
- `GET /api/v1/users/c/:username` - Get channel profile
- `GET /api/v1/users/history` - Get watch history

## 🛠️ Tech Stack

### Backend
- **Node.js** - Runtime environment
- **Express.js** - Web framework
- **MongoDB** - Database
- **Mongoose** - ODM
- **JWT** - Authentication
- **Cloudinary** - File storage
- **Multer** - File upload handling

### Frontend
- **React 18** - UI library
- **Vite** - Build tool
- **React Router** - Client-side routing
- **Tailwind CSS** - Styling
- **Axios** - HTTP client
- **Lucide React** - Icons

## 🐛 Troubleshooting

### Common Issues

1. **MongoDB Connection Error:**
   - Ensure MongoDB is running
   - Check connection string in `env` file
   - Verify network access (for Atlas)

2. **CORS Errors:**
   - Check `CORS_ORIGIN` in backend env
   - Ensure frontend is running on correct port

3. **File Upload Issues:**
   - Verify Cloudinary credentials
   - Check file size limits
   - Ensure proper file types

4. **Authentication Issues:**
   - Check JWT secrets in env file
   - Verify token expiration settings
   - Clear browser cookies if needed

### Development Tips

- Use browser DevTools to monitor network requests
- Check console for error messages
- Verify environment variables are loaded
- Test API endpoints with Postman/Insomnia

## 📝 Environment Variables

### Backend (`chai-backend/env`)
```env
MONGODB_URL=mongodb://localhost:27017
ACCESS_TOKEN_SECRET=your_secret_key
REFRESH_TOKEN_SECRET=your_secret_key
ACCESS_TOKEN_EXPIRY=15m
REFRESH_TOKEN_EXPIRY=7d
PORT=8000
CORS_ORIGIN=http://localhost:3000
CLOUDINARY_CLOUD_NAME=your_cloud_name
CLOUDINARY_API_KEY=your_api_key
CLOUDINARY_API_SECRET=your_api_secret
```

## 🚀 Deployment

### Backend Deployment
1. Set up MongoDB Atlas cluster
2. Configure environment variables
3. Deploy to Heroku, Railway, or Vercel
4. Update CORS_ORIGIN for production domain

### Frontend Deployment
1. Build the application: `npm run build`
2. Deploy to Vercel, Netlify, or GitHub Pages
3. Update API base URL for production

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Test thoroughly
5. Submit a pull request

## 📄 License

ISC License - see LICENSE file for details

## 👨‍💻 Author

Sourav Kumar Verma

---

**Happy Coding! 🎉**
# chai-video
# chai-video
