import { useEffect, useState } from 'react';
import { useCartStore, useWishlistStore } from '../lib/store';

import { ShoppingCart, Heart } from 'lucide-react';
import { supabase } from '../lib/supabase';


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

  const { addItem } = useCartStore();
  const { addItem: addToWishlist } = useWishlistStore();


  const addToCart = (product: any) => {
    console.log('Adding to cart:', product);
    addItem(product);
  };



  return (
    <div className="container mx-auto p-4">
      <header className="flex justify-between items-center mb-8">
        <h1 className="text-3xl font-bold">Projects</h1>
       
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
                  onClick={() => addToWishlist(product)}
                  className="bg-red-500 text-white px-4 py-2 rounded flex items-center"
                >
                  <Heart className="mr-2" size={20} /> Wishlist
                </button>
                <button 
                  onClick={() => addToCart(product)}
                  className="bg-blue-500 text-white px-4 py-2 rounded flex items-center"
                >
                  <ShoppingCart className="mr-2" size={20} /> Add to Cart
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
