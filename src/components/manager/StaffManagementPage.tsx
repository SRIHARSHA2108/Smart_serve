import { useState } from 'react'
import {
  ArrowLeft,
  ChefHat,
  Edit3,
  Plus,
  Search,
  Trash2,
  UserCheck,
  UserRound,
  Users,
  UserX,
  X,
} from 'lucide-react'
import { useNavigate } from 'react-router-dom'
import {
  useStaffStore,
  type StaffRole,
} from '../../store/staffStore'

export default function StaffManagementPage() {
  const navigate = useNavigate()

  const staff = useStaffStore((state) => state.staff)
  const addStaff = useStaffStore(
    (state) => state.addStaff,
  )
  const updateStaff = useStaffStore(
    (state) => state.updateStaff,
  )
  const toggleStatus = useStaffStore(
    (state) => state.toggleStatus,
  )
  const deleteStaff = useStaffStore(
    (state) => state.deleteStaff,
  )

  const [search, setSearch] = useState('')
  const [showForm, setShowForm] = useState(false)
  const [editingId, setEditingId] =
    useState<string | null>(null)

  const [name, setName] = useState('')
  const [email, setEmail] = useState('')
  const [role, setRole] =
    useState<StaffRole>('SERVER')
  const [error, setError] = useState('')

  const filteredStaff = staff.filter((member) => {
    const query = search.trim().toLowerCase()

    return (
      !query ||
      member.name.toLowerCase().includes(query) ||
      member.email.toLowerCase().includes(query) ||
      member.role.toLowerCase().includes(query)
    )
  })

  const resetForm = () => {
    setName('')
    setEmail('')
    setRole('SERVER')
    setEditingId(null)
    setError('')
    setShowForm(false)
  }

  const openAddForm = () => {
    resetForm()
    setShowForm(true)
  }

  const openEditForm = (id: string) => {
    const member = staff.find(
      (item) => item.id === id,
    )

    if (!member) return

    setEditingId(member.id)
    setName(member.name)
    setEmail(member.email)
    setRole(member.role)
    setError('')
    setShowForm(true)
  }

  const handleSave = () => {
    if (!name.trim()) {
      setError('Enter the staff member name.')
      return
    }

    if (
      !email.trim() ||
      !email.includes('@')
    ) {
      setError('Enter a valid email address.')
      return
    }

    const duplicateEmail = staff.some(
      (member) =>
        member.email.toLowerCase() ===
          email.trim().toLowerCase() &&
        member.id !== editingId,
    )

    if (duplicateEmail) {
      setError(
        'A staff member with this email already exists.',
      )
      return
    }

    if (editingId) {
      updateStaff(editingId, {
        name: name.trim(),
        email: email.trim().toLowerCase(),
        role,
      })
    } else {
      addStaff({
        name: name.trim(),
        email: email.trim().toLowerCase(),
        role,
        status: 'ACTIVE',
      })
    }

    resetForm()
  }

  return (
    <main className="min-h-screen bg-[#f5f5f3]">
      <header className="sticky top-0 z-30 border-b border-neutral-200 bg-white/95 backdrop-blur-xl">
        <div className="mx-auto flex max-w-7xl items-center justify-between px-4 py-4 sm:px-6">
          <div className="flex items-center gap-3">
            <button
              type="button"
              onClick={() => navigate('/manager')}
              className="flex h-10 w-10 items-center justify-center rounded-xl bg-neutral-100"
            >
              <ArrowLeft size={19} />
            </button>

            <div>
              <p className="text-xs font-bold uppercase tracking-wider text-orange-500">
                Manager
              </p>

              <h1 className="text-xl font-black">
                Staff Management
              </h1>
            </div>
          </div>

          <button
            type="button"
            onClick={openAddForm}
            className="flex items-center gap-2 rounded-xl bg-orange-500 px-4 py-3 text-sm font-bold text-white"
          >
            <Plus size={18} />
            Add Staff
          </button>
        </div>
      </header>

      <div className="mx-auto max-w-7xl p-4 sm:p-6 lg:p-8">
        <section className="grid grid-cols-2 gap-3 sm:grid-cols-4">
          <Summary
            label="Total Staff"
            value={staff.length}
          />

          <Summary
            label="Kitchen"
            value={
              staff.filter(
                (member) =>
                  member.role === 'KITCHEN',
              ).length
            }
          />

          <Summary
            label="Servers"
            value={
              staff.filter(
                (member) =>
                  member.role === 'SERVER',
              ).length
            }
          />

          <Summary
            label="Active"
            value={
              staff.filter(
                (member) =>
                  member.status === 'ACTIVE',
              ).length
            }
          />
        </section>

        <div className="mt-6 flex items-center gap-3 rounded-2xl border border-neutral-200 bg-white px-4">
          <Search
            size={19}
            className="text-neutral-400"
          />

          <input
            value={search}
            onChange={(event) =>
              setSearch(event.target.value)
            }
            placeholder="Search staff..."
            className="h-13 flex-1 bg-transparent text-sm outline-none"
          />
        </div>

        <section className="mt-6 grid gap-4 md:grid-cols-2 xl:grid-cols-3">
          {filteredStaff.map((member) => (
            <article
              key={member.id}
              className="rounded-[24px] border border-neutral-200 bg-white p-5 shadow-sm"
            >
              <div className="flex items-start justify-between gap-3">
                <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-orange-50 text-orange-500">
                  {member.role === 'KITCHEN' ? (
                    <ChefHat size={23} />
                  ) : member.role === 'SERVER' ? (
                    <UserRound size={23} />
                  ) : (
                    <Users size={23} />
                  )}
                </div>

                <span
                  className={`rounded-full px-3 py-1 text-[10px] font-black ${
                    member.status === 'ACTIVE'
                      ? 'bg-green-50 text-green-600'
                      : 'bg-neutral-100 text-neutral-500'
                  }`}
                >
                  {member.status}
                </span>
              </div>

              <h2 className="mt-4 text-lg font-black">
                {member.name}
              </h2>

              <p className="mt-1 break-all text-xs text-neutral-400">
                {member.email}
              </p>

              <span className="mt-4 inline-block rounded-full bg-neutral-100 px-3 py-1 text-[10px] font-black text-neutral-600">
                {formatRole(member.role)}
              </span>

              <div className="mt-5 grid grid-cols-3 gap-2">
                <button
                  type="button"
                  onClick={() =>
                    openEditForm(member.id)
                  }
                  className="flex items-center justify-center gap-1 rounded-xl bg-neutral-100 px-2 py-2.5 text-xs font-bold"
                >
                  <Edit3 size={14} />
                  Edit
                </button>

                <button
                  type="button"
                  onClick={() =>
                    toggleStatus(member.id)
                  }
                  className="flex items-center justify-center gap-1 rounded-xl bg-orange-50 px-2 py-2.5 text-xs font-bold text-orange-600"
                >
                  {member.status === 'ACTIVE' ? (
                    <UserX size={14} />
                  ) : (
                    <UserCheck size={14} />
                  )}

                  {member.status === 'ACTIVE'
                    ? 'Disable'
                    : 'Enable'}
                </button>

                <button
                  type="button"
                  onClick={() => {
                    if (
                      window.confirm(
                        `Delete ${member.name}?`,
                      )
                    ) {
                      deleteStaff(member.id)
                    }
                  }}
                  className="flex items-center justify-center gap-1 rounded-xl bg-red-50 px-2 py-2.5 text-xs font-bold text-red-500"
                >
                  <Trash2 size={14} />
                  Delete
                </button>
              </div>
            </article>
          ))}
        </section>
      </div>

      {showForm && (
        <div className="fixed inset-0 z-50 overflow-y-auto bg-black/40 p-4 backdrop-blur-sm">
          <div className="mx-auto my-10 max-w-md rounded-[28px] bg-white p-6 shadow-2xl">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-xs font-bold uppercase text-orange-500">
                  Staff
                </p>

                <h2 className="text-xl font-black">
                  {editingId
                    ? 'Edit Staff'
                    : 'Add Staff'}
                </h2>
              </div>

              <button
                type="button"
                onClick={resetForm}
                className="flex h-9 w-9 items-center justify-center rounded-full bg-neutral-100"
              >
                <X size={18} />
              </button>
            </div>

            <div className="mt-6 space-y-4">
              <Field
                label="Full Name"
                value={name}
                onChange={setName}
                placeholder="Staff member name"
              />

              <Field
                label="Email"
                value={email}
                onChange={setEmail}
                placeholder="staff@spicegarden.com"
                type="email"
              />

              <div>
                <label className="text-sm font-bold">
                  Role
                </label>

                <select
                  value={role}
                  onChange={(event) =>
                    setRole(
                      event.target
                        .value as StaffRole,
                    )
                  }
                  className="mt-2 h-12 w-full rounded-xl border border-neutral-200 bg-white px-3 outline-none focus:border-orange-400"
                >
                  <option value="SERVER">
                    Server / Waiter
                  </option>

                  <option value="KITCHEN">
                    Kitchen Staff
                  </option>

                  <option value="MANAGER">
                    Manager
                  </option>
                </select>
              </div>

              {error && (
                <p className="rounded-xl bg-red-50 p-3 text-xs font-semibold text-red-600">
                  {error}
                </p>
              )}
            </div>

            <button
              type="button"
              onClick={handleSave}
              className="mt-6 h-13 w-full rounded-2xl bg-orange-500 font-bold text-white"
            >
              {editingId
                ? 'Save Changes'
                : 'Create Staff'}
            </button>

            <p className="mt-4 text-center text-[11px] leading-5 text-neutral-400">
              Authentication credentials will be connected
              when Firebase/Supabase Auth is added.
            </p>
          </div>
        </div>
      )}
    </main>
  )
}

function Summary({
  label,
  value,
}: {
  label: string
  value: number
}) {
  return (
    <div className="rounded-2xl border border-neutral-200 bg-white p-4">
      <p className="text-xs font-bold text-neutral-400">
        {label}
      </p>

      <p className="mt-2 text-2xl font-black">
        {value}
      </p>
    </div>
  )
}

function Field({
  label,
  value,
  onChange,
  placeholder,
  type = 'text',
}: {
  label: string
  value: string
  onChange: (value: string) => void
  placeholder: string
  type?: string
}) {
  return (
    <div>
      <label className="text-sm font-bold">
        {label}
      </label>

      <input
        type={type}
        value={value}
        onChange={(event) =>
          onChange(event.target.value)
        }
        placeholder={placeholder}
        className="mt-2 h-12 w-full rounded-xl border border-neutral-200 px-3 outline-none focus:border-orange-400"
      />
    </div>
  )
}

function formatRole(role: StaffRole) {
  const roles: Record<StaffRole, string> = {
    MANAGER: 'Manager',
    KITCHEN: 'Kitchen Staff',
    SERVER: 'Server / Waiter',
  }

  return roles[role]
}