import { useMemo, useState } from 'react'
import {
  ArrowLeft,
  Box,
  Check,
  Clock3,
  Heart,
  Minus,
  Plus,
  ScanLine,
  Star,
} from 'lucide-react'
import { useNavigate, useParams } from 'react-router-dom'
import { menuItems } from '../../data/menuItems'

type Portion = 'Regular' | 'Large' | 'Family'
type SelectedSpice = 'Mild' | 'Medium' | 'Spicy'

const portionPrices: Record<Portion, number> = {
  Regular: 0,
  Large: 80,
  Family: 200,
}

export default function DishDetailsPage() {
  const navigate = useNavigate()
  const { id } = useParams()

  const item = menuItems.find((food) => food.id === id)

  const [portion, setPortion] = useState<Portion>('Regular')
  const [spice, setSpice] = useState<SelectedSpice>(
    item?.spiceLevel ?? 'Medium',
  )
  const [quantity, setQuantity] = useState(1)
  const [extraChicken, setExtraChicken] = useState(false)
  const [extraRaita, setExtraRaita] = useState(false)
  const [favorite, setFavorite] = useState(false)
  const [imageFailed, setImageFailed] = useState(false)

  const total = useMemo(() => {
    if (!item) return 0

    const extras =
      (extraChicken ? 100 : 0) +
      (extraRaita ? 30 : 0)

    return (
      (item.price + portionPrices[portion] + extras) *
      quantity
    )
  }, [
    item,
    portion,
    quantity,
    extraChicken,
    extraRaita,
  ])

  if (!item) {
    return (
      <main className="flex min-h-screen items-center justify-center bg-[#f8f7f4] p-6">
        <div className="text-center">
          <div className="text-5xl">🍽️</div>

          <h1 className="mt-4 text-2xl font-black">
            Dish not found
          </h1>

          <button
            type="button"
            onClick={() => navigate('/menu')}
            className="mt-5 rounded-xl bg-orange-500 px-5 py-3 font-bold text-white"
          >
            Return to Menu
          </button>
        </div>
      </main>
    )
  }

  return (
    <main className="min-h-screen bg-[#f8f7f4] pb-28">
      <div className="mx-auto max-w-5xl">
        <section className="relative aspect-[16/10] max-h-[520px] overflow-hidden bg-orange-50 sm:rounded-b-[32px]">
          {!imageFailed ? (
            <img
              src={item.imageUrl}
              alt={item.name}
              onError={() => setImageFailed(true)}
              className="h-full w-full object-cover"
            />
          ) : (
            <div className="flex h-full flex-col items-center justify-center bg-gradient-to-br from-orange-50 to-amber-100">
              <span className="text-7xl">🍽️</span>

              <span className="mt-3 text-xs font-bold uppercase tracking-[0.18em] text-orange-400">
                Spice Garden
              </span>
            </div>
          )}

          <div className="absolute inset-x-0 top-0 flex items-center justify-between p-4">
            <button
              type="button"
              onClick={() => navigate(-1)}
              className="flex h-11 w-11 items-center justify-center rounded-full bg-white/90 shadow-md backdrop-blur"
            >
              <ArrowLeft size={21} />
            </button>

            <button
              type="button"
              onClick={() => setFavorite((current) => !current)}
              className="flex h-11 w-11 items-center justify-center rounded-full bg-white/90 shadow-md backdrop-blur"
            >
              <Heart
                size={21}
                className={
                  favorite
                    ? 'fill-red-500 text-red-500'
                    : ''
                }
              />
            </button>
          </div>
        </section>

        <div className="px-4 py-6 sm:px-6">
          <div className="flex items-start justify-between gap-4">
            <div>
              <div className="flex items-center gap-2">
                <div
                  className={`flex h-5 w-5 items-center justify-center rounded border ${
                    item.vegetarian
                      ? 'border-green-600'
                      : 'border-red-500'
                  }`}
                >
                  <span
                    className={`h-2.5 w-2.5 rounded-full ${
                      item.vegetarian
                        ? 'bg-green-600'
                        : 'bg-red-500'
                    }`}
                  />
                </div>

                <span className="text-xs font-bold text-neutral-500">
                  {item.category}
                </span>
              </div>

              <h1 className="mt-2 text-3xl font-black tracking-tight sm:text-4xl">
                {item.name}
              </h1>
            </div>

            <span className="shrink-0 text-2xl font-black">
              ₹{item.price}
            </span>
          </div>

          <div className="mt-3 flex flex-wrap items-center gap-4 text-sm text-neutral-600">
            <span className="flex items-center gap-1">
              <Star
                size={17}
                className="fill-amber-400 text-amber-400"
              />
              <strong>{item.rating}</strong>
              <span>
                ({formatReviews(item.reviewCount)} reviews)
              </span>
            </span>

            <span className="flex items-center gap-1">
              <Clock3 size={16} />
              {item.preparationTime} min
            </span>
          </div>

          <p className="mt-5 leading-7 text-neutral-600">
            {item.description}
          </p>

          <section className="mt-7 grid grid-cols-4 gap-2">
            <Nutrition
              value={item.calories}
              label="Calories"
            />
            <Nutrition
              value={`${item.protein}g`}
              label="Protein"
            />
            <Nutrition
              value={`${item.carbs}g`}
              label="Carbs"
            />
            <Nutrition
              value={`${item.fat}g`}
              label="Fat"
            />
          </section>

          <section className="mt-8">
            <h2 className="text-lg font-black">
              Ingredients
            </h2>

            <div className="mt-3 flex flex-wrap gap-2">
              {item.ingredients.map((ingredient) => (
                <span
                  key={ingredient}
                  className="rounded-full border border-neutral-200 bg-white px-3 py-1.5 text-xs font-semibold text-neutral-600"
                >
                  {ingredient}
                </span>
              ))}
            </div>
          </section>

          <section className="mt-7">
            <h2 className="text-lg font-black">
              Allergens
            </h2>

            <div className="mt-3">
              {item.allergens.length ? (
                <div className="flex flex-wrap gap-2">
                  {item.allergens.map((allergen) => (
                    <span
                      key={allergen}
                      className="rounded-full bg-red-50 px-3 py-1.5 text-xs font-bold text-red-600"
                    >
                      {allergen}
                    </span>
                  ))}
                </div>
              ) : (
                <span className="text-sm text-neutral-500">
                  No listed allergens.
                </span>
              )}
            </div>
          </section>

          <section className="mt-8">
            <h2 className="text-lg font-black">
              Portion Size
            </h2>

            <div className="mt-3 grid grid-cols-3 gap-2">
              {(Object.keys(portionPrices) as Portion[]).map(
                (option) => (
                  <button
                    key={option}
                    type="button"
                    onClick={() => setPortion(option)}
                    className={`rounded-2xl border p-3 text-sm font-bold transition ${
                      portion === option
                        ? 'border-orange-500 bg-orange-50 text-orange-600'
                        : 'border-neutral-200 bg-white text-neutral-700'
                    }`}
                  >
                    {option}

                    {portionPrices[option] > 0 && (
                      <span className="mt-1 block text-[10px] font-semibold">
                        +₹{portionPrices[option]}
                      </span>
                    )}
                  </button>
                ),
              )}
            </div>
          </section>

          <section className="mt-7">
            <h2 className="text-lg font-black">
              Spice Level
            </h2>

            <div className="mt-3 grid grid-cols-3 gap-2">
              {(['Mild', 'Medium', 'Spicy'] as SelectedSpice[]).map(
                (option) => (
                  <button
                    key={option}
                    type="button"
                    onClick={() => setSpice(option)}
                    className={`rounded-2xl border p-3 text-sm font-bold transition ${
                      spice === option
                        ? 'border-orange-500 bg-orange-50 text-orange-600'
                        : 'border-neutral-200 bg-white text-neutral-700'
                    }`}
                  >
                    🌶 {option}
                  </button>
                ),
              )}
            </div>
          </section>

          <section className="mt-7">
            <h2 className="text-lg font-black">
              Add-ons
            </h2>

            <div className="mt-3 space-y-2">
              {!item.vegetarian && (
                <Addon
                  label="Extra Chicken"
                  price={100}
                  checked={extraChicken}
                  onChange={() =>
                    setExtraChicken((current) => !current)
                  }
                />
              )}

              <Addon
                label="Extra Raita"
                price={30}
                checked={extraRaita}
                onChange={() =>
                  setExtraRaita((current) => !current)
                }
              />
            </div>
          </section>

          <section className="mt-8 grid grid-cols-2 gap-3">
            <button
              type="button"
              className="flex h-13 items-center justify-center gap-2 rounded-2xl bg-neutral-900 font-bold text-white"
            >
              <Box size={19} />
              View in 3D
            </button>

            <button
              type="button"
              className="flex h-13 items-center justify-center gap-2 rounded-2xl border-2 border-neutral-900 bg-white font-bold"
            >
              <ScanLine size={19} />
              View in AR
            </button>
          </section>

          <section className="mt-8 flex items-center justify-between rounded-2xl bg-white p-4">
            <span className="font-bold">
              Quantity
            </span>

            <div className="flex items-center gap-4">
              <button
                type="button"
                onClick={() =>
                  setQuantity((current) =>
                    Math.max(1, current - 1),
                  )
                }
                className="flex h-9 w-9 items-center justify-center rounded-full bg-neutral-100"
              >
                <Minus size={17} />
              </button>

              <span className="min-w-5 text-center font-black">
                {quantity}
              </span>

              <button
                type="button"
                onClick={() =>
                  setQuantity((current) => current + 1)
                }
                className="flex h-9 w-9 items-center justify-center rounded-full bg-neutral-900 text-white"
              >
                <Plus size={17} />
              </button>
            </div>
          </section>
        </div>
      </div>

      <div className="fixed inset-x-0 bottom-0 z-50 border-t border-neutral-200 bg-white/95 p-3 backdrop-blur-xl">
        <div className="mx-auto max-w-3xl">
          <button
            type="button"
            className="flex h-14 w-full items-center justify-center gap-2 rounded-2xl bg-orange-500 font-black text-white shadow-lg shadow-orange-500/20"
          >
            <Check size={19} />
            Add to Cart · ₹{total}
          </button>
        </div>
      </div>
    </main>
  )
}

