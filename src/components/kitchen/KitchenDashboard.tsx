import {
  Check,
  CheckCircle2,
  ChefHat,
  Clock3,
  CookingPot,
  Flame,
  PackageCheck,
  RefreshCw,
  UtensilsCrossed,
  X,
} from 'lucide-react'
import { useMemo, useState } from 'react'
import {
  useOrderStore,
  type OrderStatus,
} from '../../store/orderStore'

type KitchenFilter =
  | 'NEW'
  | 'PREPARING'
  | 'READY'
  | 'COMPLETED'

export default function KitchenDashboard() {
  const orders = useOrderStore((state) => state.orders)

  const updateOrderStatus = useOrderStore(
    (state) => state.updateOrderStatus,
  )

  const [filter, setFilter] =
    useState<KitchenFilter>('NEW')

  const filteredOrders = useMemo(
    () =>
      orders.filter(
        (order) => order.status === filter,
      ),
    [orders, filter],
  )

  const countStatus = (status: OrderStatus) =>
    orders.filter((order) => order.status === status)
      .length

  return (
    <main className="min-h-screen bg-[#111820] text-white">
      <header className="sticky top-0 z-40 border-b border-white/10 bg-[#111820]/95 backdrop-blur-xl">
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

              <div className="text-[10px] font-bold uppercase tracking-[0.18em] text-neutral-400">
                Kitchen
              </div>
            </div>
          </div>

          <div className="flex items-center gap-2 rounded-full border border-green-500/20 bg-green-500/10 px-3 py-2 text-xs font-bold text-green-400">
            <span className="h-2 w-2 animate-pulse rounded-full bg-green-400" />
            Kitchen Online
          </div>
        </div>
      </header>

      <div className="mx-auto grid max-w-7xl lg:grid-cols-[240px_1fr]">
        <aside className="border-white/10 p-4 lg:min-h-[calc(100vh-78px)] lg:border-r lg:p-5">
          <div className="grid grid-cols-4 gap-2 lg:grid-cols-1">
            <KitchenNavButton
              label="New Orders"
              count={countStatus('NEW')}
              active={filter === 'NEW'}
              icon={<Flame size={18} />}
              onClick={() => setFilter('NEW')}
            />

            <KitchenNavButton
              label="Preparing"
              count={countStatus('PREPARING')}
              active={filter === 'PREPARING'}
              icon={<CookingPot size={18} />}
              onClick={() => setFilter('PREPARING')}
            />

            <KitchenNavButton
              label="Ready"
              count={countStatus('READY')}
              active={filter === 'READY'}
              icon={<PackageCheck size={18} />}
              onClick={() => setFilter('READY')}
            />

            <KitchenNavButton
              label="Completed"
              count={countStatus('COMPLETED')}
              active={filter === 'COMPLETED'}
              icon={<CheckCircle2 size={18} />}
              onClick={() => setFilter('COMPLETED')}
            />
          </div>
        </aside>

        <section className="min-w-0 p-4 sm:p-6 lg:p-8">
          <div className="mb-7 flex flex-wrap items-end justify-between gap-4">
            <div>
              <p className="text-xs font-bold uppercase tracking-[0.18em] text-orange-400">
                Spice Garden
              </p>

              <h1 className="mt-2 text-2xl font-black sm:text-3xl">
                {getFilterTitle(filter)}
              </h1>

              <p className="mt-1 text-sm text-neutral-400">
                {filteredOrders.length}{' '}
                {filteredOrders.length === 1
                  ? 'order'
                  : 'orders'}
              </p>
            </div>

            <div className="flex items-center gap-2 rounded-xl border border-white/10 bg-white/5 px-3 py-2 text-xs text-neutral-400">
              <RefreshCw size={14} />
              Live order queue
            </div>
          </div>

          {filteredOrders.length === 0 ? (
            <KitchenEmptyState filter={filter} />
          ) : (
            <div className="grid gap-4 xl:grid-cols-2">
              {filteredOrders.map((order) => (
                <article
                  key={order.orderId}
                  className="overflow-hidden rounded-[24px] border border-white/10 bg-[#18212b] shadow-xl"
                >
                  <div className="flex items-center justify-between border-b border-white/10 px-5 py-4">
                    <div>
                      <div className="flex items-center gap-2">
                        <span className="text-lg font-black">
                          #{order.orderId}
                        </span>

                        <KitchenStatusBadge
                          status={order.status}
                        />
                      </div>

                      <div className="mt-1 flex items-center gap-3 text-xs text-neutral-400">
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

                    <div className="rounded-xl bg-orange-500/10 px-3 py-2 text-center">
                      <div className="text-[9px] font-bold uppercase tracking-wider text-orange-400">
                        Table
                      </div>

                      <div className="text-xl font-black text-orange-400">
                        {order.tableNumber}
                      </div>
                    </div>
                  </div>

                  <div className="space-y-4 p-5">
                    {order.items.map((item) => (
                      <div
                        key={item.cartItemId}
                        className="flex gap-3"
                      >
                        <img
                          src={item.imageUrl}
                          alt=""
                          className="h-14 w-14 shrink-0 rounded-xl object-cover"
                        />

                        <div className="min-w-0 flex-1">
                          <div className="flex justify-between gap-3">
                            <h2 className="font-bold">
                              {item.name}
                            </h2>

                            <span className="font-black text-orange-400">
                              ×{item.quantity}
                            </span>
                          </div>

                          <p className="mt-1 text-xs text-neutral-400">
                            {item.spice} Spicy ·{' '}
                            {item.portion}
                          </p>

                          {(item.extraChicken ||
                            item.extraRaita) && (
                            <p className="mt-1 text-xs font-semibold text-amber-400">
                              +{' '}
                              {[
                                item.extraChicken
                                  ? 'Extra Chicken'
                                  : '',
                                item.extraRaita
                                  ? 'Extra Raita'
                                  : '',
                              ]
                                .filter(Boolean)
                                .join(', ')}
                            </p>
                          )}
                        </div>
                      </div>
                    ))}
                  </div>

                  <KitchenActions
                    status={order.status}
                    onStatusChange={(status) =>
                      updateOrderStatus(
                        order.orderId,
                        status,
                      )
                    }
                  />
                </article>
              ))}
            </div>
          )}
        </section>
      </div>
    </main>
  )
}

