import { create } from 'zustand'
import {
  collection,
  deleteDoc,
  doc,
  getDocs,
  onSnapshot,
  query,
  setDoc,
  updateDoc,
  where,
} from 'firebase/firestore'
import { db } from '../services/firebase'

export type TableStatus =
  | 'AVAILABLE'
  | 'OCCUPIED'
  | 'CLEANING'
  | 'INACTIVE'

export type RestaurantTable = {
  tableId: string
  restaurantId: string
  tableNumber: number
  verificationCode: string
  status: TableStatus
  active: boolean
  createdAt: string
}

type TableStore = {
  tables: RestaurantTable[]
  loading: boolean
  error: string | null

  subscribeToTables: () => () => void

  addTable: (
    tableNumber: number,
  ) => Promise<RestaurantTable>

  regenerateCode: (
    tableId: string,
  ) => Promise<void>

  updateStatus: (
    tableId: string,
    status: TableStatus,
  ) => Promise<void>

  deactivateTable: (
    tableId: string,
  ) => Promise<void>

  activateTable: (
    tableId: string,
  ) => Promise<void>

  deleteTable: (
    tableId: string,
  ) => Promise<void>
}

const RESTAURANT_ID = 'spice-garden'

function generateVerificationCode() {
  const characters =
    'ABCDEFGHJKLMNPQRSTUVWXYZ23456789'

  let code = ''

  for (let i = 0; i < 4; i++) {
    code += characters.charAt(
      Math.floor(
        Math.random() * characters.length,
      ),
    )
  }

  return code
}

async function generateUniqueCode() {
  const tablesRef = collection(db, 'tables')

  for (let attempt = 0; attempt < 20; attempt++) {
    const code = generateVerificationCode()

    const codeQuery = query(
      tablesRef,
      where('verificationCode', '==', code),
    )

    const snapshot = await getDocs(codeQuery)

    if (snapshot.empty) {
      return code
    }
  }

  throw new Error(
    'Unable to generate a unique verification code.',
  )
}

export const useTableStore =
  create<TableStore>((set) => ({
    tables: [],
    loading: true,
    error: null,

    subscribeToTables: () => {
      set({
        loading: true,
        error: null,
      })

      const tablesRef = collection(db, 'tables')

      const tablesQuery = query(
        tablesRef,
        where(
          'restaurantId',
          '==',
          RESTAURANT_ID,
        ),
      )

      const unsubscribe = onSnapshot(
        tablesQuery,

        (snapshot) => {
          const tables: RestaurantTable[] =
            snapshot.docs.map((tableDocument) => {
              const data = tableDocument.data()

              return {
                tableId: tableDocument.id,

                restaurantId:
                  data.restaurantId,

                tableNumber:
                  data.tableNumber,

                verificationCode:
                  data.verificationCode,

                status:
                  data.status as TableStatus,

                active:
                  data.active,

                createdAt:
                  data.createdAt ?? '',
              }
            })

          tables.sort(
            (a, b) =>
              a.tableNumber -
              b.tableNumber,
          )

          set({
            tables,
            loading: false,
            error: null,
          })
        },

        (error) => {
          console.error(
            'Unable to load tables:',
            error,
          )

          set({
            loading: false,
            error:
              'Unable to load restaurant tables.',
          })
        },
      )

      return unsubscribe
    },

    addTable: async (tableNumber) => {
      const duplicateQuery = query(
        collection(db, 'tables'),
        where(
          'restaurantId',
          '==',
          RESTAURANT_ID,
        ),
        where(
          'tableNumber',
          '==',
          tableNumber,
        ),
      )

      const duplicateSnapshot =
        await getDocs(duplicateQuery)

      if (!duplicateSnapshot.empty) {
        throw new Error(
          `Table ${tableNumber} already exists.`,
        )
      }

      const verificationCode =
        await generateUniqueCode()

      const tableId = `table-${tableNumber}`

      const table: RestaurantTable = {
        tableId,
        restaurantId: RESTAURANT_ID,
        tableNumber,
        verificationCode,
        status: 'AVAILABLE',
        active: true,
        createdAt: new Date().toISOString(),
      }

      await setDoc(
        doc(db, 'tables', tableId),
        {
          restaurantId:
            table.restaurantId,

          tableNumber:
            table.tableNumber,

          verificationCode:
            table.verificationCode,

          status:
            table.status,

          active:
            table.active,

          createdAt:
            table.createdAt,
        },
      )

      return table
    },

    regenerateCode: async (tableId) => {
      const newCode =
        await generateUniqueCode()

      await updateDoc(
        doc(db, 'tables', tableId),
        {
          verificationCode: newCode,
        },
      )
    },

    updateStatus: async (
      tableId,
      status,
    ) => {
      await updateDoc(
        doc(db, 'tables', tableId),
        {
          status,
        },
      )
    },

    deactivateTable: async (tableId) => {
      await updateDoc(
        doc(db, 'tables', tableId),
        {
          active: false,
          status: 'INACTIVE',
        },
      )
    },

    activateTable: async (tableId) => {
      await updateDoc(
        doc(db, 'tables', tableId),
        {
          active: true,
          status: 'AVAILABLE',
        },
      )
    },

    deleteTable: async (tableId) => {
      await deleteDoc(
        doc(db, 'tables', tableId),
      )
    },
  }))
