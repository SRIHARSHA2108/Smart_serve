import {
  useEffect,
  useMemo,
  useRef,
  useState,
} from 'react'
import {
  ArrowLeft,
  CheckCircle2,
  ChefHat,
  Home,
  ReceiptText,
  Activity,
} from 'lucide-react'
import { useNavigate } from 'react-router-dom'
import { useOrderStore } from '../../store/orderStore'
import { useSessionStore } from '../../store/sessionStore'
import { useCartStore } from '../../store/cartStore'
import OrderTimer from './OrderTimer'

export default function OrderConfirmationPage() {
  const navigate = useNavigate()

  const order = useOrderStore(
    (state) => state.latestOrder,
  )
  const allOrders = useOrderStore(
    (state) => state.orders,
  )
  const subscribeToOrder = useOrderStore(
    (state) => state.subscribeToOrder,
  )
  const requestReceipt = useOrderStore(
    (state) => state.requestReceipt,
  )
  const clearSession = useSessionStore(
    (state) => state.clearSession,
  )
  const clearCart = useCartStore((state) => state.clearCart)
  const session = useSessionStore((state) => state.session)
  const [receiptSent, setReceiptSent] = useState(false)
  const clearedAfterPayment = useRef(false)
  const orderId = order?.orderId
  const visibleOrders = useMemo(() => {
    if (!order) return []

    const sessionOrders = allOrders
      .filter(
        (sessionOrder) =>
          sessionOrder.customerSessionId ===
          (session?.customerSessionId ?? order.customerSessionId),
      )
      .sort(
        (first, second) =>
          new Date(first.createdAt).getTime() -
          new Date(second.createdAt).getTime(),
      )

    return sessionOrders.length > 0
      ? sessionOrders
      : [order]
  }, [allOrders, order, session?.customerSessionId])
  const visibleItems = visibleOrders.flatMap((sessionOrder) =>
    sessionOrder.items.map((item) => ({
      ...item,
      displayKey: `${sessionOrder.orderId}-${item.cartItemId}`,
    })),
  )
  const sessionTotal = visibleOrders.reduce(
    (total, sessionOrder) => total + sessionOrder.totalAmount,
    0,
  )

  useEffect(() => {
    if (!orderId) return

    return subscribeToOrder(orderId)
  }, [orderId, subscribeToOrder])

  useEffect(() => {
    if (!order) {
      navigate('/cart', { replace: true })
    }
  }, [order, navigate])

  useEffect(() => {
    if (
      order?.paymentStatus === 'PAID' &&
      !clearedAfterPayment.current
    ) {
      clearedAfterPayment.current = true
      clearSession()
      clearCart()
    }
  }, [order?.paymentStatus, clearSession, clearCart])

  if (!order) {
    return null
  }

  return (
    <main className="min-h-screen bg-[#fffaf4] px-4 py-10">
      <div className="mx-auto max-w-md">
        <button
          type="button"
          onClick={() => navigate(-1)}
          aria-label="Go back"
          className="mb-6 flex h-10 w-10 items-center justify-center rounded-full bg-white text-neutral-700 shadow-sm transition hover:bg-neutral-100"
        >
          <ArrowLeft size={20} />
        </button>

        <div className="text-center">
          <div className="mx-auto flex h-24 w-24 items-center justify-center rounded-full bg-green-50 text-green-600">
            <CheckCircle2 size={52} />
          </div>

          <p className="mt-6 text-sm font-bold uppercase tracking-[0.18em] text-green-600">
            Order placed
          </p>

          <h1 className="mt-2 text-3xl font-black">
            Thank you!
          </h1>

          <p className="mt-3 leading-6 text-neutral-500">
            Your order has been sent to the Spice Garden
            kitchen.
          </p>
        </div>

        <section className="mt-8 rounded-[28px] bg-white p-6 shadow-lg shadow-neutral-900/5">
          <div className="flex items-center justify-between border-b border-neutral-100 pb-5">
            <div>
              <p className="text-xs font-bold uppercase text-neutral-400">
                Order
              </p>

              <p className="mt-1 text-xl font-black">
                #{order.orderId}
              </p>
            </div>

            <div className="text-right">
              <p className="text-xs font-bold uppercase text-neutral-400">
                Table
              </p>

              <p className="mt-1 text-xl font-black">
                {order.tableNumber}
              </p>
            </div>
          </div>

          <div className="mt-5 space-y-4">
            {visibleItems.map((item) => (
              <div
                key={item.displayKey}
                className="flex justify-between gap-4"
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

          <div className="my-5 border-t border-dashed border-neutral-200" />

          <div className="flex items-center justify-between">
            <span className="font-black">
               Amount to be Paid
            </span>

            <span className="text-xl font-black">
              ₹{sessionTotal}
            </span>
          </div>
        </section>

        <div className="mt-5">
          <OrderTimer
            createdAt={order.createdAt}
            completed={order.status === 'COMPLETED'}
          />
        </div>

        <div className="mt-5 flex items-start gap-3 rounded-2xl bg-orange-50 p-4">
          <ChefHat
            size={21}
            className="mt-0.5 shrink-0 text-orange-500"
          />

          <div>
            <p className="text-sm font-bold text-neutral-800">
              Sent to Kitchen
            </p>

            <p className="mt-1 text-xs leading-5 text-neutral-500">
              Restaurant staff have received your order and
              will handle preparation and service.
            </p>
          </div>
        </div>

        <div className="mt-6 grid grid-cols-2 gap-3">
          <button
            type="button"
            onClick={() => navigate('/menu')}
            className="flex h-13 items-center justify-center gap-2 rounded-2xl bg-orange-500 font-bold text-white"
          >
            <Home size={18} />
            Home Menu
          </button>

          <button
            type="button"
            disabled={receiptSent || order.receiptRequested}
            onClick={async () => {
              try {
                await requestReceipt(order.orderId)
                setReceiptSent(true)
              } catch (error) {
                console.error('Receipt request failed:', error)
                window.alert('Unable to notify the server. Please try again.')
              }
            }}
            className="flex h-13 items-center justify-center gap-2 rounded-2xl border border-neutral-200 bg-white font-bold text-neutral-700 disabled:opacity-60"
          >
            <ReceiptText size={18} />
            {receiptSent || order.receiptRequested
              ? 'Receipt Requested'
              : 'Request Receipt'}
          </button>
        </div>
        <button
          type="button"
          onClick={() =>
            navigate(`/order-status/${order.orderId}`)
          }
          className="mt-3 flex h-14 w-full items-center justify-center gap-2 rounded-2xl bg-neutral-900 font-bold text-white shadow-lg transition hover:bg-neutral-800"
        >
          <Activity size={19} />

          View Live Order Status
        </button>
        
        <p className="mt-6 text-center text-xs leading-5 text-neutral-400">
          Smart Serve · See it. Choose it. Enjoy it.
        </p>
      </div>
    </main>
  )
}
