import { create } from 'zustand'
import { persist } from 'zustand/middleware'
import { menuItems as initialMenuItems } from '../data/menuItems'
import type { MenuItem } from '../types/menu'

export type ManagedMenuItem = MenuItem & {
  available: boolean
}

type MenuStore = {
  items: ManagedMenuItem[]

  addItem: (item: ManagedMenuItem) => void

  updateItem: (
    id: string,
    updates: Partial<ManagedMenuItem>,
  ) => void

  toggleAvailability: (id: string) => void

  deleteItem: (id: string) => void
}

const initialItems: ManagedMenuItem[] =
  initialMenuItems.map((item) => ({
    ...item,
    available: true,
  }))

export const useMenuStore = create<MenuStore>()(
  persist(
    (set) => ({
      items: initialItems,

      addItem: (item) =>
        set((state) => ({
          items: [...state.items, item],
        })),

      updateItem: (id, updates) =>
        set((state) => ({
          items: state.items.map((item) =>
            item.id === id
              ? {
                  ...item,
                  ...updates,
                }
              : item,
          ),
        })),

      toggleAvailability: (id) =>
        set((state) => ({
          items: state.items.map((item) =>
            item.id === id
              ? {
                  ...item,
                  available: !item.available,
                }
              : item,
          ),
        })),

      deleteItem: (id) =>
        set((state) => ({
          items: state.items.filter(
            (item) => item.id !== id,
          ),
        })),
    }),
    {
      name: 'smart-serve-menu',
    },
  ),
)