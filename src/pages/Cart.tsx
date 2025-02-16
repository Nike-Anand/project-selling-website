import React from 'react';
import { useCartStore } from '../lib/store';


import { Card } from '../components/ui/card';
import Button from '../components/button';
import { Trash2, Heart} from 'lucide-react';
import { useNavigate } from 'react-router-dom';



const CartPage = () => {
  const navigate = useNavigate();
  const { items: cartItems, removeItem, moveToWishlist } = useCartStore((state) => ({
    items: state.items,
    removeItem: state.removeItem,
    moveToWishlist: state.moveToWishlist
  }));
  
  const [isProcessing, setIsProcessing] = React.useState(false);
  
  const handleCheckout = async () => {
    setIsProcessing(true);
    try {
      await navigate('/checkout');
    } catch (error) {
      console.error('Checkout error:', error);
    } finally {
      setIsProcessing(false);
    }
  };

  const total = cartItems.reduce((sum, item) => sum + item.price, 0);

  return (
    <div className="p-6 max-w-6xl mx-auto">
      <h1 className="text-3xl font-bold mb-8">Shopping Cart</h1>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {cartItems.map((item) => (
          <Card key={item.id}>
            <div className="overflow-hidden">
              <img
                src={item.previewImage}
                alt={item.title}
                className="w-full h-48 object-cover"
              />
              <div className="p-4">
                <div className="flex justify-between items-start mb-2">
                  <h3 className="text-lg font-semibold">{item.title}</h3>
                  <div className="flex gap-2">
                    <Button
                      variant="ghost"
                      className="text-blue-500 hover:text-green-500"
                      onClick={() => moveToWishlist(item)}
                    >
                      <Heart className="h-5 w-5" />
                    </Button>
                    <Button
                      variant="ghost"
                      className="text-black hover:text-red-700"
                      onClick={() => removeItem(item.id)}
                    >
                      <Trash2 className="w-5 h-5" />
                    </Button>
                  </div>
                </div>
                <p className="text-lg font-medium">${item.price.toFixed(2)}</p>
              </div>
            </div>
          </Card>
        ))}
      </div>

      {cartItems.length === 0 && (
        <div className="text-center py-12">
          <h2 className="text-xl font-semibold text-gray-600 mb-2">Your cart is empty</h2>
          <p className="text-gray-500">Add some items to your cart to get started!</p>
        </div>
      )}

      {cartItems.length > 0 && (
        <div className="mt-8">
          <div className="bg-white dark:bg-gray-800 p-6 rounded-lg shadow max-w-md ml-auto">
            <div className="flex justify-between mb-4">
              <span className="text-lg font-medium dark:text-white">Total:</span>
              <span className="text-2xl font-bold dark:text-white">
                ${total.toFixed(2)}
              </span>
            </div>
            <Button
              onClick={handleCheckout}
              disabled={isProcessing}
              className="w-full bg-indigo-600 text-white py-3 px-4 rounded-lg hover:bg-indigo-700 disabled:opacity-50"
            >
              {isProcessing ? 'Processing...' : 'Proceed to Checkout'}
            </Button>
          </div>
        </div>
      )}
    </div>
  );
};

export default CartPage;