const generateOrderId = () => {
  try {
    const timestamp = Date.now();
    const random = Math.random().toString(36).substr(2, 9).toUpperCase();
    return `ORD-${timestamp}-${random}`;
  } catch (error) {
    console.error('Generate order ID error:', error);
    // Fallback to simple timestamp-based ID
    return `ORD-${Date.now()}`;
  }
};

const generateSKU = (brand, storage) => {
  try {
    const timestamp = Date.now();
    const sku = `${brand.substring(0, 3).toUpperCase()}-${storage.replace(/\s/g, '')}-${timestamp}`;
    return sku;
  } catch (error) {
    console.error('Generate SKU error:', error);
    // Fallback to timestamp-based SKU
    return `SKU-${Date.now()}`;
  }
};

module.exports = {
  generateOrderId,
  generateSKU
};
