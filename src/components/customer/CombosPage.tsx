import {
  Sparkles,
  ShoppingCart,
  UtensilsCrossed,
} from 'lucide-react'
import { useNavigate } from 'react-router-dom'
import { useCartStore } from '../../store/cartStore'
import SmartServeLogo from '../common/SmartServeLogo'

export default function CombosPage() {
  const navigate = useNavigate()

  const cartItems = useCartStore(
    (state) => state.items,
  )
  const addItem = useCartStore(
    (state) => state.addItem,
    )

  const cartCount = cartItems.reduce(
    (total, item) =>
      total + item.quantity,
    0,
  )
  const addComboToCart = ({
    foodId,
    name,
    imageUrl,
    price,
    }: {
    foodId: string
    name: string
    imageUrl: string
    price: number
    }) => {
    addItem({
        cartItemId: `${foodId}-${Date.now()}`,
        foodId,
        name,
        imageUrl,

        basePrice: price,
        unitPrice: price,

        quantity: 1,

        portion: 'Regular',
        spice: 'Medium',

        extraChicken: false,
        extraRaita: false,
    })
    }

  return (
    <main className="min-h-screen bg-[#f8f7f4] pb-24 text-neutral-900">
      {/* HEADER */}

      <header className="sticky top-0 z-40 border-b border-neutral-200 bg-white/95 backdrop-blur-xl">
        <div className="mx-auto flex max-w-7xl items-center justify-between px-4 py-3 sm:px-6">
          <div>
            <SmartServeLogo />

            <p className="ml-14 -mt-1 text-xs font-semibold text-neutral-500">
              Spice Garden
            </p>
          </div>

          <button
            type="button"
            onClick={() =>
              navigate('/cart')
            }
            className="relative flex h-10 w-10 items-center justify-center rounded-full text-neutral-700 hover:bg-neutral-100"
          >
            <ShoppingCart size={21} />

            {cartCount > 0 && (
              <span className="absolute right-0 top-0 flex h-5 min-w-5 items-center justify-center rounded-full bg-orange-500 px-1 text-[10px] font-black text-white">
                {cartCount}
              </span>
            )}
          </button>
        </div>
      </header>

      {/* CONTENT */}

      <div className="mx-auto max-w-7xl px-4 py-6 sm:px-6">
        <div>
          <div className="flex items-center gap-2">
            <Sparkles
              size={21}
              className="text-orange-500"
            />

            <p className="text-xs font-black uppercase tracking-[0.16em] text-orange-500">
              Special Offers
            </p>
          </div>

          <h1 className="mt-2 text-3xl font-black">
            Value Combos
          </h1>

          <p className="mt-2 text-sm text-neutral-500">
            Enjoy more together and save on your meal.
          </p>
        </div>

        <div className="mt-7 grid gap-5 sm:grid-cols-2">
          <ComboCard
            title="Biryani Feast"
            description="Chicken Biryani + Fresh Lime Soda"
            originalPrice={397}
            comboPrice={349}
            imageUrl="/images/chicken-biryani.jpg"
            onAddToCart={() =>
                addComboToCart({
                foodId: 'combo-biryani-feast',
                name: 'Biryani Feast',
                imageUrl:
                    '/images/chicken-biryani.jpg',
                price: 349,
                })
            }
            />

          <ComboCard
            title="Veg Delight"
            description="Paneer Butter Masala + Garlic Naan"
            originalPrice={370}
            comboPrice={319}
            imageUrl="/images/paneer-butter-masala.jpg"
            onAddToCart={() =>
                addComboToCart({
                foodId: 'combo-veg-delight',
                name: 'Veg Delight',
                imageUrl:
                    '/images/paneer-butter-masala.jpg',
                price: 319,
                })
            }
            />
        </div>
      </div>

      {/* BOTTOM NAVIGATION */}

      <nav className="fixed bottom-0 left-0 right-0 z-50 border-t border-neutral-200 bg-white/95 backdrop-blur-xl">
        <div className="mx-auto grid max-w-lg grid-cols-3">
          <BottomNavItem
            icon={<UtensilsCrossed size={21} />}
            label="Menu"
            onClick={() =>
              navigate('/menu')
            }
          />

          <BottomNavItem
            icon={<Sparkles size={21} />}
            label="Combos"
            active
            onClick={() =>
              navigate('/combos')
            }
          />

          <BottomNavItem
            icon={<ShoppingCart size={21} />}
            label="Cart"
            badge={
              cartCount > 0
                ? cartCount.toString()
                : undefined
            }
            onClick={() =>
              navigate('/cart')
            }
          />
        </div>
      </nav>
    </main>
  )
}

function ComboCard({
  title,
  description,
  originalPrice,
  comboPrice,
  imageUrl,
  onAddToCart,
}: {
  title: string
  description: string
  originalPrice: number
  comboPrice: number
  imageUrl: string
  onAddToCart: () => void
}) {
  const savings =
    originalPrice - comboPrice

  return (
    <article className="overflow-hidden rounded-[26px] border border-neutral-200 bg-white shadow-sm">
      <div className="relative h-56 overflow-hidden bg-orange-50">
        <img
          src={imageUrl}
          alt={title}
          className="h-full w-full object-cover"
        />

        <span className="absolute left-4 top-4 rounded-full bg-green-500 px-3 py-1.5 text-[10px] font-black uppercase text-white shadow-lg">
          Save ₹{savings}
        </span>
      </div>

      <div className="p-5">
        <div className="flex items-start justify-between gap-3">
          <div>
            <h2 className="text-xl font-black">
              {title}
            </h2>

            <p className="mt-2 text-sm text-neutral-500">
              {description}
            </p>
          </div>

          <Sparkles
            size={20}
            className="shrink-0 text-orange-500"
          />
        </div>

        <div className="mt-5 flex items-end justify-between">
          <div>
            <span className="text-2xl font-black">
              ₹{comboPrice}
            </span>

            <span className="ml-2 text-sm text-neutral-400 line-through">
              ₹{originalPrice}
            </span>
          </div>

          <span className="rounded-full bg-orange-50 px-3 py-1.5 text-[10px] font-black uppercase text-orange-600">
            Combo
          </span>
        </div>
      </div>
      <button
        type="button"
        onClick={onAddToCart}
        className="mt-5 flex h-12 w-full items-center justify-center gap-2 rounded-2xl bg-orange-500 font-black text-white shadow-lg shadow-orange-500/20 transition hover:bg-orange-600"
        >
        <ShoppingCart size={18} />
        Add Combo to Cart · ₹{comboPrice}
        </button>
    </article>
  )
}

function BottomNavItem({
  icon,
  label,
  active = false,
  badge,
  onClick,
}: {
  icon: React.ReactNode
  label: string
  active?: boolean
  badge?: string
  onClick?: () => void
}) {
  return (
    <button
      type="button"
      onClick={onClick}
      className={`relative flex min-h-16 flex-col items-center justify-center gap-1 text-[11px] font-bold transition ${
        active
          ? 'text-orange-500'
          : 'text-neutral-500 hover:text-orange-500'
      }`}
    >
      <div className="relative">
        {icon}

        {badge && (
          <span className="absolute -right-3 -top-2 flex h-4 min-w-4 items-center justify-center rounded-full bg-orange-500 px-1 text-[9px] text-white">
            {badge}
          </span>
        )}
      </div>

      {label}
    </button>
  )
}