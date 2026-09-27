import type {
  ReactNode,
} from 'react'
import {
  Navigate,
} from 'react-router-dom'
import { useAuthStore } from '../../store/authStore'
import type { StaffRole } from '../../services/authService'

type ProtectedRouteProps = {
  children: ReactNode
  allowedRoles: StaffRole[]
}

export default function ProtectedRoute({
  children,
  allowedRoles,
}: ProtectedRouteProps) {
  const staff = useAuthStore(
    (state) => state.staff,
  )

  const initialized = useAuthStore(
    (state) => state.initialized,
  )

  if (!initialized) {
    return (
      <main className="flex min-h-screen items-center justify-center bg-[#f6f3ee]">
        <p className="font-bold text-neutral-500">
          Checking staff access...
        </p>
      </main>
    )
  }

  if (!staff) {
    return (
      <Navigate
        to="/staff/login"
        replace
      />
    )
  }

  if (
    !allowedRoles.includes(staff.role)
  ) {
    switch (staff.role) {
      case 'MANAGER':
        return (
          <Navigate
            to="/manager"
            replace
          />
        )

      case 'KITCHEN':
        return (
          <Navigate
            to="/kitchen"
            replace
          />
        )

      case 'SERVER':
        return (
          <Navigate
            to="/server"
            replace
          />
        )
    }
  }

  return children
}