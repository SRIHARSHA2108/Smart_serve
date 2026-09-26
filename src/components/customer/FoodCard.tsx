import { useNavigate } from 'react-router-dom'
import { Heart, Leaf, Star } from 'lucide-react'
import { useState } from 'react'
import type { MenuItem } from '../../types/menu'

type FoodCardProps = {
  item: MenuItem
}

export default function FoodCard({ item }: FoodCardProps) {
  const navigate = useNavigate()
  const [favorite, setFavorite] = useState(false)
  const [imageFailed, setImageFailed] = useState(false)

  return (
    <article onClick={() => navigate(`/dish/${item.id}`)}
    className="group overflow-hidden rounded-[22px] border border-neutral-200/80 bg-white shadow-sm transition hover:-translate-y-1 hover:shadow-lg">
      <div className="relative aspect-[4/3] overflow-hidden bg-gradient-to-br from-orange-100 to-amber-50">
        {!imageFailed ? (
          <img
            src={item.imageUrl}
            alt={item.name}
            loading="lazy"
            decoding="async"
            onError={() => setImageFailed(true)}
            className="h-full w-full object-cover transition duration-500 group-hover:scale-105"
          />
        ) : (
        <div className="flex h-full flex-col items-center justify-center bg-gradient-to-br from-orange-50 to-amber-100 px-4 text-center">
            <span className="text-4xl">🍽️</span>

            <span className="mt-2 text-[10px] font-bold uppercase tracking-wider text-orange-400">
                Spice Garden
            </span>
        </div>
        )}

        <button
          type="button"
          aria-label={`Favorite ${item.name}`}
          onClick={(event) => {
             event.stopPropagation()
             setFavorite((current) => !current)
          }}
          className="absolute right-3 top-3 flex h-9 w-9 items-center justify-center rounded-full bg-white/90 text-neutral-700 shadow-sm backdrop-blur transition hover:scale-105"
        >
          <Heart
            size={18}
            className={favorite ? 'fill-red-500 text-red-500' : ''}
          />
        </button>

        {item.chefChoice && (
          <span className="absolute bottom-3 left-3 rounded-full bg-green-600 px-2.5 py-1 text-[10px] font-bold text-white shadow-sm">
            Chef&apos;s Pick
          </span>
        )}

        {!item.chefChoice && item.popular && (
          <span className="absolute bottom-3 left-3 rounded-full bg-sky-500 px-2.5 py-1 text-[10px] font-bold text-white shadow-sm">
            Popular
          </span>
        )}
      </div>

      <div className="p-4">
        <div className="flex items-start justify-between gap-2">
          <h3 className="line-clamp-2 font-extrabold leading-5 text-neutral-900">
            {item.name}
          </h3>

          <div
            title={item.vegetarian ? 'Vegetarian' : 'Non-Vegetarian'}
            className={`mt-0.5 flex h-5 w-5 shrink-0 items-center justify-center rounded border ${
              item.vegetarian
                ? 'border-green-600'
                : 'border-red-500'
            }`}
          >
            <span
              className={`h-2.5 w-2.5 rounded-full ${
                item.vegetarian ? 'bg-green-600' : 'bg-red-500'
              }`}
            />
          </div>
        </div>

        <div className="mt-2 flex items-center justify-between gap-2">
          <span className="text-lg font-black text-neutral-900">
            ₹{item.price}
          </span>

          <span className="flex items-center gap-1 text-xs font-semibold text-neutral-600">
            <Star
              size={14}
              className="fill-amber-400 text-amber-400"
            />
            {item.rating}

            <span className="hidden text-neutral-400 sm:inline">
                ({formatReviewCount(item.reviewCount)})
            </span>
        </span>
        </div>

        <div className="mt-3 flex flex-wrap gap-1.5">
          {item.vegetarian && (
            <span className="inline-flex items-center gap-1 rounded-full bg-green-50 px-2 py-1 text-[10px] font-bold text-green-700">
              <Leaf size={11} />
              Vegetarian
            </span>
          )}

          <span className="rounded-full bg-orange-50 px-2 py-1 text-[10px] font-bold text-orange-600">
            🌶 {item.spiceLevel}
          </span>

          <span className="rounded-full bg-neutral-100 px-2 py-1 text-[10px] font-semibold text-neutral-600">
            {item.calories} kcal
          </span>
        </div>
      </div>
    </article>
  )
}
function formatReviewCount(count: number) {
  if (count >= 1000) {
    return `${(count / 1000).toFixed(1)}k`
  }

  return count.toString()
}