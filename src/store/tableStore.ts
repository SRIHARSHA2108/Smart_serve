import { create } from 'zustand'
import { persist } from 'zustand/middleware'

export type TableStatus =
  | 'AVAILABLE'
  | 'OCCUPIED'
  | 'CLEANING'
  | 'INACTIVE'

export type RestaurantTable = {
  tableId: string
  tableNumber: number
  verificationCode: string
  status: TableStatus
  active: boolean
  createdAt: string
}

type TableStore = {
  tables: RestaurantTable[]

  addTable: (tableNumber: number) => RestaurantTable

  regenerateCode: (tableId: string) => void

  updateStatus: (
    tableId: string,
    status: TableStatus,
  ) => void

  deactivateTable: (tableId: string) => void
}

function generateVerificationCode() {
  const characters = 'ABCDEFGHJKLMNPQRSTUVWXYZ23456789'

  let code = ''

  for (let i = 0; i < 4; i++) {
    code += characters.charAt(
      Math.floor(Math.random() * characters.length),
    )
  }

  return code
}

const initialTables: RestaurantTable[] = [
  {
    tableId: 'table-1',
    tableNumber: 1,
    verificationCode: 'A1B2',
    status: 'AVAILABLE',
    active: true,
    createdAt: new Date().toISOString(),
  },
  {
    tableId: 'table-2',
    tableNumber: 2,
    verificationCode: 'C3D4',
    status: 'OCCUPIED',
    active: true,
    createdAt: new Date().toISOString(),
  },
  {
    tableId: 'table-3',
    tableNumber: 3,
    verificationCode: 'E5F6',
    status: 'AVAILABLE',
    active: true,
    createdAt: new Date().toISOString(),
  },
  {
    tableId: 'table-4',
    tableNumber: 4,
    verificationCode: 'G7H8',
    status: 'CLEANING',
    active: true,
    createdAt: new Date().toISOString(),
  },
  {
    tableId: 'table-5',
    tableNumber: 5,
    verificationCode: 'J2K4',
    status: 'AVAILABLE',
    active: true,
    createdAt: new Date().toISOString(),
  },
  {
    tableId: 'table-12',
    tableNumber: 12,
    verificationCode: 'A7K9',
    status: 'AVAILABLE',
    active: true,
    createdAt: new Date().toISOString(),
  },
]

export const useTableStore = create<TableStore>()(
  persist(
    (set, get) => ({
      tables: initialTables,

      addTable: (tableNumber) => {
        const existingTable = get().tables.find(
          (table) => table.tableNumber === tableNumber,
        )

        if (existingTable) {
          throw new Error(
            `Table ${tableNumber} already exists.`,
          )
        }

        let verificationCode =
          generateVerificationCode()

        while (
          get().tables.some(
            (table) =>
              table.verificationCode ===
              verificationCode,
          )
        ) {
          verificationCode =
            generateVerificationCode()
        }

        const table: RestaurantTable = {
          tableId: `table-${Date.now()}`,
          tableNumber,
          verificationCode,
          status: 'AVAILABLE',
          active: true,
          createdAt: new Date().toISOString(),
        }

        set((state) => ({
          tables: [...state.tables, table].sort(
            (a, b) =>
              a.tableNumber - b.tableNumber,
          ),
        }))

        return table
      },

      regenerateCode: (tableId) => {
        let newCode = generateVerificationCode()

        while (
          get().tables.some(
            (table) =>
              table.verificationCode === newCode,
          )
        ) {
          newCode = generateVerificationCode()
        }

        set((state) => ({
          tables: state.tables.map((table) =>
            table.tableId === tableId
              ? {
                  ...table,
                  verificationCode: newCode,
                }
              : table,
          ),
        }))
      },

      updateStatus: (tableId, status) => {
        set((state) => ({
          tables: state.tables.map((table) =>
            table.tableId === tableId
              ? {
                  ...table,
                  status,
                }
              : table,
          ),
        }))
      },

      deactivateTable: (tableId) => {
        set((state) => ({
          tables: state.tables.map((table) =>
            table.tableId === tableId
              ? {
                  ...table,
                  active: false,
                  status: 'INACTIVE',
                }
              : table,
          ),
        }))
      },
    }),
    {
      name: 'smart-serve-tables',
    },
  ),
)