function Nutrition({
  value,
  label,
}: {
  value: string | number
  label: string
}) {
  return (
    <div className="rounded-2xl bg-white p-3 text-center shadow-sm">
      <div className="text-sm font-black">
        {value}
      </div>

      <div className="mt-1 text-[10px] text-neutral-500">
        {label}
      </div>
    </div>
  )
}

function Addon({
  label,
  price,
  checked,
  onChange,
}: {
  label: string
  price: number
  checked: boolean
  onChange: () => void
}) {
  return (
    <button
      type="button"
      onClick={onChange}
      className="flex w-full items-center justify-between rounded-2xl border border-neutral-200 bg-white p-4"
    >
      <div className="flex items-center gap-3">
        <div
          className={`flex h-5 w-5 items-center justify-center rounded-md border ${
            checked
              ? 'border-orange-500 bg-orange-500 text-white'
              : 'border-neutral-300'
          }`}
        >
          {checked && <Check size={13} />}
        </div>

        <span className="font-semibold">
          {label}
        </span>
      </div>

      <span className="text-sm font-bold text-neutral-500">
        +₹{price}
      </span>
    </button>
  )
}

function formatReviews(count: number) {
  if (count >= 1000) {
    return `${(count / 1000).toFixed(1)}k`
  }

  return count.toString()
}