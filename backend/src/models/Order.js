const mongoose = require('mongoose');

const orderSchema = new mongoose.Schema({
  orderNumber: {
    type: String,
    required: false, // Will be generated in pre-save hook
    unique: true,
    uppercase: true
  },
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: false // Allow guest orders
  },
  // Guest order information
  guestInfo: {
    firstName: {
      type: String,
      required: function() { return !this.user; }
    },
    lastName: {
      type: String,
      required: function() { return !this.user; }
    },
    email: {
      type: String,
      required: function() { return !this.user; }
    },
    phone: {
      type: String,
      required: function() { return !this.user; }
    }
  },
  // Order items
  items: [{
    product: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Product',
      required: true
    },
    name: {
      type: String,
      required: true
    },
    price: {
      type: Number,
      required: true
    },
    quantity: {
      type: Number,
      required: true,
      min: 1
    },
    image: {
      type: String,
      required: true
    }
  }],
  // Pricing
  pricing: {
    subtotal: {
      type: Number,
      required: true,
      min: 0
    },
    shipping: {
      type: Number,
      required: true,
      min: 0
    },
    tax: {
      type: Number,
      required: true,
      min: 0
    },
    total: {
      type: Number,
      required: true,
      min: 0
    }
  },
  // Addresses
  shippingAddress: {
    street: {
      type: String,
      required: true
    },
    city: {
      type: String,
      required: true
    },
    state: {
      type: String,
      required: false
    },
    zipCode: {
      type: String,
      required: true
    },
    country: {
      type: String,
      required: true,
      default: 'Sweden'
    }
  },
  billingAddress: {
    street: {
      type: String,
      required: true
    },
    city: {
      type: String,
      required: true
    },
    state: {
      type: String,
      required: false
    },
    zipCode: {
      type: String,
      required: true
    },
    country: {
      type: String,
      required: true,
      default: 'Sweden'
    }
  },
  // Payment information
  payment: {
    method: {
      type: String,
      required: true,
      enum: ['card', 'paypal', 'klarna', 'swish'],
      default: 'card'
    },
    status: {
      type: String,
      required: true,
      enum: ['pending', 'paid', 'failed', 'refunded'],
      default: 'pending'
    },
    transactionId: {
      type: String,
      required: false
    },
    paidAt: {
      type: Date,
      required: false
    }
  },
  // Order status
  status: {
    type: String,
    required: true,
    enum: ['pending', 'confirmed', 'processing', 'shipped', 'delivered', 'cancelled', 'refunded'],
    default: 'pending'
  },
  // Shipping information
  shipping: {
    method: {
      type: String,
      required: true,
      default: 'standard'
    },
    trackingNumber: {
      type: String,
      required: false
    },
    carrier: {
      type: String,
      required: false
    },
    estimatedDelivery: {
      type: Date,
      required: false
    },
    shippedAt: {
      type: Date,
      required: false
    },
    deliveredAt: {
      type: Date,
      required: false
    }
  },
  // Order notes
  notes: {
    customer: {
      type: String,
      maxlength: 500
    },
    admin: {
      type: String,
      maxlength: 1000
    }
  },
  // Timestamps
  statusHistory: [{
    status: {
      type: String,
      required: true
    },
    timestamp: {
      type: Date,
      default: Date.now
    },
    note: {
      type: String,
      maxlength: 200
    }
  }]
}, {
  timestamps: true
});

// Generate order number before saving
orderSchema.pre('save', async function(next) {
  if (this.isNew && !this.orderNumber) {
    const count = await mongoose.model('Order').countDocuments();
    this.orderNumber = `WS-${String(count + 1).padStart(8, '0')}`;
  }
  next();
});

// Add status to history when status changes
orderSchema.pre('save', function(next) {
  if (this.isModified('status') && !this.isNew) {
    this.statusHistory.push({
      status: this.status,
      timestamp: new Date()
    });
  }
  next();
});

// Indexes for better query performance
orderSchema.index({ orderNumber: 1 });
orderSchema.index({ user: 1 });
orderSchema.index({ 'guestInfo.email': 1 });
orderSchema.index({ status: 1 });
orderSchema.index({ 'payment.status': 1 });
orderSchema.index({ createdAt: -1 });

// Virtual for formatted order number
orderSchema.virtual('formattedOrderNumber').get(function() {
  return this.orderNumber;
});

// Virtual for order total with currency
orderSchema.virtual('formattedTotal').get(function() {
  return `${this.pricing.total} SEK`;
});

// Method to check if order can be cancelled
orderSchema.methods.canBeCancelled = function() {
  return ['pending', 'confirmed'].includes(this.status);
};

// Method to check if order can be refunded
orderSchema.methods.canBeRefunded = function() {
  return ['delivered', 'shipped'].includes(this.status) && this.payment.status === 'paid';
};

// Method to update order status
orderSchema.methods.updateStatus = function(newStatus, note = '') {
  this.status = newStatus;
  this.statusHistory.push({
    status: newStatus,
    timestamp: new Date(),
    note: note
  });
  return this.save();
};

module.exports = mongoose.model('Order', orderSchema);
