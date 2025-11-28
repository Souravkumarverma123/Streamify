# 🚀 Chai Video Setup Guide

## Quick Start (5 minutes)

### 1. Prerequisites Check
```bash
# Check if Node.js is installed
node --version
npm --version
```

### 2. Install Dependencies
```bash
# Run the setup script
./setup.sh
```

### 3. Database Setup (Choose One)

#### Option A: MongoDB Atlas (Recommended - No Installation Required)
1. Go to [MongoDB Atlas](https://cloud.mongodb.com)
2. Create a free account
3. Create a new cluster (free tier)
4. Get connection string
5. Update `chai-backend/env`:
   ```env
   MONGODB_URL=mongodb+srv://username:password@cluster.mongodb.net
   ```

#### Option B: Local MongoDB
```bash
# Try the MongoDB starter script
./start-mongodb.sh
```

#### Option C: Docker (if installed)
```bash
docker run -d --name mongodb -p 27017:27017 mongo:latest
```

### 4. Start Applications

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

### 5. Test Connection
```bash
node test-connection.js
```

## 🔧 Configuration

### Environment Variables (`chai-backend/env`)
```env
# Database
MONGODB_URL=mongodb://localhost:27017

# JWT Secrets (generate secure keys)
ACCESS_TOKEN_SECRET=your_very_long_and_secure_access_token_secret_key_here
REFRESH_TOKEN_SECRET=your_very_long_and_secure_refresh_token_secret_key_here
ACCESS_TOKEN_EXPIRY=15m
REFRESH_TOKEN_EXPIRY=7d

# Server
PORT=8000
CORS_ORIGIN=http://localhost:3000

# Cloudinary (for file uploads)
CLOUDINARY_CLOUD_NAME=your_cloud_name
CLOUDINARY_API_KEY=your_api_key
CLOUDINARY_API_SECRET=your_api_secret
```

## 🐛 Troubleshooting

### MongoDB Connection Issues
```bash
# Check if MongoDB is running
pgrep mongod

# Start MongoDB manually
mongod --dbpath ./data/db

# Or use Docker
docker start mongodb
```

### Port Conflicts
```bash
# Check what's using port 8000
lsof -i :8000

# Check what's using port 3000
lsof -i :3000
```

### CORS Issues
- Ensure `CORS_ORIGIN=http://localhost:3000` in backend env
- Check that frontend is running on port 3000

### File Upload Issues
- Verify Cloudinary credentials
- Check file size limits
- Ensure proper file types

## 🧪 Testing

### Manual Testing
1. Open http://localhost:3000
2. Register a new account
3. Login with credentials
4. Test profile updates
5. Check browser DevTools for errors

### API Testing
```bash
# Test backend health
curl http://localhost:8000/api/v1/users/current-user

# Should return 401 (unauthorized) - this is expected
```

## 📱 Access Points

- **Frontend**: http://localhost:3000
- **Backend API**: http://localhost:8000
- **API Documentation**: http://localhost:8000/api/v1

## 🎯 Features to Test

1. **Authentication**
   - User registration
   - User login
   - Profile management
   - Password change

2. **File Uploads**
   - Avatar upload
   - Cover image upload
   - File validation

3. **Channel System**
   - Channel profiles
   - Subscription logic
   - Watch history

## 🚨 Common Issues & Solutions

### Issue: "MongoDB connection failed"
**Solution**: 
- Check if MongoDB is running
- Verify connection string
- Try MongoDB Atlas instead

### Issue: "CORS error"
**Solution**:
- Check CORS_ORIGIN in backend env
- Ensure frontend is on correct port

### Issue: "File upload failed"
**Solution**:
- Check Cloudinary credentials
- Verify file size limits
- Check file types

### Issue: "Authentication failed"
**Solution**:
- Check JWT secrets in env
- Clear browser cookies
- Verify token expiration

## 🎉 Success Indicators

✅ Backend starts without errors  
✅ Frontend loads at localhost:3000  
✅ Can register new user  
✅ Can login with credentials  
✅ Can update profile  
✅ No console errors  

## 📞 Need Help?

1. Check the main README.md
2. Run `node test-connection.js`
3. Check browser DevTools console
4. Verify all environment variables
5. Ensure MongoDB is running

---

**Happy Coding! 🚀**
