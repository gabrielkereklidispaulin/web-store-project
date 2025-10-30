import React, { useState, useEffect } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { FiCheckCircle, FiShoppingBag, FiMail, FiTruck, FiHome } from 'react-icons/fi';

const OrderSuccess = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const [orderData, setOrderData] = useState(null);

  useEffect(() => {
    // Get order data from navigation state
    if (location.state?.order) {
      console.log('Order Success - Received order data:', location.state.order);
      setOrderData(location.state.order);
    } else {
      // If no order data, redirect to home
      console.log('Order Success - No order data, redirecting to home');
      navigate('/');
    }
  }, [location.state, navigate]);


  if (!orderData) {
    return (
      <div className="min-h-screen bg-white flex items-center justify-center">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-black"></div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        {/* Success Header */}
        <div className="text-center mb-12">
          <div className="mx-auto w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mb-6">
            <FiCheckCircle className="h-8 w-8 text-green-600" />
          </div>
          <h1 className="text-3xl font-light text-black mb-4">Order Confirmed!</h1>
          <p className="text-lg text-primary-600 font-light mb-2">
            Thank you for your purchase. Your order has been successfully placed.
          </p>
          <p className="text-sm text-primary-600">
            Order #{orderData.orderNumber} • Placed on {new Date(orderData.createdAt).toLocaleDateString('en-US', {
              year: 'numeric',
              month: 'long',
              day: 'numeric'
            })}
          </p>
        </div>

        {/* Order Details Card */}
        <div className="bg-white rounded-lg shadow-sm border border-gray-200 overflow-hidden">
          {/* Order Header */}
          <div className="bg-gray-50 px-8 py-6 border-b border-gray-200">
            <div className="flex items-center justify-between">
              <div>
                <h2 className="text-xl font-light text-black">Order Receipt</h2>
                <p className="text-sm text-primary-600">Order #{orderData.orderNumber}</p>
              </div>
              <div className="text-right">
                <p className="text-sm text-primary-600">Order Date</p>
                <p className="font-medium text-black">
                  {new Date(orderData.createdAt).toLocaleDateString('en-US', {
                    year: 'numeric',
                    month: 'long',
                    day: 'numeric'
                  })}
                </p>
              </div>
            </div>
          </div>

          <div className="p-8">
            {/* Customer Information */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-8">
              <div>
                <h3 className="text-lg font-medium text-black mb-4">Customer Information</h3>
                <div className="space-y-2">
                  <p className="text-sm text-primary-600">Name</p>
                  <p className="font-medium text-black">
                    {orderData.guestInfo ? 
                      `${orderData.guestInfo.firstName} ${orderData.guestInfo.lastName}` : 
                      `${orderData.user?.firstName} ${orderData.user?.lastName}`
                    }
                  </p>
                  
                  <p className="text-sm text-primary-600 mt-4">Email</p>
                  <p className="font-medium text-black">
                    {orderData.guestInfo?.email || orderData.user?.email}
                  </p>
                  
                  <p className="text-sm text-primary-600 mt-4">Phone</p>
                  <p className="font-medium text-black">
                    {orderData.guestInfo?.phone || orderData.user?.phone || 'Not provided'}
                  </p>
                </div>
              </div>

              <div>
                <h3 className="text-lg font-medium text-black mb-4">Shipping Address</h3>
                <div className="space-y-2">
                  <p className="font-medium text-black">{orderData.shippingAddress.street}</p>
                  <p className="font-medium text-black">
                    {orderData.shippingAddress.zipCode} {orderData.shippingAddress.city}
                  </p>
                  <p className="font-medium text-black">{orderData.shippingAddress.country}</p>
                </div>
              </div>
            </div>

            {/* Order Items */}
            <div className="mb-8">
              <h3 className="text-lg font-medium text-black mb-4">Order Items</h3>
              <div className="space-y-4">
                {orderData.items.map((item) => (
                  <div key={item.id} className="flex items-center space-x-4 p-4 border border-gray-200 rounded-lg">
                    <img
                      src={item.image}
                      alt={item.name}
                      className="w-16 h-16 object-cover rounded-lg"
                      onError={(e) => {
                        e.target.src = '/placeholder-image.jpg';
                      }}
                    />
                    <div className="flex-1">
                      <h4 className="font-medium text-black">{item.name}</h4>
                      <p className="text-sm text-primary-600">Quantity: {item.quantity}</p>
                    </div>
                    <div className="text-right">
                      <p className="font-medium text-black">{item.price} SEK</p>
                      <p className="text-sm text-primary-600">each</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Order Summary */}
            <div className="border-t border-gray-200 pt-6">
              <div className="max-w-md ml-auto">
                <div className="space-y-3">
                  <div className="flex justify-between">
                    <span className="text-primary-600 font-light">Subtotal</span>
                    <span className="font-medium text-black">{orderData.pricing.subtotal} SEK</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-primary-600 font-light">Shipping</span>
                    <span className="font-medium text-black">
                      {orderData.pricing.shipping === 0 ? 'Free' : `${orderData.pricing.shipping} SEK`}
                    </span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-primary-600 font-light">VAT</span>
                    <span className="font-medium text-black">Included</span>
                  </div>
                  <div className="border-t border-gray-300 pt-3">
                    <div className="flex justify-between">
                      <span className="text-lg font-medium text-black">Total</span>
                      <span className="text-lg font-medium text-black">{orderData.pricing.total} SEK</span>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Delivery Information */}
        <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-8 mt-8">
          <div className="flex items-start space-x-4">
            <div className="flex-shrink-0">
              <FiTruck className="h-6 w-6 text-primary-600" />
            </div>
            <div>
              <h3 className="text-lg font-medium text-black mb-2">Delivery Information</h3>
              <p className="text-primary-600 font-light mb-2">
                Your order will be shipped within 1-2 business days.
              </p>
              <p className="text-primary-600 font-light">
                <strong>Estimated delivery:</strong> 3-5 business days
              </p>
            </div>
          </div>
        </div>

        {/* Email Confirmation */}
        <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-8 mt-8">
          <div className="flex items-start space-x-4">
            <div className="flex-shrink-0">
              <FiMail className="h-6 w-6 text-primary-600" />
            </div>
            <div>
              <h3 className="text-lg font-medium text-black mb-2">Email Confirmation</h3>
              <p className="text-primary-600 font-light">
                A confirmation email has been sent to <strong>{orderData.guestInfo?.email || orderData.user?.email}</strong> 
                with your order details and tracking information.
              </p>
            </div>
          </div>
        </div>

        {/* Action Buttons */}
        <div className="flex flex-col sm:flex-row gap-4 mt-12">
          <Link
            to="/products"
            className="flex items-center justify-center space-x-2 bg-black text-white px-6 py-3 hover:bg-gray-800 transition-colors duration-200"
          >
            <FiShoppingBag className="h-4 w-4" />
            <span>Continue Shopping</span>
          </Link>
          
          <Link
            to="/"
            className="flex items-center justify-center space-x-2 border border-gray-300 text-gray-700 px-6 py-3 hover:bg-gray-50 transition-colors duration-200"
          >
            <FiHome className="h-4 w-4" />
            <span>Back to Home</span>
          </Link>
        </div>

        {/* Print Styles */}
        <style jsx>{`
          @media print {
            body * {
              visibility: hidden;
            }
            .print-area, .print-area * {
              visibility: visible;
            }
            .print-area {
              position: absolute;
              left: 0;
              top: 0;
              width: 100%;
            }
            .no-print {
              display: none !important;
            }
          }
        `}</style>
      </div>
    </div>
  );
};

export default OrderSuccess;
