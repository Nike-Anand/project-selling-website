import { create } from 'zustand';
import { supabase } from './supabase';
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
  addItem: (project: Project) => Promise<void>;
  removeItem: (projectId: string) => Promise<void>;
  clearCart: () => Promise<void>;
  moveToWishlist: (project: Project) => Promise<void>;
}

export const useCartStore = create<CartState>((set) => {
  const storedItems = localStorage.getItem('cartItems');
  const initialItems = storedItems ? JSON.parse(storedItems) : [];
  
  return {
    items: initialItems,
    addItem: async (project: Project) => {
      const { data: { user } } = await supabase.auth.getUser();
      if (user) {
        const { data: userData, error: fetchError } = await supabase
          .from('users')
          .select('cart')
          .eq('id', user.id)
          .single();
          
        if (fetchError) {
          console.error('Error fetching cart from Supabase:', fetchError);
        } else {
          const existingCart = userData?.cart || [];
          const updatedCart = existingCart.some((id: string) => id === project.id)
            ? existingCart
            : [...existingCart, project.id];
            
          await supabase
            .from('users')
            .update({ cart: updatedCart })
            .eq('id', user.id);
        }
      }

      set((state) => {
        const updatedItems = state.items.some((item) => item.id === project.id)
          ? state.items
          : [...state.items, project];
        localStorage.setItem('cartItems', JSON.stringify(updatedItems));
        return { items: updatedItems };
      });
    },
    removeItem: async (projectId: string) => {
      const { data: { user } } = await supabase.auth.getUser();
      if (user) {
        const { data: userData, error: fetchError } = await supabase
          .from('users')
          .select('cart')
          .eq('id', user.id)
          .single();
          
        if (fetchError) {
          console.error('Error fetching cart from Supabase:', fetchError);
        } else {
          const existingCart = userData?.cart || [];
          const updatedCart = existingCart.filter((id: string) => id !== projectId);
          
          await supabase
            .from('users')
            .update({ cart: updatedCart })
            .eq('id', user.id);
        }
      }

      set((state) => {
        const updatedItems = state.items.filter((item) => item.id !== projectId);
        localStorage.setItem('cartItems', JSON.stringify(updatedItems));
        return { items: updatedItems };
      });
    },
    clearCart: async () => {
      const { data: { user } } = await supabase.auth.getUser();
      if (user) {
        await supabase
          .from('users')
          .update({ cart: [] })
          .eq('id', user.id);
      }
      set({ items: [] });
      localStorage.removeItem('cartItems');
    },
    moveToWishlist: async (project: Project) => {
      const { data: { user } } = await supabase.auth.getUser();
      if (user) {
        const { data: userData, error: fetchError } = await supabase
          .from('users')
          .select('wishlist')
          .eq('id', user.id)
          .single();
          
        if (fetchError) {
          console.error('Error fetching wishlist from Supabase:', fetchError);
        } else {
          const existingWishlist = userData?.wishlist || [];
          const updatedWishlist = [...existingWishlist, project.id];
          
          // Update both cart and wishlist in a single transaction
          const { error: updateError } = await supabase
            .from('users')
            .update({
              cart: initialItems.filter((item: Project) => item.id !== project.id),
              wishlist: updatedWishlist
            })
            .eq('id', user.id);
            
          if (updateError) {
            console.error('Error updating cart/wishlist in Supabase:', updateError);
            return;
          }
        }
      }

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
  addItem: (project: Project) => Promise<void>;
  removeItem: (projectId: string) => Promise<void>;
  moveToCart: (project: Project) => Promise<void>;
}

export const useWishlistStore = create<WishlistState>((set) => {
  const storedItems = localStorage.getItem('wishlistItems');
  const initialItems = storedItems ? JSON.parse(storedItems) : [];
  
  return {
    items: initialItems,
    addItem: async (project: Project) => {
      const { data: { user } } = await supabase.auth.getUser();
      if (user) {
        const { data: userData, error: fetchError } = await supabase
          .from('users')
          .select('wishlist')
          .eq('id', user.id)
          .single();
          
        if (fetchError) {
          console.error('Error fetching wishlist from Supabase:', fetchError);
        } else {
          const existingWishlist = userData?.wishlist || [];
          const updatedWishlist = existingWishlist.some((id: string) => id === project.id)
            ? existingWishlist
            : [...existingWishlist, project.id];
            
          await supabase
            .from('users')
            .update({ wishlist: updatedWishlist })
            .eq('id', user.id);
        }
      }

      set((state) => {
        const updatedItems = state.items.some((item) => item.id === project.id)
          ? state.items
          : [...state.items, project];
        localStorage.setItem('wishlistItems', JSON.stringify(updatedItems));
        return { items: updatedItems };
      });
    },
    removeItem: async (projectId: string) => {
      const { data: { user } } = await supabase.auth.getUser();
      if (user) {
        const { data: userData, error: fetchError } = await supabase
          .from('users')
          .select('wishlist')
          .eq('id', user.id)
          .single();
          
        if (fetchError) {
          console.error('Error fetching wishlist from Supabase:', fetchError);
        } else {
          const existingWishlist = userData?.wishlist || [];
          const updatedWishlist = existingWishlist.filter((id: string) => id !== projectId);
          
          await supabase
            .from('users')
            .update({ wishlist: updatedWishlist })
            .eq('id', user.id);
        }
      }

      set((state) => {
        const updatedItems = state.items.filter((item) => item.id !== projectId);
        localStorage.setItem('wishlistItems', JSON.stringify(updatedItems));
        return { items: updatedItems };
      });
    },
    moveToCart: async (project: Project) => {
      const { data: { user } } = await supabase.auth.getUser();
      if (user) {
        const { data: userData, error: fetchError } = await supabase
          .from('users')
          .select('cart, wishlist')
          .eq('id', user.id)
          .single();
          
        if (fetchError) {
          console.error('Error fetching user data from Supabase:', fetchError);
        } else {
          const existingCart = userData?.cart || [];
          const existingWishlist = userData?.wishlist || [];
          
          const updatedCart = [...existingCart, project.id];
          const updatedWishlist = existingWishlist.filter((id: string) => id !== project.id);
          
          const { error: updateError } = await supabase
            .from('users')
            .update({
              cart: updatedCart,
              wishlist: updatedWishlist
            })
            .eq('id', user.id);
            
          if (updateError) {
            console.error('Error updating cart/wishlist in Supabase:', updateError);
            return;
          }
        }
      }

      set((state) => {
        const updatedItems = state.items.filter((item) => item.id !== project.id);
        localStorage.setItem('wishlistItems', JSON.stringify(updatedItems));
        useCartStore.getState().addItem(project);
        return { items: updatedItems };
      });
    },
  };
});