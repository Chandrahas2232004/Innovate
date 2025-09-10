# Deployment Guide for Render

## Overview
This guide will help you deploy your Rural Innovation Platform to Render.

## Prerequisites
1. GitHub repository with your code
2. MongoDB Atlas cluster (already configured)
3. Render account

## Deployment Steps

### 1. Backend Deployment

1. **Connect your GitHub repository to Render**
   - Go to [Render Dashboard](https://dashboard.render.com)
   - Click "New +" → "Web Service"
   - Connect your GitHub repository

2. **Configure Backend Service**
   - **Name**: `innovate-backend`
   - **Environment**: `Node`
   - **Build Command**: `npm install`
   - **Start Command**: `npm start`
   - **Plan**: Free

3. **Environment Variables**
   Set these in the Render dashboard:
   ```
   NODE_ENV=production
   MONGO_URI=mongodb+srv://chandrahas1si22cs047_db_user:zgEzmi1JmL930GjU@cluster0.abxlwr9.mongodb.net/?retryWrites=true&w=majority&appName=Cluster0
   JWT_SECRET=your_super_secret_jwt_key_change_this_in_production_12345
   ```

4. **Deploy**
   - Click "Create Web Service"
   - Wait for deployment to complete
   - Note the URL (e.g., `https://innovate-backend.onrender.com`)

### 2. Frontend Deployment

1. **Create Static Site**
   - Go to Render Dashboard
   - Click "New +" → "Static Site"
   - Connect your GitHub repository

2. **Configure Frontend Service**
   - **Name**: `innovate-frontend`
   - **Build Command**: `npm install && npm run build`
   - **Publish Directory**: `dist`
   - **Plan**: Free

3. **Environment Variables**
   ```
   VITE_API_URL=https://innovate-backend.onrender.com
   ```
   (Replace with your actual backend URL)

4. **Deploy**
   - Click "Create Static Site"
   - Wait for deployment to complete

## Important Notes

### Backend Issues Fixed
1. ✅ **Missing Link Import**: Fixed in `IdeaForm.jsx`
2. ✅ **getIdeaById Return Value**: Fixed in `IdeasContext.jsx`
3. ✅ **MongoDB Atlas Connection**: Configured with your connection string
4. ✅ **Health Check Endpoint**: Added for Render monitoring

### Button Functionality
The button issues were caused by:
1. Missing `Link` import in `IdeaForm.jsx` - **FIXED**
2. Missing return value in `getIdeaById` function - **FIXED**
3. Proper error handling in context - **IMPROVED**

### Environment Configuration
- Backend: Uses MongoDB Atlas connection string
- Frontend: Points to deployed backend URL
- CORS: Configured to allow frontend requests

## Testing After Deployment

1. **Backend Health Check**
   - Visit: `https://your-backend-url.onrender.com/health`
   - Should return: `{"status":"OK","message":"Server is running"}`

2. **Frontend**
   - Visit your frontend URL
   - Test user registration/login
   - Test idea creation and viewing
   - Test button functionality

## Troubleshooting

### Common Issues
1. **CORS Errors**: Backend has CORS enabled for all origins
2. **Database Connection**: Check MongoDB Atlas IP whitelist (should allow all IPs: 0.0.0.0/0)
3. **Environment Variables**: Ensure all are set correctly in Render dashboard

### Render Free Tier Limitations
- Services may sleep after 15 minutes of inactivity
- First request after sleep may be slow (cold start)
- Consider upgrading to paid plan for production use

## Next Steps
1. Deploy backend first
2. Update frontend environment variable with backend URL
3. Deploy frontend
4. Test all functionality
5. Consider custom domain setup
