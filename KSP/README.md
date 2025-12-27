# Kandy Super Phone - E-Commerce Platform

A full-stack PERN (PostgreSQL, Express.js, React, Node.js) e-commerce platform for selling smartphones with customer and admin functionality.

## Features

### Customer Features
- User authentication (JWT-based)
- Browse and search products by brand, price, storage, and condition
- Add products to shopping cart
- Checkout with shipping address
- Multiple payment methods (Cash on Delivery, PayHere, Stripe)
- Order tracking and order history
- User profile management

### Admin Features
- Dashboard with sales reports and analytics
- Product inventory management
- Order management and status tracking
- Customer management
- Sales and revenue reports
- Low stock alerts

## Tech Stack

### Backend
- **Server**: Express.js (Node.js)
- **Database**: PostgreSQL
- **ORM**: Sequelize
- **Authentication**: JWT (jsonwebtoken)
- **Password Hashing**: bcryptjs
- **Security**: Helmet, CORS, Rate Limiting
- **Payments**: Stripe, PayHere API

### Frontend
- **UI Library**: React 18
- **Routing**: React Router v6
- **Styling**: Tailwind CSS
- **State Management**: Zustand
- **API Client**: Axios
- **Icons**: React Icons
- **Notifications**: React Toastify

## Project Structure

```
KSP/
├── backend/
│   ├── src/
│   │   ├── config/
│   │   │   ├── database.js
│   │   │   └── sequelize.js
│   │   ├── models/
│   │   │   ├── User.js
│   │   │   ├── Product.js
│   │   │   ├── Cart.js
│   │   │   ├── Order.js
│   │   │   ├── OrderItem.js
│   │   │   ├── Payment.js
│   │   │   └── index.js
│   │   ├── routes/
│   │   │   ├── authRoutes.js
│   │   │   ├── productRoutes.js
│   │   │   ├── cartRoutes.js
│   │   │   ├── orderRoutes.js
│   │   │   ├── paymentRoutes.js
│   │   │   ├── adminProductRoutes.js
│   │   │   ├── adminOrderRoutes.js
│   │   │   ├── adminUserRoutes.js
│   │   │   └── adminReportRoutes.js
│   │   ├── controllers/
│   │   ├── middleware/
│   │   │   ├── authenticate.js
│   │   │   ├── authorize.js
│   │   │   └── errorHandler.js
│   │   ├── utils/
│   │   │   ├── tokenUtils.js
│   │   │   └── generators.js
│   │   └── server.js
│   ├── migrations/
│   ├── package.json
│   └── .env.example
├── frontend/
│   ├── src/
│   │   ├── components/
│   │   │   ├── Navigation.js
│   │   │   └── Footer.js
│   │   ├── pages/
│   │   │   ├── Home.js
│   │   │   ├── Products.js
│   │   │   ├── ProductDetail.js
│   │   │   ├── Cart.js
│   │   │   ├── Checkout.js
│   │   │   ├── Orders.js
│   │   │   ├── Auth/
│   │   │   │   ├── Login.js
│   │   │   │   └── Register.js
│   │   │   └── Admin/
│   │   │       └── Dashboard.js
│   │   ├── services/
│   │   │   ├── api.js
│   │   │   └── apiService.js
│   │   ├── context/
│   │   │   └── store.js
│   │   ├── styles/
│   │   │   └── globals.css
│   │   ├── App.js
│   │   └── index.js
│   ├── public/
│   │   └── index.html
│   ├── package.json
│   ├── tailwind.config.js
│   └── postcss.config.js
└── README.md
```

## Setup Instructions

### Prerequisites
- Node.js (v16+)
- PostgreSQL (v12+)
- npm or yarn

### Backend Setup

1. **Install dependencies:**
   ```bash
   cd backend
   npm install
   ```

2. **Configure environment variables:**
   ```bash
   cp .env.example .env
   ```
   Edit `.env` and add:
   ```
   DB_HOST=localhost
   DB_PORT=5432
   DB_NAME=kandy_super_phone
   DB_USER=postgres
   DB_PASSWORD=your_password
   PORT=5000
   JWT_SECRET=your_jwt_secret_key
   JWT_EXPIRE=7d
   STRIPE_SECRET_KEY=your_stripe_key
   PAYHERE_MERCHANT_ID=your_payhere_id
   CORS_ORIGIN=http://localhost:3000
   ```

3. **Create PostgreSQL database:**
   ```bash
   createdb kandy_super_phone
   ```

4. **Run migrations (optional - auto-sync in development):**
   ```bash
   npm run migrate
   ```

5. **Start the server:**
   ```bash
   npm run dev
   ```
   Server will run on `http://localhost:5000`

### Frontend Setup

1. **Install dependencies:**
   ```bash
   cd frontend
   npm install
   ```

2. **Start development server:**
   ```bash
   npm start
   ```
   App will open on `http://localhost:3000`

## Database Schema

