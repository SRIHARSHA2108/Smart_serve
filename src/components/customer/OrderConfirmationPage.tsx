import {
  CheckCircle2,
  ChefHat,
  Home,
  ReceiptText,
} from 'lucide-react'
import { useNavigate } from 'react-router-dom'
import { useOrderStore } from '../../store/orderStore'

export default function OrderConfirmationPage() {
  const navigate = useNavigate()

  const order = useOrderStore(
    (state) => state.latestOrder,
  )

  if (!order) {
    return (
      <main className="flex min-h-screen items-center justify-center bg-[#f8f7f4] p-6">
        <div className="text-center">
          <h1 className="text-2xl font-black">
            No recent order
          </h1>

          <button
            type="button"
            onClick={() => navigate('/menu')}
            className="mt-5 rounded-2xl bg-orange-500 px-6 py-3 font-bold text-white"
          >
            View Menu
          </button>
        </div>
      </main>
    )
  }

  return (
    <main className="min-h-screen bg-[#fffaf4] px-4 py-10">
      <div className="mx-auto max-w-md">
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
            {order.items.map((item) => (
              <div
                key={item.cartItemId}
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
              ₹{order.totalAmount}
            </span>
          </div>
        </section>

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
            Menu
          </button>

          <button
            type="button"
            className="flex h-13 items-center justify-center gap-2 rounded-2xl border border-neutral-200 bg-white font-bold text-neutral-700"
          >
            <ReceiptText size={18} />
            Receipt
          </button>
        </div>

        <p className="mt-6 text-center text-xs leading-5 text-neutral-400">
          Smart Serve · See it. Choose it. Enjoy it.
        </p>
      </div>
    </main>
  )
}