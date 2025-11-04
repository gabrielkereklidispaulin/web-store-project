import React from 'react';

const Footer = () => {
  return (
    <footer className="bg-white border-t border-primary-200">
      <div className="max-w-8xl mx-auto px-6 lg:px-8 py-16">
        <div className="mb-12">
          {/* Company Info */}
          <div>
            <h3 className="text-lg font-light text-black mb-6 tracking-wide">WebStore</h3>
            <p className="text-sm text-primary-600 font-light leading-relaxed max-w-md">
              Curated products with exceptional quality and design. 
              Committed to providing excellent service and thoughtful curation.
            </p>
          </div>
        </div>

        <div className="border-t border-primary-200 pt-8">
          <div className="flex justify-center">
            <p className="text-xs text-primary-500 font-light">
              © 2025 WebStore | Created by Gabriel Kereklidis Paulin
            </p>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
