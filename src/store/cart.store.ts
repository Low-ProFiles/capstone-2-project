import { create } from 'zustand';
import { persist, createJSONStorage } from 'zustand/middleware';
interface CartItem {
  id: string;
  title: string;
  coverImageUrl?: string;
  quantity: number;
}

interface CartState {
  items: CartItem[];
  addItem: (course: CartItem) => void;
  removeItem: (courseId: string) => void;
  clearCart: () => void;
  increaseQuantity: (courseId: string) => void;
  decreaseQuantity: (courseId: string) => void;
}

export const useCartStore = create<CartState>()(
  persist(
    (set) => ({
      items: [],
      addItem: (course) => {
        set((state) => {
          const existingItem = state.items.find((item) => item.id === course.id);
          if (existingItem) {
            return {
              items: state.items.map((item) =>
                item.id === course.id ? { ...item, quantity: item.quantity + 1 } : item
              ),
            };
          } else {
            return { items: [...state.items, { ...course, quantity: 1 }] };
          }
        });
      },
      removeItem: (courseId) => {
        set((state) => ({
          items: state.items.filter((item) => item.id !== courseId),
        }));
      },
      clearCart: () => set({ items: [] }),
      increaseQuantity: (courseId) => {
        set((state) => ({
          items: state.items.map((item) =>
            item.id === courseId ? { ...item, quantity: item.quantity + 1 } : item
          ),
        }));
      },
      decreaseQuantity: (courseId) => {
        set((state) => ({
          items: state.items.map((item) =>
            item.id === courseId ? { ...item, quantity: Math.max(1, item.quantity - 1) } : item
          ),
        }));
      },
    }),
    {
      name: 'cart-storage',
      storage: createJSONStorage(() => localStorage),
    }
  )
);