import {
  useEffect,
  useState,
} from 'react'
import {
  ArrowLeft,
  Plus,
  RefreshCw,
  Table2,
  X,
} from 'lucide-react'
import { useNavigate } from 'react-router-dom'
import { QRCodeSVG } from 'qrcode.react'
import { useTableStore } from '../../store/tableStore'

export default function TableManagementPage() {
  const navigate = useNavigate()

  const tables = useTableStore((state) => state.tables)
  const loading = useTableStore(
    (state) => state.loading,
  )

  const firestoreError = useTableStore(
    (state) => state.error,
  )

  const subscribeToTables = useTableStore(
    (state) => state.subscribeToTables,
  )
  const addTable = useTableStore((state) => state.addTable)
  const regenerateCode = useTableStore(
    (state) => state.regenerateCode,
  )
  const deactivateTable = useTableStore(
    (state) => state.deactivateTable,
  )

  const [showAddTable, setShowAddTable] =
    useState(false)

  const [tableNumber, setTableNumber] =
    useState('')

  const [formError, setFormError] =
  useState('')
 
  useEffect(() => {
    const unsubscribe = subscribeToTables()

    return unsubscribe
  }, [subscribeToTables])
  const handleAddTable = () => {
    const number = Number(tableNumber)

    if (!number || number <= 0) {
      setFormError('Enter a valid table number.')
      return
    }

    try {
      addTable(number)

      setTableNumber('')
      setFormError('')
      setShowAddTable(false)
    } catch (err) {
      setFormError(
        err instanceof Error
          ? err.message
          : 'Unable to create table.',
      )
    }
  }

  return (
    <main className="min-h-screen bg-[#f5f5f3]">
      <header className="border-b border-neutral-200 bg-white">
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
                Table Management
              </h1>
            </div>
          </div>

          <button
            type="button"
            onClick={() => setShowAddTable(true)}
            className="flex items-center gap-2 rounded-xl bg-orange-500 px-4 py-3 text-sm font-bold text-white"
          >
            <Plus size={18} />
            Add Table
          </button>
        </div>
      </header>

      <div className="mx-auto max-w-7xl p-4 sm:p-6 lg:p-8">
        {loading && (
        <div className="mb-5 rounded-2xl bg-white p-5 text-sm font-bold text-neutral-500">
            Loading tables from Firebase...
          </div>
        )}

        {firestoreError && (
          <div className="mb-5 rounded-2xl bg-red-50 p-5 text-sm font-bold text-red-600">
            {firestoreError}
          </div>
        )}
        <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-3">
          {tables.map((table) => (
            <article
              key={table.tableId}
              className="rounded-[26px] border border-neutral-200 bg-white p-5 shadow-sm"
            >
              <div className="flex items-start justify-between">
                <div>
                  <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-orange-50 text-orange-500">
                    <Table2 size={22} />
                  </div>

                  <h2 className="mt-4 text-xl font-black">
                    Table {table.tableNumber}
                  </h2>
                </div>

                <StatusBadge
                  status={table.status}
                />
              </div>

              <div className="mt-5 rounded-2xl bg-neutral-50 p-4">
                <p className="text-[10px] font-bold uppercase tracking-wider text-neutral-400">
                  Verification Code
                </p>

                <p className="mt-1 text-2xl font-black tracking-[0.2em]">
                  {table.verificationCode}
                </p>
              </div>

              <div className="mt-5 flex justify-center rounded-2xl border border-neutral-100 p-4">
                <QRCodeSVG
                  value={`${window.location.origin}/verify?restaurant=spice-garden`}
                  size={130}
                  level="M"
                />
              </div>

              <p className="mt-2 text-center text-[10px] text-neutral-400">
                Spice Garden restaurant QR
              </p>

              <div className="mt-5 grid grid-cols-2 gap-2">
                <button
                  type="button"
                  onClick={() =>
                    regenerateCode(table.tableId)
                  }
                  disabled={!table.active}
                  className="flex items-center justify-center gap-2 rounded-xl border border-neutral-200 px-3 py-2.5 text-xs font-bold disabled:opacity-40"
                >
                  <RefreshCw size={14} />
                  New Code
                </button>

                <button
                  type="button"
                  disabled={!table.active}
                  onClick={() =>
                    deactivateTable(table.tableId)
                  }
                  className="flex items-center justify-center gap-2 rounded-xl border border-red-100 px-3 py-2.5 text-xs font-bold text-red-500 disabled:opacity-40"
                >
                  <X size={14} />
                  Deactivate
                </button>
              </div>
            </article>
          ))}
        </div>
      </div>

      {showAddTable && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 p-4 backdrop-blur-sm">
          <div className="w-full max-w-sm rounded-[28px] bg-white p-6 shadow-2xl">
            <div className="flex items-center justify-between">
              <h2 className="text-xl font-black">
                Add Table
              </h2>

              <button
                type="button"
                onClick={() => {
                  setShowAddTable(false)
                  setFormError('')
                }}
                className="flex h-9 w-9 items-center justify-center rounded-full bg-neutral-100"
              >
                <X size={18} />
              </button>
            </div>

            <label className="mt-6 block text-sm font-bold">
              Table Number
            </label>

            <input
              type="number"
              min="1"
              value={tableNumber}
              onChange={(event) =>
                setTableNumber(event.target.value)
              }
              placeholder="Example: 12"
              className="mt-2 h-13 w-full rounded-2xl border border-neutral-200 px-4 outline-none focus:border-orange-400"
            />

            {formError && (
              <p className="mt-2 text-xs font-semibold text-red-500">
                {formError}
              </p>
            )}

            <p className="mt-4 text-xs leading-5 text-neutral-400">
              Smart Serve will automatically generate a
              unique verification code for this table.
            </p>

            <button
              type="button"
              onClick={handleAddTable}
              className="mt-6 h-13 w-full rounded-2xl bg-orange-500 font-bold text-white"
            >
              Create Table
            </button>
          </div>
        </div>
      )}
    </main>
  )
}

function StatusBadge({
  status,
}: {
  status: string
}) {
  const styles: Record<string, string> = {
    AVAILABLE:
      'bg-green-50 text-green-600',
    OCCUPIED:
      'bg-orange-50 text-orange-600',
    CLEANING:
      'bg-blue-50 text-blue-600',
    INACTIVE:
      'bg-neutral-100 text-neutral-500',
  }

  return (
    <span
      className={`rounded-full px-3 py-1 text-[10px] font-black ${
        styles[status] ??
        'bg-neutral-100 text-neutral-500'
      }`}
    >
      {status}
    </span>
  )
}