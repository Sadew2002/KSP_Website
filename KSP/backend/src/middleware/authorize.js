const authorizeAdmin = (req, res, next) => {
  try {
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
  } catch (error) {
    console.error('🔐 Authorization middleware error:', error);
    return res.status(500).json({
      success: false,
      message: 'Authorization failed',
      error: error.message
    });
  }
};

module.exports = authorizeAdmin;
