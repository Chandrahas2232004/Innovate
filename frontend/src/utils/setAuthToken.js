import axios from 'axios';

const setAuthToken = token => {
  if (token) {
    // Set the token in localStorage
    localStorage.setItem('token', token);
    
    // Set the token in axios headers
    axios.defaults.headers.common['x-auth-token'] = token;
    console.log('Auth token set:', token);
  } else {
    // Remove the token from localStorage
    localStorage.removeItem('token');
    
    // Remove the token from axios headers
    delete axios.defaults.headers.common['x-auth-token'];
    console.log('Auth token removed');
  }
};

export default setAuthToken;
