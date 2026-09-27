import {
  ArrowLeft,
  Heart,
} from 'lucide-react'
import { useNavigate } from 'react-router-dom'

export default function FavoritesPage() {
  const navigate = useNavigate()

  return (
    <main className="min-h-screen bg-[#f8f7f4] p-4">
      <div className="mx-auto max-w-3xl">
        <header className="flex items-center gap-3 py-3">
          <button
            type="button"
            onClick={() => navigate('/menu')}
            className="flex h-10 w-10 items-center justify-center rounded-full bg-white"
          >
            <ArrowLeft size={20} />
          </button>

          <div>
            <p className="text-xs font-bold uppercase tracking-wider text-orange-500">
              Smart Serve
            </p>

            <h1 className="text-xl font-black">
              Favorites
            </h1>
          </div>
        </header>

        <section className="mt-6 flex min-h-[400px] flex-col items-center justify-center rounded-[28px] bg-white p-8 text-center shadow-sm">
          <div className="flex h-20 w-20 items-center justify-center rounded-full bg-orange-50 text-orange-500">
            <Heart size={34} />
          </div>

          <h2 className="mt-5 text-xl font-black">
            Your favorite dishes
          </h2>

          <p className="mt-2 max-w-sm text-sm leading-6 text-neutral-500">
            Dishes you mark as favorites will appear
            here.
          </p>

          <button
            type="button"
            onClick={() => navigate('/menu')}
            className="mt-6 rounded-2xl bg-orange-500 px-6 py-3 font-bold text-white"
          >
            Browse Menu
          </button>
        </section>
      </div>
    </main>
  )
}