import { create } from 'zustand'
import {
  collection,
  deleteDoc,
  doc,
  getDoc,
  onSnapshot,
  query,
  setDoc,
  updateDoc,
  where,
  writeBatch,
} from 'firebase/firestore'
import { db } from '../services/firebase'
import { menuItems as initialMenuItems } from '../data/menuItems'
import type { MenuItem } from '../types/menu'

export type ManagedMenuItem = MenuItem & {
  restaurantId: string
  available: boolean
}

type MenuStore = {
  items: ManagedMenuItem[]
  loading: boolean
  error: string | null

  subscribeToMenu: () => () => void

  seedMenu: () => Promise<void>

  addItem: (
    item: Omit<ManagedMenuItem, 'restaurantId'>,
  ) => Promise<void>

  updateItem: (
    id: string,
    updates: Partial<ManagedMenuItem>,
  ) => Promise<void>

  toggleAvailability: (
    id: string,
  ) => Promise<void>

  deleteItem: (id: string) => Promise<void>
}

const RESTAURANT_ID = 'spice-garden'

export const useMenuStore =
  create<MenuStore>((set, get) => ({
    items: [],
    loading: true,
    error: null,

    subscribeToMenu: () => {
      set({
        loading: true,
        error: null,
      })

      const menuQuery = query(
        collection(db, 'menuItems'),
        where(
          'restaurantId',
          '==',
          RESTAURANT_ID,
        ),
      )

      const unsubscribe = onSnapshot(
        menuQuery,
        (snapshot) => {
          const items =
            snapshot.docs.map((document) => {
              const data = document.data()

              return {
                ...data,
                id: document.id,
              } as ManagedMenuItem
            })

          set({
            items,
            loading: false,
            error: null,
          })
        },

        (error) => {
          console.error(
            'Unable to load menu:',
            error,
          )

          set({
            loading: false,
            error:
              'Unable to load the restaurant menu.',
          })
        },
      )

      return unsubscribe
    },

    seedMenu: async () => {
      const markerRef = doc(
        db,
        'restaurants',
        RESTAURANT_ID,
      )

      const restaurantSnapshot =
        await getDoc(markerRef)

      if (!restaurantSnapshot.exists()) {
        throw new Error(
          'Restaurant document does not exist.',
        )
      }

      const batch = writeBatch(db)

      initialMenuItems.forEach((item) => {
        const itemRef = doc(
          db,
          'menuItems',
          item.id,
        )

        batch.set(
          itemRef,
          {
            ...item,
            restaurantId: RESTAURANT_ID,
            available: true,
          },
          {
            merge: true,
          },
        )
      })

      await batch.commit()
    },

    addItem: async (item) => {
      const itemRef = doc(
        db,
        'menuItems',
        item.id,
      )

      await setDoc(itemRef, {
        ...item,
        restaurantId: RESTAURANT_ID,
      })
    },

    updateItem: async (
      id,
      updates,
    ) => {
      const {
        id: _ignoredId,
        ...safeUpdates
      } = updates as Partial<ManagedMenuItem> & {
        id?: string
      }

      void _ignoredId

      await updateDoc(
        doc(db, 'menuItems', id),
        safeUpdates,
      )
    },

    toggleAvailability: async (id) => {
      const item = get().items.find(
        (menuItem) => menuItem.id === id,
      )

      if (!item) {
        throw new Error(
          'Menu item not found.',
        )
      }

      await updateDoc(
        doc(db, 'menuItems', id),
        {
          available: !item.available,
        },
      )
    },

    deleteItem: async (id) => {
      await deleteDoc(
        doc(db, 'menuItems', id),
      )
    },
  }))