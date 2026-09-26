import { create } from 'zustand'
import { persist } from 'zustand/middleware'
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

type OrderStore = {
  orders: Order[]
  latestOrder: Order | null

  createOrder: (
    order: Omit<
      Order,
      'orderId' | 'status' | 'createdAt'
    >,
  ) => Order

  updateOrderStatus: (
    orderId: string,
    status: OrderStatus,
  ) => void

  clearOrders: () => void
}

function generateOrderId() {
  const number = Math.floor(
    1000 + Math.random() * 9000,
  )

  return `SM${number}`
}

export const useOrderStore = create<OrderStore>()(
  persist(
    (set) => ({
      orders: [],
      latestOrder: null,

      createOrder: (orderData) => {
        const order: Order = {
          ...orderData,
          orderId: generateOrderId(),
          status: 'NEW',
          createdAt: new Date().toISOString(),
        }

        set((state) => ({
          orders: [order, ...state.orders],
          latestOrder: order,
        }))

        return order
      },

      updateOrderStatus: (orderId, status) => {
        set((state) => ({
          orders: state.orders.map((order) =>
            order.orderId === orderId
              ? {
                  ...order,
                  status,
                }
              : order,
          ),

          latestOrder:
            state.latestOrder?.orderId === orderId
              ? {
                  ...state.latestOrder,
                  status,
                }
              : state.latestOrder,
        }))
      },

      clearOrders: () =>
        set({
          orders: [],
          latestOrder: null,
        }),
    }),
    {
      name: 'smart-serve-orders',
    },
  ),
)