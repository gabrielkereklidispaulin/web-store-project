# WebStore - E-commerce Platform

A full-stack e-commerce application built with React frontend and Node.js/Express backend.

## 🚀 Features

### Backend (Complete)
- **Authentication**: JWT-based user authentication with registration, login, and token refresh
- **Product Management**: Full CRUD operations for products with search, filtering, and reviews
- **Category Management**: Organize products into categories
- **User Management**: User profiles and admin functionality
- **Security**: Rate limiting, CORS, helmet, input validation
- **Database**: MongoDB with comprehensive schemas and seeding

### Frontend (In Progress)
- **Authentication**: Login/Register pages with form validation
- **Product Catalog**: Home page with featured products and product listing
- **Shopping Cart**: Context-based cart management with localStorage persistence
- **Responsive Design**: Mobile-first design with Tailwind CSS
- **Search & Filtering**: Advanced product search and filtering capabilities

## 🛠️ Tech Stack

### Backend
- Node.js & Express.js
- MongoDB with Mongoose
- JWT Authentication
- bcryptjs for password hashing
- Express Validator for input validation
- Helmet for security
- CORS for cross-origin requests

### Frontend
- React 18
- React Router DOM for routing
- React Query for data fetching
- React Hook Form for form management
- Tailwind CSS for styling
- React Hot Toast for notifications
- React Icons for icons

## 📦 Installation & Setup

### Prerequisites
- Node.js (v16 or higher)
- MongoDB (local or cloud)
- npm or yarn

### Backend Setup

1. Navigate to the backend directory:
```bash
cd backend
```

2. Install dependencies:
```bash
npm install
```

3. Create environment file:
```bash
cp env.example .env
```

4. Update the `.env` file with your configuration:
```env
PORT=5000
NODE_ENV=development
MONGODB_URI=mongodb://localhost:27017/webstore
JWT_SECRET=your-super-secret-jwt-key-here
JWT_EXPIRE=7d
FRONTEND_URL=http://localhost:3000
```

5. Start the backend server:
```bash
npm run dev
```

6. (Optional) Seed the database with sample data:
```bash
npm run seed
```

### Frontend Setup

1. Navigate to the frontend directory:
```bash
cd frontend
```

2. Install dependencies:
```bash
npm install
```

3. Create environment file:
```bash
echo "REACT_APP_API_URL=http://localhost:5000/api" > .env
```

4. Start the frontend development server:
```bash
npm start
```

## 🌐 Access the Application

- **Frontend**: http://localhost:3000
- **Backend API**: http://localhost:5000/api
- **Health Check**: http://localhost:5000/api/health

## 👤 Demo Accounts

The seeded database includes demo accounts:

- **Admin Account**: 
  - Email: `admin@webstore.com`
  - Password: `admin123`

- **User Account**: 
  - Email: `john@example.com`
  - Password: `password123`

## 📁 Project Structure

```
web-store-project/
├── backend/
│   ├── src/
│   │   ├── models/          # MongoDB schemas
│   │   ├── routes/          # API routes
│   │   ├── middleware/      # Authentication & validation
│   │   ├── utils/           # Utility functions
│   │   └── app.js           # Express app configuration
│   ├── tests/               # Backend tests
│   └── package.json
├── frontend/
│   ├── src/
│   │   ├── components/       # Reusable React components
│   │   ├── pages/           # Page components
│   │   ├── context/         # React Context providers
│   │   ├── services/        # API service layer
│   │   ├── hooks/           # Custom React hooks
│   │   └── utils/           # Utility functions
│   └── package.json
└── docs/                    # Documentation
```

## 🔄 API Endpoints

### Authentication
- `POST /api/auth/register` - User registration
- `POST /api/auth/login` - User login
- `GET /api/auth/me` - Get current user
- `POST /api/auth/logout` - User logout
- `POST /api/auth/refresh` - Refresh JWT token

### Products
- `GET /api/products` - Get all products (with filtering)
- `GET /api/products/search` - Search products
- `GET /api/products/:id` - Get product by ID
- `POST /api/products` - Create product (Admin)
- `PUT /api/products/:id` - Update product (Admin)
- `DELETE /api/products/:id` - Delete product (Admin)
- `POST /api/products/:id/reviews` - Add product review

### Categories
- `GET /api/categories` - Get all categories
- `GET /api/categories/:id` - Get category by ID
- `POST /api/categories` - Create category (Admin)
- `PUT /api/categories/:id` - Update category (Admin)
- `DELETE /api/categories/:id` - Delete category (Admin)

## 🚧 Next Steps

The following features are planned for implementation:

1. **Complete Product Detail Page** - Individual product view with images, reviews, and add to cart
2. **Shopping Cart Implementation** - Full cart functionality with quantity management
3. **Checkout Process** - Order creation and payment integration
4. **User Profile Management** - Profile editing and order history
5. **Admin Dashboard** - Product and category management interface
6. **Order Management** - Order tracking and status updates
7. **Payment Integration** - Stripe or PayPal integration
8. **Email Notifications** - Order confirmations and updates
9. **Testing** - Unit and integration tests
10. **Deployment** - Production deployment setup

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch
3. Commit your changes
4. Push to the branch
5. Create a Pull Request

## 📄 License

This project is licensed under the MIT License.

## 🆘 Support

If you encounter any issues or have questions, please create an issue in the repository.

