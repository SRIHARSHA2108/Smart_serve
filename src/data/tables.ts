export type RestaurantTable = {
  id: string
  tableNumber: number
  verificationCode: string
  status: 'available' | 'occupied' | 'cleaning'
}

export const demoTables: RestaurantTable[] = [
  {
    id: 'table-1',
    tableNumber: 1,
    verificationCode: 'A1B2',
    status: 'available',
  },
  {
    id: 'table-2',
    tableNumber: 2,
    verificationCode: 'C3D4',
    status: 'occupied',
  },
  {
    id: 'table-3',
    tableNumber: 3,
    verificationCode: 'E5F6',
    status: 'available',
  },
  {
    id: 'table-4',
    tableNumber: 4,
    verificationCode: 'G7H8',
    status: 'cleaning',
  },
  {
    id: 'table-5',
    tableNumber: 5,
    verificationCode: 'J2K4',
    status: 'available',
  },
  {
    id: 'table-12',
    tableNumber: 12,
    verificationCode: 'A7K9',
    status: 'available',
  },
]