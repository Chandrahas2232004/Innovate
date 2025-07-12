import { useEffect, useContext } from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { AuthContext, AuthProvider } from './context/AuthContext';
import { IdeasProvider } from './context/IdeasContext';
import Navbar from './components/layout/Navbar';
import Home from './components/pages/Home';
import Register from './components/auth/Register';
import Login from './components/auth/Login';
import Dashboard from './components/dashboard/Dashboard';
import IdeaForm from './components/ideas/IdeaForm';
import IdeaDetail from './components/ideas/IdeaDetail';
import PrivateRoute from './components/routing/PrivateRoute';
import Alert from './components/layout/Alert';
import { AlertProvider } from './context/AlertContext';
import NotFound from './components/pages/NotFound';
import Profile from './components/profile/Profile';
import EditProfile from './components/profile/EditProfile';
import Ideas from './components/ideas/Ideas';
import setAuthToken from './utils/setAuthToken';

// Check for token in localStorage and set it in headers
if (localStorage.token) {
  setAuthToken(localStorage.token);
}

function App() {
  return (
    <AuthProvider>
      <AlertProvider>
        <IdeasProvider>
          <Router>
            <AppContent />
          </Router>
        </IdeasProvider>
      </AlertProvider>
    </AuthProvider>
  );
}

// Separate component to use hooks with context
function AppContent() {
  const { loadUser } = useContext(AuthContext);
  
  useEffect(() => {
    // Load user data when app first mounts
    if (localStorage.token) {
      loadUser();
    }
  }, []);
  
  return (
    <div className="App">
      <Navbar />
      <div className="container">
        <Alert />
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/register" element={<Register />} />
          <Route path="/login" element={<Login />} />
          <Route path="/ideas" element={<Ideas />} />
          <Route path="/ideas/:id" element={<IdeaDetail />} />
          <Route path="/dashboard" element={
            <PrivateRoute>
              <Dashboard />
            </PrivateRoute>
          } />
          <Route path="/create-idea" element={
            <PrivateRoute>
              <IdeaForm />
            </PrivateRoute>
          } />
          <Route path="/edit-idea/:id" element={
            <PrivateRoute>
              <IdeaForm />
            </PrivateRoute>
          } />
          <Route path="/profile/:id" element={<Profile />} />
          <Route path="/edit-profile" element={
            <PrivateRoute>
              <EditProfile />
            </PrivateRoute>
          } />
          <Route path="*" element={<NotFound />} />
        </Routes>
      </div>
    </div>
  );
}

export default App;




