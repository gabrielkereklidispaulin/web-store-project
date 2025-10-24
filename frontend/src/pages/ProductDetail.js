import React, { useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useQuery } from 'react-query';
import { useCart } from '../context/CartContext';
import { useAuth } from '../context/AuthContext';
import { productsAPI } from '../services/api';
import { FiShoppingCart, FiHeart, FiShare2, FiStar, FiMinus, FiPlus, FiTruck, FiShield, FiRotateCcw } from 'react-icons/fi';
import toast from 'react-hot-toast';

const ProductDetail = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { addToCart, isInCart, getCartItem } = useCart();
  const { isAuthenticated } = useAuth();
  const [selectedImageIndex, setSelectedImageIndex] = useState(0);
  const [quantity, setQuantity] = useState(1);
  const [selectedVariant, setSelectedVariant] = useState(null);

  const { data, isLoading, error } = useQuery(
    ['product', id],
    () => productsAPI.getProduct(id).then(res => res.data),
    {
      select: (data) => data.data.product,
    }
  );

  const product = data;

  const handleAddToCart = () => {
    if (product.inventory?.trackQuantity && product.inventory?.quantity <= 0) {
      toast.error('This product is out of stock');
      return;
    }

    addToCart(product, quantity);
    toast.success(`${product.name} added to cart!`);
  };

  const handleQuantityChange = (newQuantity) => {
    const maxQuantity = product?.inventory?.quantity || 999;
    if (newQuantity >= 1 && newQuantity <= maxQuantity) {
      setQuantity(newQuantity);
    }
  };

  const handleBuyNow = () => {
    if (product.inventory?.trackQuantity && product.inventory?.quantity <= 0) {
      toast.error('This product is out of stock');
      return;
    }

    addToCart(product, quantity);
    navigate('/checkout');
  };

  if (isLoading) {
    return (
      <div className="min-h-screen bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <div className="animate-pulse">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
              <div className="space-y-4">
                <div className="h-96 bg-gray-200 rounded-lg"></div>
                <div className="flex space-x-2">
                  {[...Array(4)].map((_, i) => (
                    <div key={i} className="h-20 w-20 bg-gray-200 rounded"></div>
                  ))}
                </div>
              </div>
              <div className="space-y-4">
                <div className="h-8 bg-gray-200 rounded w-3/4"></div>
                <div className="h-4 bg-gray-200 rounded w-1/2"></div>
                <div className="h-6 bg-gray-200 rounded w-1/4"></div>
                <div className="h-32 bg-gray-200 rounded"></div>
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }

  if (error || !product) {
    return (
      <div className="min-h-screen bg-white flex items-center justify-center">
        <div className="text-center">
          <h2 className="text-2xl font-light text-black mb-4">Product Not Found</h2>
          <p className="text-primary-600 mb-8 font-light">The product you're looking for doesn't exist.</p>
          <button
            onClick={() => navigate('/products')}
            className="text-sm font-light text-black border border-black px-6 py-3 hover:bg-black hover:text-white transition-colors duration-200"
          >
            Back to Products
          </button>
        </div>
      </div>
    );
  }

  const cartItem = getCartItem(product._id);
  const isInCartItem = isInCart(product._id);

  return (
    <div className="min-h-screen bg-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Breadcrumb */}
        <nav className="mb-8">
          <div className="flex items-center space-x-2 text-sm text-primary-600">
            <button onClick={() => navigate('/')} className="hover:text-black transition-colors">
              Home
            </button>
            <span>/</span>
            <button onClick={() => navigate('/products')} className="hover:text-black transition-colors">
              Products
            </button>
            <span>/</span>
            <span className="text-black">{product.name}</span>
          </div>
        </nav>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
          {/* Product Images */}
          <div className="space-y-4">
            <div className="aspect-square bg-gray-50 rounded-lg overflow-hidden">
              <img
                src={product.images?.[selectedImageIndex]?.url || '/placeholder-image.jpg'}
                alt={product.name}
                className="w-full h-full object-cover"
                onError={(e) => {
                  e.target.src = '/placeholder-image.jpg';
                }}
              />
            </div>
            
            {product.images && product.images.length > 1 && (
              <div className="flex space-x-2">
                {product.images.map((image, index) => (
                  <button
                    key={index}
                    onClick={() => setSelectedImageIndex(index)}
                    className={`w-20 h-20 rounded-lg overflow-hidden border-2 ${
                      selectedImageIndex === index ? 'border-black' : 'border-gray-200'
                    }`}
                  >
                    <img
                      src={image.url}
                      alt={`${product.name} ${index + 1}`}
                      className="w-full h-full object-cover"
                      onError={(e) => {
                        e.target.src = '/placeholder-image.jpg';
                      }}
                    />
                  </button>
                ))}
              </div>
            )}
          </div>

          {/* Product Info */}
          <div className="space-y-8">
            <div>
              <h1 className="text-3xl font-light text-black mb-4">{product.name}</h1>
              <p className="text-lg text-primary-600 font-light mb-6">{product.shortDescription}</p>
              
              {/* Price */}
              <div className="flex items-center space-x-4 mb-6">
                <span className="text-3xl font-light text-black">
                  {product.price} SEK
                </span>
                {product.comparePrice && product.comparePrice > product.price && (
                  <>
                    <span className="text-xl text-primary-400 line-through">
                      {product.comparePrice} SEK
                    </span>
                    <span className="bg-red-100 text-red-800 text-sm px-2 py-1 rounded">
                      {Math.round(((product.comparePrice - product.price) / product.comparePrice) * 100)}% OFF
                    </span>
                  </>
                )}
              </div>

              {/* Rating */}
              {product.ratings && product.ratings.count > 0 && (
                <div className="flex items-center space-x-2 mb-6">
                  <div className="flex items-center">
                    {[...Array(5)].map((_, i) => (
                      <FiStar
                        key={i}
                        className={`h-4 w-4 ${
                          i < Math.floor(product.ratings.average)
                            ? 'text-yellow-400 fill-current'
                            : 'text-gray-300'
                        }`}
                      />
                    ))}
                  </div>
                  <span className="text-sm text-primary-600">
                    {product.ratings.average.toFixed(1)} ({product.ratings.count} reviews)
                  </span>
                </div>
              )}

              {/* Stock Status */}
              <div className="mb-6">
                {(product.inventory?.trackQuantity ? product.inventory?.quantity > 0 : true) ? (
                  <span className="text-green-600 text-sm font-medium">
                    ✓ In Stock
                    {product.inventory?.trackQuantity && ` (${product.inventory.quantity} available)`}
                  </span>
                ) : (
                  <span className="text-red-600 text-sm font-medium">✗ Out of Stock</span>
                )}
              </div>
            </div>

            {/* Variants */}
            {product.variants && product.variants.length > 0 && (
              <div className="space-y-4">
                {product.variants.map((variant, index) => (
                  <div key={index}>
                    <h3 className="text-sm font-medium text-black mb-2">{variant.name}</h3>
                    <div className="flex flex-wrap gap-2">
                      {variant.options.map((option, optionIndex) => (
                        <button
                          key={optionIndex}
                          onClick={() => setSelectedVariant({ variantIndex: index, optionIndex })}
                          className={`px-4 py-2 text-sm border rounded-md transition-colors ${
                            selectedVariant?.variantIndex === index && selectedVariant?.optionIndex === optionIndex
                              ? 'border-black bg-black text-white'
                              : 'border-gray-300 hover:border-black'
                          }`}
                        >
                          {option.name}
                          {option.priceAdjustment !== 0 && (
                            <span className="ml-1 text-xs">
                              {option.priceAdjustment > 0 ? '+' : ''}{option.priceAdjustment} SEK
                            </span>
                          )}
                        </button>
                      ))}
                    </div>
                  </div>
                ))}
              </div>
            )}

            {/* Quantity */}
            <div className="space-y-4">
              <h3 className="text-sm font-medium text-black">Quantity</h3>
              <div className="flex items-center space-x-4">
                <div className="flex items-center border border-gray-300 rounded-md">
                  <button
                    onClick={() => handleQuantityChange(quantity - 1)}
                    disabled={quantity <= 1}
                    className="p-2 hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    <FiMinus className="h-4 w-4" />
                  </button>
                  <span className="px-4 py-2 text-sm font-medium">{quantity}</span>
                  <button
                    onClick={() => handleQuantityChange(quantity + 1)}
                    disabled={quantity >= (product.inventory?.quantity || 999)}
                    className="p-2 hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    <FiPlus className="h-4 w-4" />
                  </button>
                </div>
                {cartItem && (
                  <span className="text-sm text-primary-600">
                    {cartItem.quantity} in cart
                  </span>
                )}
              </div>
            </div>

            {/* Action Buttons */}
            <div className="space-y-4">
              <div className="flex space-x-4">
                <button
                  onClick={handleAddToCart}
                  disabled={product.inventory?.trackQuantity && product.inventory?.quantity <= 0}
                  className="flex-1 flex items-center justify-center space-x-2 bg-black text-white px-6 py-3 hover:bg-gray-800 disabled:opacity-50 disabled:cursor-not-allowed transition-colors duration-200"
                >
                  <FiShoppingCart className="h-5 w-5" />
                  <span>{isInCartItem ? 'Update Cart' : 'Add to Cart'}</span>
                </button>
                <button
                  onClick={handleBuyNow}
                  disabled={product.inventory?.trackQuantity && product.inventory?.quantity <= 0}
                  className="flex-1 bg-primary-600 text-white px-6 py-3 hover:bg-primary-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors duration-200"
                >
                  Buy Now
                </button>
              </div>

              <div className="flex space-x-4">
                <button className="flex items-center space-x-2 text-primary-600 hover:text-black transition-colors">
                  <FiHeart className="h-5 w-5" />
                  <span>Add to Wishlist</span>
                </button>
                <button className="flex items-center space-x-2 text-primary-600 hover:text-black transition-colors">
                  <FiShare2 className="h-5 w-5" />
                  <span>Share</span>
                </button>
              </div>
            </div>

            {/* Features */}
            <div className="border-t pt-8">
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-6">
                <div className="flex items-center space-x-3">
                  <FiTruck className="h-6 w-6 text-primary-600" />
                  <div>
                    <h4 className="text-sm font-medium text-black">Free Shipping</h4>
                    <p className="text-xs text-primary-600">On orders over 500 SEK</p>
                  </div>
                </div>
                <div className="flex items-center space-x-3">
                  <FiShield className="h-6 w-6 text-primary-600" />
                  <div>
                    <h4 className="text-sm font-medium text-black">Secure Payment</h4>
                    <p className="text-xs text-primary-600">Your data is protected</p>
                  </div>
                </div>
                <div className="flex items-center space-x-3">
                  <FiRotateCcw className="h-6 w-6 text-primary-600" />
                  <div>
                    <h4 className="text-sm font-medium text-black">Easy Returns</h4>
                    <p className="text-xs text-primary-600">30-day return policy</p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Product Description */}
        <div className="mt-16 border-t pt-16">
          <div className="max-w-4xl">
            <h2 className="text-2xl font-light text-black mb-8">Product Description</h2>
            <div className="prose prose-lg max-w-none">
              <p className="text-primary-600 font-light leading-relaxed whitespace-pre-line">
                {product.description}
              </p>
            </div>
          </div>
        </div>

        {/* Reviews */}
        {product.reviews && product.reviews.length > 0 && (
          <div className="mt-16 border-t pt-16">
            <h2 className="text-2xl font-light text-black mb-8">Customer Reviews</h2>
            <div className="space-y-6">
              {product.reviews.map((review, index) => (
                <div key={index} className="border-b border-gray-200 pb-6">
                  <div className="flex items-center justify-between mb-2">
                    <div className="flex items-center space-x-2">
                      <span className="font-medium text-black">
                        {review.user?.firstName} {review.user?.lastName}
                      </span>
                      <div className="flex items-center">
                        {[...Array(5)].map((_, i) => (
                          <FiStar
                            key={i}
                            className={`h-4 w-4 ${
                              i < review.rating ? 'text-yellow-400 fill-current' : 'text-gray-300'
                            }`}
                          />
                        ))}
                      </div>
                    </div>
                    <span className="text-sm text-primary-600">
                      {new Date(review.createdAt).toLocaleDateString()}
                    </span>
                  </div>
                  {review.comment && (
                    <p className="text-primary-600 font-light">{review.comment}</p>
                  )}
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default ProductDetail;
