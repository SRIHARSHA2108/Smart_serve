import {
  Box,
  ChefHat,
  ClipboardList,
  LayoutDashboard,
  Menu,
  ShoppingBag,
  Table2,
  TrendingUp,
  Users,
  UtensilsCrossed,
  LogOut,
} from 'lucide-react'
import { useEffect } from 'react'
import { useOrderStore } from '../../store/orderStore'
import { useMenuStore } from '../../store/menuStore'
import { useNavigate } from 'react-router-dom'
import { useAuthStore } from '../../store/authStore'

export default function ManagerDashboard() {
  const orders = useOrderStore((state) => state.orders)
  const subscribeToOrders = useOrderStore(
    (state) => state.subscribeToOrders,
  )

  useEffect(() => {
    const unsubscribe =
      subscribeToOrders()

    return unsubscribe
  }, [subscribeToOrders])
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
 
  const activeOrders = orders.filter(
    (order) =>
      order.status !== 'COMPLETED' &&
      order.status !== 'REJECTED',
  )
  const menuItems = useMenuStore((state) => state.items)
  const completedOrders = orders.filter(
    (order) => order.status === 'COMPLETED',
  )

  const totalSales = completedOrders.reduce(
    (total, order) => total + order.totalAmount,
    0,
  )

  const activeTables = new Set(
    activeOrders.map((order) => order.tableNumber),
  ).size

  return (
    <main className="min-h-screen bg-[#f5f5f3] text-neutral-900">
      <div className="grid min-h-screen lg:grid-cols-[250px_1fr]">

        {/* SIDEBAR */}

        <aside className="hidden border-r border-neutral-200 bg-white lg:block">
          <div className="sticky top-0 flex h-screen flex-col">
            <div className="border-b border-neutral-100 px-6 py-6">
              <div className="flex items-center gap-3">
                <div className="flex h-11 w-11 items-center justify-center rounded-2xl bg-orange-500 text-white">
                  <ChefHat size={24} />
                </div>

                <div>
                  <div className="font-black tracking-tight">
                    SMART{' '}
                    <span className="text-orange-500">
                      SERVE
                    </span>
                  </div>

                  <div className="text-[10px] font-bold uppercase tracking-[0.18em] text-neutral-400">
                    Manager
                  </div>
                </div>
              </div>
            </div>

            <nav className="min-h-0 flex-1 space-y-1 overflow-y-auto p-4">
              <ManagerNav
                icon={<LayoutDashboard size={18} />}
                label="Overview"
                active
              />

              <ManagerNav
                icon={<ClipboardList size={18} />}
                label="Orders"
                onClick={() => navigate('/manager/orders')}
              />

              <ManagerNav
                icon={<UtensilsCrossed size={18} />}
                label="Menu Management"
                onClick={() => navigate('/manager/menu')}
              />

              <ManagerNav
                icon={<Box size={18} />}
                label="3D Models"
                onClick={() => navigate('/manager/models')}
              />

              <ManagerNav
                icon={<Table2 size={18} />}
                label="Table Management"
                onClick={() => navigate('/manager/tables')}
              />

              <ManagerNav
                icon={<Users size={18} />}
                label="Staff Management"
                onClick={() => navigate('/manager/staff')}
              />

              <ManagerNav
                icon={<TrendingUp size={18} />}
                label="Analytics"
                onClick={() =>
                  navigate('/manager/analytics')
                }
              />
            </nav>

            <div className="shrink-0 border-t border-neutral-100 bg-white p-4">
              <div className="px-2">
                <p className="text-xs font-bold text-neutral-700">
                  Spice Garden
                </p>

                <p className="mt-1 text-[11px] text-neutral-400">
                  Restaurant Manager
                </p>
              </div>

              <button
                type="button"
                onClick={handleLogout}
                className="mt-4 flex w-full items-center gap-3 rounded-xl px-3 py-3 text-sm font-bold text-red-500 transition hover:bg-red-50"
              >
                <LogOut size={18} />
                Logout
              </button>
            </div>
          </div>
        </aside>

        {/* CONTENT */}

        <section className="min-w-0">

          {/* HEADER */}

          <header className="sticky top-0 z-30 border-b border-neutral-200 bg-white/95 backdrop-blur-xl">
            <div className="mx-auto flex max-w-7xl items-center justify-between px-4 py-4 sm:px-6 lg:px-8">
              <div className="flex items-center gap-3">
                <button
                  type="button"
                  className="flex h-10 w-10 items-center justify-center rounded-xl bg-neutral-100 lg:hidden"
                >
                  <Menu size={20} />
                </button>

                <div>
                  <p className="text-xs font-bold uppercase tracking-[0.16em] text-orange-500">
                    Spice Garden
                  </p>

                  <h1 className="text-xl font-black">
                    Manager Dashboard
                  </h1>
                </div>
              </div>

              <div className="flex h-10 w-10 items-center justify-center rounded-full bg-neutral-900 text-sm font-black text-white">
                SG
              </div>
            </div>
          </header>

          <div className="mx-auto max-w-7xl p-4 sm:p-6 lg:p-8">

            {/* TITLE */}

            <div>
              <p className="text-sm text-neutral-500">
                Restaurant overview
              </p>

              <h2 className="mt-1 text-3xl font-black tracking-tight">
                Today's Overview
              </h2>
            </div>

            {/* STATISTICS */}

            <section className="mt-7 grid grid-cols-2 gap-3 xl:grid-cols-4">
              <StatCard
                icon={<TrendingUp size={21} />}
                title="Today's Sales"
                value={`₹${totalSales.toLocaleString('en-IN')}`}
                subtitle="Completed orders"
              />

              <StatCard
                icon={<ShoppingBag size={21} />}
                title="Total Orders"
                value={orders.length.toString()}
                subtitle="All orders"
              />

              <StatCard
                icon={<Table2 size={21} />}
                title="Active Tables"
                value={activeTables.toString()}
                subtitle="Currently occupied"
              />

              <StatCard
                icon={<ClipboardList size={21} />}
                title="Pending Orders"
                value={activeOrders.length.toString()}
                subtitle="Requires attention"
              />
            </section>

            <div className="mt-7 grid gap-6 xl:grid-cols-[1.4fr_1fr]">

              {/* RECENT ORDERS */}

              <section className="rounded-[26px] border border-neutral-200 bg-white p-5 shadow-sm">
                <div className="flex items-center justify-between">
                  <div>
                    <h3 className="text-lg font-black">
                      Recent Orders
                    </h3>

                    <p className="mt-1 text-xs text-neutral-400">
                      Latest restaurant orders
                    </p>
                  </div>

                  <button
                    type="button"
                    onClick={() => navigate('/manager/orders')}
                    className="text-xs font-bold text-orange-500"
                  >
                    View All
                  </button>
                </div>

                {orders.length === 0 ? (
                  <div className="py-16 text-center">
                    <ClipboardList
                      size={38}
                      className="mx-auto text-neutral-200"
                    />

                    <p className="mt-4 font-bold text-neutral-500">
                      No orders yet
                    </p>

                    <p className="mt-1 text-xs text-neutral-400">
                      Customer orders will appear here.
                    </p>
                  </div>
                ) : (
                  <div className="mt-5 space-y-2">
                    {orders
                      .slice(0, 5)
                      .map((order) => (
                        <div
                          key={order.orderId}
                          className="flex items-center justify-between gap-4 rounded-2xl bg-neutral-50 p-4"
                        >
                          <div>
                            <p className="font-black">
                              #{order.orderId}
                            </p>

                            <p className="mt-1 text-xs text-neutral-400">
                              Table {order.tableNumber} ·{' '}
                              {order.items.length}{' '}
                              {order.items.length === 1
                                ? 'item'
                                : 'items'}
                            </p>
                          </div>

                          <div className="text-right">
                            <p className="font-black">
                              ₹{order.totalAmount}
                            </p>

                            <OrderStatusBadge
                              status={order.status}
                            />
                          </div>
                        </div>
                      ))}
                  </div>
                )}
              </section>

              {/* POPULAR DISHES */}

              <section className="rounded-[26px] border border-neutral-200 bg-white p-5 shadow-sm">
                <div>
                  <h3 className="text-lg font-black">
                    Popular Dishes
                  </h3>

                  <p className="mt-1 text-xs text-neutral-400">
                    Spice Garden favourites
                  </p>
                </div>

                <div className="mt-5 space-y-3">
                  {menuItems
                    .filter(
                      (item) =>
                        item.popular ||
                        item.chefChoice,
                    )
                    .slice(0, 4)
                    .map((item, index) => (
                      <div
                        key={item.id}
                        className="flex items-center gap-3"
                      >
                        <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-orange-50 text-xs font-black text-orange-500">
                          {index + 1}
                        </div>

                        <div className="min-w-0 flex-1">
                          <p className="truncate text-sm font-bold">
                            {item.name}
                          </p>

                          <p className="text-[11px] text-neutral-400">
                            ₹{item.price}
                          </p>
                        </div>

                        <span className="text-xs font-bold text-neutral-500">
                          ★ {item.rating}
                        </span>
                      </div>
                    ))}
                </div>
              </section>
            </div>

            {/* MANAGEMENT SHORTCUTS */}

            <section className="mt-7">
              <h3 className="text-lg font-black">
                Restaurant Management
              </h3>

              <div className="mt-4 grid gap-3 sm:grid-cols-2 xl:grid-cols-4">
                <ManagementCard
                  icon={<UtensilsCrossed size={22} />}
                  title="Menu"
                  description={`${menuItems.length} dishes`}
                  onClick={() => navigate('/manager/menu')}
                />

                <ManagementCard
                  icon={<Table2 size={22} />}
                  title="Tables"
                  description="Manage tables & codes"
                />

                <ManagementCard
                  icon={<Box size={22} />}
                  title="3D Models"
                  description="Manage food models"
                  onClick={() => navigate('/manager/models')}
                />

                <ManagementCard
                  icon={<Users size={22} />}
                  title="Staff"
                  description="Manage staff access"
                  onClick={() => navigate('/manager/staff')}
                />
              </div>
            </section>
          </div>
        </section>
      </div>
    </main>
  )
}

