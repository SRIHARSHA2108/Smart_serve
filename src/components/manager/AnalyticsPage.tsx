import { useMemo } from 'react'
import {
  ArrowLeft,
  BarChart3,
  CheckCircle2,
  IndianRupee,
  ShoppingBag,
  TrendingUp,
  UtensilsCrossed,
} from 'lucide-react'
import { useNavigate } from 'react-router-dom'
import { useOrderStore } from '../../store/orderStore'

export default function AnalyticsPage() {
  const navigate = useNavigate()
  const orders = useOrderStore((state) => state.orders)

  const completedOrders = useMemo(
    () =>
      orders.filter(
        (order) => order.status === 'COMPLETED',
      ),
    [orders],
  )

  const totalSales = completedOrders.reduce(
    (total, order) => total + order.totalAmount,
    0,
  )

  const averageOrderValue =
    completedOrders.length > 0
      ? Math.round(
          totalSales / completedOrders.length,
        )
      : 0

  const pendingOrders = orders.filter(
    (order) =>
      order.status !== 'COMPLETED' &&
      order.status !== 'REJECTED',
  ).length

  const popularDishes = useMemo(() => {
    const counts = new Map<
      string,
      {
        name: string
        quantity: number
        revenue: number
      }
    >()

    orders
      .filter(
        (order) =>
          order.status !== 'REJECTED',
      )
      .forEach((order) => {
        order.items.forEach((item) => {
          const existing = counts.get(item.name)

          if (existing) {
            existing.quantity += item.quantity
            existing.revenue +=
              item.unitPrice * item.quantity
          } else {
            counts.set(item.name, {
              name: item.name,
              quantity: item.quantity,
              revenue:
                item.unitPrice * item.quantity,
            })
          }
        })
      })

    return Array.from(counts.values())
      .sort(
        (a, b) =>
          b.quantity - a.quantity,
      )
      .slice(0, 5)
  }, [orders])

  const maxDishQuantity = Math.max(
    ...popularDishes.map(
      (dish) => dish.quantity,
    ),
    1,
  )

  const statusData = [
    {
      label: 'New',
      value: orders.filter(
        (order) => order.status === 'NEW',
      ).length,
    },
    {
      label: 'Accepted',
      value: orders.filter(
        (order) =>
          order.status === 'ACCEPTED',
      ).length,
    },
    {
      label: 'Preparing',
      value: orders.filter(
        (order) =>
          order.status === 'PREPARING',
      ).length,
    },
    {
      label: 'Ready',
      value: orders.filter(
        (order) => order.status === 'READY',
      ).length,
    },
    {
      label: 'Completed',
      value: completedOrders.length,
    },
    {
      label: 'Rejected',
      value: orders.filter(
        (order) =>
          order.status === 'REJECTED',
      ).length,
    },
  ]

  const maxStatusCount = Math.max(
    ...statusData.map(
      (status) => status.value,
    ),
    1,
  )

  return (
    <main className="min-h-screen bg-[#f5f5f3]">
      <header className="sticky top-0 z-30 border-b border-neutral-200 bg-white/95 backdrop-blur-xl">
        <div className="mx-auto flex max-w-7xl items-center gap-3 px-4 py-4 sm:px-6">
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
              Analytics
            </h1>
          </div>
        </div>
      </header>

      <div className="mx-auto max-w-7xl p-4 sm:p-6 lg:p-8">
        <div>
          <p className="text-sm text-neutral-500">
            Spice Garden performance
          </p>

          <h2 className="mt-1 text-3xl font-black tracking-tight">
            Restaurant Analytics
          </h2>
        </div>

        <section className="mt-7 grid grid-cols-2 gap-3 xl:grid-cols-4">
          <MetricCard
            icon={<IndianRupee size={21} />}
            label="Completed Sales"
            value={`₹${totalSales.toLocaleString(
              'en-IN',
            )}`}
            subtitle="Completed orders"
          />

          <MetricCard
            icon={<ShoppingBag size={21} />}
            label="Total Orders"
            value={orders.length.toString()}
            subtitle="All recorded orders"
          />

          <MetricCard
            icon={<TrendingUp size={21} />}
            label="Average Order"
            value={`₹${averageOrderValue.toLocaleString(
              'en-IN',
            )}`}
            subtitle="Completed orders"
          />

          <MetricCard
            icon={<BarChart3 size={21} />}
            label="Pending Orders"
            value={pendingOrders.toString()}
            subtitle="Currently active"
          />
        </section>

        <div className="mt-7 grid gap-6 xl:grid-cols-2">
          {/* POPULAR DISHES */}

          <section className="rounded-[26px] border border-neutral-200 bg-white p-5 shadow-sm">
            <div>
              <h3 className="text-lg font-black">
                Popular Dishes
              </h3>

              <p className="mt-1 text-xs text-neutral-400">
                Based on ordered quantities
              </p>
            </div>

            {popularDishes.length === 0 ? (
              <EmptyState message="No dish sales data yet." />
            ) : (
              <div className="mt-6 space-y-5">
                {popularDishes.map(
                  (dish, index) => (
                    <div key={dish.name}>
                      <div className="flex items-center justify-between gap-4">
                        <div className="flex min-w-0 items-center gap-3">
                          <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-orange-50 text-xs font-black text-orange-500">
                            {index + 1}
                          </div>

                          <div className="min-w-0">
                            <p className="truncate text-sm font-black">
                              {dish.name}
                            </p>

                            <p className="mt-0.5 text-[11px] text-neutral-400">
                              ₹
                              {dish.revenue.toLocaleString(
                                'en-IN',
                              )}{' '}
                              revenue
                            </p>
                          </div>
                        </div>

                        <span className="shrink-0 text-sm font-black">
                          {dish.quantity}{' '}
                          ordered
                        </span>
                      </div>

                      <div className="ml-11 mt-2 h-2 overflow-hidden rounded-full bg-neutral-100">
                        <div
                          className="h-full rounded-full bg-orange-500"
                          style={{
                            width: `${
                              (dish.quantity /
                                maxDishQuantity) *
                              100
                            }%`,
                          }}
                        />
                      </div>
                    </div>
                  ),
                )}
              </div>
            )}
          </section>

          {/* ORDER STATUS */}

          <section className="rounded-[26px] border border-neutral-200 bg-white p-5 shadow-sm">
            <div>
              <h3 className="text-lg font-black">
                Order Status
              </h3>

              <p className="mt-1 text-xs text-neutral-400">
                Current order distribution
              </p>
            </div>

            {orders.length === 0 ? (
              <EmptyState message="No order data yet." />
            ) : (
              <div className="mt-6 space-y-4">
                {statusData.map((status) => (
                  <div key={status.label}>
                    <div className="flex items-center justify-between">
                      <span className="text-sm font-bold text-neutral-600">
                        {status.label}
                      </span>

                      <span className="text-sm font-black">
                        {status.value}
                      </span>
                    </div>

                    <div className="mt-2 h-2 overflow-hidden rounded-full bg-neutral-100">
                      <div
                        className="h-full rounded-full bg-neutral-900"
                        style={{
                          width: `${
                            (status.value /
                              maxStatusCount) *
                            100
                          }%`,
                        }}
                      />
                    </div>
                  </div>
                ))}
              </div>
            )}
          </section>
        </div>

        {/* COMPLETED ORDERS */}

        <section className="mt-7 rounded-[26px] border border-neutral-200 bg-white p-5 shadow-sm">
          <div className="flex items-center justify-between">
            <div>
              <h3 className="text-lg font-black">
                Completed Orders
              </h3>

              <p className="mt-1 text-xs text-neutral-400">
                Recent completed sales
              </p>
            </div>

            <CheckCircle2
              size={22}
              className="text-green-500"
            />
          </div>

          {completedOrders.length === 0 ? (
            <EmptyState message="No completed orders yet." />
          ) : (
            <div className="mt-5 overflow-x-auto">
              <table className="w-full min-w-[600px] text-left">
                <thead>
                  <tr className="border-b border-neutral-100 text-[10px] font-black uppercase tracking-wider text-neutral-400">
                    <th className="pb-3">
                      Order
                    </th>

                    <th className="pb-3">
                      Table
                    </th>

                    <th className="pb-3">
                      Items
                    </th>

                    <th className="pb-3">
                      Amount
                    </th>

                    <th className="pb-3">
                      Time
                    </th>
                  </tr>
                </thead>

                <tbody>
                  {completedOrders
                    .slice(0, 8)
                    .map((order) => (
                      <tr
                        key={order.orderId}
                        className="border-b border-neutral-50 text-sm"
                      >
                        <td className="py-4 font-black">
                          #{order.orderId}
                        </td>

                        <td className="py-4">
                          Table{' '}
                          {order.tableNumber}
                        </td>

                        <td className="py-4">
                          {order.items.reduce(
                            (total, item) =>
                              total +
                              item.quantity,
                            0,
                          )}
                        </td>

                        <td className="py-4 font-black">
                          ₹
                          {order.totalAmount.toLocaleString(
                            'en-IN',
                          )}
                        </td>

                        <td className="py-4 text-neutral-400">
                          {formatTime(
                            order.createdAt,
                          )}
                        </td>
                      </tr>
                    ))}
                </tbody>
              </table>
            </div>
          )}
        </section>
      </div>
    </main>
  )
}

function MetricCard({
  icon,
  label,
  value,
  subtitle,
}: {
  icon: React.ReactNode
  label: string
  value: string
  subtitle: string
}) {
  return (
    <article className="rounded-[24px] border border-neutral-200 bg-white p-5 shadow-sm">
      <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-orange-50 text-orange-500">
        {icon}
      </div>

      <p className="mt-4 text-xs font-bold text-neutral-400">
        {label}
      </p>

      <p className="mt-1 text-2xl font-black">
        {value}
      </p>

      <p className="mt-1 text-[11px] text-neutral-400">
        {subtitle}
      </p>
    </article>
  )
}

function EmptyState({
  message,
}: {
  message: string
}) {
  return (
    <div className="py-14 text-center">
      <UtensilsCrossed
        size={35}
        className="mx-auto text-neutral-200"
      />

      <p className="mt-3 text-sm font-bold text-neutral-400">
        {message}
      </p>
    </div>
  )
}

function formatTime(createdAt: string) {
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