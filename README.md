# Innovate - Deployment Guide for Render

This guide will help you deploy your Innovate application to Render.

## Prerequisites

1. A Render account (sign up at [render.com](https://render.com))
2. A MongoDB database (you can use MongoDB Atlas for free)
3. Your code pushed to a Git repository (GitHub, GitLab, etc.)

## Deployment Steps

### Step 1: Prepare Your Database

1. **Set up MongoDB Atlas** (recommended for production):
   - Go to [MongoDB Atlas](https://www.mongodb.com/atlas)
   - Create a free account and cluster
   - Get your connection string
   - Replace `your_username`, `your_password`, and `your_cluster` in the connection string

### Step 2: Deploy Backend

1. **Connect your repository to Render**:
   - Log in to Render
   - Click "New +" → "Web Service"
   - Connect your Git repository
   - Select the repository containing your Innovate project

2. **Configure the backend service**:
   - **Name**: `innovate-backend`
   - **Root Directory**: `backend`
   - **Environment**: `Node`
   - **Build Command**: `npm install`
   - **Start Command**: `npm start`
   - **Plan**: Free

3. **Set Environment Variables**:
   - `MONGO_URI`: Your MongoDB connection string
   - `JWT_SECRET`: A secure random string for JWT signing
   - `NODE_ENV`: `production`

4. **Deploy**:
   - Click "Create Web Service"
   - Wait for the build to complete
   - Note the URL (e.g., `https://innovate-backend.onrender.com`)

### Step 3: Deploy Frontend

1. **Create another web service**:
   - Click "New +" → "Static Site"
   - Connect the same repository

2. **Configure the frontend service**:
   - **Name**: `innovate-frontend`
   - **Root Directory**: `frontend`
   - **Build Command**: `npm install && npm run build`
   - **Publish Directory**: `dist`
   - **Plan**: Free

3. **Set Environment Variables**:
   - `VITE_API_URL`: Your backend URL (e.g., `https://innovate-backend.onrender.com`)

4. **Deploy**:
   - Click "Create Static Site"
   - Wait for the build to complete
   - Your frontend will be available at the provided URL

### Step 4: Update CORS Settings (if needed)

If you encounter CORS issues, update your backend's CORS configuration in `backend/index.js`:

```javascript
app.use(cors({
  origin: ['https://your-frontend-url.onrender.com', 'http://localhost:3000'],
  credentials: true
}));
```

## Environment Variables Reference

### Backend (.env)
```
MONGO_URI=mongodb+srv://username:password@cluster.mongodb.net/innovate
JWT_SECRET=your_secure_jwt_secret_here
NODE_ENV=production
PORT=5000
```

### Frontend (.env)
```
VITE_API_URL=https://your-backend-url.onrender.com
```

## Troubleshooting

### Common Issues:

1. **Build Failures**:
   - Check that all dependencies are in `package.json`
   - Ensure build commands are correct
   - Check for syntax errors in your code

2. **Database Connection Issues**:
   - Verify your MongoDB connection string
   - Ensure your MongoDB cluster allows connections from anywhere (0.0.0.0/0)

3. **CORS Errors**:
   - Update CORS configuration to include your frontend URL
   - Check that environment variables are set correctly

4. **Environment Variables**:
   - Make sure all required environment variables are set in Render
   - Check that variable names match what your code expects

### Getting Help:

- Check Render logs in the dashboard
- Verify environment variables are set correctly
- Test your API endpoints using tools like Postman
- Check browser console for frontend errors

## Security Notes

1. **Never commit sensitive data** like API keys or database credentials
2. **Use environment variables** for all sensitive configuration
3. **Generate a strong JWT secret** for production
4. **Enable HTTPS** (Render provides this automatically)

## Monitoring

- Use Render's built-in logging to monitor your application
- Set up alerts for build failures
- Monitor your MongoDB Atlas dashboard for database performance

Your application should now be live on Render! 🚀 