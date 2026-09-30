import {
  Bell,
  CheckCircle2,
  ChefHat,
  ClipboardList,
  CreditCard,
  LayoutGrid,
  ReceiptText,
  UtensilsCrossed,
  LogOut,
} from 'lucide-react'
import {
  useEffect,
  useMemo,
  useState,
} from 'react'
import {
  useTableStatusStore,
  type TableOperationalStatus,
} from '../../store/tableStatusStore'
import {
  useTableStore,
  type RestaurantTable,
} from '../../store/tableStore'
import {
  useOrderStore,
  type ReceiptRequest,
  type Order,
} from '../../store/orderStore'
import { useNavigate } from 'react-router-dom'
import { useAuthStore } from '../../store/authStore'

type ServerSection = 'tables' | 'orders' | 'payments'

export default function ServerDashboard() {
  const orders = useOrderStore((state) => state.orders)
  const receiptRequests = useOrderStore(
    (state) => state.receiptRequests,
  )
  const subscribeToReceiptRequests = useOrderStore(
    (state) => state.subscribeToReceiptRequests,
  )
  const tableStatuses = useTableStatusStore(
    (state) => state.tableStatuses,
    )
  const tables = useTableStore((state) => state.tables)
  const subscribeToTables = useTableStore(
    (state) => state.subscribeToTables,
  )
  const [section, setSection] =
    useState<ServerSection>('tables')
  const [notificationsOpen, setNotificationsOpen] =
    useState(false)
  const navigate = useNavigate()

  const logout = useAuthStore(
    (state) => state.logout,
  )

  const handleLogout = async () => {
    await logout()

    navigate('/staff/login', {
      replace: true,
    })
  }
  const [selectedTable, setSelectedTable] =
    useState<number | null>(null)
  const subscribeToOrders = useOrderStore(
    (state) => state.subscribeToOrders,
  )

  useEffect(() => {
    const unsubscribe =
      subscribeToOrders()

    return unsubscribe
  }, [subscribeToOrders])

  useEffect(() => {
    const unsubscribe = subscribeToTables()

    return unsubscribe
  }, [subscribeToTables])

  useEffect(() => {
    const unsubscribe = subscribeToReceiptRequests()

    return unsubscribe
  }, [subscribeToReceiptRequests])
  const activeOrders = useMemo(
    () =>
      orders.filter(
        (order) =>
          order.status !== 'COMPLETED' &&
          order.status !== 'REJECTED',
      ),
    [orders],
  )

  const selectedOrder =
    selectedTable === null
      ? undefined
      : activeOrders.find(
          (order) =>
            order.tableNumber === selectedTable,
        )

  return (
    <main className="min-h-screen bg-[#f5f6f8] text-neutral-900">
      <header className="sticky top-0 z-40 border-b border-neutral-200 bg-white/95 backdrop-blur-xl">
        <div className="mx-auto flex max-w-7xl items-center justify-between px-4 py-4 sm:px-6">
          <div className="flex items-center gap-3">
            <div className="flex h-11 w-11 items-center justify-center rounded-2xl bg-orange-500 text-white">
              <ChefHat size={25} />
            </div>

            <div>
              <div className="font-black tracking-tight">
                SMART{' '}
                <span className="text-orange-500">
                  SERVE
                </span>
              </div>

              <div className="text-[10px] font-bold uppercase tracking-[0.18em] text-blue-500">
                Server
              </div>
            </div>
          </div>

          <div className="flex items-center gap-3">
            <div className="relative">
              <button
                type="button"
                onClick={() => setNotificationsOpen((open) => !open)}
                className="relative flex h-10 w-10 items-center justify-center rounded-full bg-neutral-100"
                aria-label="Open notifications"
              >
                <Bell size={19} />

                {(orders.some(
                  (order) => order.status === 'READY',
                ) || receiptRequests.length > 0) && (
                  <span className="absolute right-0 top-0 h-3 w-3 rounded-full border-2 border-white bg-red-500" />
                )}
              </button>

              {notificationsOpen && (
                <div className="absolute right-0 top-12 z-50 w-72 rounded-2xl border border-neutral-200 bg-white p-3 shadow-xl">
                  <p className="px-2 py-1 text-xs font-black uppercase tracking-wider text-neutral-400">
                    Notifications
                  </p>

                  {receiptRequests.length === 0 ? (
                    <p className="px-2 py-4 text-sm text-neutral-500">
                      No receipt requests.
                    </p>
                  ) : (
                    receiptRequests.map((order) => (
                      <button
                        key={order.orderId}
                        type="button"
                        onClick={() => {
                          setSection('payments')
                          setNotificationsOpen(false)
                        }}
                        className="mt-1 w-full rounded-xl bg-orange-50 px-3 py-3 text-left text-sm font-bold text-orange-800"
                      >
                        Table {order.tableNumber} requested a receipt
                        <span className="mt-1 block text-[11px] font-semibold text-orange-600">
                          Order #{order.orderId}
                        </span>
                      </button>
                    ))
                  )}
                </div>
              )}
            </div>

            <div className="flex h-10 w-10 items-center justify-center rounded-full bg-neutral-900 text-sm font-black text-white">
              S
            </div>
            <button
              type="button"
              onClick={handleLogout}
              className="flex h-10 items-center gap-2 rounded-xl border border-red-200 bg-red-50 px-3 text-xs font-bold text-red-600 transition hover:bg-red-100"
            >
              <LogOut size={16} />

              <span className="hidden sm:inline">
                Logout
              </span>
            </button>
          </div>
        </div>
      </header>

      <div className="mx-auto grid max-w-7xl lg:grid-cols-[230px_1fr]">
        <aside className="border-neutral-200 bg-white p-4 lg:min-h-[calc(100vh-77px)] lg:border-r lg:p-5">
          <div className="grid grid-cols-3 gap-2 lg:grid-cols-1">
            <ServerNavButton
              label="Tables"
              icon={<LayoutGrid size={18} />}
              active={section === 'tables'}
              onClick={() => {
                setSection('tables')
                setSelectedTable(null)
              }}
            />

            <ServerNavButton
              label="Orders"
              icon={<ClipboardList size={18} />}
              active={section === 'orders'}
              onClick={() => {
                setSection('orders')
                setSelectedTable(null)
              }}
            />

            <ServerNavButton
              label="Payments"
              icon={<CreditCard size={18} />}
              active={section === 'payments'}
              onClick={() => {
                setSection('payments')
                setSelectedTable(null)
              }}
            />
          </div>
        </aside>

        <section className="min-w-0 p-4 sm:p-6 lg:p-8">
          {selectedTable !== null ? (
            <TableDetails
              tableNumber={selectedTable}
              order={selectedOrder}
              onBack={() => setSelectedTable(null)}
            />
          ) : section === 'tables' ? (
            <TablesView
              activeOrders={activeOrders}
              tableStatuses={tableStatuses}
              tables={tables}
              onSelectTable={setSelectedTable}
            />
          ) : section === 'orders' ? (
            <OrdersView orders={orders} />
          ) : (
            <PaymentsView
              orders={orders}
              receiptRequests={receiptRequests}
            />
          )}
        </section>
      </div>
    </main>
  )
}

