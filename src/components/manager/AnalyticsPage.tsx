import {
  useEffect,
  useMemo,
  useState,
} from 'react'
import {
  ArrowLeft,
  BarChart3,
  CalendarRange,
  CheckCircle2,
  IndianRupee,
  ShoppingBag,
  TrendingUp,
  UtensilsCrossed,
} from 'lucide-react'
import { useNavigate } from 'react-router-dom'
import {
  useOrderStore,
  type Order,
} from '../../store/orderStore'

type ChartMode = 'day' | 'week' | 'month'

export default function AnalyticsPage() {
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

  const [chartMode, setChartMode] =
    useState<ChartMode>('month')

  const [popularMode, setPopularMode] =
    useState<ChartMode>('month')
  const [statusMode, setStatusMode] =
    useState<ChartMode>('month')
  const [completedMode, setCompletedMode] =
    useState<ChartMode>('month')

  const visibleOrders = useMemo(() => {
    const today = new Date()
    const firstDayOfWeek =
      (today.getDay() + 6) % 7
    let start: Date
    let end: Date

    if (chartMode === 'day') {
      start = new Date(today)
      start.setHours(0, 0, 0, 0)
      start.setDate(today.getDate() - 6)
      end = new Date(today)
      end.setHours(0, 0, 0, 0)
      end.setDate(today.getDate() + 1)
    } else if (chartMode === 'week') {
      start = new Date(today)
      start.setHours(0, 0, 0, 0)
      start.setDate(
        today.getDate() - firstDayOfWeek - 42,
      )
      end = new Date(start)
      end.setDate(start.getDate() + 49)
    } else {
      start = new Date(
        today.getFullYear(),
        today.getMonth() - 5,
        1,
      )
      end = new Date(
        today.getFullYear(),
        today.getMonth() + 1,
        1,
      )
    }

    return orders.filter((order) => {
      const createdAt = new Date(order.createdAt)

      return createdAt >= start && createdAt < end
    })
  }, [chartMode, orders])

  const popularOrders = useMemo(
    () => getOrdersInRange(orders, popularMode),
    [orders, popularMode],
  )

  const statusOrders = useMemo(
    () => getOrdersInRange(orders, statusMode),
    [orders, statusMode],
  )

  const completedPanelOrders = useMemo(
    () => getOrdersInRange(orders, completedMode),
    [orders, completedMode],
  )

  const completedOrders = useMemo(
    () =>
      visibleOrders.filter(
        (order) => order.status === 'COMPLETED',
      ),
    [visibleOrders],
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

  const pendingOrders = visibleOrders.filter(
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

    popularOrders
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
  }, [popularOrders])

  const maxDishQuantity = Math.max(
    ...popularDishes.map(
      (dish) => dish.quantity,
    ),
    1,
  )

  const chartData = useMemo(() => {
    const today = new Date()

    const bucketCount = chartMode === 'month' ? 6 : 7
    const firstDayOfWeek =
      (today.getDay() + 6) % 7

    return Array.from(
      { length: bucketCount },
      (_, index) => {
        let start: Date
        let end: Date
        let label: string
        let fullLabel: string

        if (chartMode === 'day') {
          start = new Date(today)
          start.setHours(0, 0, 0, 0)
          start.setDate(
            today.getDate() - (bucketCount - 1 - index),
          )
          end = new Date(start)
          end.setDate(start.getDate() + 1)
          label = start.toLocaleDateString([], {
            weekday: 'short',
          })
          fullLabel = start.toLocaleDateString([], {
            weekday: 'long',
            month: 'short',
            day: 'numeric',
          })
        } else if (chartMode === 'week') {
          start = new Date(today)
          start.setHours(0, 0, 0, 0)
          start.setDate(
            today.getDate() - firstDayOfWeek -
              (bucketCount - 1 - index) * 7,
          )
          end = new Date(start)
          end.setDate(start.getDate() + 7)
          label = start.toLocaleDateString([], {
            month: 'short',
            day: 'numeric',
          })
          fullLabel = `${start.toLocaleDateString([], {
            month: 'short',
            day: 'numeric',
          })} – ${new Date(
            end.getTime() - 1,
          ).toLocaleDateString([], {
            month: 'short',
            day: 'numeric',
          })}`
        } else {
          start = new Date(
            today.getFullYear(),
            today.getMonth() - (bucketCount - 1 - index),
            1,
          )
          end = new Date(
            start.getFullYear(),
            start.getMonth() + 1,
            1,
          )
          label = start.toLocaleDateString([], {
            month: 'short',
          })
          fullLabel = start.toLocaleDateString([], {
            month: 'long',
            year: 'numeric',
          })
        }

        const bucketOrders = orders.filter((order) => {
          const createdAt = new Date(order.createdAt)

          return createdAt >= start && createdAt < end
        })
        const completed = bucketOrders.filter(
          (order) => order.status === 'COMPLETED',
        )

        return {
          key: start.toISOString(),
          label,
          fullLabel,
          sales: completed.reduce(
            (total, order) =>
              total + order.totalAmount,
            0,
          ),
          orders: bucketOrders.filter(
            (order) => order.status !== 'REJECTED',
          ).length,
          completedOrders: completed.length,
        }
      },
    )
  }, [chartMode, orders])

  const maxChartSales = Math.max(
    ...chartData.map((period) => period.sales),
    1,
  )

  const currentPeriod =
    chartData[chartData.length - 1]

  const chartModeLabel =
    chartMode === 'day'
      ? 'Daily'
      : chartMode === 'week'
        ? 'Weekly'
        : 'Monthly'

  const statusData = [
    {
      label: 'New',
      value: statusOrders.filter(
        (order) => order.status === 'NEW',
      ).length,
    },
    {
      label: 'Accepted',
      value: statusOrders.filter(
        (order) =>
          order.status === 'ACCEPTED',
      ).length,
    },
    {
      label: 'Preparing',
      value: statusOrders.filter(
        (order) =>
          order.status === 'PREPARING',
      ).length,
    },
    {
      label: 'Ready',
      value: statusOrders.filter(
        (order) => order.status === 'READY',
      ).length,
    },
    {
      label: 'Completed',
      value: statusOrders.filter(
        (order) => order.status === 'COMPLETED',
      ).length,
    },
    {
      label: 'Rejected',
      value: statusOrders.filter(
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
            value={visibleOrders.length.toString()}
            subtitle={`${chartModeLabel} range`}
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

        <section className="mt-7 rounded-[26px] border border-neutral-200 bg-white p-5 shadow-sm sm:p-6">
          <div className="flex flex-wrap items-start justify-between gap-4">
            <div>
              <div className="flex items-center gap-2">
                <CalendarRange
                  size={20}
                  className="text-orange-500"
                />

                <h3 className="text-lg font-black">
                  Sales Overview
                </h3>
              </div>

              <p className="mt-1 text-xs text-neutral-400">
                Compare completed sales and valid orders by day, week, or month
              </p>
            </div>

            <div className="flex rounded-xl bg-neutral-100 p-1">
              {(['day', 'week', 'month'] as ChartMode[]).map(
                (mode) => (
                  <button
                    key={mode}
                    type="button"
                    onClick={() => setChartMode(mode)}
                    className={`rounded-lg px-3 py-2 text-xs font-black capitalize transition ${
                      chartMode === mode
                        ? 'bg-white text-orange-600 shadow-sm'
                        : 'text-neutral-500 hover:text-neutral-900'
                    }`}
                  >
                    {mode}
                  </button>
                ),
              )}
            </div>
          </div>

          <div className="mt-6 grid gap-3 sm:grid-cols-3">
            <MonthlyMetric
              label={`${chartModeLabel} sales`}
              value={`₹${currentPeriod.sales.toLocaleString(
                'en-IN',
              )}`}
            />

            <MonthlyMetric
              label={`${chartModeLabel} orders`}
              value={currentPeriod.orders.toString()}
            />

            <MonthlyMetric
              label="Completed orders"
              value={currentPeriod.completedOrders.toString()}
            />
          </div>

          <div className="mt-8 flex h-56 gap-2 sm:gap-4">
            {chartData.map((period) => (
              <div
                key={period.key}
                className="flex h-full min-w-0 flex-1 flex-col items-center justify-end gap-2"
              >
                <span className="max-w-full truncate text-[10px] font-bold text-neutral-400">
                  ₹{period.sales.toLocaleString('en-IN')}
                </span>

                <div className="flex h-36 w-full items-end justify-center rounded-xl bg-neutral-50 px-2">
                  <div
                    className="w-full max-w-10 rounded-t-xl bg-orange-500 transition-all"
                    style={{
                      height: `${Math.max(
                        (period.sales /
                          maxChartSales) *
                          100,
                        period.sales > 0 ? 8 : 2,
                      )}%`,
                    }}
                    title={`${period.fullLabel}: ₹${period.sales.toLocaleString(
                      'en-IN',
                    )}`}
                  />
                </div>

                <span className="max-w-full truncate text-xs font-black text-neutral-600">
                  {period.label}
                </span>
              </div>
            ))}
          </div>
        </section>

        <div className="mt-7 grid gap-6 xl:grid-cols-2">
          {/* POPULAR DISHES */}

          <section className="rounded-[26px] border border-neutral-200 bg-white p-5 shadow-sm">
            <div className="flex flex-wrap items-start justify-between gap-3">
              <div>
              <h3 className="text-lg font-black">
                Popular Dishes
              </h3>

              <p className="mt-1 text-xs text-neutral-400">
                Based on ordered quantities in the selected range
              </p>
              </div>

              <PeriodTabs
                value={popularMode}
                onChange={setPopularMode}
              />
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
            <div className="flex flex-wrap items-start justify-between gap-3">
              <div>
              <h3 className="text-lg font-black">
                Order Status
              </h3>

              <p className="mt-1 text-xs text-neutral-400">
                Current order distribution in the selected range
              </p>
              </div>

              <PeriodTabs
                value={statusMode}
                onChange={setStatusMode}
              />
            </div>

            {statusOrders.length === 0 ? (
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
          <div className="flex flex-wrap items-start justify-between gap-3">
            <div>
              <h3 className="text-lg font-black">
                Completed Orders
              </h3>

              <p className="mt-1 text-xs text-neutral-400">
                Recent completed sales in the selected range
              </p>
            </div>

            <PeriodTabs
              value={completedMode}
              onChange={setCompletedMode}
            />

            <CheckCircle2
              size={22}
              className="text-green-500"
            />
          </div>

          {completedPanelOrders.filter(
            (order) => order.status === 'COMPLETED',
          ).length === 0 ? (
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
                  {completedPanelOrders
                    .filter(
                      (order) =>
                        order.status === 'COMPLETED',
                    )
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

function PeriodTabs({
  value,
  onChange,
}: {
  value: ChartMode
  onChange: (mode: ChartMode) => void
}) {
  return (
    <div className="flex shrink-0 rounded-xl bg-neutral-100 p-1">
      {(['day', 'week', 'month'] as ChartMode[]).map(
        (mode) => (
          <button
            key={mode}
            type="button"
            onClick={() => onChange(mode)}
            className={`rounded-lg px-2.5 py-1.5 text-[10px] font-black capitalize transition ${
              value === mode
                ? 'bg-white text-orange-600 shadow-sm'
                : 'text-neutral-500 hover:text-neutral-900'
            }`}
          >
            {mode}
          </button>
        ),
      )}
    </div>
  )
}

function getOrdersInRange(
  orders: Order[],
  mode: ChartMode,
) {
  const today = new Date()
  const firstDayOfWeek =
    (today.getDay() + 6) % 7
  let start: Date
  let end: Date

  if (mode === 'day') {
    start = new Date(today)
    start.setHours(0, 0, 0, 0)
    start.setDate(today.getDate() - 6)
    end = new Date(today)
    end.setHours(0, 0, 0, 0)
    end.setDate(today.getDate() + 1)
  } else if (mode === 'week') {
    start = new Date(today)
    start.setHours(0, 0, 0, 0)
    start.setDate(
      today.getDate() - firstDayOfWeek - 42,
    )
    end = new Date(start)
    end.setDate(start.getDate() + 49)
  } else {
    start = new Date(
      today.getFullYear(),
      today.getMonth() - 5,
      1,
    )
    end = new Date(
      today.getFullYear(),
      today.getMonth() + 1,
      1,
    )
  }

  return orders.filter((order) => {
    const createdAt = new Date(order.createdAt)

    return createdAt >= start && createdAt < end
  })
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

function MonthlyMetric({
  label,
  value,
}: {
  label: string
  value: string
}) {
  return (
    <div className="rounded-2xl bg-neutral-50 p-4">
      <p className="text-[11px] font-bold text-neutral-400">
        {label}
      </p>

      <p className="mt-1 text-xl font-black">
        {value}
      </p>
    </div>
  )
}
