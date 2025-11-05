import React from 'react';
import { Link } from 'react-router-dom';
import { useQuery } from 'react-query';
import { productsAPI } from '../services/api';
import { FiShoppingBag, FiTruck, FiShield, FiHeadphones } from 'react-icons/fi';

const Home = () => {
  const { data: featuredProducts, isLoading } = useQuery(
    'featured-products',
    () => productsAPI.getProducts({ limit: 8 }).then(res => res.data),
    {
      select: (data) => data.data.products,
    }
  );

  const features = [
    {
      icon: <FiShoppingBag className="h-6 w-6" />,
      title: 'Curated Selection',
      description: 'Carefully chosen products across multiple categories'
    },
    {
      icon: <FiTruck className="h-6 w-6" />,
      title: 'Fast Shipping',
      description: 'Free shipping on orders over $50'
    },
    {
      icon: <FiShield className="h-6 w-6" />,
      title: 'Secure Payment',
      description: 'Your payment information is safe and secure'
    },
    {
      icon: <FiHeadphones className="h-6 w-6" />,
      title: '24/7 Support',
      description: 'Customer support whenever you need it'
    }
  ];

  return (
    <div className="min-h-screen">
      {/* Hero Section */}
      <section className="bg-white">
        <div className="max-w-8xl mx-auto px-6 lg:px-8 py-32">
          <div className="text-center max-w-4xl mx-auto">
            <h1 className="text-5xl md:text-7xl font-light text-black mb-8 tracking-tight">
              WebStore
            </h1>
            <p className="text-lg md:text-xl text-primary-600 mb-16 font-light leading-relaxed">
              Discover carefully curated products with exceptional quality and design
            </p>
            <div className="flex flex-col sm:flex-row gap-6 justify-center">
              <Link
                to="/products"
                className="text-sm font-light text-black border border-black px-8 py-4 hover:bg-black hover:text-white transition-colors duration-200"
              >
                Shop Collection
              </Link>
              <Link
                to="/products?featured=true"
                className="text-sm font-light text-black border border-black px-8 py-4 hover:bg-black hover:text-white transition-colors duration-200"
              >
                Featured Products
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* Featured Products Section */}
      <section className="py-24 bg-white">
        <div className="max-w-8xl mx-auto px-6 lg:px-8">
          <div className="text-center mb-20">
            <h2 className="text-3xl md:text-4xl font-light text-black mb-6 tracking-tight">Our Collection</h2>
            <p className="text-primary-600 font-light">Carefully curated products for every style</p>
          </div>

          {isLoading ? (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
              {[...Array(8)].map((_, index) => (
                <div key={index} className="bg-white animate-pulse">
                  <div className="h-80 bg-primary-100 mb-4"></div>
                  <div className="h-4 bg-primary-200 rounded mb-2"></div>
                  <div className="h-4 bg-primary-200 rounded w-3/4"></div>
                </div>
              ))}
            </div>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
              {featuredProducts?.map((product) => (
                <div key={product._id} className="group">
                  <Link to={`/products/${product._id}`}>
                    <div className="mb-6" style={{ width: '100%', height: '320px', backgroundColor: '#f5f5f5', border: '2px solid #ddd' }}>
                      <img
                        src={product.images?.[0]?.url || '/placeholder-image.jpg'}
                        alt={product.name}
                        style={{ 
                          width: '100%', 
                          height: '100%', 
                          objectFit: 'cover',
                          display: 'block'
                        }}
                        onError={(e) => {
                          console.log('Image failed to load:', product.images?.[0]?.url);
                          e.target.style.display = 'none';
                        }}
                        onLoad={() => console.log('Image loaded successfully:', product.images?.[0]?.url)}
                      />
                    </div>
                    <div className="text-center">
                      <h3 className="font-light text-lg mb-2 text-black">{product.name}</h3>
                      <p className="text-sm text-primary-600 mb-4 font-light">{product.shortDescription}</p>
                      <div className="flex items-center justify-center space-x-2">
                        <span className="text-lg font-light text-black">
                          {product.price} SEK
                        </span>
                        {product.comparePrice && (
                          <span className="text-sm text-primary-400 line-through">
                            {product.comparePrice} SEK
                          </span>
                        )}
                      </div>
                    </div>
                  </Link>
                </div>
              ))}
            </div>
          )}

          <div className="text-center mt-20">
            <Link
              to="/products"
              className="text-sm font-light text-black border border-black px-8 py-4 hover:bg-black hover:text-white transition-colors duration-200"
            >
              View All Products
            </Link>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-24 bg-primary-50">
        <div className="max-w-8xl mx-auto px-6 lg:px-8">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-16">
            {features.map((feature, index) => (
              <div key={index} className="text-center">
                <div className="flex justify-center mb-6">
                  <div className="text-primary-600">
                    {feature.icon}
                  </div>
                </div>
                <h3 className="text-lg font-light text-black mb-4">{feature.title}</h3>
                <p className="text-sm text-primary-600 font-light leading-relaxed">{feature.description}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Newsletter Section */}
      <section className="py-24 bg-black text-white">
        <div className="max-w-4xl mx-auto px-6 lg:px-8 text-center">
          <h2 className="text-3xl md:text-4xl font-light mb-6 tracking-tight">Stay Updated</h2>
          <p className="text-lg mb-12 text-primary-300 font-light">
            Subscribe to our newsletter for the latest collections and exclusive offers
          </p>
          <div className="max-w-md mx-auto flex">
            <input
              type="email"
              placeholder="Enter your email"
              className="flex-1 px-4 py-4 text-black text-sm font-light focus:outline-none"
            />
            <button className="bg-white text-black px-8 py-4 text-sm font-light hover:bg-primary-100 transition-colors duration-200">
              Subscribe
            </button>
          </div>
        </div>
      </section>
    </div>
  );
};

export default Home;