function TablesView({
  activeOrders,
  tableStatuses,
  tables,
  onSelectTable,
}: {
  activeOrders: Order[]
  tableStatuses: Record<
    number,
    TableOperationalStatus
  >
  tables: RestaurantTable[]
  onSelectTable: (tableNumber: number) => void
}) {
  return (
    <>
      <div className="mb-7">
        <p className="text-xs font-bold uppercase tracking-[0.18em] text-orange-500">
          Spice Garden
        </p>

        <h1 className="mt-2 text-3xl font-black">
          Tables
        </h1>

        <div className="mt-3 flex flex-wrap gap-4 text-xs font-semibold text-neutral-500">
          <Legend color="bg-green-500" label="Available" />
          <Legend color="bg-orange-500" label="Occupied" />
          <Legend color="bg-blue-500" label="Food Ready" />
          <Legend color="bg-neutral-400" label="Cleaning" />
        </div>
      </div>

      <div className="grid grid-cols-2 gap-3 sm:grid-cols-3 xl:grid-cols-4">
        {tables.map((table) => {
          const activeOrder = activeOrders.find(
            (order) =>
              order.tableNumber === table.tableNumber,
          )

          const operationalStatus =
            table.status ??
            tableStatuses[table.tableNumber] ??
            'AVAILABLE'

            const status = getTableStatus(
            operationalStatus,
            activeOrder,
            )

          return (
            <button
              key={table.tableId}
              type="button"
              onClick={() =>
                onSelectTable(table.tableNumber)
              }
              className={`min-h-36 rounded-[22px] border p-4 text-left transition hover:-translate-y-1 hover:shadow-md ${getTableStyles(
                status,
              )}`}
            >
              <div className="flex items-start justify-between">
                <UtensilsCrossed size={22} />

                <span className="h-2.5 w-2.5 rounded-full bg-current" />
              </div>

              <div className="mt-7">
                <div className="text-lg font-black">
                  Table {table.tableNumber}
                </div>

                <div className="mt-1 text-xs font-bold">
                  {status}
                </div>

                {activeOrder && (
                  <div className="mt-2 text-[10px] font-semibold opacity-70">
                    #{activeOrder.orderId}
                  </div>
                )}
              </div>
            </button>
          )
        })}
      </div>
    </>
  )
}

