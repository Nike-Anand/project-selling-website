import { create } from 'zustand';
import { User } from '@supabase/supabase-js';
import { Project } from '../types';

interface AuthState {
  user: User | null;
  isAdmin: boolean;
  setUser: (user: User | null) => void;
  setIsAdmin: (isAdmin: boolean) => void;
}

export const useAuthStore = create<AuthState>((set) => ({
  user: null,
  isAdmin: false,
  setUser: (user) => set({ user }),
  setIsAdmin: (isAdmin) => set({ isAdmin }),
}));

interface CartState {
  items: Project[];
  addItem: (project: Project) => void;
  removeItem: (projectId: string) => void;
  clearCart: () => void;
}

export const useCartStore = create<CartState>((set) => {
  const storedItems = localStorage.getItem('cartItems');
console.log('Initializing cart items from localStorage:', storedItems);
  const initialItems = storedItems ? JSON.parse(storedItems) : [];
  
  return {
    items: initialItems,
    addItem: (project: Project) => {
      console.log('Adding item to cart:', project);
console.log('Current items in local storage before adding:', localStorage.getItem('cartItems'));
      console.log('Current items in local storage after adding:', localStorage.getItem('cartItems'));
      set((state) => {
        const updatedItems = state.items.some((item) => item.id === project.id)
          ? state.items
          : [...state.items, project];
        localStorage.setItem('cartItems', JSON.stringify(updatedItems));
      console.log('Current items in local storage:', localStorage.getItem('cartItems'));
        return { items: updatedItems };
      });
    },
    removeItem: (projectId: string) => {
      set((state) => {
        const updatedItems = state.items.filter((item) => item.id !== projectId);
        localStorage.setItem('cartItems', JSON.stringify(updatedItems));
        return { items: updatedItems };
      });
    },
    clearCart: () => {
      set({ items: [] });
      localStorage.removeItem('cartItems');
    },
  };
});

interface WishlistState {
  items: Project[];
  addItem: (project: Project) => void;
  removeItem: (projectId: string) => void;
}

export const useWishlistStore = create<WishlistState>((set) => ({
  items: [],
  addItem: (project) =>
    set((state) => ({
      items: state.items.some((item) => item.id === project.id)
        ? state.items
        : [...state.items, project],
    })),
  removeItem: (projectId) =>
    set((state) => ({
      items: state.items.filter((item) => item.id !== projectId),
    })),
}));
