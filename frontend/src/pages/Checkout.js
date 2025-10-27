import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useCart } from '../context/CartContext';
import { useAuth } from '../context/AuthContext';
import { ordersAPI } from '../services/api';
import { FiUser, FiMail, FiPhone, FiMapPin, FiCreditCard, FiLock, FiArrowLeft, FiCheck } from 'react-icons/fi';
import toast from 'react-hot-toast';

const Checkout = () => {
  const { items, totalItems, totalPrice, clearCart } = useCart();
  const { user, isAuthenticated } = useAuth();
  const navigate = useNavigate();

  const [formData, setFormData] = useState({
    // Personal Information
    firstName: user?.firstName || '',
    lastName: user?.lastName || '',
    email: user?.email || '',
    phone: user?.phone || '',
    
    // Shipping Address
    shippingAddress: {
      street: user?.address?.street || '',
      city: user?.address?.city || '',
      state: user?.address?.state || '',
      zipCode: user?.address?.zipCode || '',
      country: user?.address?.country || 'Sweden'
    },
    
    // Billing Address (same as shipping by default)
    billingAddress: {
      sameAsShipping: true,
      street: '',
      city: '',
      state: '',
      zipCode: '',
      country: 'Sweden'
    },
    
    // Payment Information
    paymentMethod: 'card',
    cardNumber: '',
    expiryDate: '',
      cvv: '',
    cardName: '',
    
    // Order Information
    orderNotes: '',
    newsletter: false,
    termsAccepted: false
  });

  const [currentStep, setCurrentStep] = useState(1);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [errors, setErrors] = useState({});

  // Redirect if cart is empty
  useEffect(() => {
    if (items.length === 0) {
      navigate('/cart');
    }
  }, [items, navigate]);

  const handleInputChange = (e) => {
    const { name, value, type, checked } = e.target;
    
    if (name.includes('.')) {
      const [parent, child] = name.split('.');
      setFormData(prev => ({
        ...prev,
        [parent]: {
          ...prev[parent],
          [child]: value
        }
      }));
    } else {
      setFormData(prev => ({
        ...prev,
        [name]: type === 'checkbox' ? checked : value
      }));
    }
    
    // Clear error when user starts typing
    if (errors[name]) {
      setErrors(prev => ({
        ...prev,
        [name]: ''
      }));
    }
  };

  const validateStep = (step) => {
    const newErrors = {};

    if (step === 1) {
      // Personal Information
      if (!formData.firstName.trim()) newErrors.firstName = 'First name is required';
      if (!formData.lastName.trim()) newErrors.lastName = 'Last name is required';
      if (!formData.email.trim()) newErrors.email = 'Email is required';
      else if (!/\S+@\S+\.\S+/.test(formData.email)) newErrors.email = 'Email is invalid';
      if (!formData.phone.trim()) newErrors.phone = 'Phone number is required';
    }

    if (step === 2) {
      // Shipping Address
      if (!formData.shippingAddress.street.trim()) newErrors['shippingAddress.street'] = 'Street address is required';
      if (!formData.shippingAddress.city.trim()) newErrors['shippingAddress.city'] = 'City is required';
      if (!formData.shippingAddress.zipCode.trim()) newErrors['shippingAddress.zipCode'] = 'ZIP code is required';
      if (!formData.shippingAddress.country.trim()) newErrors['shippingAddress.country'] = 'Country is required';
    }

    if (step === 3) {
      // Payment Information
      if (!formData.cardNumber.trim()) newErrors.cardNumber = 'Card number is required';
      if (!formData.expiryDate.trim()) newErrors.expiryDate = 'Expiry date is required';
      if (!formData.cvv.trim()) newErrors.cvv = 'CVV is required';
      if (!formData.cardName.trim()) newErrors.cardName = 'Cardholder name is required';
    }

    if (step === 4) {
      // Terms and Conditions
      if (!formData.termsAccepted) newErrors.termsAccepted = 'You must accept the terms and conditions';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleNext = () => {
    if (validateStep(currentStep)) {
      setCurrentStep(prev => prev + 1);
    }
  };

  const handlePrevious = () => {
    setCurrentStep(prev => prev - 1);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!validateStep(4)) {
      return;
    }

    setIsSubmitting(true);

    try {
      // Prepare order data
      const orderData = {
        items: items.map(item => ({
          product: item.id,
          quantity: item.quantity
        })),
        shippingAddress: {
          street: formData.shippingAddress.street,
          city: formData.shippingAddress.city,
          state: formData.shippingAddress.state,
          zipCode: formData.shippingAddress.zipCode,
          country: formData.shippingAddress.country
        },
        billingAddress: formData.billingAddress.sameAsShipping ? formData.shippingAddress : {
          street: formData.billingAddress.street,
          city: formData.billingAddress.city,
          state: formData.billingAddress.state,
          zipCode: formData.billingAddress.zipCode,
          country: formData.billingAddress.country
        },
        payment: {
          method: formData.paymentMethod
        },
        notes: {
          customer: formData.orderNotes || ''
        }
      };

      // Add guest info if not logged in
      if (!isAuthenticated) {
        orderData.firstName = formData.firstName;
        orderData.lastName = formData.lastName;
        orderData.email = formData.email;
        orderData.phone = formData.phone;
      }

      // Create the order
      const response = await ordersAPI.createOrder(orderData);
      
      if (response.data.success) {
        // Clear cart
        clearCart();
        
        // Show success message
        toast.success('Order placed successfully!');
        
        // Redirect to success page with order data
        navigate('/order-success', { 
          state: { 
            order: response.data.data.order,
            orderNumber: response.data.data.order.orderNumber 
          } 
        });
      } else {
        toast.error(response.data.message || 'Failed to place order');
      }
      
    } catch (error) {
      console.error('Order creation error:', error);
      toast.error(error.response?.data?.message || 'Failed to place order. Please try again.');
    } finally {
      setIsSubmitting(false);
    }
  };

  const calculateShipping = () => {
    return totalPrice >= 500 ? 0 : 50;
  };

  const calculateTotal = () => {
    return totalPrice + calculateShipping();
  };

  if (items.length === 0) {
    return null; // Will redirect to cart
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        {/* Header */}
        <div className="mb-12">
          <button
            onClick={() => navigate('/cart')}
            className="flex items-center space-x-2 text-primary-600 hover:text-black transition-colors mb-4"
          >
            <FiArrowLeft className="h-4 w-4" />
            <span>Back to Cart</span>
          </button>
          <h1 className="text-3xl font-light text-black mb-4">Checkout</h1>
          <p className="text-primary-600 font-light">
            Complete your order in {5 - currentStep} step{5 - currentStep !== 1 ? 's' : ''}
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-12">
          {/* Checkout Form */}
          <div className="lg:col-span-2">
            <form onSubmit={handleSubmit}>
              {/* Step 1: Personal Information */}
              {currentStep === 1 && (
                <div className="bg-white p-8 rounded-lg shadow-sm">
                  <h2 className="text-xl font-light text-black mb-6">Personal Information</h2>
                  
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div>
                      <label className="block text-sm font-medium text-black mb-2">
                        First Name *
                      </label>
                      <div className="relative">
                        <FiUser className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
                        <input
                          type="text"
                          name="firstName"
                          value={formData.firstName}
                          onChange={handleInputChange}
                          className={`w-full pl-10 pr-4 py-3 border rounded-md focus:outline-none focus:ring-2 focus:ring-black ${
                            errors.firstName ? 'border-red-300' : 'border-gray-300'
                          }`}
                          placeholder="First name"
                        />
                      </div>
                      {errors.firstName && (
                        <p className="mt-1 text-sm text-red-600">{errors.firstName}</p>
                      )}
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-black mb-2">
                        Last Name *
                      </label>
                      <div className="relative">
                        <FiUser className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
                        <input
                          type="text"
                          name="lastName"
                          value={formData.lastName}
                          onChange={handleInputChange}
                          className={`w-full pl-10 pr-4 py-3 border rounded-md focus:outline-none focus:ring-2 focus:ring-black ${
                            errors.lastName ? 'border-red-300' : 'border-gray-300'
                          }`}
                          placeholder="Last name"
                        />
                      </div>
                      {errors.lastName && (
                        <p className="mt-1 text-sm text-red-600">{errors.lastName}</p>
                      )}
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-black mb-2">
                        Email Address *
                      </label>
                      <div className="relative">
                        <FiMail className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
                        <input
                          type="email"
                          name="email"
                          value={formData.email}
                          onChange={handleInputChange}
                          className={`w-full pl-10 pr-4 py-3 border rounded-md focus:outline-none focus:ring-2 focus:ring-black ${
                            errors.email ? 'border-red-300' : 'border-gray-300'
                          }`}
                          placeholder="Email address"
                        />
                      </div>
                      {errors.email && (
                        <p className="mt-1 text-sm text-red-600">{errors.email}</p>
                      )}
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-black mb-2">
                        Phone Number *
                      </label>
                      <div className="relative">
                        <FiPhone className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
                        <input
                          type="tel"
                          name="phone"
                          value={formData.phone}
                          onChange={handleInputChange}
                          className={`w-full pl-10 pr-4 py-3 border rounded-md focus:outline-none focus:ring-2 focus:ring-black ${
                            errors.phone ? 'border-red-300' : 'border-gray-300'
                          }`}
                          placeholder="Phone number"
                        />
                      </div>
                      {errors.phone && (
                        <p className="mt-1 text-sm text-red-600">{errors.phone}</p>
                      )}
                    </div>
                  </div>

                  <div className="mt-8">
                    <button
                      type="button"
                      onClick={handleNext}
                      className="w-full bg-black text-white px-6 py-4 hover:bg-gray-800 transition-colors duration-200"
                    >
                      Continue to Shipping
                    </button>
                  </div>
                </div>
              )}

              {/* Step 2: Shipping Address */}
              {currentStep === 2 && (
                <div className="bg-white p-8 rounded-lg shadow-sm">
                  <h2 className="text-xl font-light text-black mb-6">Shipping Address</h2>
                  
                  <div className="space-y-6">
                    <div>
                      <label className="block text-sm font-medium text-black mb-2">
                        Street Address *
                      </label>
                      <div className="relative">
                        <FiMapPin className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
                        <input
                          type="text"
                          name="shippingAddress.street"
                          value={formData.shippingAddress.street}
                          onChange={handleInputChange}
                          className={`w-full pl-10 pr-4 py-3 border rounded-md focus:outline-none focus:ring-2 focus:ring-black ${
                            errors['shippingAddress.street'] ? 'border-red-300' : 'border-gray-300'
                          }`}
                          placeholder="Street address"
                        />
                      </div>
                      {errors['shippingAddress.street'] && (
                        <p className="mt-1 text-sm text-red-600">{errors['shippingAddress.street']}</p>
                      )}
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                      <div>
                        <label className="block text-sm font-medium text-black mb-2">
                          City *
                        </label>
                        <input
                          type="text"
                          name="shippingAddress.city"
                          value={formData.shippingAddress.city}
                          onChange={handleInputChange}
                          className={`w-full px-4 py-3 border rounded-md focus:outline-none focus:ring-2 focus:ring-black ${
                            errors['shippingAddress.city'] ? 'border-red-300' : 'border-gray-300'
                          }`}
                          placeholder="City"
                        />
                        {errors['shippingAddress.city'] && (
                          <p className="mt-1 text-sm text-red-600">{errors['shippingAddress.city']}</p>
                        )}
                      </div>

                      <div>
                        <label className="block text-sm font-medium text-black mb-2">
                          State/Province
                        </label>
                        <input
                          type="text"
                          name="shippingAddress.state"
                          value={formData.shippingAddress.state}
                          onChange={handleInputChange}
                          className="w-full px-4 py-3 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-black"
                          placeholder="State"
                        />
                      </div>

                      <div>
                        <label className="block text-sm font-medium text-black mb-2">
                          ZIP Code *
                        </label>
                        <input
                          type="text"
                          name="shippingAddress.zipCode"
                          value={formData.shippingAddress.zipCode}
                          onChange={handleInputChange}
                          className={`w-full px-4 py-3 border rounded-md focus:outline-none focus:ring-2 focus:ring-black ${
                            errors['shippingAddress.zipCode'] ? 'border-red-300' : 'border-gray-300'
                          }`}
                          placeholder="ZIP code"
                        />
                        {errors['shippingAddress.zipCode'] && (
                          <p className="mt-1 text-sm text-red-600">{errors['shippingAddress.zipCode']}</p>
                        )}
                      </div>
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-black mb-2">
                        Country *
                      </label>
                      <select
                        name="shippingAddress.country"
                        value={formData.shippingAddress.country}
                        onChange={handleInputChange}
                        className={`w-full px-4 py-3 border rounded-md focus:outline-none focus:ring-2 focus:ring-black ${
                          errors['shippingAddress.country'] ? 'border-red-300' : 'border-gray-300'
                        }`}
                      >
                        <option value="Sweden">Sweden</option>
                        <option value="Norway">Norway</option>
                        <option value="Denmark">Denmark</option>
                        <option value="Finland">Finland</option>
                        <option value="Germany">Germany</option>
                        <option value="Other">Other</option>
                      </select>
                      {errors['shippingAddress.country'] && (
                        <p className="mt-1 text-sm text-red-600">{errors['shippingAddress.country']}</p>
                      )}
                    </div>
                  </div>

                  <div className="mt-8 flex space-x-4">
                    <button
                      type="button"
                      onClick={handlePrevious}
                      className="flex-1 border border-gray-300 text-gray-700 px-6 py-4 hover:bg-gray-50 transition-colors duration-200"
                    >
                      Back
                    </button>
                    <button
                      type="button"
                      onClick={handleNext}
                      className="flex-1 bg-black text-white px-6 py-4 hover:bg-gray-800 transition-colors duration-200"
                    >
                      Continue to Payment
                    </button>
                  </div>
                </div>
              )}

              {/* Step 3: Payment Information */}
              {currentStep === 3 && (
                <div className="bg-white p-8 rounded-lg shadow-sm">
                  <h2 className="text-xl font-light text-black mb-6">Payment Information</h2>
                  
                  <div className="space-y-6">
                    <div>
                      <label className="block text-sm font-medium text-black mb-2">
                        Cardholder Name *
                      </label>
                      <div className="relative">
                        <FiUser className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
                        <input
                          type="text"
                          name="cardName"
                          value={formData.cardName}
                          onChange={handleInputChange}
                          className={`w-full pl-10 pr-4 py-3 border rounded-md focus:outline-none focus:ring-2 focus:ring-black ${
                            errors.cardName ? 'border-red-300' : 'border-gray-300'
                          }`}
                          placeholder="Name on card"
                        />
                      </div>
                      {errors.cardName && (
                        <p className="mt-1 text-sm text-red-600">{errors.cardName}</p>
                      )}
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-black mb-2">
                        Card Number *
                      </label>
                      <div className="relative">
                        <FiCreditCard className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
                        <input
                          type="text"
                          name="cardNumber"
                          value={formData.cardNumber}
                          onChange={handleInputChange}
                          className={`w-full pl-10 pr-4 py-3 border rounded-md focus:outline-none focus:ring-2 focus:ring-black ${
                            errors.cardNumber ? 'border-red-300' : 'border-gray-300'
                          }`}
                          placeholder="1234 5678 9012 3456"
                          maxLength="19"
                        />
                      </div>
                      {errors.cardNumber && (
                        <p className="mt-1 text-sm text-red-600">{errors.cardNumber}</p>
                      )}
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                      <div>
                        <label className="block text-sm font-medium text-black mb-2">
                          Expiry Date *
                        </label>
                        <input
                          type="text"
                          name="expiryDate"
                          value={formData.expiryDate}
                          onChange={handleInputChange}
                          className={`w-full px-4 py-3 border rounded-md focus:outline-none focus:ring-2 focus:ring-black ${
                            errors.expiryDate ? 'border-red-300' : 'border-gray-300'
                          }`}
                          placeholder="MM/YY"
                          maxLength="5"
                        />
                        {errors.expiryDate && (
                          <p className="mt-1 text-sm text-red-600">{errors.expiryDate}</p>
                        )}
                      </div>

                      <div>
                        <label className="block text-sm font-medium text-black mb-2">
                          CVV *
                        </label>
                        <div className="relative">
                          <FiLock className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
                          <input
                            type="text"
                            name="cvv"
                            value={formData.cvv}
                            onChange={handleInputChange}
                            className={`w-full pl-10 pr-4 py-3 border rounded-md focus:outline-none focus:ring-2 focus:ring-black ${
                              errors.cvv ? 'border-red-300' : 'border-gray-300'
                            }`}
                            placeholder="123"
                            maxLength="4"
                          />
                        </div>
                        {errors.cvv && (
                          <p className="mt-1 text-sm text-red-600">{errors.cvv}</p>
                        )}
                      </div>
                    </div>
                  </div>

                  <div className="mt-8 flex space-x-4">
                    <button
                      type="button"
                      onClick={handlePrevious}
                      className="flex-1 border border-gray-300 text-gray-700 px-6 py-4 hover:bg-gray-50 transition-colors duration-200"
                    >
                      Back
                    </button>
                    <button
                      type="button"
                      onClick={handleNext}
                      className="flex-1 bg-black text-white px-6 py-4 hover:bg-gray-800 transition-colors duration-200"
                    >
                      Review Order
                    </button>
                  </div>
                </div>
              )}

              {/* Step 4: Review & Place Order */}
              {currentStep === 4 && (
                <div className="bg-white p-8 rounded-lg shadow-sm">
                  <h2 className="text-xl font-light text-black mb-6">Review Your Order</h2>
                  
                  {/* Order Summary */}
                  <div className="space-y-4 mb-8">
                    <h3 className="text-lg font-medium text-black">Order Items</h3>
                    {items.map((item) => (
                      <div key={item.id} className="flex items-center space-x-4 p-4 border border-gray-200 rounded-lg">
                        <img
                          src={item.image}
                          alt={item.name}
                          className="w-16 h-16 object-cover rounded-lg"
                        />
                        <div className="flex-1">
                          <h4 className="font-medium text-black">{item.name}</h4>
                          <p className="text-sm text-primary-600">Quantity: {item.quantity}</p>
                        </div>
                        <p className="font-medium text-black">{item.price * item.quantity} SEK</p>
                      </div>
                    ))}
                  </div>

                  {/* Terms and Conditions */}
                  <div className="mb-8">
                    <label className="flex items-start space-x-3">
                      <input
                        type="checkbox"
                        name="termsAccepted"
                        checked={formData.termsAccepted}
                        onChange={handleInputChange}
                        className="mt-1 h-4 w-4 text-black focus:ring-black border-gray-300 rounded"
                      />
                      <span className="text-sm text-gray-700">
                        I agree to the{' '}
                        <a href="#" className="text-black underline hover:no-underline">
                          Terms and Conditions
                        </a>{' '}
                        and{' '}
                        <a href="#" className="text-black underline hover:no-underline">
                          Privacy Policy
                        </a>
                      </span>
                    </label>
                    {errors.termsAccepted && (
                      <p className="mt-1 text-sm text-red-600">{errors.termsAccepted}</p>
                    )}
                  </div>

                  <div className="flex space-x-4">
                    <button
                      type="button"
                      onClick={handlePrevious}
                      className="flex-1 border border-gray-300 text-gray-700 px-6 py-4 hover:bg-gray-50 transition-colors duration-200"
                    >
                      Back
                    </button>
                    <button
                      type="submit"
                      disabled={isSubmitting}
                      className="flex-1 bg-black text-white px-6 py-4 hover:bg-gray-800 disabled:opacity-50 disabled:cursor-not-allowed transition-colors duration-200 flex items-center justify-center space-x-2"
                    >
                      {isSubmitting ? (
                        <>
                          <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white"></div>
                          <span>Processing...</span>
                        </>
                      ) : (
                        <>
                          <FiCheck className="h-4 w-4" />
                          <span>Place Order</span>
                        </>
                      )}
                    </button>
                  </div>
                </div>
              )}
            </form>
          </div>

          {/* Order Summary Sidebar */}
          <div className="lg:col-span-1">
            <div className="bg-white p-8 rounded-lg shadow-sm sticky top-8">
              <h2 className="text-xl font-light text-black mb-6">Order Summary</h2>
              
              <div className="space-y-4 mb-6">
                <div className="flex justify-between">
                  <span className="text-primary-600 font-light">Subtotal</span>
                  <span className="font-light text-black">{totalPrice} SEK</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-primary-600 font-light">Shipping</span>
                  <span className="font-light text-black">
                    {calculateShipping() === 0 ? 'Free' : `${calculateShipping()} SEK`}
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
                      {calculateTotal()} SEK
                    </span>
                  </div>
                </div>
              </div>

              {/* Security Info */}
              <div className="mt-8 pt-6 border-t border-gray-300">
                <div className="flex items-center space-x-2 text-sm text-primary-600">
                  <FiLock className="h-4 w-4" />
                  <span>Secure payment processing</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Checkout;
