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

export const useCartStore = create<CartState>((set) => ({
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
  clearCart: () => set({ items: [] }),
}));

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

