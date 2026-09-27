import {
  useEffect,
  useMemo,
  useState,
} from 'react'
import {
  ChevronRight,
  CircleUserRound,
  Search,
  ShoppingCart,
  SlidersHorizontal,
  Sparkles,
  UtensilsCrossed,
} from 'lucide-react'
import SmartServeLogo from '../common/SmartServeLogo'
import FoodCard from './FoodCard'
import { menuCategories } from '../../data/categories'
import { useMenuStore } from '../../store/menuStore'
import type { MenuCategory } from '../../data/categories'
import { useSessionStore } from '../../store/sessionStore'
import { useNavigate } from 'react-router-dom'
import { useCartStore } from '../../store/cartStore'

export default function MenuPage() {
  const navigate = useNavigate()
  const session = useSessionStore((state) => state.session)
  const cartItems = useCartStore(
    (state) => state.items,
  )

  const cartCount = cartItems.reduce(
    (total, item) => total + item.quantity,
    0,
  )
  
  const allMenuItems = useMenuStore(
    (state) => state.items,
  )
  const subscribeToMenu = useMenuStore(
      (state) => state.subscribeToMenu,
    )
    useEffect(() => {
    const unsubscribe = subscribeToMenu()

    return unsubscribe
  }, [subscribeToMenu])

  const menuItems = useMemo(
    () =>
      allMenuItems.filter(
        (item) => item.available,
      ),
    [allMenuItems],
  )
  const [search, setSearch] = useState('')
  const [category, setCategory] = useState<MenuCategory>('All')

  const filteredItems = useMemo(() => {
    const normalizedSearch = search.trim().toLowerCase()

    return menuItems.filter((item) => {
      const categoryMatches =
        category === 'All' || item.category === category

      const searchMatches =
        !normalizedSearch ||
        item.name.toLowerCase().includes(normalizedSearch) ||
        item.description.toLowerCase().includes(normalizedSearch) ||
        item.tags.some((tag) =>
          tag.toLowerCase().includes(normalizedSearch),
        )

      return categoryMatches && searchMatches
    })
  }, [category, search, menuItems])

  const recommendedItems = menuItems
    .filter((item) => item.recommended)
    .slice(0, 2)

  return (
    <main className="min-h-screen bg-[#f8f7f4] pb-24 text-neutral-900">
      <header className="sticky top-0 z-40 border-b border-neutral-200/80 bg-white/95 backdrop-blur-xl">
        <div className="mx-auto flex max-w-7xl items-center justify-between px-4 py-3 sm:px-6">
          <div>
            <SmartServeLogo />

            <p className="ml-14 -mt-1 text-xs font-semibold text-neutral-500">
              Spice Garden
            </p>
          </div>

          <div className="flex items-center gap-1">
            <button
              type="button"
              onClick={() => navigate('/cart')}
              className="relative flex h-10 w-10 items-center justify-center rounded-full text-neutral-700 transition hover:bg-neutral-100"
            >
              <ShoppingCart size={21} />

              {cartCount > 0 && (
                <span className="absolute right-0 top-0 flex h-5 min-w-5 items-center justify-center rounded-full bg-orange-500 px-1 text-[10px] font-black text-white">
                  {cartCount}
                </span>
              )}
            </button>

            <button
              type="button"
              className="ml-1 flex h-10 w-10 items-center justify-center rounded-full bg-neutral-100 text-neutral-700"
            >
              <CircleUserRound size={22} />
            </button>
          </div>
        </div>
      </header>

      <div className="mx-auto max-w-7xl px-4 py-5 sm:px-6 lg:py-7">
        <section
  className="relative overflow-hidden rounded-[26px] bg-neutral-900 px-6 py-7 text-white shadow-xl sm:px-8 sm:py-9"
  style={{
    backgroundImage:
      "linear-gradient(90deg, rgba(15,15,15,0.96) 0%, rgba(15,15,15,0.82) 48%, rgba(15,15,15,0.35) 100%), url('/images/chicken-biryani.jpg')",
    backgroundSize: 'cover',
    backgroundPosition: 'center',
  }}
>
          <div className="absolute -right-14 -top-20 h-64 w-64 rounded-full bg-orange-500/25 blur-3xl" />

          <div className="absolute -bottom-24 right-28 h-52 w-52 rounded-full bg-amber-400/10 blur-3xl" />

          <div className="relative z-10 max-w-xl">
            <div className="flex flex-wrap items-center gap-2">
              <span className="rounded-full bg-orange-500/15 px-3 py-1 text-xs font-bold text-orange-300">
                Welcome to
              </span>

              <span className="rounded-full border border-white/10 bg-white/10 px-3 py-1 text-xs font-bold text-white">
                Table {session?.tableNumber ?? 12}
              </span>
            </div>

            <h1 className="mt-4 text-3xl font-black tracking-tight sm:text-4xl">
              Spice Garden
            </h1>

            <p className="mt-2 max-w-md text-sm leading-6 text-neutral-300">
              Authentic flavors, modern dining experience.
              Discover dishes crafted for every craving.
            </p>

            <div className="mt-5 inline-flex items-center gap-2 text-xs font-semibold text-orange-300">
              <Sparkles size={15} />
              AI-powered recommendations available
            </div>
          </div>
        </section>

        <section className="relative z-20 -mt-4 px-2 sm:px-5">
          <div className="flex items-center gap-3 rounded-2xl border border-neutral-200 bg-white p-2 shadow-lg shadow-neutral-900/5">
            <Search
              size={20}
              className="ml-2 shrink-0 text-neutral-400"
            />

            <input
              value={search}
              onChange={(event) => setSearch(event.target.value)}
              placeholder="Search for dishes, cuisines..."
              className="h-11 min-w-0 flex-1 bg-transparent text-sm text-neutral-800 outline-none placeholder:text-neutral-400"
            />

            <button
              type="button"
              className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-neutral-100 text-neutral-700 transition hover:bg-orange-50 hover:text-orange-600"
            >
              <SlidersHorizontal size={18} />
            </button>
          </div>
        </section>

        <section className="mt-6">
          <div className="scrollbar-none flex gap-2 overflow-x-auto pb-2">
            {menuCategories.map((item) => {
              const active = item === category

              return (
                <button
                  key={item}
                  type="button"
                  onClick={() => setCategory(item)}
                  className={`shrink-0 rounded-full px-4 py-2 text-sm font-bold transition ${
                    active
                      ? 'bg-orange-500 text-white shadow-md shadow-orange-500/20'
                      : 'border border-neutral-200 bg-white text-neutral-600 hover:border-orange-200 hover:text-orange-600'
                  }`}
                >
                  {item}
                </button>
              )
            })}
          </div>
        </section>

        {!search && category === 'All' && (
          <section className="mt-7">
            <div className="mb-4 flex items-end justify-between gap-3">
              <div>
                <div className="flex items-center gap-2">
                  <Sparkles
                    size={18}
                    className="text-orange-500"
                  />

                  <h2 className="text-xl font-black tracking-tight">
                    Recommended for You
                  </h2>
                </div>

                <p className="mt-1 text-xs text-neutral-500">
                  Popular choices from Spice Garden
                </p>
              </div>

              <button
                type="button"
                className="flex items-center gap-1 text-xs font-bold text-orange-500"
              >
                See All
                <ChevronRight size={15} />
              </button>
            </div>

            <div className="grid grid-cols-2 gap-3 sm:gap-4 lg:max-w-2xl">
              {recommendedItems.map((item) => (
                <FoodCard key={item.id} item={item} />
              ))}
            </div>
          </section>
        )}

        <section
            id="all-dishes"
            className="mt-8 scroll-mt-24"
          >
          <div className="mb-4 flex items-center justify-between">
            <div>
              <h2 className="text-xl font-black tracking-tight">
                {category === 'All' ? 'All Dishes' : category}
              </h2>

              <p className="mt-1 text-xs text-neutral-500">
                {filteredItems.length}{' '}
                {filteredItems.length === 1 ? 'dish' : 'dishes'} available
              </p>
            </div>

            <button
              type="button"
              className="flex items-center gap-2 rounded-xl border border-neutral-200 bg-white px-3 py-2 text-xs font-bold text-neutral-700"
            >
              <SlidersHorizontal size={15} />
              Filter
            </button>
          </div>

          {filteredItems.length > 0 ? (
            <div className="grid grid-cols-2 gap-3 sm:gap-4 md:grid-cols-3 xl:grid-cols-4">
              {filteredItems.map((item) => (
                <FoodCard key={item.id} item={item} />
              ))}
            </div>
          ) : (
            <div className="rounded-3xl border border-dashed border-neutral-300 bg-white px-6 py-14 text-center">
              <div className="text-4xl">🍽️</div>

              <h3 className="mt-4 font-black">
                No dishes found
              </h3>

              <p className="mt-2 text-sm text-neutral-500">
                Try another search or category.
              </p>

              <button
                type="button"
                onClick={() => {
                  setSearch('')
                  setCategory('All')
                }}
                className="mt-5 rounded-xl bg-orange-500 px-5 py-2.5 text-sm font-bold text-white"
              >
                Show all dishes
              </button>
            </div>
          )}
        </section>
      </div>

      <nav className="fixed bottom-0 left-0 right-0 z-50 border-t border-neutral-200 bg-white/95 backdrop-blur-xl">
        <div className="mx-auto grid max-w-lg grid-cols-3">
          <BottomNavItem
            icon={<UtensilsCrossed size={21} />}
            label="Menu"
            active
            onClick={() => navigate('/menu')}
          />

          <BottomNavItem
            icon={<Sparkles size={21} />}
            label="Combos"
            onClick={() => navigate('/combos')}
          />

          <BottomNavItem
            icon={<ShoppingCart size={21} />}
            label="Cart"
            badge={
              cartCount > 0
                ? cartCount.toString()
                : undefined
            }
            onClick={() => navigate('/cart')}
          />
        </div>
      </nav>
    </main>
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
      className={`relative flex min-h-16 flex-col items-center justify-center gap-1 text-[11px] font-bold ${
        active
          ? 'text-orange-500'
          : 'text-neutral-500'
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