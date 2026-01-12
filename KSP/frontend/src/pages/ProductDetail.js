import React, { useEffect, useMemo, useState } from 'react';
import { Link, useParams } from 'react-router-dom';
import { FaStar, FaShoppingCart, FaBox, FaShieldAlt } from 'react-icons/fa';
import { productService } from '../services/apiService';

const ProductDetail = () => {
  const { id } = useParams();
  const [product, setProduct] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [quantity, setQuantity] = useState(1);

  useEffect(() => {
    let isMounted = true;
    async function fetchProduct() {
      setLoading(true);
      setError('');
      try {
        const res = await productService.getProductById(id);
        const data = res.data?.product || res.data;
        if (!data) {
          throw new Error('Product not found');
        }
        if (isMounted) setProduct(data);
      } catch (err) {
        if (isMounted) setError(err.response?.data?.message || 'Failed to load product');
      } finally {
        if (isMounted) setLoading(false);
      }
    }
    if (id) fetchProduct();
    return () => { isMounted = false; };
  }, [id]);

  const imageSrc = useMemo(() => {
    const url = product?.imageUrl?.trim();
    if (!url) return 'https://via.placeholder.com/500x500?text=No+Image';
    return url.startsWith('http') ? url : `http://localhost:5000${url}`;
  }, [product]);

  const inStock = (product?.quantity ?? 0) > 0;
  const rating = product?.rating ?? 4.5;
  const reviews = product?.reviews ?? 0;

  if (loading) {
    return (
      <div className="bg-ksp-gray min-h-screen py-12">
        <div className="container mx-auto px-4">
          <div className="card p-8 text-center">Loading product…</div>
        </div>
      </div>
    );
  }

  if (error || !product) {
    return (
      <div className="bg-ksp-gray min-h-screen py-12">
        <div className="container mx-auto px-4">
          <div className="card p-8 text-center">
            <p className="text-red-600 font-semibold mb-4">{error || 'Product not found'}</p>
            <Link to="/products" className="btn-primary">Back to Products</Link>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-ksp-gray min-h-screen py-12">
      <div className="container mx-auto px-4">
        {/* Breadcrumb */}
        <div className="mb-8 text-sm text-gray-600">
          <Link to="/" className="hover:text-ksp-red">Home</Link>
          <span className="mx-2">›</span>
          <Link to="/products" className="hover:text-ksp-red">Products</Link>
          <span className="mx-2">›</span>
          <Link to={`/products?brand=${encodeURIComponent(product.brand || '')}`} className="hover:text-ksp-red">{product.brand}</Link>
          <span className="mx-2">›</span>
          <span className="text-ksp-black font-semibold">{product.name}</span>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          {/* Product Image */}
          <div className="card sticky top-20">
            <img
              src={imageSrc}
              alt={product.name}
              className="w-full rounded"
              onError={(e) => { e.currentTarget.src = 'https://via.placeholder.com/500x500?text=No+Image'; }}
            />
            {!inStock && (
              <div className="mt-4 bg-red-100 border border-red-600 text-red-600 px-4 py-2 rounded text-center font-semibold">
                Out of Stock
              </div>
            )}
          </div>

          {/* Product Info */}
          <div>
            <div className="mb-4">
              <p className="text-gray-600 text-sm mb-2">{product.brand}</p>
              <h1 className="text-4xl font-bold text-ksp-black mb-3">{product.name}</h1>

              {/* Rating */}
              <div className="flex items-center gap-2 mb-6">
                <div className="flex text-yellow-400">
                  {[...Array(5)].map((_, i) => (
                    <FaStar key={i} className={i < Math.floor(rating) ? 'text-yellow-400' : 'text-gray-300'} />
                  ))}
                </div>
                <span className="text-gray-600">({reviews} reviews)</span>
              </div>
            </div>

            {/* Price */}
            <div className="mb-6 pb-6 border-b border-gray-200">
              <p className="price-tag text-4xl">Rs. {parseFloat(product.price).toLocaleString('en-LK')}</p>
            </div>

            {/* Description */}
            {product.description && (
              <div className="card mb-6">
                <h3 className="text-xl font-bold text-ksp-black mb-3">Description</h3>
                <p className="text-gray-700 leading-relaxed">{product.description}</p>
              </div>
            )}

            {/* Specifications */}
            <div className="card mb-6">
              <h3 className="text-xl font-bold text-ksp-black mb-4">Specifications</h3>
              <div className="space-y-3">
                <div className="flex justify-between">
                  <span className="text-gray-600">Storage:</span>
                  <span className="font-semibold text-ksp-black">{product.storage || '-'}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600">RAM:</span>
                  <span className="font-semibold text-ksp-black">{product.ram || '-'}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600">Color:</span>
                  <span className="font-semibold text-ksp-black">{product.color || '-'}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600">Condition:</span>
                  <span className="badge-green">{product.condition || 'Brand New'}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600">SKU:</span>
                  <span className="font-semibold text-ksp-black">{product.sku}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600">Category:</span>
                  <span className="font-semibold text-ksp-black">{product.productType || 'Phones'}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600">Availability:</span>
                  <span className={`font-semibold ${inStock ? 'text-green-700' : 'text-red-700'}`}>{inStock ? 'In Stock' : 'Out of Stock'}</span>
                </div>
              </div>
            </div>

            {/* Add to Cart */}
            <div className="card mb-6">
              <h3 className="text-lg font-bold text-ksp-black mb-4">Quantity</h3>
              <div className="flex items-center gap-4 mb-6">
                <button
                  onClick={() => setQuantity(Math.max(1, quantity - 1))}
                  className="btn-secondary px-4"
                >
                  −
                </button>
                <input
                  type="number"
                  value={quantity}
                  readOnly
                  className="w-16 text-center form-input"
                />
                <button
                  onClick={() => setQuantity(quantity + 1)}
                  className="btn-secondary px-4"
                >
                  +
                </button>
              </div>
              <button
                className="btn-primary w-full mb-3 disabled:opacity-50"
                disabled={!inStock}
              >
                <FaShoppingCart className="inline mr-2" />
                Add to Cart
              </button>
              <button className="btn-secondary w-full">
                Save for Later
              </button>
            </div>

            {/* Features */}
            <div className="space-y-3">
              <div className="flex gap-3">
                <FaBox className="text-ksp-red text-xl flex-shrink-0 mt-1" />
                <div>
                  <p className="font-semibold text-ksp-black">Free Shipping</p>
                  <p className="text-sm text-gray-600">On orders over Rs. 5,000</p>
                </div>
              </div>
              <div className="flex gap-3">
                <FaShieldAlt className="text-ksp-red text-xl flex-shrink-0 mt-1" />
                <div>
                  <p className="font-semibold text-ksp-black">2 Year Warranty</p>
                  <p className="text-sm text-gray-600">Official manufacturer warranty included</p>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Reviews Section */}
        <div className="mt-16">
          <h2 className="text-3xl font-bold text-ksp-black mb-8">Customer Reviews</h2>
          <div className="card">
            <p className="text-center text-gray-600 py-12">No reviews yet. Be the first to review this product!</p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ProductDetail;
