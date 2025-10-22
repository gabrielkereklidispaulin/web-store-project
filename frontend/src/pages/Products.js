import React, { useState } from 'react';
import { useQuery } from 'react-query';
import { useSearchParams, Link } from 'react-router-dom';
import { productsAPI } from '../services/api';
import { FiSearch, FiFilter, FiGrid, FiList } from 'react-icons/fi';

const Products = () => {
  const [searchParams, setSearchParams] = useSearchParams();
  const [showFilters, setShowFilters] = useState(false);
  const [viewMode, setViewMode] = useState('grid');

  const page = parseInt(searchParams.get('page')) || 1;
  const search = searchParams.get('search') || '';
  const category = searchParams.get('category') || '';
  const featured = searchParams.get('featured') === 'true';
  const minPrice = searchParams.get('minPrice') || '';
  const maxPrice = searchParams.get('maxPrice') || '';
  const sort = searchParams.get('sort') || 'newest';

  const { data, isLoading, error } = useQuery(
    ['products', { page, search, category, featured, minPrice, maxPrice, sort }],
    () => productsAPI.getProducts({
      page,
      search,
      category,
      featured,
      minPrice,
      maxPrice,
      sort,
      limit: 12,
    }).then(res => res.data),
    {
      keepPreviousData: true,
    }
  );

  const products = data?.data?.products || [];
  const pagination = data?.data?.pagination || {};

  const handleFilterChange = (key, value) => {
    const newParams = new URLSearchParams(searchParams);
    if (value) {
      newParams.set(key, value);
    } else {
      newParams.delete(key);
    }
    newParams.delete('page'); // Reset to first page when filtering
    setSearchParams(newParams);
  };

  const handlePageChange = (newPage) => {
    const newParams = new URLSearchParams(searchParams);
    newParams.set('page', newPage);
    setSearchParams(newParams);
  };

  if (error) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-white">
        <div className="text-center">
          <h2 className="text-2xl font-light text-black mb-4">Error Loading Products</h2>
          <p className="text-primary-600 mb-8 font-light">Something went wrong while loading the products.</p>
          <button
            onClick={() => window.location.reload()}
            className="text-sm font-light text-black border border-black px-6 py-3 hover:bg-black hover:text-white transition-colors duration-200"
          >
            Try Again
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-white">
      <div className="max-w-8xl mx-auto px-6 lg:px-8 py-16">
        {/* Header */}
        <div className="mb-16">
          <h1 className="text-3xl md:text-4xl font-light text-black mb-6 tracking-tight">
            {search ? `Search Results for "${search}"` : 'Products'}
          </h1>
          {pagination.total && (
            <p className="text-sm text-primary-600 font-light">
              Showing {((page - 1) * 12) + 1}-{Math.min(page * 12, pagination.total)} of {pagination.total} products
            </p>
          )}
        </div>

        <div className="flex flex-col lg:flex-row gap-16">
          {/* Filters Sidebar */}
          <div className={`lg:w-80 ${showFilters ? 'block' : 'hidden lg:block'}`}>
            <div className="bg-white border border-primary-200 p-8">
              <div className="flex items-center justify-between mb-8">
                <h3 className="text-sm font-light text-black tracking-wide uppercase">Filters</h3>
                <button
                  onClick={() => setShowFilters(false)}
                  className="lg:hidden text-primary-400 hover:text-black transition-colors"
                >
                  ×
                </button>
              </div>

              {/* Search */}
              <div className="mb-8">
                <label className="block text-xs font-light text-black mb-3 tracking-wide uppercase">
                  Search
                </label>
                <div className="relative">
                  <input
                    type="text"
                    placeholder="Search products..."
                    value={search}
                    onChange={(e) => handleFilterChange('search', e.target.value)}
                    className="w-full px-3 py-2 text-sm border-0 border-b border-primary-300 focus:border-black focus:outline-none bg-transparent placeholder-primary-400 font-light"
                  />
                  <FiSearch className="absolute right-0 top-1/2 transform -translate-y-1/2 text-primary-400 h-4 w-4" />
                </div>
              </div>

              {/* Price Range */}
              <div className="mb-8">
                <label className="block text-xs font-light text-black mb-3 tracking-wide uppercase">
                  Price Range
                </label>
                <div className="grid grid-cols-2 gap-4">
                  <input
                    type="number"
                    placeholder="Min"
                    value={minPrice}
                    onChange={(e) => handleFilterChange('minPrice', e.target.value)}
                    className="px-3 py-2 text-sm border-0 border-b border-primary-300 focus:border-black focus:outline-none bg-transparent placeholder-primary-400 font-light"
                  />
                  <input
                    type="number"
                    placeholder="Max"
                    value={maxPrice}
                    onChange={(e) => handleFilterChange('maxPrice', e.target.value)}
                    className="px-3 py-2 text-sm border-0 border-b border-primary-300 focus:border-black focus:outline-none bg-transparent placeholder-primary-400 font-light"
                  />
                </div>
              </div>

              {/* Sort */}
              <div className="mb-8">
                <label className="block text-xs font-light text-black mb-3 tracking-wide uppercase">
                  Sort By
                </label>
                <select
                  value={sort}
                  onChange={(e) => handleFilterChange('sort', e.target.value)}
                  className="w-full px-3 py-2 text-sm border-0 border-b border-primary-300 focus:border-black focus:outline-none bg-transparent font-light"
                >
                  <option value="newest">Newest First</option>
                  <option value="price-low">Price: Low to High</option>
                  <option value="price-high">Price: High to Low</option>
                  <option value="name">Name: A to Z</option>
                  <option value="rating">Highest Rated</option>
                </select>
              </div>

              {/* Featured Filter */}
              <div className="mb-8">
                <label className="flex items-center">
                  <input
                    type="checkbox"
                    checked={featured}
                    onChange={(e) => handleFilterChange('featured', e.target.checked ? 'true' : '')}
                    className="rounded border-primary-300 text-black focus:ring-black"
                  />
                  <span className="ml-3 text-sm text-primary-600 font-light">Featured Only</span>
                </label>
              </div>

              {/* Clear Filters */}
              <button
                onClick={() => setSearchParams({})}
                className="w-full text-sm font-light text-primary-600 border border-primary-300 px-4 py-3 hover:border-black hover:text-black transition-colors duration-200"
              >
                Clear All Filters
              </button>
            </div>
          </div>

          {/* Products Grid */}
          <div className="flex-1">
            {/* Toolbar */}
            <div className="flex items-center justify-between mb-12">
              <button
                onClick={() => setShowFilters(true)}
                className="lg:hidden flex items-center space-x-2 text-primary-600 hover:text-black transition-colors"
              >
                <FiFilter className="h-4 w-4" />
                <span className="text-sm font-light">Filters</span>
              </button>

              <div className="flex items-center space-x-2">
                <button
                  onClick={() => setViewMode('grid')}
                  className={`p-2 ${viewMode === 'grid' ? 'text-black' : 'text-primary-400 hover:text-black'} transition-colors`}
                >
                  <FiGrid className="h-4 w-4" />
                </button>
                <button
                  onClick={() => setViewMode('list')}
                  className={`p-2 ${viewMode === 'list' ? 'text-black' : 'text-primary-400 hover:text-black'} transition-colors`}
                >
                  <FiList className="h-4 w-4" />
                </button>
              </div>
            </div>

            {/* Products */}
            {isLoading ? (
              <div className={`grid gap-8 ${viewMode === 'grid' ? 'grid-cols-1 sm:grid-cols-2 lg:grid-cols-3' : 'grid-cols-1'}`}>
                {[...Array(6)].map((_, index) => (
                  <div key={index} className="bg-white animate-pulse">
                    <div className="h-80 bg-primary-100 mb-4"></div>
                    <div className="h-4 bg-primary-200 rounded mb-2"></div>
                    <div className="h-4 bg-primary-200 rounded w-3/4"></div>
                  </div>
                ))}
              </div>
            ) : products.length === 0 ? (
              <div className="text-center py-20">
                <h3 className="text-xl font-light text-black mb-4">No Products Found</h3>
                <p className="text-primary-600 mb-8 font-light">Try adjusting your search or filter criteria.</p>
                <button
                  onClick={() => setSearchParams({})}
                  className="text-sm font-light text-black border border-black px-6 py-3 hover:bg-black hover:text-white transition-colors duration-200"
                >
                  Clear Filters
                </button>
              </div>
            ) : (
              <>
                <div className={`grid gap-8 ${viewMode === 'grid' ? 'grid-cols-1 sm:grid-cols-2 lg:grid-cols-3' : 'grid-cols-1'}`}>
                  {products.map((product) => (
                    <div key={product._id} className={`group ${viewMode === 'list' ? 'flex' : ''}`}>
                      <Link to={`/products/${product._id}`} className={viewMode === 'list' ? 'flex w-full' : ''}>
                        <div className={`${viewMode === 'list' ? 'w-64 h-48' : 'aspect-w-1 aspect-h-1'} mb-6`}>
                          <img
                            src={product.images?.[0]?.url || '/placeholder-image.jpg'}
                            alt={product.name}
                            className={`${viewMode === 'list' ? 'w-full h-full' : 'w-full h-80'} object-cover group-hover:opacity-80 transition-opacity duration-200`}
                          />
                        </div>
                        <div className={`${viewMode === 'list' ? 'flex-1 ml-8' : 'text-center'}`}>
                          <h3 className="font-light text-lg mb-3 text-black">{product.name}</h3>
                          <p className="text-sm text-primary-600 mb-4 font-light">{product.shortDescription}</p>
                          <div className={`flex items-center ${viewMode === 'list' ? 'justify-start' : 'justify-center'} space-x-2`}>
                            <span className="text-lg font-light text-black">
                              ${product.price.toFixed(2)}
                            </span>
                            {product.comparePrice && (
                              <span className="text-sm text-primary-400 line-through">
                                ${product.comparePrice.toFixed(2)}
                              </span>
                            )}
                          </div>
                        </div>
                      </Link>
                    </div>
                  ))}
                </div>

                {/* Pagination */}
                {pagination.pages > 1 && (
                  <div className="mt-20 flex justify-center">
                    <nav className="flex items-center space-x-4">
                      <button
                        onClick={() => handlePageChange(page - 1)}
                        disabled={page === 1}
                        className="text-sm font-light text-primary-600 hover:text-black disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                      >
                        Previous
                      </button>
                      
                      {[...Array(pagination.pages)].map((_, index) => {
                        const pageNum = index + 1;
                        const isCurrentPage = pageNum === page;
                        const showPage = pageNum === 1 || pageNum === pagination.pages || Math.abs(pageNum - page) <= 2;
                        
                        if (!showPage) {
                          if (pageNum === 2 || pageNum === pagination.pages - 1) {
                            return <span key={pageNum} className="px-2 text-sm text-primary-400">...</span>;
                          }
                          return null;
                        }
                        
                        return (
                          <button
                            key={pageNum}
                            onClick={() => handlePageChange(pageNum)}
                            className={`px-3 py-1 text-sm font-light transition-colors ${
                              isCurrentPage
                                ? 'text-black border-b border-black'
                                : 'text-primary-600 hover:text-black'
                            }`}
                          >
                            {pageNum}
                          </button>
                        );
                      })}
                      
                      <button
                        onClick={() => handlePageChange(page + 1)}
                        disabled={page === pagination.pages}
                        className="text-sm font-light text-primary-600 hover:text-black disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                      >
                        Next
                      </button>
                    </nav>
                  </div>
                )}
              </>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default Products;
