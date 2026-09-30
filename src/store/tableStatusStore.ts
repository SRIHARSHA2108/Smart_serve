import { create } from 'zustand'
import { persist } from 'zustand/middleware'

export type TableOperationalStatus =
  | 'AVAILABLE'
  | 'OCCUPIED'
  | 'CLEANING'
  | 'INACTIVE'

type TableStatusStore = {
  tableStatuses: Record<number, TableOperationalStatus>

  setTableStatus: (
    tableNumber: number,
    status: TableOperationalStatus,
  ) => void
}

export const useTableStatusStore =
  create<TableStatusStore>()(
    persist(
      (set) => ({
        tableStatuses: {
          1: 'AVAILABLE',
          2: 'AVAILABLE',
          3: 'AVAILABLE',
          4: 'AVAILABLE',
          5: 'AVAILABLE',
          12: 'AVAILABLE',
        },

        setTableStatus: (tableNumber, status) =>
          set((state) => ({
            tableStatuses: {
              ...state.tableStatuses,
              [tableNumber]: status,
            },
          })),
      }),
      {
        name: 'smart-serve-table-status',
      },
    ),
  )
