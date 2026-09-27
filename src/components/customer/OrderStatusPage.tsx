import {
  ArrowLeft,
  Check,
  CheckCircle2,
  ChefHat,
  Clock3,
  CookingPot,
  Home,
  UtensilsCrossed,
} from 'lucide-react'
import { useEffect } from 'react'
import { useNavigate, useParams } from 'react-router-dom'
import { useOrderStore } from '../../store/orderStore'

const statusOrder = [
  'NEW',
  'ACCEPTED',
  'PREPARING',
  'READY',
  'COMPLETED',
] as const

export default function OrderStatusPage() {
  const navigate = useNavigate()
  const { orderId } = useParams()
  const subscribeToOrder = useOrderStore(
    (state) => state.subscribeToOrder,
  )
  useEffect(() => {
    if (!orderId) {
      return
    }

    const unsubscribe =
      subscribeToOrder(orderId)

    return unsubscribe
  }, [orderId, subscribeToOrder])
  const order = useOrderStore((state) =>
    state.orders.find(
      (item) => item.orderId === orderId,
    ),
  )

  if (!order) {
    return (
      <main className="flex min-h-screen items-center justify-center bg-[#f8f7f4] p-6">
        <div className="max-w-sm text-center">
          <h1 className="text-2xl font-black">
            Order not found
          </h1>

          <p className="mt-2 text-sm text-neutral-500">
            We couldn't find this order.
          </p>

          <button
            type="button"
            onClick={() => navigate('/menu')}
            className="mt-6 rounded-2xl bg-orange-500 px-6 py-3 font-bold text-white"
          >
            Return to Menu
          </button>
        </div>
      </main>
    )
  }

  const currentStatusIndex =
    order.status === 'REJECTED'
      ? -1
      : statusOrder.indexOf(
          order.status as
            | 'NEW'
            | 'PREPARING'
            | 'READY'
            | 'COMPLETED',
        )

  return (
    <main className="min-h-screen bg-[#f8f7f4] pb-10">
      {/* HEADER */}

      <header className="sticky top-0 z-40 border-b border-neutral-200 bg-white/95 backdrop-blur-xl">
        <div className="mx-auto flex max-w-xl items-center gap-4 px-4 py-4">
          <button
            type="button"
            onClick={() => navigate(-1)}
            className="flex h-10 w-10 items-center justify-center rounded-full bg-neutral-100"
          >
            <ArrowLeft size={20} />
          </button>

          <div>
            <h1 className="font-black">
              Live Order Status
            </h1>

            <p className="text-xs text-neutral-500">
              #{order.orderId}
            </p>
          </div>
        </div>
      </header>

      <div className="mx-auto max-w-xl px-4 py-6">
        {/* TABLE / ORDER */}

        <section className="rounded-[28px] bg-neutral-900 p-6 text-white shadow-xl">
          <div className="flex items-start justify-between gap-4">
            <div>
              <p className="text-xs font-bold uppercase tracking-[0.16em] text-orange-300">
                Spice Garden
              </p>

              <h2 className="mt-2 text-2xl font-black">
                Order #{order.orderId}
              </h2>

              <p className="mt-2 text-sm text-neutral-300">
                Table {order.tableNumber}
              </p>
            </div>

            <div className="rounded-2xl bg-white/10 px-4 py-3 text-right">
              <p className="text-[10px] uppercase text-neutral-400">
                Amount
              </p>

              <p className="mt-1 text-lg font-black">
                ₹{order.totalAmount}
              </p>
            </div>
          </div>
        </section>

        {/* REJECTED */}

        {order.status === 'REJECTED' && (
          <section className="mt-5 rounded-3xl border border-red-100 bg-red-50 p-5">
            <h2 className="font-black text-red-700">
              Order could not be accepted
            </h2>

            <p className="mt-2 text-sm leading-6 text-red-600">
              Please speak with a Spice Garden staff member
              for assistance.
            </p>
          </section>
        )}

        {/* LIVE STATUS */}

        {order.status !== 'REJECTED' && (
          <section className="mt-5 rounded-[28px] bg-white p-6 shadow-sm">
            <div className="flex items-center justify-between">
              <div>
                <h2 className="text-xl font-black">
                  Your order
                </h2>

                <p className="mt-1 text-sm text-neutral-500">
                  Updates appear here as the restaurant
                  processes your order.
                </p>
              </div>

              <span className="relative flex h-3 w-3">
                <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-green-400 opacity-75" />

                <span className="relative inline-flex h-3 w-3 rounded-full bg-green-500" />
              </span>
            </div>

            <div className="mt-8">
              <StatusStep
                icon={<Check size={18} />}
                title="Order Placed"
                description="Your order has been sent to Spice Garden."
                completed={currentStatusIndex >= 0}
                active={order.status === 'NEW'}
              />

              <StatusStep
                icon={<ChefHat size={18} />}
                title="Accepted"
                description="The restaurant has accepted your order."
                completed={currentStatusIndex >= 1}
                active={order.status === 'ACCEPTED'}
              />

              <StatusStep
                icon={<CookingPot size={18} />}
                title="Preparing"
                description="The kitchen is preparing your food."
                completed={currentStatusIndex >= 1}
                active={order.status === 'PREPARING'}
              />

              <StatusStep
                icon={<Clock3 size={18} />}
                title="Ready"
                description="Your food is ready to be served."
                completed={currentStatusIndex >= 2}
                active={order.status === 'READY'}
              />

              <StatusStep
                icon={<UtensilsCrossed size={18} />}
                title="Served"
                description="Your food has been served. Enjoy your meal!"
                completed={currentStatusIndex >= 3}
                active={order.status === 'COMPLETED'}
                last
              />
            </div>
          </section>
        )}

        {/* ORDER SUMMARY */}

        <section className="mt-5 rounded-[28px] bg-white p-6 shadow-sm">
          <h2 className="font-black">
            Order Summary
          </h2>

          <div className="mt-4 space-y-4">
            {order.items.map((item) => (
              <div
                key={item.cartItemId}
                className="flex items-start justify-between gap-4"
              >
                <div>
                  <p className="font-bold">
                    {item.name} × {item.quantity}
                  </p>

                  <p className="mt-1 text-xs text-neutral-500">
                    {item.portion} · {item.spice}
                  </p>
                </div>

                <span className="font-bold">
                  ₹{item.unitPrice * item.quantity}
                </span>
              </div>
            ))}
          </div>
        </section>

        <button
          type="button"
          onClick={() => navigate('/menu')}
          className="mt-5 flex h-14 w-full items-center justify-center gap-2 rounded-2xl bg-orange-500 font-black text-white shadow-lg shadow-orange-500/20"
        >
          <Home size={18} />
          Back to Menu
        </button>
      </div>
    </main>
  )
}

