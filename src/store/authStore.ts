import { create } from 'zustand'
import {
  onAuthStateChanged,
} from 'firebase/auth'
import { auth } from '../services/firebase'
import {
  getStaffProfile,
  loginStaff,
  logoutStaff,
  type StaffProfile,
} from '../services/authService'

type AuthStore = {
  staff: StaffProfile | null
  loading: boolean
  initialized: boolean
  error: string | null

  login: (
    email: string,
    password: string,
  ) => Promise<StaffProfile>

  logout: () => Promise<void>

  initializeAuth: () => () => void
}

export const useAuthStore =
  create<AuthStore>((set) => ({
    staff: null,
    loading: false,
    initialized: false,
    error: null,

    login: async (email, password) => {
      set({
        loading: true,
        error: null,
      })

      try {
        const staff = await loginStaff(
          email,
          password,
        )

        set({
          staff,
          loading: false,
          initialized: true,
        })

        return staff
      } catch (error) {
        const message =
          error instanceof Error
            ? error.message
            : 'Unable to sign in.'

        set({
          staff: null,
          loading: false,
          error: message,
        })

        throw error
      }
    },

    logout: async () => {
      await logoutStaff()

      set({
        staff: null,
        error: null,
      })
    },

    initializeAuth: () => {
      const unsubscribe =
        onAuthStateChanged(
          auth,
          async (user) => {
            if (!user) {
              set({
                staff: null,
                initialized: true,
                loading: false,
              })

              return
            }

            try {
              const staff =
                await getStaffProfile(
                  user.uid,
                )

              if (!staff || !staff.active) {
                await logoutStaff()

                set({
                  staff: null,
                  initialized: true,
                  loading: false,
                })

                return
              }

              set({
                staff,
                initialized: true,
                loading: false,
                error: null,
              })
            } catch (error) {
              console.error(
                'Unable to restore staff session:',
                error,
              )

              set({
                staff: null,
                initialized: true,
                loading: false,
              })
            }
          },
        )

      return unsubscribe
    },
  }))