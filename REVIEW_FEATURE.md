# Customer Review Feature Documentation

## Overview
A complete customer review system has been implemented for the KSP Website, allowing authenticated users to submit star ratings and text reviews for products.

## Features Implemented

### Backend Components

#### 1. Review Model (`backend/src/models/Review.js`)
- **Fields:**
  - `productId`: Reference to Product model
  - `userId`: Reference to User model
  - `rating`: Number (1-5 stars, required)
  - `comment`: String (max 1000 characters, required)
  - `isVerifiedPurchase`: Boolean flag (automatically set based on order history)
  - `createdAt` and `updatedAt`: Timestamps

- **Indexes:**
  - Compound unique index on (productId, userId) - prevents duplicate reviews
  - Index on productId for fast review lookups
  - Index on createdAt for sorting

#### 2. Review Routes (`backend/src/routes/reviewRoutes.js`)
All routes include comprehensive error handling.

**Public Routes:**
- `GET /api/reviews/product/:productId` - Get all reviews for a product
  - Returns: reviews array, averageRating, totalReviews, rating distribution
  - Supports pagination (page, limit query params)

**Protected Routes (require authentication):**
- `POST /api/reviews` - Submit a new review
  - Body: { productId, rating, comment }
  - Automatically checks if user has purchased the product
  - Prevents duplicate reviews per user per product

- `PUT /api/reviews/:reviewId` - Update existing review
  - Only review owner can update
  - Body: { rating, comment }

- `DELETE /api/reviews/:reviewId` - Delete review
  - Only review owner can delete

- `GET /api/reviews/user/my-reviews` - Get all reviews by current user
  - Supports pagination

### Frontend Components

#### 1. Review Service (`frontend/src/services/apiService.js`)
Added `reviewService` with methods:
- `getProductReviews(productId, params)` - Fetch product reviews
- `submitReview(data)` - Submit new review
- `updateReview(reviewId, data)` - Update review
- `deleteReview(reviewId)` - Delete review
- `getMyReviews(params)` - Get user's reviews

#### 2. ProductDetail Page (`frontend/src/pages/ProductDetail.js`)
Enhanced with complete review functionality:

**Display Features:**
- Average rating display with star visualization
- Total review count
- Individual review cards showing:
  - Reviewer name
  - Star rating
  - Review date
  - Comment text
  - "Verified Purchase" badge for confirmed buyers

**Review Submission:**
- Interactive star rating selector (hover effects)
- Text area for comments (1000 character limit)
- Character counter
- Form validation
- Success/error messages
- Login prompt for non-authenticated users

**User Experience:**
- Reviews automatically refresh after submission
- Loading states for async operations
- Responsive design
- Accessible UI components

## Usage

### For Customers:
1. Navigate to any product detail page
2. Scroll to the "Customer Reviews" section
3. If logged in:
   - Select a star rating (1-5)
   - Write a review comment
   - Click "Submit Review"
4. If not logged in:
   - Click "Log In" button to authenticate first

### Review Display:
- Average rating shown prominently with stars
- Reviews sorted by creation date (newest first)
- Verified purchase badge for users who bought the product

## Technical Details

### Database Validation:
- Rating must be between 1 and 5
- Comment is required and limited to 1000 characters
- Users can only submit one review per product

### Authentication:
- Uses JWT token authentication
- Reviews are tied to authenticated users
- Requires valid token in Authorization header

### Performance:
- Compound indexes ensure fast queries
- Pagination support for large review sets
- Efficient aggregation for average ratings

## API Examples

### Submit Review:
```javascript
POST /api/reviews
Authorization: Bearer <token>
{
  "productId": "64abc123...",
  "rating": 5,
  "comment": "Great product! Highly recommended."
}
```

### Get Product Reviews:
```javascript
GET /api/reviews/product/64abc123...?page=1&limit=10
```

Response:
```javascript
{
  "success": true,
  "data": {
    "reviews": [...],
    "averageRating": 4.5,
    "totalReviews": 23,
    "distribution": {
      "5": 15,
      "4": 5,
      "3": 2,
      "2": 1,
      "1": 0
    }
  }
}
```

## Future Enhancements (Optional)
- Review images upload
- Helpful/Not helpful voting
- Admin moderation features
- Review replies
- Sort/filter options (most helpful, recent, highest rating)
- Review editing functionality in UI
