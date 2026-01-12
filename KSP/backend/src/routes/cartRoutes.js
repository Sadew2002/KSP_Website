// Shopping Cart Routes (Protected)
const express = require('express');
const router = express.Router();
const mongoose = require('mongoose');
const Cart = require('../models/Cart');
const Product = require('../models/Product');

/**
 * GET /api/cart
 * Get user's cart with product details
 */
router.get('/', async (req, res) => {
  try {
    const userId = req.user.id;

    // Get all cart items for user
    const cartItems = await Cart.find({ userId }).populate('productId', 'name price imageUrl brand condition storage color');

    // Calculate total
    const total = cartItems.reduce((sum, item) => {
      return sum + (parseFloat(item.priceAtAdd) * item.quantity);
    }, 0);

    res.json({
      success: true,
      data: {
        items: cartItems,
        itemCount: cartItems.length,
        total: parseFloat(total.toFixed(2))
      }
    });
  } catch (error) {
    console.error('Get cart error:', error);
    res.status(500).json({
      success: false,
      error: 'Failed to get cart'
    });
  }
});

/**
 * POST /api/cart/add
 * Add product to cart
 */
router.post('/add', async (req, res) => {
  try {
    const { productId, quantity = 1 } = req.body;
    const userId = req.user.id;

    // Validate inputs
    if (!productId || quantity < 1) {
      return res.status(400).json({
        success: false,
        error: 'Valid productId and quantity required'
      });
    }

    // Check if product exists
    const product = await Product.findById(productId);
    if (!product) {
      return res.status(404).json({
        success: false,
        error: 'Product not found'
      });
    }

    // Check product availability
    if (product.quantity < quantity) {
      return res.status(400).json({
        success: false,
        error: 'Insufficient stock'
      });
    }

    // Check if product already in cart
    let cartItem = await Cart.findOne({ userId, productId });

    if (cartItem) {
      // Update quantity
      cartItem.quantity += quantity;
      await cartItem.save();
    } else {
      // Create new cart item
      cartItem = await Cart.create({
        userId,
        productId,
        quantity,
        priceAtAdd: product.price
      });
    }

    // Get updated cart
    const cart = await Cart.find({ userId }).populate('productId', 'name price imageUrl');

    const total = cart.reduce((sum, item) => {
      return sum + (parseFloat(item.priceAtAdd) * item.quantity);
    }, 0);

    res.status(201).json({
      success: true,
      message: 'Product added to cart',
      data: {
        cartItem,
        itemCount: cart.length,
        total: parseFloat(total.toFixed(2))
      }
    });
  } catch (error) {
    console.error('Add to cart error:', error);
    res.status(500).json({
      success: false,
      error: 'Failed to add product to cart'
    });
  }
});

/**
 * PUT /api/cart/update/:cartItemId
 * Update cart item quantity
 */
router.put('/update/:cartItemId', async (req, res) => {
  try {
    const { cartItemId } = req.params;
    const { quantity } = req.body;
    const userId = req.user.id;

    // Validate cartItemId is valid MongoDB ObjectId
    if (!mongoose.Types.ObjectId.isValid(cartItemId)) {
      return res.status(400).json({
        success: false,
        error: 'Invalid cart item ID'
      });
    }

    // Validate quantity
    if (!quantity || quantity < 1) {
      return res.status(400).json({
        success: false,
        error: 'Quantity must be at least 1'
      });
    }

    // Find and update cart item
    const cartItem = await Cart.findOne({ _id: cartItemId, userId });
    if (!cartItem) {
      return res.status(404).json({
        success: false,
        error: 'Cart item not found'
      });
    }

    // Check product availability
    const product = await Product.findById(cartItem.productId);
    if (product.quantity < quantity) {
      return res.status(400).json({
        success: false,
        error: 'Insufficient stock'
      });
    }

    // Update quantity
    cartItem.quantity = quantity;
    await cartItem.save();

    res.json({
      success: true,
      message: 'Cart item updated',
      data: cartItem
    });
  } catch (error) {
    console.error('Update cart error:', error);
    res.status(500).json({
      success: false,
      error: 'Failed to update cart item'
    });
  }
});

/**
 * DELETE /api/cart/remove/:cartItemId
 * Remove item from cart
 */
router.delete('/remove/:cartItemId', async (req, res) => {
  try {
    const { cartItemId } = req.params;
    const userId = req.user.id;

    // Validate cartItemId is valid MongoDB ObjectId
    if (!mongoose.Types.ObjectId.isValid(cartItemId)) {
      return res.status(400).json({
        success: false,
        error: 'Invalid cart item ID'
      });
    }

    // Find and delete cart item
    const cartItem = await Cart.findOneAndDelete({ _id: cartItemId, userId });
    if (!cartItem) {
      return res.status(404).json({
        success: false,
        error: 'Cart item not found'
      });
    }

    // Get updated cart
    const cart = await Cart.find({ userId }).populate('productId', 'name price imageUrl');

    const total = cart.reduce((sum, item) => {
      return sum + (parseFloat(item.priceAtAdd) * item.quantity);
    }, 0);

    res.json({
      success: true,
      message: 'Item removed from cart',
      data: {
        itemCount: cart.length,
        total: parseFloat(total.toFixed(2))
      }
    });
  } catch (error) {
    console.error('Remove from cart error:', error);
    res.status(500).json({
      success: false,
      error: 'Failed to remove item from cart'
    });
  }
});

/**
 * DELETE /api/cart/clear
 * Clear entire cart
 */
router.delete('/clear', async (req, res) => {
  try {
    const userId = req.user.id;

    // Delete all cart items for user
    const result = await Cart.deleteMany({ userId });

    res.json({
      success: true,
      message: 'Cart cleared',
      data: {
        deletedCount: result.deletedCount
      }
    });
  } catch (error) {
    console.error('Clear cart error:', error);
    res.status(500).json({
      success: false,
      error: 'Failed to clear cart'
    });
  }
});

module.exports = router;
