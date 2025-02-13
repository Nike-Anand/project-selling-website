import React, { useState } from 'react';
import { Trash2, Heart, Plus } from 'lucide-react';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from './components/button';
import { Input } from '../components/ui/input';

const WishlistPage = () => {
  const [wishlistItems, setWishlistItems] = useState([
    { id: 1, name: 'Wireless Headphones', price: 199.99, image: '/api/placeholder/200/200' },
    { id: 2, name: 'Smart Watch', price: 299.99, image: '/api/placeholder/200/200' },
    { id: 3, name: 'Laptop Bag', price: 79.99, image: '/api/placeholder/200/200' }
  ]);
  const [newItem, setNewItem] = useState({ name: '', price: '' });

  const handleAddItem = () => {
    if (newItem.name && newItem.price) {
      setWishlistItems([
        ...wishlistItems,
        {
          id: wishlistItems.length + 1,
          name: newItem.name,
          price: parseFloat(newItem.price),
          image: '/api/placeholder/200/200'
        }
      ]);
      setNewItem({ name: '', price: '' });
    }
  };

  const handleRemoveItem = (id) => {
    setWishlistItems(wishlistItems.filter(item => item.id !== id));
  };

  return (
    <div className="p-6 max-w-6xl mx-auto">
      <div className="flex items-center gap-2 mb-8">
        <Heart className="w-8 h-8 text-red-500" />
        <h1 className="text-3xl font-bold">My Wishlist</h1>
      </div>

      {/* Add new item form */}
      <Card className="mb-8">
        <CardContent className="p-4">
          <div className="flex flex-wrap gap-4">
            <Input
              type="text"
              placeholder="Item name"
              value={newItem.name}
              onChange={(e) => setNewItem({ ...newItem, name: e.target.value })}
              className="flex-1"
            />
            <Input
              type="number"
              placeholder="Price"
              value={newItem.price}
              onChange={(e) => setNewItem({ ...newItem, price: e.target.value })}
              className="w-32"
            />
            <Button onClick={handleAddItem} className="flex items-center gap-2">
              <Plus className="w-4 h-4" />
              Add Item
            </Button>
          </div>
        </CardContent>
      </Card>

      {/* Wishlist items grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {wishlistItems.map((item) => (
          <Card key={item.id} className="overflow-hidden">
            <img
              src={item.image}
              alt={item.name}
              className="w-full h-48 object-cover"
            />
            <CardContent className="p-4">
              <div className="flex justify-between items-start mb-2">
                <h3 className="text-lg font-semibold">{item.name}</h3>
                <Button
                  variant="ghost"
                  size="icon"
                  onClick={() => handleRemoveItem(item.id)}
                  className="text-red-500 hover:text-red-700"
                >
                  <Trash2 className="w-5 h-5" />
                </Button>
              </div>
              <p className="text-lg font-medium">${item.price.toFixed(2)}</p>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Empty state */}
      {wishlistItems.length === 0 && (
        <div className="text-center py-12">
          <Heart className="w-16 h-16 text-gray-300 mx-auto mb-4" />
          <h2 className="text-xl font-semibold text-gray-600 mb-2">Your wishlist is empty</h2>
          <p className="text-gray-500">Add some items to your wishlist to get started!</p>
        </div>
      )}

      {/* Total section */}
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

export default Wishlist;