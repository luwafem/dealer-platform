import React from 'react';

const Footer = () => {
  return (
    <footer className="bg-gray-800 text-white mt-auto">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          <div>
            <h3 className="text-lg font-semibold mb-4">AutoDealer</h3>
            <p className="text-gray-300 text-sm">
              Nigeria's premier dealer-to-dealer automotive marketplace.
            </p>
          </div>
          <div>
            <h4 className="text-md font-semibold mb-4">Quick Links</h4>
            <ul className="space-y-2 text-sm">
              <li><a href="/search" className="text-gray-300 hover:text-white">Browse Cars</a></li>
              <li><a href="/subscriptions" className="text-gray-300 hover:text-white">Subscription Plans</a></li>
              <li><a href="/about" className="text-gray-300 hover:text-white">About Us</a></li>
              <li><a href="/contact" className="text-gray-300 hover:text-white">Contact</a></li>
            </ul>
          </div>
          <div>
            <h4 className="text-md font-semibold mb-4">Contact</h4>
            <p className="text-gray-300 text-sm">support@autodealer.ng</p>
            <p className="text-gray-300 text-sm">+234 800 000 0000</p>
          </div>
        </div>
        <div className="border-t border-gray-700 mt-8 pt-4 text-center text-gray-400 text-sm">
          &copy; {new Date().getFullYear()} AutoDealer. All rights reserved.
        </div>
      </div>
    </footer>
  );
};

export default Footer;