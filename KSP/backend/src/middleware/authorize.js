const authorizeAdmin = (req, res, next) => {
  if (!req.user) {
    console.warn('🔐 Authorization failed: No req.user set by authenticate middleware');
    return res.status(403).json({
      success: false,
      message: 'Access denied. Admin privileges required.'
    });
  }
  if (req.user.role !== 'admin') {
    console.warn('🔐 Authorization failed: User role is not admin', { userId: req.user.id, role: req.user.role });
    return res.status(403).json({
      success: false,
      message: 'Access denied. Admin privileges required.'
    });
  }
  next();
};

module.exports = authorizeAdmin;
