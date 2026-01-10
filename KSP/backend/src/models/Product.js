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
    defaultValue: '128GB',
    comment: 'e.g., 64GB, 128GB, 256GB'
  },
  condition: {
    type: DataTypes.ENUM('Brand New', 'Pre-Owned'),
    defaultValue: 'Brand New'
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
  isNewArrival: {
    type: DataTypes.BOOLEAN,
    defaultValue: false,
    comment: 'Mark product as new arrival for homepage display'
  },
  isPremiumDeal: {
    type: DataTypes.BOOLEAN,
    defaultValue: false,
    comment: 'Mark product as premium deal (budget phones) for homepage display'
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
