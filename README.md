# 🌾 Rural Innovation Platform

A comprehensive web application that connects rural entrepreneurs with funders to bring innovative ideas to life. This platform facilitates the sharing, discovery, and funding of rural development projects.

## 🚀 Features

### **User Management**
- **Multi-role System**: Support for Startupers, Funders, and Viewers
- **Secure Authentication**: JWT-based authentication with role-based access
- **Profile Management**: Role-specific profiles with relevant information
- **Mobile Integration**: Mobile number collection for all users

### **Idea Management**
- **Idea Submission**: Startupers can submit innovative rural development ideas
- **Category Classification**: Agriculture, Education, Healthcare, Technology, Infrastructure, Other
- **Funding Requirements**: Specify required funding amounts
- **Success Rate Prediction**: ML-powered success rate prediction for ideas
- **Detailed Descriptions**: Comprehensive idea details including implementation plans

### **Funding System**
- **Interest Expression**: Funders can express interest in ideas
- **Real-time Counts**: Live tracking of interested funders
- **Funder Profiles**: Detailed funder information and preferences
- **Investment Ranges**: Predefined investment ranges for funders

### **Advanced Features**
- **ML Integration**: Success rate prediction using machine learning
- **Responsive Design**: Modern, mobile-friendly interface
- **Real-time Updates**: Live updates for interest counts and status
- **Search & Filter**: Advanced filtering and sorting capabilities

## 🛠️ Technology Stack

### **Backend**
- **Node.js** - Runtime environment
- **Express.js** - Web framework
- **MongoDB** - Database (with Compass for local development)
- **Mongoose** - ODM for MongoDB
- **JWT** - Authentication
- **bcrypt** - Password hashing
- **Machine Learning** - Success rate prediction

### **Frontend**
- **React.js** - UI library
- **React Router** - Client-side routing
- **Context API** - State management
- **Axios** - HTTP client
- **CSS3** - Modern styling with gradients and animations

## 📋 Prerequisites

Before running this project, make sure you have the following installed:

- **Node.js** (v14 or higher)
- **MongoDB Compass** (for local database)
- **Git** (for version control)

## 🚀 Installation & Setup

### **1. Clone the Repository**
```bash
git clone <repository-url>
cd rural-innovation-platform
```

### **2. Backend Setup**

Navigate to the backend directory:
```bash
cd backend
```

Install dependencies:
```bash
npm install
```

Create a `.env` file in the backend directory:
```env
MONGO_URI=mongodb://127.0.0.1:27017/innovate
PORT=5000
JWT_SECRET=your_jwt_secret_key_here
```

Start the backend server:
```bash
npm run dev
# or
npx nodemon index.js
```

### **3. Frontend Setup**

Open a new terminal and navigate to the frontend directory:
```bash
cd frontend
```

Install dependencies:
```bash
npm install
```

Start the frontend development server:
```bash
npm run dev
```

### **4. Database Setup**

1. **Open MongoDB Compass**
2. **Connect to**: `mongodb://127.0.0.1:27017`
3. **Create database**: `innovate`
4. **Collections will be created automatically** when you first use the application

## 🎯 Usage Guide

### **For Startupers (Innovators)**

1. **Register** as a "Startuper" with your details
2. **Fill in your profile** with location and expertise
3. **Submit ideas** with detailed descriptions
4. **Track interest** from potential funders
5. **Connect with funders** through the platform

### **For Funders (Investors)**

1. **Register** as a "Funder" with your investment preferences
2. **Set investment range** and preferred categories
3. **Browse ideas** using filters and search
4. **Express interest** in promising projects
5. **Connect with startupers** through profiles

### **For Viewers (Community Members)**

1. **Register** as a "Viewer" to explore the platform
2. **Browse ideas** and learn about rural innovations
3. **View profiles** of startupers and funders
4. **Stay updated** with the latest rural development projects

## 📁 Project Structure

