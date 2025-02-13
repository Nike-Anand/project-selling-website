import React, { useEffect, useState } from 'react';
import { useCartStore } from '../lib/store'; // Import useCartStore
import { ShoppingCart, Heart } from 'lucide-react';
import { supabase } from '../lib/supabase';
import { Link } from 'react-router-dom';

const ECommerceApp = () => {
  const [products, setProducts] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchProducts = async () => {
      try {
        const { data, error } = await supabase
          .from('projects')
          .select('*');

        if (error) throw error;

        setProducts(data);
      } catch (error) {
        console.error("Error fetching products:", error); // Log error to console
        setError((error as Error).message);
      } finally {
        setLoading(false);
      }
    };

    fetchProducts();
  }, []);

  const [wishlist, setWishlist] = useState<any[]>([]);

  const { addItem } = useCartStore(); // Single declaration of addItem

  const addToCart = (product: any) => {
    console.log('Adding to cart:', product);
    addItem(product);
  };

  const addToWishlist = (product: any) => {
    if (!wishlist.some(item => item.id === product.id)) {
      setWishlist([...wishlist, product]);
    }
  };

  return (
    <div className="container mx-auto p-4">
      <header className="flex justify-between items-center mb-8">
        <h1 className="text-3xl font-bold">Projects</h1>
        <div className="flex space-x-4">
          <div className="relative">
            <Link to="/wishlist">
              <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="lucide lucide-heart h-5 w-5">
                <path d="M19 14c1.49-1.46 3-3.21 3-5.5A5.5 5.5 0 0 0 16.5 3c-1.76 0-3 .5-4.5 2-1.5-1.5-2.74-2-4.5-2A5.5 5.5 0 0 0 2 8.5c0 2.3 1.5 4.05 3 5.5l7 7Z"></path>
              </svg>
            </Link>
            {wishlist.length > 0 && (
              <span className="absolute -top-2 -right-2 bg-red-500 text-white rounded-full w-5 h-5 flex items-center justify-center text-xs">
                {wishlist.length}
              </span>
            )}
          </div>
          <div className="relative">
            <Link to="/cart">
              <ShoppingCart className="text-blue-500 cursor-pointer" />
            </Link>
            {wishlist.length > 0 && (
              <span className="absolute -top-2 -right-2 bg-blue-500 text-white rounded-full w-5 h-5 flex items-center justify-center text-xs">
                {wishlist.length}
              </span>
            )}
          </div>
        </div>
      </header>

      {loading ? (
        <p>Loading products...</p>
      ) : error ? (
        <p>Error fetching products: {error}</p>
      ) : (
        <main className="grid grid-cols-3 gap-4">
          {products.map(product => (
            <div key={product.id} className="border rounded-lg p-4 shadow-md">
              <img 
                src={product.image} 
                alt={product.title} 
                className="w-full h-48 object-cover mb-4"
              />
              <h2 className="text-xl font-semibold">{product.title}</h2>
              <p className="text-gray-600 mb-2">{product.description}</p>
              <p className="text-lg font-bold mb-4">₹{product.price}</p>
              <div className="flex justify-between">
                <button 
                  onClick={() => addToCart(product)}
                  className="bg-blue-500 text-white px-4 py-2 rounded flex items-center"
                >
                  <ShoppingCart className="mr-2" size={20} /> Add to Cart
                </button>
                <button 
                  onClick={() => addToWishlist(product)}
                  className="bg-red-500 text-white px-4 py-2 rounded flex items-center"
                >
                  <Heart className="mr-2" size={20} /> Wishlist
                </button>
              </div>
            </div>
          ))}
        </main>
      )}
    </div>
  );
};

export default ECommerceApp;
