import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useCart } from '../context/CartContext';
import { useAuth } from '../context/AuthContext';
import { FiMinus, FiPlus, FiTrash2, FiShoppingBag, FiArrowRight } from 'react-icons/fi';
import toast from 'react-hot-toast';

const Cart = () => {
  const { items, totalItems, totalPrice, updateQuantity, removeFromCart, clearCart } = useCart();
  const { isAuthenticated } = useAuth();
  const navigate = useNavigate();

  const handleQuantityChange = (productId, newQuantity) => {
    if (newQuantity < 1) {
      removeFromCart(productId);
      toast.success('Item removed from cart');
    } else {
      updateQuantity(productId, newQuantity);
    }
  };

  const handleRemoveItem = (productId, productName) => {
    removeFromCart(productId);
    toast.success(`${productName} removed from cart`);
  };

  const handleClearCart = () => {
    clearCart();
    toast.success('Cart cleared');
  };

  const handleCheckout = () => {
    if (!isAuthenticated) {
      toast.error('Please login to proceed to checkout');
      navigate('/login', { state: { from: { pathname: '/checkout' } } });
      return;
    }
    navigate('/checkout');
  };

  if (items.length === 0) {
    return (
      <div className="min-h-screen bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
          <div className="text-center">
            <div className="mx-auto w-24 h-24 bg-gray-100 rounded-full flex items-center justify-center mb-8">
              <FiShoppingBag className="h-12 w-12 text-gray-400" />
            </div>
            <h1 className="text-3xl font-light text-black mb-4">Your Cart is Empty</h1>
            <p className="text-primary-600 mb-8 font-light">
              Looks like you haven't added any items to your cart yet.
            </p>
            <Link
              to="/products"
              className="text-sm font-light text-black border border-black px-8 py-4 hover:bg-black hover:text-white transition-colors duration-200"
            >
              Continue Shopping
            </Link>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        {/* Header */}
        <div className="mb-12">
          <h1 className="text-3xl font-light text-black mb-4">Shopping Cart</h1>
          <p className="text-primary-600 font-light">
            {totalItems} {totalItems === 1 ? 'item' : 'items'} in your cart
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-12">
          {/* Cart Items */}
          <div className="lg:col-span-2">
            <div className="space-y-6">
              {items.map((item) => (
                <div key={item.id} className="flex items-center space-x-6 p-6 border border-gray-200 rounded-lg">
                  {/* Product Image */}
                  <div className="flex-shrink-0">
                    <img
                      src={item.image}
                      alt={item.name}
                      className="w-24 h-24 object-cover rounded-lg"
                      onError={(e) => {
                        e.target.src = '/placeholder-image.jpg';
                      }}
                    />
                  </div>

                  {/* Product Info */}
                  <div className="flex-1 min-w-0">
                    <h3 className="text-lg font-light text-black mb-2">{item.name}</h3>
                    <p className="text-lg font-light text-black">
                      {item.price} SEK
                    </p>
                  </div>

                  {/* Quantity Controls */}
                  <div className="flex items-center space-x-3">
                    <button
                      onClick={() => handleQuantityChange(item.id, item.quantity - 1)}
                      className="p-2 hover:bg-gray-50 rounded-md transition-colors"
                    >
                      <FiMinus className="h-4 w-4" />
                    </button>
                    <span className="w-12 text-center font-medium">{item.quantity}</span>
                    <button
                      onClick={() => handleQuantityChange(item.id, item.quantity + 1)}
                      className="p-2 hover:bg-gray-50 rounded-md transition-colors"
                    >
                      <FiPlus className="h-4 w-4" />
                    </button>
                  </div>

                  {/* Item Total */}
                  <div className="text-right">
                    <p className="text-lg font-light text-black">
                      {(item.price * item.quantity)} SEK
                    </p>
                  </div>

                  {/* Remove Button */}
                  <button
                    onClick={() => handleRemoveItem(item.id, item.name)}
                    className="p-2 text-red-600 hover:bg-red-50 rounded-md transition-colors"
                  >
                    <FiTrash2 className="h-4 w-4" />
                  </button>
                </div>
              ))}
            </div>

            {/* Clear Cart Button */}
            <div className="mt-8">
              <button
                onClick={handleClearCart}
                className="text-sm font-light text-red-600 hover:text-red-800 transition-colors"
              >
                Clear Cart
              </button>
            </div>
          </div>

          {/* Order Summary */}
          <div className="lg:col-span-1">
            <div className="bg-gray-50 p-8 rounded-lg sticky top-8">
              <h2 className="text-xl font-light text-black mb-6">Order Summary</h2>
              
              <div className="space-y-4 mb-6">
                <div className="flex justify-between">
                  <span className="text-primary-600 font-light">Subtotal</span>
                  <span className="font-light text-black">{totalPrice} SEK</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-primary-600 font-light">Shipping</span>
                  <span className="font-light text-black">
                    {totalPrice >= 500 ? 'Free' : '50 SEK'}
                  </span>
                </div>
                <div className="flex justify-between">
                  <span className="text-primary-600 font-light">VAT</span>
                  <span className="font-light text-black">Included</span>
                </div>
                <div className="border-t border-gray-300 pt-4">
                  <div className="flex justify-between">
                    <span className="text-lg font-light text-black">Total</span>
                    <span className="text-lg font-light text-black">
                      {totalPrice >= 500 
                        ? totalPrice
                        : totalPrice + 50
                      } SEK
                    </span>
                  </div>
                </div>
              </div>

              <div className="space-y-4">
                <button
                  onClick={handleCheckout}
                  className="w-full bg-black text-white px-6 py-4 hover:bg-gray-800 transition-colors duration-200 flex items-center justify-center space-x-2"
                >
                  <span>Proceed to Checkout</span>
                  <FiArrowRight className="h-4 w-4" />
                </button>
                
                <Link
                  to="/products"
                  className="w-full text-center text-sm font-light text-black border border-black px-6 py-4 hover:bg-black hover:text-white transition-colors duration-200 block"
                >
                  Continue Shopping
                </Link>
              </div>

              {/* Shipping Info */}
              <div className="mt-8 pt-6 border-t border-gray-300">
                <div className="flex items-center space-x-2 text-sm text-primary-600">
                  <FiShoppingBag className="h-4 w-4" />
                  <span>Free shipping on orders over 500 SEK</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Cart;
