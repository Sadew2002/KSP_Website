require('dotenv').config();
const express = require('express');
const cors = require('cors');
const helmet = require('helmet');
const rateLimit = require('express-rate-limit');
const { sequelize } = require('./models');
const authenticateToken = require('./middleware/authenticate');
const errorHandler = require('./middleware/errorHandler');

const app = express();

// Security Middleware - Allow images to load
app.use(helmet({
  crossOriginResourcePolicy: { policy: "cross-origin" },
  crossOriginEmbedderPolicy: false,
}));

// CORS Configuration - Allow multiple origins
const allowedOrigins = [
  'http://localhost:3000',
  'http://localhost:3001',
  'http://localhost:3002',
  process.env.CORS_ORIGIN
].filter(Boolean);

app.use(cors({
  origin: function(origin, callback) {
    // Allow requests with no origin (like mobile apps or curl requests)
    if (!origin) return callback(null, true);
    if (allowedOrigins.indexOf(origin) !== -1) {
      callback(null, true);
    } else {
      callback(null, true); // Allow all origins in development
    }
  },
  credentials: true,
  optionsSuccessStatus: 200
}));

// Rate Limiting
const limiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 100, // limit each IP to 100 requests per windowMs
  message: 'Too many requests from this IP, please try again later.'
});

const authLimiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 5, // limit login attempts
  skipSuccessfulRequests: true,
  message: 'Too many login attempts, please try again later.'
});

app.use('/api/', limiter);
app.use('/api/auth/', authLimiter);

// Body Parsing Middleware
app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ limit: '10mb', extended: true }));

// Health Check Endpoint
app.get('/health', (req, res) => {
  res.json({
    status: 'API is running',
    timestamp: new Date().toISOString()
  });
});

// Database Connection
sequelize.authenticate()
  .then(() => {
    console.log('✓ Database connected successfully');
  })
  .catch((error) => {
    console.error('✗ Database connection failed:', error.message);
    console.log('\n⚠️  Please make sure PostgreSQL is running:');
    console.log('   Windows: postgresql-x64-*\\bin\\pg_ctl -D "<PostgreSQL data folder>" start');
    console.log('   Or use: net start postgresql-x64-15 (or your version)');
    console.log(`\n📋 Connection string: postgresql://${process.env.DB_USER}:****@${process.env.DB_HOST}:${process.env.DB_PORT}/${process.env.DB_NAME}`);
    console.log('\nℹ️  Server will continue running, but API calls requiring DB will fail.\n');
  });

// Sync Models - disabled alter to avoid issues with existing tables
// Tables are already created, no need to sync
// if (process.env.NODE_ENV === 'development') {
//   sequelize.sync({ alter: true })
//     .then(() => {
//       console.log('✓ Database models synced');
//     })
//     .catch((error) => {
//       console.error('✗ Database sync failed:', error);
//     });
// }

// Serve static files (uploaded images) with CORS headers
const path = require('path');
app.use('/uploads', (req, res, next) => {
  res.header('Access-Control-Allow-Origin', '*');
  res.header('Cross-Origin-Resource-Policy', 'cross-origin');
  next();
}, express.static(path.join(__dirname, '../uploads')));

app.use('/images', (req, res, next) => {
  res.header('Access-Control-Allow-Origin', '*');
  res.header('Cross-Origin-Resource-Policy', 'cross-origin');
  next();
}, express.static(path.join(__dirname, '../public/images')));

// API Routes
// Authentication Routes (public)
app.use('/api/auth', require('./routes/authRoutes'));

// Upload Routes (protected)
app.use('/api/upload', authenticateToken, require('./routes/uploadRoutes'));

// Protected Routes
app.use('/api/products', require('./routes/productRoutes'));
app.use('/api/cart', authenticateToken, require('./routes/cartRoutes'));
app.use('/api/orders', authenticateToken, require('./routes/orderRoutes'));
app.use('/api/payments', authenticateToken, require('./routes/paymentRoutes'));

// Admin Routes (protected)
app.use('/api/admin/products', authenticateToken, require('./routes/adminProductRoutes'));
app.use('/api/admin/orders', authenticateToken, require('./routes/adminOrderRoutes'));
app.use('/api/admin/users', authenticateToken, require('./routes/adminUserRoutes'));
app.use('/api/admin/reports', authenticateToken, require('./routes/adminReportRoutes'));

// 404 Handler
app.use((req, res) => {
  res.status(404).json({
    success: false,
    message: 'Route not found'
  });
});

// Error Handler Middleware
app.use(errorHandler);

// Start Server
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`\n🚀 Server running on http://localhost:${PORT}`);
  console.log(`Environment: ${process.env.NODE_ENV || 'development'}\n`);
});

// Graceful Shutdown
process.on('SIGTERM', async () => {
  console.log('SIGTERM signal received: closing HTTP server');
  await sequelize.close();
  process.exit(0);
});

module.exports = app;