function ManagerNav({
  icon,
  label,
  active = false,
  onClick,
}: {
  icon: React.ReactNode
  label: string
  active?: boolean
  onClick?: () => void
}) {
  return (
    <button
      type="button"
      onClick={onClick}
      className={`flex w-full items-center gap-3 rounded-xl px-4 py-3 text-sm font-bold transition ${
        active
          ? 'bg-orange-50 text-orange-600'
          : 'text-neutral-500 hover:bg-neutral-50 hover:text-neutral-900'
      }`}
    >
      {icon}
      {label}
    </button>
  )
}

function StatCard({
  icon,
  title,
  value,
  subtitle,
}: {
  icon: React.ReactNode
  title: string
  value: string
  subtitle: string
}) {
  return (
    <article className="rounded-[24px] border border-neutral-200 bg-white p-5 shadow-sm">
      <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-orange-50 text-orange-500">
        {icon}
      </div>

      <p className="mt-4 text-xs font-bold text-neutral-400">
        {title}
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

function ManagementCard({
  icon,
  title,
  description,
  onClick,
}: {
  icon: React.ReactNode
  title: string
  description: string
  onClick?: () => void
}) {
  return (
    <button
      type="button"
      onClick={onClick}
      className="flex items-center gap-4 rounded-[22px] border border-neutral-200 bg-white p-5 text-left shadow-sm transition hover:-translate-y-0.5 hover:shadow-md"
    >
      <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl bg-neutral-900 text-white">
        {icon}
      </div>

      <div>
        <p className="font-black">
          {title}
        </p>

        <p className="mt-1 text-xs text-neutral-400">
          {description}
        </p>
      </div>
    </button>
  )
}

function OrderStatusBadge({
  status,
}: {
  status: string
}) {
  const styles: Record<string, string> = {
    NEW: 'bg-orange-50 text-orange-600',
    ACCEPTED: 'bg-cyan-50 text-cyan-600',
    PREPARING: 'bg-blue-50 text-blue-600',
    READY: 'bg-green-50 text-green-600',
    COMPLETED: 'bg-neutral-100 text-neutral-600',
    REJECTED: 'bg-red-50 text-red-600',
  }

  return (
    <span
      className={`mt-1 inline-block rounded-full px-2 py-1 text-[9px] font-black ${
        styles[status] ??
        'bg-neutral-100 text-neutral-600'
      }`}
    >
      {status}
    </span>
  )
}