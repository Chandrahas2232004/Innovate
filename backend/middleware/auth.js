import jwt from 'jsonwebtoken';

const auth = (req, res, next) => {
  // Get token from header
  const token = req.header('x-auth-token');
  console.log('Auth middleware: Token received:', token ? 'Yes' : 'No');

  // Check if no token
  if (!token) {
    console.log('No token provided in request');
    return res.status(401).json({ msg: 'No token, authorization denied' });
  }

  // Verify token
  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    console.log('Auth middleware: Token decoded successfully, user:', decoded.user);
    req.user = decoded.user;
    next();
  } catch (err) {
    console.log('Invalid token:', err.message);
    res.status(401).json({ msg: 'Token is not valid' });
  }
};

export default auth;