function TableDetails({
  tableNumber,
  order,
  onBack,
}: {
  tableNumber: number
  order?: Order
  onBack: () => void
}) {
  const updateOrderStatus = useOrderStore(
    (state) => state.updateOrderStatus,
  )
  const tableStatus = useTableStatusStore(
    (state) =>
        state.tableStatuses[tableNumber] ??
        'AVAILABLE',
    )

    const setTableStatus = useTableStatusStore(
    (state) => state.setTableStatus,
    )
  return (
    <div className="mx-auto max-w-3xl">
      <button
        type="button"
        onClick={onBack}
        className="mb-5 text-sm font-bold text-orange-500"
      >
        ← Back to Tables
      </button>

      <div className="rounded-[28px] bg-white p-6 shadow-sm">
        <div className="flex items-start justify-between gap-4">
          <div>
            <p className="text-xs font-bold uppercase tracking-[0.16em] text-neutral-400">
              Table Details
            </p>

            <h1 className="mt-2 text-3xl font-black">
              Table {tableNumber}
            </h1>
          </div>

            <span
            className={`rounded-full px-3 py-1.5 text-xs font-bold ${
                order?.status === 'READY'
                ? 'bg-blue-50 text-blue-600'
                : order
                    ? 'bg-orange-50 text-orange-600'
                : tableStatus === 'OCCUPIED'
                    ? 'bg-orange-50 text-orange-600'
                    : tableStatus === 'CLEANING'
                    ? 'bg-neutral-100 text-neutral-600'
                    : 'bg-green-50 text-green-600'
            }`}
            >
            {order?.status === 'READY'
                ? 'Food Ready'
                : formatTableStatus(tableStatus, order)}
            </span>
        </div>

        {!order ? (
          <div className="mt-8 rounded-2xl bg-neutral-50 p-8 text-center">
            <CheckCircle2
              size={34}
              className="mx-auto text-green-500"
            />

            <h2 className="mt-3 font-black">
              No active order
            </h2>

            <p className="mt-1 text-sm text-neutral-500">
              This table currently has no active order.
            </p>
          </div>
        ) : (
          <>
            <section className="mt-7 border-t border-neutral-100 pt-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-xs text-neutral-400">
                    Active Order
                  </p>

                  <h2 className="mt-1 text-xl font-black">
                    #{order.orderId}
                  </h2>
                </div>

                <OrderStatus status={order.status} />
              </div>

              <div className="mt-5 space-y-3">
                {order.items.map((item) => (
                  <div
                    key={item.cartItemId}
                    className="flex items-center justify-between rounded-2xl bg-neutral-50 p-4"
                  >
                    <div>
                      <p className="font-bold">
                        {item.name}
                      </p>

                      <p className="mt-1 text-xs text-neutral-500">
                        {item.portion} · {item.spice}
                      </p>
                    </div>

                    <span className="font-black">
                      ×{item.quantity}
                    </span>
                  </div>
                ))}
              </div>
            </section>

            {order.status === 'READY' && (
              <button
                type="button"
                onClick={() =>
                  updateOrderStatus(
                    order.orderId,
                    'COMPLETED',
                  )
                }
                className="mt-6 h-13 w-full rounded-2xl bg-green-500 font-black text-white"
              >
                Mark Served
              </button>
            )}

            <button
              type="button"
              className="mt-3 flex h-13 w-full items-center justify-center gap-2 rounded-2xl border border-neutral-200 bg-white font-bold"
            >
              <ReceiptText size={18} />
              Request Bill
            </button>
          </>
        )}

        <section className="mt-7 border-t border-neutral-100 pt-6">
          <h2 className="font-black">
            Table Availability
          </h2>

          <p className="mt-1 text-xs text-neutral-500">
            Update the physical table status manually.
          </p>

          <div className="mt-4 grid grid-cols-3 gap-2">
            <button
              type="button"
              onClick={() =>
                setTableStatus(
                  tableNumber,
                  'OCCUPIED',
                )
              }
              className={`rounded-xl px-3 py-3 text-xs font-bold ${
                tableStatus === 'OCCUPIED'
                  ? 'bg-orange-500 text-white'
                  : 'bg-orange-50 text-orange-600'
              }`}
            >
              Occupied
            </button>

            <button
              type="button"
              onClick={() =>
                setTableStatus(
                  tableNumber,
                  'CLEANING',
                )
              }
              className={`rounded-xl px-3 py-3 text-xs font-bold ${
                tableStatus === 'CLEANING'
                  ? 'bg-neutral-700 text-white'
                  : 'bg-neutral-100 text-neutral-600'
              }`}
            >
              Cleaning
            </button>

            <button
              type="button"
              onClick={() =>
                setTableStatus(
                  tableNumber,
                  'AVAILABLE',
                )
              }
              className={`rounded-xl px-3 py-3 text-xs font-bold ${
                tableStatus === 'AVAILABLE'
                  ? 'bg-green-500 text-white'
                  : 'bg-green-50 text-green-600'
              }`}
            >
              Available
            </button>
          </div>
        </section>
      </div>
    </div>
  )
}

