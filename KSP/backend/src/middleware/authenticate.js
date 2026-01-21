const jwt = require('jsonwebtoken');

const authenticateToken = (req, res, next) => {
  try {
    const authHeader = req.headers['authorization'];
    const token = authHeader && authHeader.split(' ')[1];

    if (!token) {
      console.warn('🔑 Authentication failed: No Authorization header or Bearer token');
      return res.status(401).json({
        success: false,
        message: 'No token provided, authorization denied'
      });
    }

    try {
      const decoded = jwt.verify(token, process.env.JWT_SECRET);
      req.user = decoded;
      console.log('🔑 Authenticated user:', { id: decoded.id, email: decoded.email, role: decoded.role });
      next();
    } catch (error) {
      if (error.name === 'TokenExpiredError') {
        console.warn('🔑 Authentication failed: Token expired');
        return res.status(401).json({
          success: false,
          message: 'Token expired'
        });
      }
      console.warn('🔑 Authentication failed: Invalid token', { error: error.message });
      return res.status(403).json({
        success: false,
        message: 'Invalid token'
      });
    }
  } catch (error) {
    console.error('🔑 Authentication middleware error:', error);
    return res.status(500).json({
      success: false,
      message: 'Authentication failed',
      error: error.message
    });
  }
};

module.exports = authenticateToken;
