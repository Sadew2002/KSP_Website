// Admin Product Routes (Protected - Admin Only)
const express = require('express');
const router = express.Router();
const { Product } = require('../models');
const authorizeAdmin = require('../middleware/authorize');
const { Op } = require('sequelize');

// Apply admin authorization to all routes
router.use(authorizeAdmin);

/**
 * GET /api/admin/products
 * Get all products (including inactive) for admin
 */
router.get('/', async (req, res) => {
  try {
    const { page = 1, limit = 20, search, brand, condition } = req.query;
    
    const where = {};
    
    if (search) {
      where[Op.or] = [
        { name: { [Op.iLike]: `%${search}%` } },
        { sku: { [Op.iLike]: `%${search}%` } },
        { brand: { [Op.iLike]: `%${search}%` } }
      ];
    }
    
    if (brand) where.brand = brand;
    if (condition) where.condition = condition;

    const offset = (parseInt(page) - 1) * parseInt(limit);

    const { count, rows: products } = await Product.findAndCountAll({
      where,
      limit: parseInt(limit),
      offset,
      order: [['createdAt', 'DESC']]
    });

    res.json({
      success: true,
      products,
      pagination: {
        total: count,
        page: parseInt(page),
        limit: parseInt(limit),
        totalPages: Math.ceil(count / parseInt(limit))
      }
    });
  } catch (error) {
    console.error('Error fetching products:', error);
    res.status(500).json({ success: false, message: 'Error fetching products', error: error.message });
  }
});

/**
 * GET /api/admin/products/:id
 * Get single product by ID
 */
router.get('/:id', async (req, res) => {
  try {
    const product = await Product.findByPk(req.params.id);
    
    if (!product) {
      return res.status(404).json({ success: false, message: 'Product not found' });
    }

    res.json({ success: true, product });
  } catch (error) {
    console.error('Error fetching product:', error);
    res.status(500).json({ success: false, message: 'Error fetching product', error: error.message });
  }
});

/**
 * POST /api/admin/products
 * Create new product
 */
router.post('/', async (req, res) => {
  try {
    const {
      name,
      description,
      brand,
      price,
      storage = '128GB',
      condition = 'Brand New',
      color,
      ram,
      quantity = 0,
      imageUrl,
      sku
    } = req.body;

    console.log('Creating product:', req.body);

    // Validate required fields
    if (!name || !brand || !price || !sku) {
      return res.status(400).json({
        success: false,
        message: 'Missing required fields: name, brand, price, sku'
      });
    }

    // Check if SKU already exists
    const existingProduct = await Product.findOne({ where: { sku } });
    if (existingProduct) {
      return res.status(400).json({ success: false, message: 'SKU already exists' });
    }

    const product = await Product.create({
      name,
      description,
      brand,
      price: parseFloat(price),
      storage,
      condition,
      color,
      ram,
      quantity: parseInt(quantity) || 0,
      imageUrl,
      sku,
      isActive: true
    });

    res.status(201).json({
      success: true,
      message: 'Product created successfully',
      product
    });
  } catch (error) {
    console.error('Error creating product:', error);
    res.status(500).json({ success: false, message: 'Error creating product', error: error.message });
  }
});

/**
 * PUT /api/admin/products/:id
 * Update product
 */
router.put('/:id', async (req, res) => {
  try {
    const product = await Product.findByPk(req.params.id);
    
    if (!product) {
      return res.status(404).json({ success: false, message: 'Product not found' });
    }

    const {
      name,
      description,
      brand,
      price,
      storage,
      condition,
      color,
      ram,
      quantity,
      imageUrl,
      sku,
      isActive
    } = req.body;

    // Check if new SKU conflicts with another product
    if (sku && sku !== product.sku) {
      const existingProduct = await Product.findOne({ where: { sku } });
      if (existingProduct) {
        return res.status(400).json({ success: false, message: 'SKU already exists' });
      }
    }

    await product.update({
      name: name ?? product.name,
      description: description ?? product.description,
      brand: brand ?? product.brand,
      price: price ?? product.price,
      storage: storage ?? product.storage,
      condition: condition ?? product.condition,
      color: color ?? product.color,
      ram: ram ?? product.ram,
      quantity: quantity ?? product.quantity,
      imageUrl: imageUrl ?? product.imageUrl,
      sku: sku ?? product.sku,
      isActive: isActive ?? product.isActive
    });

    res.json({
      success: true,
      message: 'Product updated successfully',
      product
    });
  } catch (error) {
    console.error('Error updating product:', error);
    res.status(500).json({ success: false, message: 'Error updating product', error: error.message });
  }
});

/**
 * DELETE /api/admin/products/:id
 * Delete product (soft delete - sets isActive to false)
 */
router.delete('/:id', async (req, res) => {
  try {
    const product = await Product.findByPk(req.params.id);
    
    if (!product) {
      return res.status(404).json({ success: false, message: 'Product not found' });
    }

    // Soft delete - just mark as inactive
    await product.update({ isActive: false });

    res.json({
      success: true,
      message: 'Product deleted successfully'
    });
  } catch (error) {
    console.error('Error deleting product:', error);
    res.status(500).json({ success: false, message: 'Error deleting product', error: error.message });
  }
});

/**
 * DELETE /api/admin/products/:id/permanent
 * Permanently delete product from database
 */
router.delete('/:id/permanent', async (req, res) => {
  try {
    const product = await Product.findByPk(req.params.id);
    
    if (!product) {
      return res.status(404).json({ success: false, message: 'Product not found' });
    }

    await product.destroy();

    res.json({
      success: true,
      message: 'Product permanently deleted'
    });
  } catch (error) {
    console.error('Error deleting product:', error);
    res.status(500).json({ success: false, message: 'Error deleting product', error: error.message });
  }
});

/**
 * GET /api/admin/products/inventory
 * Get inventory report
 */
router.get('/stats/inventory', async (req, res) => {
  try {
    const totalProducts = await Product.count();
    const activeProducts = await Product.count({ where: { isActive: true } });
    const lowStock = await Product.count({ where: { quantity: { [Op.lte]: 5 }, isActive: true } });
    const outOfStock = await Product.count({ where: { quantity: 0, isActive: true } });

    const brandStats = await Product.findAll({
      attributes: [
        'brand',
        [require('sequelize').fn('COUNT', require('sequelize').col('id')), 'count'],
        [require('sequelize').fn('SUM', require('sequelize').col('quantity')), 'totalStock']
      ],
      where: { isActive: true },
      group: ['brand'],
      order: [[require('sequelize').fn('COUNT', require('sequelize').col('id')), 'DESC']]
    });

    res.json({
      success: true,
      inventory: {
        totalProducts,
        activeProducts,
        lowStock,
        outOfStock,
        brandStats
      }
    });
  } catch (error) {
    console.error('Error fetching inventory:', error);
    res.status(500).json({ success: false, message: 'Error fetching inventory', error: error.message });
  }
});

module.exports = router;
