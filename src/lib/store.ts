import { create } from 'zustand';
import { User } from '@supabase/supabase-js';
import { Project } from '../types';

interface AuthState {
  user: User | null;
  isAdmin: boolean;
  setUser: (user: User | null) => void;
  setIsAdmin: (isAdmin: boolean) => void;
  logout: () => void;
}

export const useAuthStore = create<AuthState>((set) => ({
  user: null,
  isAdmin: false,
  setUser: (user) => set({ user }),
  setIsAdmin: (isAdmin) => set({ isAdmin }),
  logout: () => {
    set({ user: null, isAdmin: false });
  }
}));

interface CartState {
  items: Project[];
  addItem: (project: Project) => void;
  removeItem: (projectId: string) => void;
  clearCart: () => void;
  moveToWishlist: (project: Project) => void;
}

export const useCartStore = create<CartState>((set) => {
  const storedItems = localStorage.getItem('cartItems');
  const initialItems = storedItems ? JSON.parse(storedItems) : [];
  
  return {
    items: initialItems,
    addItem: (project: Project) => {
      set((state) => {
        const updatedItems = state.items.some((item) => item.id === project.id)
          ? state.items
          : [...state.items, project];
        localStorage.setItem('cartItems', JSON.stringify(updatedItems));
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
    moveToWishlist: (project) => {
      set((state) => {
        const updatedItems = state.items.filter((item) => item.id !== project.id);
        localStorage.setItem('cartItems', JSON.stringify(updatedItems));
        useWishlistStore.getState().addItem(project);
        return { items: updatedItems };
      });
    },
  };
});

interface WishlistState {
  items: Project[];
  addItem: (project: Project) => void;
  removeItem: (projectId: string) => void;
  moveToCart: (project: Project) => void;
}

export const useWishlistStore = create<WishlistState>((set) => {
  const storedItems = localStorage.getItem('wishlistItems');
  const initialItems = storedItems ? JSON.parse(storedItems) : [];
  
  return {
    items: initialItems,
    addItem: (project) =>
      set((state) => {
        const updatedItems = state.items.some((item) => item.id === project.id)
          ? state.items
          : [...state.items, project];
        localStorage.setItem('wishlistItems', JSON.stringify(updatedItems));
        return { items: updatedItems };
      }),
    removeItem: (projectId) =>
      set((state) => {
        const updatedItems = state.items.filter((item) => item.id !== projectId);
        localStorage.setItem('wishlistItems', JSON.stringify(updatedItems));
        return { items: updatedItems };
      }),
    moveToCart: (project) =>
      set((state) => {
        const updatedItems = state.items.filter((item) => item.id !== project.id);
        localStorage.setItem('wishlistItems', JSON.stringify(updatedItems));
        useCartStore.getState().addItem(project);
        return { items: updatedItems };
      }),
  };
});
