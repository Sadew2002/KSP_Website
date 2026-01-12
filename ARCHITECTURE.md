# MongoDB Architecture & System Design

## 📊 System Architecture

```
┌─────────────────────────────────────────────────────────────┐
│                     React Frontend                          │
│  (No changes - API contract preserved)                      │
│  - User Interface                                           │
│  - State Management (Zustand)                               │
│  - HTTP Client (Axios)                                      │
└────────────────────┬────────────────────────────────────────┘
                     │ HTTP/REST API
                     │
┌────────────────────▼────────────────────────────────────────┐
│              Express.js Backend (Node.js)                   │
│                                                              │
│  ┌──────────────────────────────────────────────────┐       │
│  │ Route Layer (10 files)                           │       │
│  │ - authRoutes                                     │       │
│  │ - productRoutes                                  │       │
│  │ - cartRoutes                                     │       │
│  │ - orderRoutes                                    │       │
│  │ - paymentRoutes                                  │       │
│  │ - adminProductRoutes                             │       │
│  │ - adminOrderRoutes                               │       │
│  │ - adminUserRoutes                                │       │
│  │ - adminReportRoutes                              │       │
│  │ - uploadRoutes                                   │       │
│  └──────────────────────────────────────────────────┘       │
│                      │                                       │
│  ┌──────────────────▼──────────────────────────────┐       │
│  │ Middleware Layer                                │       │
│  │ - authenticate (JWT verification)              │       │
│  │ - authorize (Role-based access)                │       │
│  │ - errorHandler (Global error handling)         │       │
│  │ - validator (Input validation)                 │       │
│  └──────────────────┬──────────────────────────────┘       │
│                     │                                       │
│  ┌──────────────────▼──────────────────────────────┐       │
│  │ Model/Schema Layer (Mongoose - 6 files)        │       │
│  │ - User Schema                                   │       │
│  │ - Product Schema                                │       │
│  │ - Cart Schema                                   │       │
│  │ - Order Schema                                  │       │
│  │ - OrderItem Schema                              │       │
│  │ - Payment Schema                                │       │
│  └──────────────────┬──────────────────────────────┘       │
│                     │ Mongoose ODM                          │
└────────────────────┬────────────────────────────────────────┘
                     │
                     │ Connection Pool
                     │
┌────────────────────▼────────────────────────────────────────┐
│           MongoDB (Local or Atlas Cloud)                    │
│                                                              │
│  Database: kandy_super_phone                                │
│                                                              │
│  ┌──────────────────────────────────────────────┐           │
│  │ Collections:                                  │           │
│  │ - users         (Authentication & Profiles)   │           │
│  │ - products      (Product Catalog)             │           │
│  │ - carts         (Shopping Carts)              │           │
│  │ - orders        (Orders)                      │           │
│  │ - orderitems    (Line Items)                  │           │
│  │ - payments      (Payment Records)             │           │
│  └──────────────────────────────────────────────┘           │
└─────────────────────────────────────────────────────────────┘
```

---

## 🔀 Data Flow Diagrams

### User Registration Flow
```
1. User submits registration form
   │
2. POST /api/auth/register
   ├─ Validate email format
   ├─ Check email uniqueness
   ├─ Hash password (bcryptjs)
   │
3. User.create() → MongoDB
   ├─ Store user document
   ├─ Create indexes
   │
4. Return success response
   └─ Include JWT token
```

### Product Purchase Flow
```
1. User browses products
   │
2. GET /api/products (with filters)
   ├─ Query MongoDB
   ├─ Apply filters ($regex, $gte, $lte, $or)
   └─ Return filtered products

3. User adds items to cart
   │
4. POST /api/cart/add
   ├─ Validate product exists
   ├─ Check stock availability
   ├─ Create/update Cart document
   ├─ Store price snapshot
   │
5. User proceeds to checkout
   │
6. POST /api/orders/checkout
   ├─ Get all cart items
   ├─ Validate stock
   ├─ Create Order document
   ├─ Create OrderItem documents
   ├─ Deduct product quantities
   ├─ Clear cart
   │
7. POST /api/payments/process-payment
   ├─ Process with gateway (Stripe/PayHere)
   ├─ Update Order.paymentStatus
   ├─ Create Payment document
   │
8. Order confirmation email
```

### Admin Report Generation Flow
```
1. Admin requests sales report
   │
2. GET /api/admin/reports/sales
   ├─ MongoDB aggregation pipeline:
   │  ├─ $match (filter cancelled orders)
   │  ├─ $group (sum revenue, count orders)
   │  ├─ $sort (by date)
   │
3. Return aggregated data
   └─ Dashboard displays metrics
```

