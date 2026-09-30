import { create } from 'zustand'
import {
  collection,
  doc,
  onSnapshot,
  query,
  writeBatch,
  updateDoc,
  where,
} from 'firebase/firestore'
import { db } from '../services/firebase'
import type { CartItem } from './cartStore'

export type OrderStatus =
  | 'NEW'
  | 'ACCEPTED'
  | 'PREPARING'
  | 'READY'
  | 'COMPLETED'
  | 'REJECTED'

export type Order = {
  orderId: string
  restaurantId: string
  tableId: string
  tableNumber: number
  customerSessionId: string

  items: CartItem[]

  itemsTotal: number
  taxes: number
  serviceCharge: number
  totalAmount: number

  status: OrderStatus
  createdAt: string
}

type CreateOrderData = Omit<
  Order,
  'orderId' | 'status' | 'createdAt'
>

type OrderStore = {
  orders: Order[]
  latestOrder: Order | null

  loading: boolean
  error: string | null

  subscribeToOrders: () => () => void

  subscribeToOrder: (
    orderId: string,
  ) => () => void

  createOrder: (
    order: CreateOrderData,
  ) => Promise<Order>

  updateOrderStatus: (
    orderId: string,
    status: OrderStatus,
  ) => Promise<void>

  clearOrders: () => void
}

function generateOrderId() {
  const timestamp = Date.now()
    .toString()
    .slice(-6)

  const random = Math.floor(
    10 + Math.random() * 90,
  )

  return `SM${timestamp}${random}`
}

const RESTAURANT_ID = 'spice-garden'

export const useOrderStore =
  create<OrderStore>((set) => ({
    orders: [],
    latestOrder: null,

    loading: false,
    error: null,

    subscribeToOrders: () => {
      set({
        loading: true,
        error: null,
      })

      const ordersQuery = query(
        collection(db, 'orders'),
        where(
          'restaurantId',
          '==',
          RESTAURANT_ID,
        ),
      )

      const unsubscribe = onSnapshot(
        ordersQuery,

        (snapshot) => {
          const orders: Order[] =
            snapshot.docs.map(
              (orderDocument) => {
                const data =
                  orderDocument.data()

                return {
                  ...data,
                  orderId:
                    orderDocument.id,
                } as Order
              },
            )

          orders.sort(
            (a, b) =>
              new Date(
                b.createdAt,
              ).getTime() -
              new Date(
                a.createdAt,
              ).getTime(),
          )

          set({
            orders,
            loading: false,
            error: null,
          })
        },

        (error) => {
          console.error(
            'Unable to load orders:',
            error,
          )

          set({
            loading: false,
            error:
              'Unable to load restaurant orders.',
          })
        },
      )

      return unsubscribe
    },

    subscribeToOrder: (orderId) => {
      const orderRef = doc(
        db,
        'orders',
        orderId,
      )

      const unsubscribe = onSnapshot(
        orderRef,

        (snapshot) => {
          if (!snapshot.exists()) {
            return
          }

          const order = {
            ...snapshot.data(),
            orderId: snapshot.id,
          } as Order

          set((state) => ({
            latestOrder:
              state.latestOrder?.orderId ===
                orderId ||
              !state.latestOrder
                ? order
                : state.latestOrder,

            orders: state.orders.some(
              (existing) =>
                existing.orderId === orderId,
            )
              ? state.orders.map(
                  (existing) =>
                    existing.orderId ===
                    orderId
                      ? order
                      : existing,
                )
              : state.orders,
          }))
        },

        (error) => {
          console.error(
            'Unable to watch order:',
            error,
          )
        },
      )

      return unsubscribe
    },

    createOrder: async (orderData) => {
      const orderId = generateOrderId()

      const order: Order = {
        ...orderData,
        orderId,
        status: 'NEW',
        createdAt:
          new Date().toISOString(),
      }

      const batch = writeBatch(db)

      batch.set(doc(db, 'orders', orderId), order)
      batch.update(doc(db, 'tables', order.tableId), {
        status: 'OCCUPIED',
      })

      await batch.commit()

      set((state) => ({
        latestOrder: order,

        orders: [
          order,
          ...state.orders.filter(
            (existing) =>
              existing.orderId !== orderId,
          ),
        ],
      }))

      return order
    },

    updateOrderStatus: async (
      orderId,
      status,
    ) => {
      await updateDoc(
        doc(db, 'orders', orderId),
        {
          status,
        },
      )
    },

    clearOrders: () =>
      set({
        orders: [],
        latestOrder: null,
      }),
  }))
