const jwt = require('jsonwebtoken');

const generateToken = (userId, role) => {
  try {
    const token = jwt.sign(
      { id: userId, role: role },
      process.env.JWT_SECRET,
      { expiresIn: process.env.JWT_EXPIRE || '7d' }
    );
    return token;
  } catch (error) {
    console.error('Generate token error:', error);
    throw new Error('Failed to generate token');
  }
};

const verifyToken = (token) => {
  try {
    return jwt.verify(token, process.env.JWT_SECRET);
  } catch (error) {
    return null;
  }
};

module.exports = {
  generateToken,
  verifyToken
};