function StatusStep({
  icon,
  title,
  description,
  completed,
  active,
  last = false,
}: {
  icon: React.ReactNode
  title: string
  description: string
  completed: boolean
  active: boolean
  last?: boolean
}) {
  return (
    <div className="relative flex gap-4">
      {!last && (
        <div
          className={`absolute left-[19px] top-10 h-[calc(100%-8px)] w-0.5 ${
            completed
              ? 'bg-green-500'
              : 'bg-neutral-200'
          }`}
        />
      )}

      <div
        className={`relative z-10 flex h-10 w-10 shrink-0 items-center justify-center rounded-full border-2 ${
          completed
            ? 'border-green-500 bg-green-500 text-white'
            : active
              ? 'border-orange-500 bg-orange-50 text-orange-500'
              : 'border-neutral-200 bg-white text-neutral-400'
        }`}
      >
        {completed ? (
          <CheckCircle2 size={19} />
        ) : (
          icon
        )}
      </div>

      <div className="min-h-20 pb-5">
        <div className="flex items-center gap-2">
          <h3
            className={`font-black ${
              active
                ? 'text-orange-600'
                : completed
                  ? 'text-neutral-900'
                  : 'text-neutral-400'
            }`}
          >
            {title}
          </h3>

          {active && (
            <span className="rounded-full bg-orange-50 px-2 py-1 text-[9px] font-black uppercase tracking-wider text-orange-600">
              Current
            </span>
          )}
        </div>

        <p
          className={`mt-1 text-xs leading-5 ${
            completed || active
              ? 'text-neutral-500'
              : 'text-neutral-400'
          }`}
        >
          {description}
        </p>
      </div>
    </div>
  )
}