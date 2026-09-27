import {
  ChefHat,
  Eye,
  EyeOff,
  LockKeyhole,
  Mail,
} from 'lucide-react'
import {
  useState,
} from 'react'
import {
  useNavigate,
} from 'react-router-dom'
import { useAuthStore } from '../../store/authStore'
import type { StaffRole } from '../../services/authService'

function dashboardForRole(
  role: StaffRole,
) {
  switch (role) {
    case 'MANAGER':
      return '/manager'

    case 'KITCHEN':
      return '/kitchen'

    case 'SERVER':
      return '/server'
  }
}

export default function StaffLoginPage() {
  const navigate = useNavigate()

  const login = useAuthStore(
    (state) => state.login,
  )

  const loading = useAuthStore(
    (state) => state.loading,
  )

  const storeError = useAuthStore(
    (state) => state.error,
  )

  const [email, setEmail] =
    useState('')

  const [password, setPassword] =
    useState('')

  const [showPassword, setShowPassword] =
    useState(false)

  const handleSubmit = async (
    event: React.FormEvent,
  ) => {
    event.preventDefault()

    if (!email.trim() || !password) {
      return
    }

    try {
      const staff = await login(
        email,
        password,
      )

      navigate(
        dashboardForRole(staff.role),
        {
          replace: true,
        },
      )
    } catch {
      // authStore displays the error
    }
  }

  return (
    <main className="flex min-h-screen items-center justify-center bg-[#f6f3ee] p-4">
      <div className="w-full max-w-md">
        <div className="rounded-[32px] border border-neutral-200 bg-white p-7 shadow-xl shadow-neutral-900/5 sm:p-8">
          <div className="text-center">
            <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-2xl bg-orange-500 text-white shadow-lg shadow-orange-500/20">
              <ChefHat size={32} />
            </div>

            <h1 className="mt-5 text-2xl font-black">
              SMART{' '}
              <span className="text-orange-500">
                SERVE
              </span>
            </h1>

            <p className="mt-1 text-xs font-bold uppercase tracking-[0.18em] text-neutral-400">
              Staff Portal
            </p>

            <h2 className="mt-7 text-xl font-black">
              Welcome back
            </h2>

            <p className="mt-2 text-sm text-neutral-500">
              Sign in with your restaurant
              staff account.
            </p>
          </div>

          <form
            onSubmit={handleSubmit}
            className="mt-7 space-y-4"
          >
            <div>
              <label className="text-sm font-bold">
                Email
              </label>

              <div className="mt-2 flex h-13 items-center gap-3 rounded-2xl border border-neutral-200 px-4 focus-within:border-orange-400">
                <Mail
                  size={18}
                  className="text-neutral-400"
                />

                <input
                  type="email"
                  value={email}
                  onChange={(event) =>
                    setEmail(
                      event.target.value,
                    )
                  }
                  autoComplete="email"
                  placeholder="staff@spicegarden.com"
                  className="min-w-0 flex-1 bg-transparent text-sm outline-none"
                />
              </div>
            </div>

            <div>
              <label className="text-sm font-bold">
                Password
              </label>

              <div className="mt-2 flex h-13 items-center gap-3 rounded-2xl border border-neutral-200 px-4 focus-within:border-orange-400">
                <LockKeyhole
                  size={18}
                  className="text-neutral-400"
                />

                <input
                  type={
                    showPassword
                      ? 'text'
                      : 'password'
                  }
                  value={password}
                  onChange={(event) =>
                    setPassword(
                      event.target.value,
                    )
                  }
                  autoComplete="current-password"
                  placeholder="Enter password"
                  className="min-w-0 flex-1 bg-transparent text-sm outline-none"
                />

                <button
                  type="button"
                  onClick={() =>
                    setShowPassword(
                      (current) =>
                        !current,
                    )
                  }
                  className="text-neutral-400"
                >
                  {showPassword ? (
                    <EyeOff size={18} />
                  ) : (
                    <Eye size={18} />
                  )}
                </button>
              </div>
            </div>

            {storeError && (
              <div className="rounded-2xl bg-red-50 p-3 text-sm font-semibold text-red-600">
                {storeError}
              </div>
            )}

            <button
              type="submit"
              disabled={loading}
              className="h-14 w-full rounded-2xl bg-orange-500 font-black text-white shadow-lg shadow-orange-500/20 disabled:opacity-50"
            >
              {loading
                ? 'Signing in...'
                : 'Sign In'}
            </button>
          </form>

          <p className="mt-6 text-center text-xs leading-5 text-neutral-400">
            Manager, Kitchen and Server
            accounts only.
          </p>
        </div>

        <p className="mt-5 text-center text-xs text-neutral-400">
          Smart Serve · See it. Choose it.
          Enjoy it.
        </p>
      </div>
    </main>
  )
}