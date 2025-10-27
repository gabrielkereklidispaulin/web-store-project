import React from 'react';
import { Link } from 'react-router-dom';

const Footer = () => {
  return (
    <footer className="bg-white border-t border-primary-200">
      <div className="max-w-8xl mx-auto px-6 lg:px-8 py-16">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-12">
          {/* Company Info */}
          <div className="col-span-1 md:col-span-2">
            <h3 className="text-lg font-light text-black mb-6 tracking-wide">WebStore</h3>
            <p className="text-sm text-primary-600 font-light leading-relaxed max-w-md">
              Curated products with exceptional quality and design. 
              Committed to providing excellent service and thoughtful curation.
            </p>
          </div>

          {/* Quick Links */}
          <div>
            <h4 className="text-sm font-light text-black mb-6 tracking-wide uppercase">Quick Links</h4>
            <ul className="space-y-3">
              <li>
                <Link to="/products" className="text-sm text-primary-600 hover:text-black transition-colors font-light">
                  All Products
                </Link>
              </li>
              <li>
                <Link to="/products?featured=true" className="text-sm text-primary-600 hover:text-black transition-colors font-light">
                  Featured
                </Link>
              </li>
              <li>
                <Link to="/about" className="text-sm text-primary-600 hover:text-black transition-colors font-light">
                  About
                </Link>
              </li>
              <li>
                <Link to="/contact" className="text-sm text-primary-600 hover:text-black transition-colors font-light">
                  Contact
                </Link>
              </li>
            </ul>
          </div>
        </div>

        <div className="border-t border-primary-200 mt-16 pt-8">
          <div className="flex flex-col md:flex-row justify-between items-center">
            <p className="text-xs text-primary-500 font-light">
              © 2024 WebStore. All rights reserved.
            </p>
            <div className="flex space-x-8 mt-4 md:mt-0">
              <Link to="/privacy" className="text-xs text-primary-500 hover:text-black transition-colors font-light">
                Privacy
              </Link>
              <Link to="/terms" className="text-xs text-primary-500 hover:text-black transition-colors font-light">
                Terms
              </Link>
              <Link to="/shipping" className="text-xs text-primary-500 hover:text-black transition-colors font-light">
                Shipping
              </Link>
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