---

## 📈 Database Schema Details

### User Collection
```javascript
{
  _id: ObjectId,
  firstName: String,
  lastName: String,
  email: String (unique, indexed),
  password: String (hashed),
  phone: String,
  address: String,
  city: String,
  province: String,
  postalCode: String,
  role: 'customer' | 'admin',
  isActive: Boolean (indexed),
  lastLogin: Date,
  createdAt: Date,
  updatedAt: Date
}
```
**Indexes:**
- email (unique)
- isActive

---

### Product Collection
```javascript
{
  _id: ObjectId,
  name: String,
  description: String,
  brand: String (indexed),
  price: Decimal128,
  storage: String,
  condition: 'Brand New' | 'Pre-Owned' (indexed),
  color: String,
  ram: String,
  quantity: Number,
  imageUrl: String,
  sku: String (unique, indexed),
  isActive: Boolean (indexed),
  isNewArrival: Boolean (indexed),
  isPremiumDeal: Boolean (indexed),
  createdAt: Date,
  updatedAt: Date
}
```
**Indexes:**
- sku (unique)
- brand
- condition
- isActive
- isNewArrival
- isPremiumDeal

---

### Cart Collection
```javascript
{
  _id: ObjectId,
  userId: ObjectId (ref: User),
  productId: ObjectId (ref: Product),
  quantity: Number,
  priceAtAdd: Decimal128,
  createdAt: Date,
  updatedAt: Date
}
```
**Indexes:**
- Compound unique index: (userId, productId)

---

### Order Collection
```javascript
{
  _id: ObjectId,
  userId: ObjectId (ref: User),
  shippingAddress: String,
  city: String,
  province: String,
  postalCode: String,
  totalAmount: Decimal128,
  paymentMethod: 'Stripe' | 'PayHere' | 'COD',
  status: 'Pending' | 'Confirmed' | 'Processing' | 'Shipped' | 'Delivered' | 'Cancelled',
  paymentStatus: 'Pending' | 'Paid' | 'Failed' | 'Refunded',
  trackingNumber: String,
  trackingUrl: String,
  carrier: String,
  createdAt: Date,
  updatedAt: Date
}
```
**Indexes:**
- userId
- status
- paymentStatus

---

### OrderItem Collection
```javascript
{
  _id: ObjectId,
  orderId: ObjectId (ref: Order),
  productId: ObjectId (ref: Product),
  quantity: Number,
  pricePerUnit: Decimal128,
  subtotal: Decimal128,
  createdAt: Date,
  updatedAt: Date
}
```
**Indexes:**
- orderId

---

### Payment Collection
```javascript
{
  _id: ObjectId,
  orderId: ObjectId (ref: Order, unique),
  paymentMethod: 'Stripe' | 'PayHere' | 'COD',
  transactionReference: String,
  amount: Decimal128,
  status: 'Pending' | 'Completed' | 'Failed',
  failureReason: String,
  paidAt: Date,
  metadata: Mixed,
  createdAt: Date,
  updatedAt: Date
}
```
**Indexes:**
- orderId (unique)
- transactionReference

---

## 🔐 Authentication Flow

```
1. User Login
   POST /api/auth/login
   ├─ Find user by email
   ├─ Compare password with hash
   ├─ Generate JWT token
   └─ Return token + user info

2. Protected Request
   GET /api/cart
   ├─ Include: Authorization: Bearer <token>
   │
3. Middleware Verification
   ├─ Extract token from header
   ├─ Verify JWT signature
   ├─ Decode user ID
   ├─ Attach user to req.user
   │
4. Route Handler
   ├─ Use req.user.id for queries
   ├─ Get user's data from MongoDB
   └─ Return response
```

---

## 🚀 Deployment Architecture

### Local Development
```
Developer Machine
├─ MongoDB (mongod running locally)
├─ Node.js Backend (npm run dev)
└─ React Frontend (npm start)
```

### Production Deployment
```
├─ Frontend
│  └─ Hosted on: Vercel/Netlify/AWS S3+CloudFront
│
├─ Backend
│  └─ Hosted on: Heroku/Railway/AWS EC2/Google Cloud
│
└─ Database
   └─ Hosted on: MongoDB Atlas (Cloud)
```

---

## 📊 Aggregation Pipeline Examples

