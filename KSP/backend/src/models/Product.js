const { DataTypes } = require('sequelize');
const sequelize = require('../config/sequelize');

const Product = sequelize.define('Product', {
  id: {
    type: DataTypes.UUID,
    defaultValue: DataTypes.UUIDV4,
    primaryKey: true
  },
  name: {
    type: DataTypes.STRING,
    allowNull: false,
    validate: {
      notEmpty: true
    }
  },
  description: {
    type: DataTypes.TEXT,
    allowNull: true
  },
  brand: {
    type: DataTypes.STRING,
    allowNull: false,
    validate: {
      notEmpty: true
    }
  },
  price: {
    type: DataTypes.DECIMAL(10, 2),
    allowNull: false,
    validate: {
      isDecimal: true,
      min: 0
    }
  },
  storage: {
    type: DataTypes.STRING,
    allowNull: false,
    comment: 'e.g., 64GB, 128GB, 256GB'
  },
  condition: {
    type: DataTypes.ENUM('New', 'Used'),
    defaultValue: 'New'
  },
  color: {
    type: DataTypes.STRING,
    allowNull: true
  },
  ram: {
    type: DataTypes.STRING,
    allowNull: true,
    comment: 'e.g., 4GB, 6GB, 8GB'
  },
  quantity: {
    type: DataTypes.INTEGER,
    allowNull: false,
    defaultValue: 0,
    validate: {
      isInt: true,
      min: 0
    }
  },
  imageUrl: {
    type: DataTypes.STRING,
    allowNull: true
  },
  isActive: {
    type: DataTypes.BOOLEAN,
    defaultValue: true
  },
  sku: {
    type: DataTypes.STRING,
    unique: true,
    allowNull: false
  }
}, {
  timestamps: true
});

module.exports = Product;
