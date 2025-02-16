import React from 'react';
import { useWishlistStore } from '../lib/store';
import type { Project } from '../types';
import { Trash2, Heart,ShoppingCart } from 'lucide-react';
import { Card, CardContent } from '../components/ui/card';
import Button from '../components/button';


const WishlistPage = () => {
  const { items: wishlistItems, removeItem, moveToCart } = useWishlistStore((state) => ({
    items: state.items,
    removeItem: state.removeItem,
    moveToCart: state.moveToCart
  }));

  return (
    <div className="p-6 max-w-6xl mx-auto">
      <div className="flex items-center gap-2 mb-8">
        <Heart className="w-8 h-8 text-red-500" />
        <h1 className="text-3xl font-bold">My Wishlist</h1>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {wishlistItems.map((item) => (
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
                      className=" text-blue-500 hover:text-black"
                      onClick={() => moveToCart(item)}
                    >
                       <ShoppingCart className="h-5 w-5" />
                    </Button>
                    <Button
                      className="text-red-500 hover:text-violet-500"
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

      {wishlistItems.length === 0 && (
        <div className="text-center py-12">
          <Heart className="w-16 h-16 text-gray-300 mx-auto mb-4" />
          <h2 className="text-xl font-semibold text-gray-600 mb-2">Your wishlist is empty</h2>
          <p className="text-gray-500">Add some items to your wishlist to get started!</p>
        </div>
      )}

      {wishlistItems.length > 0 && (
        <div className="mt-8 text-right">
          <p className="text-xl font-semibold">
            Total: ${wishlistItems.reduce((sum, item) => sum + item.price, 0).toFixed(2)}
          </p>
        </div>
      )}
    </div>
  );
};

export default WishlistPage;