### Sales Report
```javascript
db.orders.aggregate([
  { $match: { status: { $ne: 'Cancelled' } } },
  {
    $group: {
      _id: null,
      totalOrders: { $sum: 1 },
      totalRevenue: { $sum: '$totalAmount' },
      averageOrderValue: { $avg: '$totalAmount' }
    }
  }
])
```

### Top Products
```javascript
db.orderitems.aggregate([
  {
    $lookup: {
      from: 'orders',
      localField: 'orderId',
      foreignField: '_id',
      as: 'order'
    }
  },
  { $unwind: '$order' },
  { $match: { 'order.status': { $ne: 'Cancelled' } } },
  {
    $group: {
      _id: '$productId',
      totalQuantity: { $sum: '$quantity' },
      totalRevenue: { $sum: '$subtotal' }
    }
  },
  { $sort: { totalQuantity: -1 } },
  { $limit: 10 }
])
```

---

## 🔄 Error Handling Strategy

```
┌─────────────────────────────────────┐
│  Client Request                     │
└────────────┬────────────────────────┘
             │
┌────────────▼────────────────────────┐
│  Input Validation                   │
│  ├─ Check required fields           │
│  ├─ Validate data types             │
│  └─ Validate format (email, etc.)   │
└────────────┬────────────────────────┘
             │
┌────────────▼────────────────────────┐
│  Business Logic                     │
│  ├─ Check stock availability        │
│  ├─ Verify user ownership           │
│  └─ Apply business rules            │
└────────────┬────────────────────────┘
             │
┌────────────▼────────────────────────┐
│  Database Operations                │
│  ├─ Try operation                   │
│  └─ Catch MongoDB errors            │
│     ├─ 11000 (Duplicate Key)        │
│     ├─ Validation errors            │
│     └─ Connection errors            │
└────────────┬────────────────────────┘
             │
┌────────────▼────────────────────────┐
│  Response                           │
│  ├─ Success: 200/201                │
│  ├─ Client Error: 400/403/404       │
│  └─ Server Error: 500               │
└─────────────────────────────────────┘
```

---

## 🎯 Performance Optimization

### Indexing Strategy
- **Unique Indexes:** email, sku, orderId (payment)
- **Single Field Indexes:** brand, condition, isActive, status, userId
- **Compound Indexes:** (userId, productId) for carts

### Query Optimization
- Use `.select()` to exclude passwords
- Use `.populate()` only when needed
- Paginate large result sets
- Use aggregation for complex reports

### Caching Opportunities (Future)
- Cache product list by brand/condition
- Cache top products for homepage
- Cache inventory levels
- Cache sales reports (hourly)

---

## 📋 Monitoring & Logging

### What's Logged
```javascript
// Connection logs
🔄 Connecting to MongoDB...
✓ MongoDB connected successfully

// Request logs (via middleware)
GET /api/products 200 45ms
POST /api/cart/add 201 120ms

// Error logs
Error: Stock not available for product X
Connection error: MongoDB connection failed
```

### Recommended Monitoring Tools
- **Database:** MongoDB Atlas Dashboard
- **Logs:** CloudWatch/Papertrail/Loggly
- **Performance:** New Relic/Datadog
- **Errors:** Sentry/LogRocket

---

## 🔗 API Response Format

### Success Response
```javascript
{
  "success": true,
  "message": "Operation successful",
  "data": { /* response data */ }
}
```

### Error Response
```javascript
{
  "success": false,
  "error": "Error message",
  "code": "ERROR_CODE" // optional
}
```

### Paginated Response
```javascript
{
  "success": true,
  "data": [ /* array of items */ ],
  "pagination": {
    "total": 100,
    "page": 1,
    "limit": 10,
    "pages": 10
  }
}
```

---

## 🎓 Learning Resources

### MongoDB
- [MongoDB Official Documentation](https://docs.mongodb.com/)
- [MongoDB Aggregation Pipeline](https://docs.mongodb.com/manual/reference/operator/aggregation/)
- [MongoDB Atlas (Cloud)](https://www.mongodb.com/cloud/atlas)

### Mongoose
- [Mongoose Documentation](https://mongoosejs.com/)
- [Mongoose Schemas](https://mongoosejs.com/docs/guide.html)
- [Mongoose Queries](https://mongoosejs.com/docs/queries.html)
- [Mongoose Aggregation](https://mongoosejs.com/docs/api/aggregate.html)

### Express.js & Node.js
- [Express.js Guide](https://expressjs.com/)
- [Node.js Best Practices](https://github.com/goldbergyoni/nodebestpractices)
- [RESTful API Design](https://www.restapitutorial.com/)

---

**System Architecture Complete! Ready for production deployment. 🚀**