function OrdersView({
  orders,
}: {
  orders: Order[]
}) {
  return (
    <>
      <p className="text-xs font-bold uppercase tracking-[0.18em] text-orange-500">
        Spice Garden
      </p>

      <h1 className="mt-2 text-3xl font-black">
        Orders
      </h1>

      <p className="mt-1 text-sm text-neutral-500">
        Restaurant order overview
      </p>

      {orders.length === 0 ? (
        <EmptyMessage text="No orders available." />
      ) : (
        <div className="mt-7 space-y-3">
          {orders.map((order) => (
            <div
              key={order.orderId}
              className="flex flex-wrap items-center justify-between gap-4 rounded-2xl bg-white p-5 shadow-sm"
            >
              <div>
                <div className="font-black">
                  #{order.orderId}
                </div>

                <div className="mt-1 text-xs text-neutral-500">
                  Table {order.tableNumber} ·{' '}
                  {order.items.length}{' '}
                  {order.items.length === 1
                    ? 'item'
                    : 'items'}
                </div>
              </div>

              <div className="flex items-center gap-4">
                <OrderStatus status={order.status} />

                <span className="font-black">
                  ₹{order.totalAmount}
                </span>
              </div>
            </div>
          ))}
        </div>
      )}
    </>
  )
}

function PaymentsView({
  orders,
  receiptRequests,
}: {
  orders: Order[]
  receiptRequests: ReceiptRequest[]
}) {
  const markPaymentReceived = useOrderStore(
    (state) => state.markPaymentReceived,
  )
  const completedOrders = orders.filter(
    (order) => order.status === 'COMPLETED',
  )
  const requestedOrders = receiptRequests
    .map((request) =>
      orders.find(
        (order) => order.orderId === request.orderId,
      ),
    )
    .filter((order): order is Order => Boolean(order))
  const paymentOrders = [
    ...completedOrders,
    ...requestedOrders.filter(
      (requestedOrder) =>
        !completedOrders.some(
          (completedOrder) =>
            completedOrder.orderId === requestedOrder.orderId,
        ),
    ),
  ]
  return (
    <>
      <p className="text-xs font-bold uppercase tracking-[0.18em] text-orange-500">
        Spice Garden
      </p>

      <h1 className="mt-2 text-3xl font-black">
        Payments
      </h1>

      <p className="mt-1 text-sm text-neutral-500">
        Confirm payment after collecting the bill from the table.
      </p>

      {receiptRequests.length > 0 && (
        <div className="mt-6 flex items-start gap-3 rounded-2xl border border-orange-200 bg-orange-50 p-4 text-sm text-orange-800">
          <Bell size={18} className="mt-0.5 shrink-0" />
          <div>
            <p className="font-black">Receipt requested</p>
            <p className="mt-1 text-xs">
              {receiptRequests.length} customer request{receiptRequests.length === 1 ? '' : 's'} waiting for payment confirmation.
            </p>
          </div>
        </div>
      )}

      {paymentOrders.length === 0 ? (
        <EmptyMessage text="No payment requests available." />
      ) : (
        <div className="mt-7 space-y-3">
          {paymentOrders.map((order) => (
            <div
              key={order.orderId}
              className="rounded-2xl bg-white p-5 shadow-sm"
            >
              <div className="flex items-center justify-between">
                <div>
                  <div className="font-black">
                    Table {receiptRequests.find(
                      (request) =>
                        request.orderId === order.orderId,
                    )?.tableNumber ?? order.tableNumber}
                  </div>

                  <div className="mt-1 text-xs text-neutral-500">
                    #{order.orderId}
                  </div>
                </div>

                <div className="text-right">
                  <div className="text-xs text-neutral-400">
                    Amount to be Paid
                  </div>

                  <div className="text-xl font-black">
                    ₹{order.totalAmount}
                  </div>
                </div>
              </div>

              <label className="mt-5 flex cursor-pointer items-center gap-3 rounded-xl border border-neutral-200 bg-neutral-50 p-3 text-sm font-bold">
                <input
                  type="checkbox"
                  checked={order.paymentStatus === 'PAID'}
                  disabled={order.paymentStatus === 'PAID'}
                  onChange={() => markPaymentReceived(order.orderId)}
                  className="h-5 w-5 accent-green-600"
                />
                {order.paymentStatus === 'PAID'
                  ? 'Payment confirmed'
                  : 'Mark payment received'}
              </label>
            </div>
          ))}
        </div>
      )}
    </>
  )
}

