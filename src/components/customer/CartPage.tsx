import {
  ArrowLeft,
  Minus,
  Plus,
  ShoppingBag,
  Trash2,
} from 'lucide-react'
import { useNavigate } from 'react-router-dom'
import { useCartStore } from '../../store/cartStore'
import { useSessionStore } from '../../store/sessionStore'
import { useOrderStore } from '../../store/orderStore'
import { useTableStatusStore } from '../../store/tableStatusStore'

export default function CartPage() {
  const navigate = useNavigate()

  const session = useSessionStore((state) => state.session)
  const setTableStatus = useTableStatusStore(
    (state) => state.setTableStatus,
  )
  const items = useCartStore((state) => state.items)
  const increaseQuantity = useCartStore(
    (state) => state.increaseQuantity,
  )
  const decreaseQuantity = useCartStore(
    (state) => state.decreaseQuantity,
  )
  const removeItem = useCartStore(
    (state) => state.removeItem,
  )

  const clearCart = useCartStore(
    (state) => state.clearCart,
  )
  const createOrder = useOrderStore(
    (state) => state.createOrder,
  )
  const itemsTotal = items.reduce(
    (total, item) =>
      total + item.unitPrice * item.quantity,
    0,
  )

  const taxes = Math.round(itemsTotal * 0.05)
  const serviceCharge = Math.round(itemsTotal * 0.05)

  const grandTotal =
    itemsTotal + taxes + serviceCharge
const handlePlaceOrder = async () => {
  if (items.length === 0) {
    return
  }

  if (!session) {
    alert(
      'Your table session is missing. Please verify your table again.',
    )

    navigate('/verify')
    return
  }

  try {
    const order = await createOrder({
        restaurantId:
          session.restaurantId,

        tableId:
          session.tableId,

        tableNumber:
          session.tableNumber,

        customerSessionId:
          session.customerSessionId,

        items: [...items],

        itemsTotal,
        taxes,
        serviceCharge,
        totalAmount: grandTotal,
      })

      console.log(
        'Firebase order created:',
        order,
      )

      setTableStatus(
        session.tableNumber,
        'OCCUPIED',
      )

      clearCart()

      navigate('/order-confirmation')
    } catch (error) {
      console.error(
        'Order creation failed:',
        error,
      )

      alert(
        'Unable to place your order. Please try again.',
      )
    }
  }
  const totalQuantity = items.reduce(
    (total, item) => total + item.quantity,
    0,
  )

  if (items.length === 0) {
    return (
      <main className="flex min-h-screen items-center justify-center bg-[#f8f7f4] p-6">
        <div className="max-w-sm text-center">
          <div className="mx-auto flex h-20 w-20 items-center justify-center rounded-full bg-orange-50 text-orange-500">
            <ShoppingBag size={36} />
          </div>

          <h1 className="mt-5 text-2xl font-black">
            Your cart is empty
          </h1>

          <p className="mt-2 text-sm leading-6 text-neutral-500">
            Explore the Spice Garden menu and add something
            delicious.
          </p>

          <button
            type="button"
            onClick={() => navigate('/menu')}
            className="mt-6 rounded-2xl bg-orange-500 px-6 py-3 font-bold text-white"
          >
            View Menu
          </button>
        </div>
      </main>
    )
  }

  return (
    <main className="min-h-screen bg-[#f8f7f4] pb-28">
      <header className="sticky top-0 z-40 border-b border-neutral-200 bg-white/95 backdrop-blur-xl">
        <div className="mx-auto flex max-w-3xl items-center gap-4 px-4 py-4">
          <button
            type="button"
            onClick={() => navigate(-1)}
            className="flex h-10 w-10 items-center justify-center rounded-full bg-neutral-100"
          >
            <ArrowLeft size={20} />
          </button>

          <div className="flex-1">
            <h1 className="font-black">
              Your Cart
            </h1>

            <p className="text-xs text-neutral-500">
              {totalQuantity}{' '}
              {totalQuantity === 1 ? 'item' : 'items'}
            </p>
          </div>

          <div className="rounded-xl bg-orange-50 px-3 py-2 text-right">
            <div className="text-[10px] font-bold uppercase text-orange-500">
              Verified
            </div>

            <div className="text-sm font-black">
              Table {session?.tableNumber ?? 12}
            </div>
          </div>
        </div>
      </header>

      <div className="mx-auto max-w-3xl px-4 py-6">
        <div className="space-y-3">
          {items.map((item) => (
            <article
              key={item.cartItemId}
              className="flex gap-4 rounded-3xl bg-white p-4 shadow-sm"
            >
              <img
                src={item.imageUrl}
                alt={item.name}
                className="h-24 w-24 shrink-0 rounded-2xl object-cover"
              />

              <div className="min-w-0 flex-1">
                <div className="flex items-start justify-between gap-2">
                  <div>
                    <h2 className="font-black">
                      {item.name}
                    </h2>

                    <p className="mt-1 text-xs text-neutral-500">
                      {item.portion} · {item.spice}
                    </p>
                  </div>

                  <button
                    type="button"
                    onClick={() =>
                      removeItem(item.cartItemId)
                    }
                    className="text-neutral-400 hover:text-red-500"
                  >
                    <Trash2 size={17} />
                  </button>
                </div>

                {(item.extraChicken ||
                  item.extraRaita) && (
                  <div className="mt-2 text-[11px] text-neutral-500">
                    {item.extraChicken &&
                      'Extra Chicken'}

                    {item.extraChicken &&
                      item.extraRaita &&
                      ' · '}

                    {item.extraRaita &&
                      'Extra Raita'}
                  </div>
                )}

                <div className="mt-4 flex items-center justify-between">
                  <span className="font-black">
                    ₹
                    {item.unitPrice *
                      item.quantity}
                  </span>

                  <div className="flex items-center gap-3">
                    <button
                      type="button"
                      onClick={() =>
                        decreaseQuantity(
                          item.cartItemId,
                        )
                      }
                      className="flex h-8 w-8 items-center justify-center rounded-full bg-neutral-100"
                    >
                      <Minus size={15} />
                    </button>

                    <span className="min-w-4 text-center text-sm font-black">
                      {item.quantity}
                    </span>

                    <button
                      type="button"
                      onClick={() =>
                        increaseQuantity(
                          item.cartItemId,
                        )
                      }
                      className="flex h-8 w-8 items-center justify-center rounded-full bg-neutral-900 text-white"
                    >
                      <Plus size={15} />
                    </button>
                  </div>
                </div>
              </div>
            </article>
          ))}
        </div>

        <section className="mt-6 rounded-3xl bg-white p-5 shadow-sm">
          <h2 className="font-black">
            Price Details
          </h2>

          <div className="mt-5 space-y-3 text-sm">
            <PriceRow
              label="Items Total"
              amount={itemsTotal}
            />

            <PriceRow
              label="Taxes"
              amount={taxes}
            />

            <PriceRow
              label="Service Charge"
              amount={serviceCharge}
            />
          </div>

          <div className="my-4 border-t border-dashed border-neutral-200" />

          <div className="flex items-center justify-between">
            <span className="font-black">
              Total Amount
            </span>

            <span className="text-xl font-black">
              ₹{grandTotal}
            </span>
          </div>
        </section>

        <div className="mt-4 rounded-2xl bg-green-50 p-4 text-sm text-green-800">
          ✓ Your order will automatically be assigned to{' '}
          <strong>
            Table {session?.tableNumber ?? 12}
          </strong>
          . You do not need to select a table again.
        </div>
      </div>

      <div className="fixed inset-x-0 bottom-0 border-t border-neutral-200 bg-white/95 p-3 backdrop-blur-xl">
        <div className="mx-auto max-w-3xl">
          <button
            type="button"
            onClick={handlePlaceOrder}
            className="h-14 w-full rounded-2xl bg-orange-500 font-black text-white shadow-lg shadow-orange-500/20"
          >
            Place Order · ₹{grandTotal}
          </button>
        </div>
      </div>
    </main>
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
    <div className="flex justify-between text-neutral-600">
      <span>{label}</span>

      <span className="font-semibold">
        ₹{amount}
      </span>
    </div>
  )
}