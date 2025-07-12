const roleCheck = (role) => (req, res, next) => {
  if (req.user.role !== role) {
    return res.status(403).json({ msg: `Access denied. ${role} role required.` });
  }
  next();
};

export default roleCheck;
