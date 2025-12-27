const generateOrderId = () => {
  const timestamp = Date.now();
  const random = Math.random().toString(36).substr(2, 9).toUpperCase();
  return `ORD-${timestamp}-${random}`;
};

const generateSKU = (brand, storage) => {
  const timestamp = Date.now();
  const sku = `${brand.substring(0, 3).toUpperCase()}-${storage.replace(/\s/g, '')}-${timestamp}`;
  return sku;
};

module.exports = {
  generateOrderId,
  generateSKU
};