function KitchenNavButton({
  label,
  count,
  active,
  icon,
  onClick,
}: {
  label: string
  count: number
  active: boolean
  icon: React.ReactNode
  onClick: () => void
}) {
  return (
    <button
      type="button"
      onClick={onClick}
      className={`flex min-w-0 items-center justify-center gap-2 rounded-xl px-3 py-3 text-xs font-bold transition lg:justify-start lg:text-sm ${
        active
          ? 'bg-orange-500 text-white'
          : 'bg-white/5 text-neutral-400 hover:bg-white/10 hover:text-white'
      }`}
    >
      {icon}

      <span className="hidden sm:inline">
        {label}
      </span>

      {count > 0 && (
        <span
          className={`ml-auto hidden min-w-6 rounded-full px-2 py-0.5 text-center text-[10px] lg:block ${
            active
              ? 'bg-white/20'
              : 'bg-orange-500 text-white'
          }`}
        >
          {count}
        </span>
      )}
    </button>
  )
}

function KitchenStatusBadge({
  status,
}: {
  status: OrderStatus
}) {
  const styles: Record<OrderStatus, string> = {
    NEW: 'bg-orange-500/15 text-orange-400',
    PREPARING: 'bg-blue-500/15 text-blue-400',
    READY: 'bg-green-500/15 text-green-400',
    COMPLETED: 'bg-neutral-500/15 text-neutral-400',
    REJECTED: 'bg-red-500/15 text-red-400',
  }

  return (
    <span
      className={`rounded-full px-2.5 py-1 text-[9px] font-black uppercase tracking-wider ${styles[status]}`}
    >
      {status}
    </span>
  )
}

function KitchenActions({
  status,
  onStatusChange,
}: {
  status: OrderStatus
  onStatusChange: (status: OrderStatus) => void
}) {
  if (status === 'NEW') {
    return (
      <div className="grid grid-cols-2 gap-3 border-t border-white/10 p-4">
        <button
          type="button"
          onClick={() =>
            onStatusChange('REJECTED')
          }
          className="flex h-11 items-center justify-center gap-2 rounded-xl bg-red-500/15 font-bold text-red-400 transition hover:bg-red-500 hover:text-white"
        >
          <X size={17} />
          Reject
        </button>

        <button
          type="button"
          onClick={() =>
            onStatusChange('PREPARING')
          }
          className="flex h-11 items-center justify-center gap-2 rounded-xl bg-green-500 font-bold text-white transition hover:bg-green-600"
        >
          <Check size={17} />
          Accept
        </button>
      </div>
    )
  }

  if (status === 'PREPARING') {
    return (
      <div className="border-t border-white/10 p-4">
        <button
          type="button"
          onClick={() =>
            onStatusChange('READY')
          }
          className="flex h-11 w-full items-center justify-center gap-2 rounded-xl bg-orange-500 font-bold text-white"
        >
          <PackageCheck size={18} />
          Mark Food Ready
        </button>
      </div>
    )
  }

  if (status === 'READY') {
    return (
      <div className="border-t border-white/10 p-4">
        <button
          type="button"
          onClick={() =>
            onStatusChange('COMPLETED')
          }
          className="flex h-11 w-full items-center justify-center gap-2 rounded-xl bg-green-500 font-bold text-white"
        >
          <CheckCircle2 size={18} />
          Complete Order
        </button>
      </div>
    )
  }

  if (status === 'COMPLETED') {
    return (
      <div className="flex items-center justify-center gap-2 border-t border-white/10 p-4 text-sm font-bold text-green-400">
        <CheckCircle2 size={18} />
        Order Completed
      </div>
    )
  }

  return null
}

function KitchenEmptyState({
  filter,
}: {
  filter: KitchenFilter
}) {
  return (
    <div className="flex min-h-[420px] items-center justify-center rounded-[28px] border border-dashed border-white/10 bg-white/[0.02] p-8">
      <div className="text-center">
        <div className="mx-auto flex h-20 w-20 items-center justify-center rounded-full bg-white/5 text-neutral-500">
          <UtensilsCrossed size={32} />
        </div>

        <h2 className="mt-5 text-xl font-black">
          No {getFilterTitle(filter).toLowerCase()}
        </h2>

        <p className="mt-2 max-w-sm text-sm leading-6 text-neutral-500">
          Orders in this stage will appear here automatically.
        </p>
      </div>
    </div>
  )
}

function getFilterTitle(filter: KitchenFilter) {
  const titles: Record<KitchenFilter, string> = {
    NEW: 'New Orders',
    PREPARING: 'Preparing',
    READY: 'Ready for Service',
    COMPLETED: 'Completed Orders',
  }

  return titles[filter]
}

function formatOrderTime(createdAt: string) {
  return new Date(createdAt).toLocaleTimeString([], {
    hour: '2-digit',
    minute: '2-digit',
  })
}