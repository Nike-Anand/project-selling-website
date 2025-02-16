import React from 'react';
import { useNavigate } from 'react-router-dom'; // Import useNavigate
import { Search, ShoppingCart, Heart, User, Moon } from 'lucide-react';
import { useCartStore } from '../lib/store';
import { useWishlistStore } from '../lib/store';

export default function Navbar() {
  const navigate = useNavigate(); // Define navigate using useNavigate

  return (
    <nav className="fixed top-0 w-full bg-white shadow-sm z-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          <div className="flex items-center">
          <button 
      onClick={() => navigate('/')}
      className="group relative transform transition-transform duration-200 hover:scale-110"
    >
      <h1 className="text-2xl font-bold text-indigo-600 group-hover:text-blue-500 transition-colors duration-200">
        ProjectHub
      </h1>
      <div className="absolute -inset-2 bg-white/5 rounded-lg opacity-0 group-hover:opacity-100 transition-opacity duration-200 pointer-events-none " />
    </button>
          </div>

          <div className="flex-1 max-w-2xl mx-8">
            <div className="relative">
              <input
                type="text"
                placeholder="Search projects..."
                className="w-full px-4 py-2 pl-10 pr-4 rounded-lg border border-gray-300 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
              />
              <Search className="absolute left-3 top-2.5 h-5 w-5 text-gray-400" />
            </div>
          </div>

          <div className="flex items-center space-x-4">
            <button className="p-2 hover:bg-gray-100 rounded-full">
              <Moon className="h-5 w-5" />
            </button>
            <button 
              onClick={() => navigate('/wishlist')} // Add onClick handler for wishlist navigation
              className="p-2 hover:bg-gray-100 rounded-full relative"
            >
              <Heart className="h-5 w-5" />
              {useWishlistStore(state => state.items.length) > 0 && (
                <span className="absolute -top-1 -right-1 bg-red-500 text-white text-xs rounded-full px-1.5 py-0.5">
                  {useWishlistStore(state => state.items.length)}
                </span>
              )}
            </button>
            <button 
              onClick={() => navigate('/cart')} // Add onClick handler for cart navigation
              className="p-2 hover:bg-gray-100 rounded-full relative"
            >
              <ShoppingCart className="h-5 w-5" />
              {useCartStore(state => state.items.length) > 0 && (
                <span className="absolute -top-1 -right-1 bg-blue-500 text-white text-xs rounded-full px-1.5 py-0.5">
                  {useCartStore(state => state.items.length)}
                </span>
              )}
            </button>
            <button 
              onClick={() => navigate('/SignInPage')} // Add onClick handler for cart navigation
              className="p-2 hover:bg-gray-100 rounded-full relative"
            >
              <User className="h-5 w-5" />
            </button>
          </div>
        </div>
      </div>
    </nav>
  );
}
