import React from 'react';
import { Link } from 'react-router-dom';

const NotFound = () => {
  return (
    <div className="min-h-screen flex flex-col items-center justify-center px-4">
      <div className="text-center">
        <h1 className="text-9xl font-bold text-blue-600">404</h1>
        <h2 className="text-4xl font-semibold text-gray-800 mt-4">Page Not Found</h2>
        <p className="text-lg text-gray-600 mt-4 mb-8">
          Oops! The page you're looking for doesn't exist or has been moved.
        </p>
        <div className="flex flex-col md:flex-row items-center justify-center gap-4">
          <Link
            to="/"
            className="px-6 py-3 rounded-lg bg-blue-600 text-white font-medium hover:bg-blue-700 transition-colors"
          >
            Return Home
          </Link>
          <Link
            to="/results"
            className="px-6 py-3 rounded-lg border border-blue-600 text-blue-600 font-medium hover:bg-gray-50 transition-colors"
          >
            Search Universities
          </Link>
        </div>
      </div>
    </div>
  );
};

export default NotFound; 