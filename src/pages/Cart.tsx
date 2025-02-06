<<<<<<< HEAD
import { useNavigate } from 'react-router-dom';
import { Trash2, ShoppingBag } from 'lucide-react';
import { useCartStore } from '../lib/store';

export default function Cart() {
  const { items, removeItem } = useCartStore(); // Removed clearCart
  const navigate = useNavigate();
=======
import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Trash2, ShoppingBag } from 'lucide-react';
import { useCartStore } from '../lib/store';
import { supabase } from '../lib/supabase';

export default function Cart() {
  const { items, removeItem, clearCart } = useCartStore();
  const navigate = useNavigate();
  const [isProcessing, setIsProcessing] = useState(false);
>>>>>>> 3af26f0d75406a4bf246460b95a5193a23c9dba6

  const total = items.reduce((sum, item) => sum + item.price, 0);

  const handleCheckout = () => {
    navigate('/checkout');
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <h1 className="text-2xl font-bold mb-8 dark:text-white">Shopping Cart</h1>
      
      {items.length === 0 ? (
        <div className="text-center py-12">
          <ShoppingBag className="mx-auto h-12 w-12 text-gray-400" />
          <h3 className="mt-2 text-sm font-medium text-gray-900 dark:text-white">Your cart is empty</h3>
          <p className="mt-1 text-sm text-gray-500 dark:text-gray-400">
            Start adding some projects to your cart!
          </p>
        </div>
      ) : (
        <div className="space-y-8">
          {items.map((item) => (
            <div
              key={item.id}
              className="flex items-center space-x-4 bg-white dark:bg-gray-800 p-4 rounded-lg shadow"
            >
              <img
                src={item.previewImage}
                alt={item.title}
                className="w-24 h-24 object-cover rounded"
              />
              <div className="flex-1">
                <h3 className="text-lg font-medium dark:text-white">{item.title}</h3>
                <p className="text-gray-500 dark:text-gray-400">{item.description}</p>
              </div>
              <div className="text-right">
                <p className="text-lg font-bold dark:text-white">${item.price}</p>
                <button
                  onClick={() => removeItem(item.id)}
                  className="text-red-500 hover:text-red-700"
                >
                  <Trash2 className="h-5 w-5" />
                </button>
              </div>
            </div>
          ))}
          
          <div className="bg-white dark:bg-gray-800 p-6 rounded-lg shadow">
            <div className="flex justify-between mb-4">
              <span className="text-lg font-medium dark:text-white">Total:</span>
              <span className="text-2xl font-bold dark:text-white">${total.toFixed(2)}</span>
            </div>
            <button
              onClick={handleCheckout}
<<<<<<< HEAD
              className="w-full bg-indigo-600 text-white py-3 px-4 rounded-lg hover:bg-indigo-700"
            >
              Proceed to Checkout
=======
              disabled={isProcessing}
              className="w-full bg-indigo-600 text-white py-3 px-4 rounded-lg hover:bg-indigo-700 disabled:opacity-50"
            >
              {isProcessing ? 'Processing...' : 'Proceed to Checkout'}
>>>>>>> 3af26f0d75406a4bf246460b95a5193a23c9dba6
            </button>
          </div>
        </div>
      )}
    </div>
  );
<<<<<<< HEAD
}
=======
}
>>>>>>> 3af26f0d75406a4bf246460b95a5193a23c9dba6