### Users Table
- id (UUID, PK)
- firstName, lastName
- email (unique)
- password (hashed)
- phone, address, city, province, postalCode
- role (customer/admin)
- isActive
- lastLogin
- timestamps

### Products Table
- id (UUID, PK)
- name, description
- brand
- price
- storage (64GB, 128GB, etc.)
- condition (New/Used)
- color, ram
- quantity
- imageUrl
- sku (unique)
- isActive
- timestamps

### Cart Table
- id (UUID, PK)
- userId (FK)
- productId (FK)
- quantity
- priceAtAdd
- timestamps

### Orders Table
- id (UUID, PK)
- orderId (unique customer-visible ID)
- userId (FK)
- totalAmount
- status (pending, confirmed, processing, shipped, delivered, cancelled)
- paymentMethod (cod, payhere, stripe)
- paymentStatus
- shipping address fields
- trackingNumber
- timestamps

### OrderItems Table
- id (UUID, PK)
- orderId (FK)
- productId (FK)
- quantity, pricePerUnit, subtotal
- timestamps

### Payments Table
- id (UUID, PK)
- orderId (FK)
- amount
- paymentMethod
- status (pending, completed, failed, refunded)
- transactionId
- paymentReference
- metadata (JSON)
- timestamps

## API Endpoints

### Authentication
- `POST /api/auth/register` - Register new user
- `POST /api/auth/login` - Login user
- `POST /api/auth/refresh-token` - Refresh JWT
- `POST /api/auth/logout` - Logout user

### Products (Public)
- `GET /api/products` - Get all products
- `GET /api/products/:id` - Get product by ID
- `GET /api/products/search?q=query` - Search products

### Cart (Protected)
- `GET /api/cart` - Get user's cart
- `POST /api/cart/add` - Add to cart
- `PUT /api/cart/update/:cartItemId` - Update cart item
- `DELETE /api/cart/remove/:cartItemId` - Remove from cart
- `DELETE /api/cart/clear` - Clear entire cart

### Orders (Protected)
- `GET /api/orders` - Get user's orders
- `GET /api/orders/:orderId` - Get order details
- `POST /api/orders/checkout` - Create order
- `PUT /api/orders/:orderId/cancel` - Cancel order

### Payments (Protected)
- `POST /api/payments/process-payment` - Process payment
- `GET /api/payments/:orderId` - Get payment status

### Admin Routes (Protected - Admin Only)
- `POST /api/admin/products` - Create product
- `PUT /api/admin/products/:id` - Update product
- `DELETE /api/admin/products/:id` - Delete product
- `GET /api/admin/orders` - Get all orders
- `PUT /api/admin/orders/:orderId/status` - Update order status
- `GET /api/admin/users` - Get all users
- `GET /api/admin/reports/*` - Various reports

## Security Features

✓ Password hashing with bcryptjs
✓ JWT authentication
✓ CORS protection
✓ Helmet security headers
✓ Rate limiting
✓ SQL injection protection (Sequelize ORM)
✓ HTTPS ready
✓ Environment variable protection
✓ Role-based access control

## Next Steps

1. **Implement Controllers** - Add business logic to route handlers
2. **Create Database Migrations** - Use Sequelize CLI for schema versioning
3. **Implement Payment Integration** - Stripe and PayHere payment flows
4. **Build Admin Dashboard** - Add charts and detailed reports
5. **Add Image Upload** - Multer integration for product images
6. **Implement Search & Filters** - Advanced product filtering
7. **Add Email Notifications** - Order confirmation and shipping updates
8. **Testing** - Unit and integration tests
9. **Deployment** - Deploy to production (Heroku, AWS, DigitalOcean, etc.)

## Environment Variables

Create a `.env` file in the backend folder with the following variables:

```
# Database
DB_HOST=localhost
DB_PORT=5432
DB_NAME=kandy_super_phone
DB_USER=postgres
DB_PASSWORD=your_password

# Server
PORT=5000
NODE_ENV=development

# JWT
JWT_SECRET=your_jwt_secret_change_in_production
JWT_EXPIRE=7d

# Payments
STRIPE_SECRET_KEY=your_stripe_secret_key
PAYHERE_MERCHANT_ID=your_payhere_id
PAYHERE_RETURN_URL=http://localhost:3000/payment/success
PAYHERE_CANCEL_URL=http://localhost:3000/payment/cancel
PAYHERE_NOTIFY_URL=http://localhost:5000/api/payments/payhere-notify

# CORS
CORS_ORIGIN=http://localhost:3000
```

## Development

### Running Both Services Simultaneously

Open two terminal windows:

**Terminal 1 - Backend:**
```bash
cd backend
npm run dev
```

**Terminal 2 - Frontend:**
```bash
cd frontend
npm start
```

## Contributing

Guidelines for contributing to this project will be added soon.

## License

MIT License

## Support

For issues or questions, please open an issue on the GitHub repository.

---

**Happy coding! 🚀**