function ServerNavButton({
  label,
  icon,
  active,
  onClick,
}: {
  label: string
  icon: React.ReactNode
  active: boolean
  onClick: () => void
}) {
  return (
    <button
      type="button"
      onClick={onClick}
      className={`flex items-center justify-center gap-2 rounded-xl px-3 py-3 text-sm font-bold transition lg:justify-start ${
        active
          ? 'bg-blue-50 text-blue-600'
          : 'text-neutral-500 hover:bg-neutral-50'
      }`}
    >
      {icon}
      {label}
    </button>
  )
}

function OrderStatus({
  status,
}: {
  status: Order['status']
}) {
  const styles = {
    NEW: 'bg-orange-50 text-orange-600',
    ACCEPTED: 'bg-cyan-50 text-cyan-700',
    PREPARING: 'bg-amber-50 text-amber-600',
    READY: 'bg-blue-50 text-blue-600',
    COMPLETED: 'bg-green-50 text-green-600',
    REJECTED: 'bg-red-50 text-red-600',
  }

  return (
    <span
      className={`rounded-full px-3 py-1.5 text-[10px] font-black ${styles[status]}`}
    >
      {status}
    </span>
  )
}

function Legend({
  color,
  label,
}: {
  color: string
  label: string
}) {
  return (
    <span className="flex items-center gap-1.5">
      <span
        className={`h-2 w-2 rounded-full ${color}`}
      />
      {label}
    </span>
  )
}

function EmptyMessage({
  text,
}: {
  text: string
}) {
  return (
    <div className="mt-7 rounded-[28px] border border-dashed border-neutral-300 bg-white p-12 text-center text-sm text-neutral-500">
      {text}
    </div>
  )
}

function getTableStatus(
  operationalStatus: TableOperationalStatus,
  order?: Order,
) {
  if (order?.status === 'READY') {
    return 'Food Ready'
  }

  if (order) {
    return 'Occupied'
  }

  if (operationalStatus === 'OCCUPIED') {
    return 'Occupied'
  }

  if (operationalStatus === 'CLEANING') {
    return 'Cleaning'
  }

  if (operationalStatus === 'INACTIVE') {
    return 'Inactive'
  }

  return 'Available'
}

function getTableStyles(status: string) {
  if (status === 'Food Ready') {
    return 'border-blue-200 bg-blue-50 text-blue-700'
  }

  if (status === 'Occupied') {
    return 'border-orange-200 bg-orange-50 text-orange-700'
  }

  if (status === 'Cleaning') {
    return 'border-neutral-300 bg-neutral-100 text-neutral-600'
  }

  if (status === 'Inactive') {
    return 'border-neutral-300 bg-neutral-100 text-neutral-500'
  }

  return 'border-green-200 bg-green-50 text-green-700'
}
function formatTableStatus(
  status: TableOperationalStatus,
  order?: Order,
) {
  if (order?.status === 'READY') {
    return 'Food Ready'
  }

  if (order) {
    return 'Occupied'
  }

  if (status === 'OCCUPIED') {
    return 'Occupied'
  }

  if (status === 'CLEANING') {
    return 'Cleaning'
  }

  return 'Available'
}
