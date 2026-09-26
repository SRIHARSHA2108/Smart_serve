import { create } from 'zustand'
import { persist } from 'zustand/middleware'

export type CustomerSession = {
  restaurantId: string
  restaurantName: string
  tableId: string
  tableNumber: number
  verificationCode: string
  customerSessionId: string
}

type SessionStore = {
  session: CustomerSession | null

  setSession: (
    session: CustomerSession,
  ) => void

  clearSession: () => void
}

export const useSessionStore =
  create<SessionStore>()(
    persist(
      (set) => ({
        session: null,

        setSession: (session) => {
          set({ session })
        },

        clearSession: () => {
          set({ session: null })
        },
      }),
      {
        name: 'smart-serve-session',
      },
    ),
  )