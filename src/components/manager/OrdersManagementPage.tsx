import {
  useEffect,
  useMemo,
  useState,
} from 'react'
import {
  ArrowLeft,
  CheckCircle2,
  ChefHat,
  Clock3,
  PackageCheck,
  Search,
  ShoppingBag,
  XCircle,
} from 'lucide-react'
import { useNavigate } from 'react-router-dom'
import {
  useOrderStore,
  type OrderStatus,
} from '../../store/orderStore'

type FilterStatus = 'ALL' | OrderStatus

const filters: FilterStatus[] = [
  'ALL',
  'NEW',
  'ACCEPTED',
  'PREPARING',
  'READY',
  'COMPLETED',
  'REJECTED',
]

export default function OrdersManagementPage() {
  const navigate = useNavigate()

  const orders = useOrderStore((state) => state.orders)
  const subscribeToOrders = useOrderStore(
    (state) => state.subscribeToOrders,
  )

  useEffect(() => {
    const unsubscribe =
      subscribeToOrders()

    return unsubscribe
  }, [subscribeToOrders])
  const [search, setSearch] = useState('')
  const [filter, setFilter] =
    useState<FilterStatus>('ALL')

  const filteredOrders = useMemo(() => {
    const query = search.trim().toLowerCase()

    return orders.filter((order) => {
      const matchesFilter =
        filter === 'ALL' ||
        order.status === filter

      const matchesSearch =
        !query ||
        order.orderId
          .toLowerCase()
          .includes(query) ||
        order.tableNumber
          .toString()
          .includes(query) ||
        order.items.some((item) =>
          item.name
            .toLowerCase()
            .includes(query),
        )

      return matchesFilter && matchesSearch
    })
  }, [orders, filter, search])

  const completedOrders = orders.filter(
    (order) => order.status === 'COMPLETED',
  )

  const totalSales = completedOrders.reduce(
    (total, order) =>
      total + order.totalAmount,
    0,
  )

  const pendingOrders = orders.filter(
    (order) =>
      order.status !== 'COMPLETED' &&
      order.status !== 'REJECTED',
  ).length

  return (
    <main className="min-h-screen bg-[#f5f5f3]">
      <header className="sticky top-0 z-30 border-b border-neutral-200 bg-white/95 backdrop-blur-xl">
        <div className="mx-auto flex max-w-7xl items-center justify-between px-4 py-4 sm:px-6">
          <div className="flex items-center gap-3">
            <button
              type="button"
              onClick={() =>
                navigate('/manager')
              }
              className="flex h-10 w-10 items-center justify-center rounded-xl bg-neutral-100"
            >
              <ArrowLeft size={19} />
            </button>

            <div>
              <p className="text-xs font-bold uppercase tracking-wider text-orange-500">
                Manager
              </p>

              <h1 className="text-xl font-black">
                Orders Management
              </h1>
            </div>
          </div>
        </div>
      </header>

      <div className="mx-auto max-w-7xl p-4 sm:p-6 lg:p-8">

        {/* SUMMARY */}

        <section className="grid grid-cols-2 gap-3 lg:grid-cols-4">
          <SummaryCard
            label="Total Orders"
            value={orders.length.toString()}
          />

          <SummaryCard
            label="Pending"
            value={pendingOrders.toString()}
          />

          <SummaryCard
            label="Completed"
            value={completedOrders.length.toString()}
          />

          <SummaryCard
            label="Completed Sales"
            value={`₹${totalSales.toLocaleString(
              'en-IN',
            )}`}
          />
        </section>

        {/* SEARCH */}

        <div className="mt-6 flex items-center gap-3 rounded-2xl border border-neutral-200 bg-white px-4">
          <Search
            size={19}
            className="shrink-0 text-neutral-400"
          />

          <input
            value={search}
            onChange={(event) =>
              setSearch(event.target.value)
            }
            placeholder="Search order, table or dish..."
            className="h-13 min-w-0 flex-1 bg-transparent text-sm outline-none"
          />
        </div>

        {/* FILTERS */}

        <div className="mt-4 flex gap-2 overflow-x-auto pb-2">
          {filters.map((status) => (
            <button
              key={status}
              type="button"
              onClick={() =>
                setFilter(status)
              }
              className={`shrink-0 rounded-full px-4 py-2 text-xs font-black transition ${
                filter === status
                  ? 'bg-orange-500 text-white'
                  : 'border border-neutral-200 bg-white text-neutral-500'
              }`}
            >
              {formatStatus(status)}

              {status !== 'ALL' && (
                <span className="ml-2 opacity-70">
                  {orders.filter(
                    (order) =>
                      order.status === status,
                  ).length}
                </span>
              )}
            </button>
          ))}
        </div>

        {/* ORDERS */}

        {filteredOrders.length === 0 ? (
          <div className="mt-6 rounded-[28px] border border-dashed border-neutral-300 bg-white py-20 text-center">
            <ShoppingBag
              size={42}
              className="mx-auto text-neutral-200"
            />

            <h2 className="mt-4 font-black">
              No orders found
            </h2>

            <p className="mt-1 text-sm text-neutral-400">
              Orders matching this filter will
              appear here.
            </p>
          </div>
        ) : (
          <section className="mt-6 grid gap-4 xl:grid-cols-2">
            {filteredOrders.map((order) => (
              <article
                key={order.orderId}
                className="overflow-hidden rounded-[26px] border border-neutral-200 bg-white shadow-sm"
              >
                {/* ORDER HEADER */}

                <div className="flex items-start justify-between gap-4 border-b border-neutral-100 p-5">
                  <div>
                    <div className="flex flex-wrap items-center gap-2">
                      <h2 className="text-lg font-black">
                        #{order.orderId}
                      </h2>

                      <StatusBadge
                        status={order.status}
                      />
                    </div>

                    <div className="mt-2 flex flex-wrap items-center gap-3 text-xs text-neutral-400">
                      <span>
                        Table {order.tableNumber}
                      </span>

                      <span className="flex items-center gap-1">
                        <Clock3 size={12} />

                        {formatOrderTime(
                          order.createdAt,
                        )}
                      </span>
                    </div>
                  </div>

                  <div className="text-right">
                    <p className="text-[10px] font-bold uppercase text-neutral-400">
                      Total
                    </p>

                    <p className="mt-1 text-xl font-black">
                      ₹{order.totalAmount}
                    </p>
                  </div>
                </div>

                {/* ITEMS */}

                <div className="space-y-4 p-5">
                  {order.items.map((item) => (
                    <div
                      key={item.cartItemId}
                      className="flex items-start gap-3"
                    >
                      <img
                        src={item.imageUrl}
                        alt={item.name}
                        className="h-14 w-14 shrink-0 rounded-xl bg-orange-50 object-cover"
                        onError={(event) => {
                          event.currentTarget.style.display =
                            'none'
                        }}
                      />

                      <div className="min-w-0 flex-1">
                        <div className="flex justify-between gap-3">
                          <p className="font-bold">
                            {item.name}
                          </p>

                          <span className="font-black text-orange-500">
                            ×{item.quantity}
                          </span>
                        </div>

                        <p className="mt-1 text-xs text-neutral-400">
                          {item.portion} ·{' '}
                          {item.spice}
                        </p>

                        {(item.extraChicken ||
                          item.extraRaita) && (
                          <p className="mt-1 text-[11px] font-semibold text-amber-600">
                            {[
                              item.extraChicken
                                ? 'Extra Chicken'
                                : '',
                              item.extraRaita
                                ? 'Extra Raita'
                                : '',
                            ]
                              .filter(Boolean)
                              .join(' · ')}
                          </p>
                        )}
                      </div>
                    </div>
                  ))}
                </div>

                {/* PRICE */}

                <div className="border-t border-neutral-100 bg-neutral-50 p-5">
                  <PriceRow
                    label="Items"
                    amount={order.itemsTotal}
                  />

                  <PriceRow
                    label="Taxes"
                    amount={order.taxes}
                  />

                  <PriceRow
                    label="Service Charge"
                    amount={
                      order.serviceCharge
                    }
                  />

                  <div className="mt-3 flex justify-between border-t border-neutral-200 pt-3">
                    <span className="font-black">
                      Total
                    </span>

                    <span className="font-black">
                      ₹{order.totalAmount}
                    </span>
                  </div>
                </div>
              </article>
            ))}
          </section>
        )}
      </div>
    </main>
  )
}

