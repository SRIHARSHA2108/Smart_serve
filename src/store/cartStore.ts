import { create } from 'zustand'
import { persist } from 'zustand/middleware'

export type CartItem = {
  cartItemId: string
  foodId: string
  name: string
  imageUrl: string
  basePrice: number
  unitPrice: number
  quantity: number
  portion: 'Regular' | 'Large' | 'Family'
  spice: 'Mild' | 'Medium' | 'Spicy'
  extraChicken: boolean
  extraRaita: boolean
}

type CartStore = {
  items: CartItem[]

  addItem: (item: CartItem) => void

  increaseQuantity: (
    cartItemId: string,
  ) => void

  decreaseQuantity: (
    cartItemId: string,
  ) => void

  removeItem: (
    cartItemId: string,
  ) => void

  clearCart: () => void
}

export const useCartStore = create<CartStore>()(
  persist(
    (set) => ({
      items: [],

      addItem: (item) =>
        set((state) => ({
          items: [...state.items, item],
        })),

      increaseQuantity: (cartItemId) =>
        set((state) => ({
          items: state.items.map((item) =>
            item.cartItemId === cartItemId
              ? {
                  ...item,
                  quantity: item.quantity + 1,
                }
              : item,
          ),
        })),

      decreaseQuantity: (cartItemId) =>
        set((state) => ({
          items: state.items
            .map((item) =>
              item.cartItemId === cartItemId
                ? {
                    ...item,
                    quantity:
                      item.quantity - 1,
                  }
                : item,
            )
            .filter(
              (item) => item.quantity > 0,
            ),
        })),

      removeItem: (cartItemId) =>
        set((state) => ({
          items: state.items.filter(
            (item) =>
              item.cartItemId !==
              cartItemId,
          ),
        })),

      clearCart: () =>
        set({
          items: [],
        }),
    }),
    {
      name: 'smart-serve-cart',
    },
  ),
)