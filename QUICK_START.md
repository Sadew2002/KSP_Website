# 🚀 Quick Start Guide - MongoDB Database Migration

## What's Been Done

Your KSP e-commerce backend has been **completely migrated from PostgreSQL + Sequelize to MongoDB + Mongoose**. All 10 backend routes have been updated and are ready to use.

---

## ✅ Completed Tasks

- ✅ Removed PostgreSQL dependencies (pg, pg-hstore, sequelize)
- ✅ Added Mongoose (MongoDB ODM)
- ✅ Converted all 6 data models to Mongoose
- ✅ Updated all 10 route files (auth, products, cart, orders, payments, admin)
- ✅ Converted seed data script
- ✅ Updated database initialization script
- ✅ Fixed deprecation warnings
- ✅ Created comprehensive documentation

---

## 🎯 Getting Started (3 Steps)

### Step 1️⃣: Ensure MongoDB is Running

**Windows:**
```powershell
mongod
```

Or if MongoDB is installed as a service:
```powershell
net start "MongoDB Server"
```

**macOS (Homebrew):**
```bash
brew services start mongodb-community
```

**Linux:**
```bash
sudo systemctl start mongod
```

### Step 2️⃣: Initialize Database & Load Seed Data

```bash
cd backend

# Initialize database collections and indexes
npm run init-db

# Populate sample data
npm run seed
```

**This creates:**
- Admin user: `admin@ksp.com` / `admin123`
- Customer user: `customer@example.com` / `customer123`
- 12 sample products (mix of brands and conditions)

### Step 3️⃣: Start Development Server

```bash
npm run dev
```

Server will run on: **http://localhost:5000**

---

## 🧪 Quick Test

### 1. Test Server is Running
```bash
curl http://localhost:5000/api/products
```

### 2. Test Login
```bash
curl -X POST http://localhost:5000/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{"email":"admin@ksp.com","password":"admin123"}'
```

You'll get a JWT token in the response. Copy it for authenticated requests.

### 3. Test Protected Route (Cart)
```bash
curl -X GET http://localhost:5000/api/cart \
  -H "Authorization: Bearer YOUR_JWT_TOKEN_HERE"
```

---

## 📁 Key Files Changed

### Database Configuration
- **`backend/.env`** - MongoDB URI and settings
- **`backend/src/config/mongodb.js`** - MongoDB connection handler

### Models (All Updated)
- `backend/src/models/User.js`
- `backend/src/models/Product.js`
- `backend/src/models/Cart.js`
- `backend/src/models/Order.js`
- `backend/src/models/OrderItem.js`
- `backend/src/models/Payment.js`
- `backend/src/models/index.js`

### Routes (All Updated)
- `backend/src/routes/authRoutes.js`
- `backend/src/routes/productRoutes.js`
- `backend/src/routes/cartRoutes.js`
- `backend/src/routes/orderRoutes.js`
- `backend/src/routes/paymentRoutes.js`
- `backend/src/routes/adminProductRoutes.js`
- `backend/src/routes/adminOrderRoutes.js`
- `backend/src/routes/adminUserRoutes.js`
- `backend/src/routes/adminReportRoutes.js`

### Scripts
- **`backend/src/server.js`** - MongoDB connection
- **`backend/src/initDb.js`** - Database initialization
- **`backend/src/seedData.js`** - Seed data script
- **`backend/package.json`** - Updated scripts and dependencies

---

## 📚 API Endpoints Available

### Public Endpoints
```
GET    /api/products           - List products with filters
GET    /api/products/:id       - Get product details
GET    /api/products/brands    - Get unique brands
POST   /api/auth/register      - Register new user
POST   /api/auth/login         - Login user
```

### Protected Endpoints (Require JWT Token)
```
GET    /api/cart               - Get user's cart
POST   /api/cart/add           - Add product to cart
PUT    /api/cart/update/:id    - Update cart item
DELETE /api/cart/remove/:id    - Remove from cart
DELETE /api/cart/clear         - Clear entire cart

GET    /api/orders             - Get user's orders
GET    /api/orders/:id         - Get order details
POST   /api/orders/checkout    - Create order
PUT    /api/orders/:id/cancel  - Cancel order

POST   /api/payments/process-payment      - Process payment
GET    /api/payments/:orderId  - Get payment status
```

