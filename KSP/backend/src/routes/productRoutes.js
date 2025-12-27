// Product Routes (Public)
const express = require('express');
const router = express.Router();
const { Product } = require('../models');
const { Op } = require('sequelize');

/**
 * GET /api/products
 * Get all products with filtering and pagination
 */
router.get('/', async (req, res) => {
  try {
    const { 
      page = 1, 
      limit = 12, 
      brand, 
      condition, 
      minPrice, 
      maxPrice,
      search,
      sortBy = 'createdAt',
      sortOrder = 'DESC'
    } = req.query;

    const where = { isActive: true };

    if (brand) {
      where.brand = brand;
    }

    if (condition) {
      where.condition = condition;
    }

    if (minPrice || maxPrice) {
      where.price = {};
      if (minPrice) where.price[Op.gte] = parseFloat(minPrice);
      if (maxPrice) where.price[Op.lte] = parseFloat(maxPrice);
    }

    if (search) {
      where[Op.or] = [
        { name: { [Op.iLike]: `%${search}%` } },
        { brand: { [Op.iLike]: `%${search}%` } },
        { description: { [Op.iLike]: `%${search}%` } }
      ];
    }

    const offset = (parseInt(page) - 1) * parseInt(limit);

    const { count, rows: products } = await Product.findAndCountAll({
      where,
      limit: parseInt(limit),
      offset,
      order: [[sortBy, sortOrder.toUpperCase()]]
    });

    res.json({
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
    res.status(500).json({ message: 'Error fetching products', error: error.message });
  }
});

/**
 * GET /api/products/brands
 * Get all unique brands
 */
router.get('/brands', async (req, res) => {
  try {
    const brands = await Product.findAll({
      attributes: ['brand'],
      where: { isActive: true },
      group: ['brand'],
      order: [['brand', 'ASC']]
    });
    res.json(brands.map(b => b.brand));
  } catch (error) {
    console.error('Error fetching brands:', error);
    res.status(500).json({ message: 'Error fetching brands', error: error.message });
  }
});

/**
 * GET /api/products/:id
 * Get product by ID
 */
router.get('/:id', async (req, res) => {
  try {
    const product = await Product.findByPk(req.params.id);
    
    if (!product) {
      return res.status(404).json({ message: 'Product not found' });
    }

    res.json(product);
  } catch (error) {
    console.error('Error fetching product:', error);
    res.status(500).json({ message: 'Error fetching product', error: error.message });
  }
});

module.exports = router;