function SummaryCard({
  label,
  value,
}: {
  label: string
  value: string
}) {
  return (
    <article className="rounded-[22px] border border-neutral-200 bg-white p-5 shadow-sm">
      <p className="text-xs font-bold text-neutral-400">
        {label}
      </p>

      <p className="mt-2 text-2xl font-black">
        {value}
      </p>
    </article>
  )
}

function StatusBadge({
  status,
}: {
  status: OrderStatus
}) {
  const styles: Record<OrderStatus, string> = {
    NEW:
      'bg-orange-50 text-orange-600',
    ACCEPTED:
      'bg-cyan-50 text-cyan-600',
    PREPARING:
      'bg-blue-50 text-blue-600',
    READY:
      'bg-green-50 text-green-600',
    COMPLETED:
      'bg-neutral-100 text-neutral-600',
    REJECTED:
      'bg-red-50 text-red-600',
  }

  const icons: Record<
    OrderStatus,
    React.ReactNode
  > = {
    NEW: <Clock3 size={11} />,
    ACCEPTED: <CheckCircle2 size={11} />,
    PREPARING: <ChefHat size={11} />,
    READY: <PackageCheck size={11} />,
    COMPLETED: <CheckCircle2 size={11} />,
    REJECTED: <XCircle size={11} />,
  }

  return (
    <span
      className={`inline-flex items-center gap-1 rounded-full px-2.5 py-1 text-[9px] font-black ${styles[status]}`}
    >
      {icons[status]}
      {status}
    </span>
  )
}

function PriceRow({
  label,
  amount,
}: {
  label: string
  amount: number
}) {
  return (
    <div className="mb-2 flex justify-between text-xs text-neutral-500">
      <span>{label}</span>

      <span className="font-semibold">
        ₹{amount}
      </span>
    </div>
  )
}

function formatOrderTime(createdAt: string) {
  return new Date(createdAt).toLocaleString(
    [],
    {
      day: '2-digit',
      month: 'short',
      hour: '2-digit',
      minute: '2-digit',
    },
  )
}

function formatStatus(
  status: FilterStatus,
) {
  const labels: Record<
    FilterStatus,
    string
  > = {
    ALL: 'All',
    NEW: 'New',
    ACCEPTED: 'Accepted',
    PREPARING: 'Preparing',
    READY: 'Ready',
    COMPLETED: 'Completed',
    REJECTED: 'Rejected',
  }

  return labels[status]
}