### Admin Endpoints (Require Admin Role)
```
GET    /api/admin/products                    - List all products
GET    /api/admin/products/:id                - Get product
POST   /api/admin/products                    - Create product
PUT    /api/admin/products/:id                - Update product
DELETE /api/admin/products/:id                - Soft delete
DELETE /api/admin/products/:id/permanent      - Hard delete
GET    /api/admin/products/stats/inventory    - Inventory stats

GET    /api/admin/orders                      - List all orders
PUT    /api/admin/orders/:id/status           - Update order status
PUT    /api/admin/orders/:id/tracking         - Update tracking
GET    /api/admin/orders/reports/sales        - Sales report

GET    /api/admin/users                       - List users
PUT    /api/admin/users/:id/role              - Update user role
PUT    /api/admin/users/:id/status            - Update status

GET    /api/admin/reports/sales               - Sales report
GET    /api/admin/reports/revenue             - Revenue report
GET    /api/admin/reports/customers           - Customer report
GET    /api/admin/reports/inventory           - Inventory report
```

---

## 🔑 What's New in MongoDB

### 1. **Decimal Precision**
Prices are stored as Decimal128 in MongoDB, maintaining financial accuracy like PostgreSQL did.

### 2. **Flexible Relationships**
Products, Orders, and Carts are linked using MongoDB ObjectIds and Mongoose virtuals, providing clean data relationships.

### 3. **Advanced Filtering**
Product filtering now uses MongoDB's powerful query operators ($regex, $gte, $lte, $or, etc.)

### 4. **Aggregation Pipelines**
Admin reports now use MongoDB's aggregation framework for powerful analytics.

### 5. **Automatic Indexes**
All critical fields have indexes for optimal performance.

---

## ⚙️ Environment Variables

**Required** (in `.env` file):
```env
MONGODB_URI=mongodb://localhost:27017/kandy_super_phone
JWT_SECRET=your_secret_key_here
```

**Optional:**
```env
PORT=5000
NODE_ENV=development
STRIPE_SECRET_KEY=stripe_key_here
```

---

## 🐛 Troubleshooting

### "MongoDB connection failed"
**Solution:** Make sure MongoDB is running on your machine
```bash
# Windows
mongod

# Or check if running
Get-NetTCPConnection -LocalPort 27017
```

### "Port 5000 already in use"
**Solution:** Kill the process using port 5000
```bash
# Windows PowerShell
Get-NetTCPConnection -LocalPort 5000 | Stop-Process -Force
```

### "Cannot find module 'mongoose'"
**Solution:** Install dependencies
```bash
npm install
```

### Old PostgreSQL errors appearing
**Solution:** Make sure old server isn't running
```bash
# Kill all Node processes
taskkill /IM node.exe /F

# Then restart
npm run dev
```

---

## 📖 Full Documentation

For detailed information, see:
- **`MONGODB_MIGRATION.md`** - Complete setup guide and database structure
- **`MONGODB_CONVERSION_SUMMARY.md`** - Technical implementation details

---

## ✨ Frontend Integration

**Good news:** No frontend changes needed! ✅
- API endpoints remain the same
- JWT authentication works unchanged
- Response formats are compatible

Just update your API base URL in frontend `.env` to:
```env
REACT_APP_API_BASE_URL=http://localhost:5000
```

---

## 🎉 You're Ready!

```bash
# 1. Start MongoDB
mongod

# 2. In backend directory
npm install
npm run init-db
npm run seed
npm run dev

# 3. Server is ready at http://localhost:5000
```

---

## 📞 Need Help?

Check the detailed documentation:
1. [MongoDB Migration Guide](./backend/MONGODB_MIGRATION.md)
2. [Conversion Summary](./MONGODB_CONVERSION_SUMMARY.md)

Or test the API:
- Use Postman, Thunder Client, or REST Client VS Code extension
- Try the cURL examples above
- Check server logs in terminal for errors

---

**Happy coding! 🚀**