```
rural-innovation-platform/
├── backend/
│   ├── models/
│   │   ├── User.js          # User schema with role-specific fields
│   │   └── Idea.js          # Idea schema with ML integration
│   ├── routes/
│   │   ├── auth.js          # Authentication routes
│   │   ├── ideas.js         # Idea management routes
│   │   └── users.js         # User profile routes
│   ├── middleware/
│   │   ├── auth.js          # JWT authentication middleware
│   │   └── roleCheck.js     # Role-based access control
│   ├── utils/
│   │   ├── mlModel.js       # Machine learning model
│   │   └── mlPredictor.js   # Success rate prediction
│   ├── index.js             # Main server file
│   └── package.json
├── frontend/
│   ├── src/
│   │   ├── components/
│   │   │   ├── auth/        # Login/Register components
│   │   │   ├── dashboard/   # Dashboard components
│   │   │   ├── ideas/       # Idea management components
│   │   │   ├── layout/      # Navigation and layout
│   │   │   └── profile/     # User profile components
│   │   ├── context/         # React Context for state management
│   │   ├── utils/           # Utility functions
│   │   ├── App.jsx          # Main application component
│   │   └── main.jsx         # Application entry point
│   ├── public/              # Static assets
│   └── package.json
└── README.md
```

## 🔧 Configuration

### **Environment Variables**

**Backend (.env)**
```env
MONGO_URI=mongodb://127.0.0.1:27017/innovate
PORT=5000
JWT_SECRET=your_secure_jwt_secret_here
```

### **Database Configuration**

The application uses MongoDB with the following collections:
- **users**: User profiles and authentication data
- **ideas**: Submitted ideas with metadata and interest tracking

## 🎨 Key Features Explained

### **1. Role-Based System**

**Startupers (Innovators)**
- Submit rural development ideas
- Track funder interest
- Manage idea details
- Connect with potential funders

**Funders (Investors)**
- Browse and filter ideas
- Express interest in projects
- Set investment preferences
- Connect with startupers

**Viewers (Community)**
- Explore ideas and profiles
- Learn about rural innovations
- Stay updated with projects

### **2. Machine Learning Integration**

The platform includes ML-powered success rate prediction:
- Analyzes idea characteristics
- Provides success probability
- Explains prediction factors
- Helps funders make informed decisions

### **3. Real-time Updates**

- Live interest count updates
- Instant UI feedback
- Real-time data synchronization
- Responsive user experience

## 🚀 Deployment

### **Local Development**
```bash
# Backend
cd backend
npm run dev

# Frontend (in new terminal)
cd frontend
npm run dev
```

### **Production Deployment**

1. **Backend Deployment**
   - Set up MongoDB Atlas or production MongoDB
   - Configure environment variables
   - Deploy to Heroku, Vercel, or similar

2. **Frontend Deployment**
   - Build the project: `npm run build`
   - Deploy to Netlify, Vercel, or similar
   - Configure API endpoints

## 🔒 Security Features

- **JWT Authentication**: Secure token-based authentication
- **Password Hashing**: bcrypt for secure password storage
- **Role-Based Access**: Different permissions for different user types
- **Input Validation**: Server-side validation for all inputs
- **CORS Configuration**: Proper cross-origin resource sharing

## 🧪 Testing

### **Manual Testing Checklist**

1. **User Registration**
   - [ ] Register as Startuper
   - [ ] Register as Funder
   - [ ] Register as Viewer
   - [ ] Verify role-specific fields

2. **Idea Management**
   - [ ] Submit new idea
   - [ ] Edit existing idea
   - [ ] Delete idea
   - [ ] View idea details

3. **Interest System**
   - [ ] Express interest as funder
   - [ ] Verify interest count updates
   - [ ] Check interest status
   - [ ] View interested funders

4. **Profile Management**
   - [ ] View user profiles
   - [ ] Edit profile information
   - [ ] Browse user ideas

## 🐛 Troubleshooting

### **Common Issues**

1. **MongoDB Connection Error**
   - Ensure MongoDB Compass is running
   - Check connection string in .env
   - Verify database name is correct

2. **Frontend Not Loading**
   - Check if backend is running on port 5000
   - Verify axios configuration
   - Check browser console for errors

3. **Interest Count Not Updating**
   - Check browser console for debugging info
   - Verify backend logs
   - Ensure proper data refresh

### **Debug Mode**

The application includes comprehensive debugging:
- Console logs for API calls
- Frontend state tracking
- Backend request/response logging
- Database operation tracking

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Test thoroughly
5. Submit a pull request

## 📄 License

This project is licensed under the MIT License.

## 📞 Support

For support and questions:
- Check the troubleshooting section
- Review the console logs for debugging
- Ensure all prerequisites are installed
- Verify environment configuration

## 🎯 Future Enhancements

- **Real-time Chat**: Direct messaging between users
- **File Uploads**: Support for project documents and images
- **Advanced Analytics**: Detailed project analytics and insights
- **Mobile App**: Native mobile application
- **Payment Integration**: Direct payment processing
- **Notification System**: Email and push notifications

---

**Built with ❤️ for rural development and innovation** 