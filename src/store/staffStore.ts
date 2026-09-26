import { create } from 'zustand'
import { persist } from 'zustand/middleware'

export type StaffRole =
  | 'MANAGER'
  | 'KITCHEN'
  | 'SERVER'

export type StaffStatus =
  | 'ACTIVE'
  | 'INACTIVE'

export type StaffMember = {
  id: string
  name: string
  email: string
  role: StaffRole
  status: StaffStatus
  createdAt: string
}

type StaffStore = {
  staff: StaffMember[]

  addStaff: (
    data: Omit<StaffMember, 'id' | 'createdAt'>,
  ) => void

  updateStaff: (
    id: string,
    updates: Partial<
      Omit<StaffMember, 'id' | 'createdAt'>
    >,
  ) => void

  toggleStatus: (id: string) => void

  deleteStaff: (id: string) => void
}

const initialStaff: StaffMember[] = [
  {
    id: 'staff-manager-1',
    name: 'Restaurant Manager',
    email: 'manager@spicegarden.com',
    role: 'MANAGER',
    status: 'ACTIVE',
    createdAt: new Date().toISOString(),
  },
  {
    id: 'staff-kitchen-1',
    name: 'Kitchen Staff',
    email: 'kitchen@spicegarden.com',
    role: 'KITCHEN',
    status: 'ACTIVE',
    createdAt: new Date().toISOString(),
  },
  {
    id: 'staff-server-1',
    name: 'Server Staff',
    email: 'server@spicegarden.com',
    role: 'SERVER',
    status: 'ACTIVE',
    createdAt: new Date().toISOString(),
  },
]

export const useStaffStore = create<StaffStore>()(
  persist(
    (set) => ({
      staff: initialStaff,

      addStaff: (data) =>
        set((state) => ({
          staff: [
            ...state.staff,
            {
              ...data,
              id: `staff-${Date.now()}`,
              createdAt: new Date().toISOString(),
            },
          ],
        })),

      updateStaff: (id, updates) =>
        set((state) => ({
          staff: state.staff.map((member) =>
            member.id === id
              ? {
                  ...member,
                  ...updates,
                }
              : member,
          ),
        })),

      toggleStatus: (id) =>
        set((state) => ({
          staff: state.staff.map((member) =>
            member.id === id
              ? {
                  ...member,
                  status:
                    member.status === 'ACTIVE'
                      ? 'INACTIVE'
                      : 'ACTIVE',
                }
              : member,
          ),
        })),

      deleteStaff: (id) =>
        set((state) => ({
          staff: state.staff.filter(
            (member) => member.id !== id,
          ),
        })),
    }),
    {
      name: 'smart-serve-staff',
    },
  ),
)