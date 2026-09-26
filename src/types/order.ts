export type OrderStatus =
  | 'NEW'
  | 'PREPARING'
  | 'READY'
  | 'COMPLETED'

export type OrderItem = {
  id: string
  name: string
  quantity: number
  price: number
  portion?: string
  spiceLevel?: string
}

export type CustomerOrder = {
  orderId: string
  restaurantId: string
  restaurantName: string

  tableId: string
  tableNumber: number
  customerSessionId: string

  items: OrderItem[]

  subtotal: number
  taxes: number
  serviceCharge: number
  totalAmount: number

  status: OrderStatus
  createdAt: string
}