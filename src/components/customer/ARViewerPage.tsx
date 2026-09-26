import {
  ArrowLeft,
  Box,
  Info,
  Smartphone,
} from 'lucide-react'
import { useNavigate, useParams } from 'react-router-dom'
import ARViewer from './ARViewer'
import { useMenuStore } from '../../store/menuStore'

export default function ARViewerPage() {
  const navigate = useNavigate()
  const { id } = useParams()

  const items = useMenuStore(
    (state) => state.items,
  )

  const item = items.find(
    (food) => food.id === id,
  )

  if (!item) {
    return (
      <main className="flex min-h-screen items-center justify-center bg-[#f8f7f4] p-6">
        <div className="text-center">
          <Box
            size={48}
            className="mx-auto text-neutral-300"
          />

          <h1 className="mt-4 text-2xl font-black">
            Dish not found
          </h1>

          <button
            type="button"
            onClick={() => navigate('/menu')}
            className="mt-5 rounded-2xl bg-orange-500 px-6 py-3 font-bold text-white"
          >
            Return to Menu
          </button>
        </div>
      </main>
    )
  }

  if (!item.glbUrl) {
    return (
      <main className="min-h-screen bg-[#f8f7f4]">
        <Header
          foodName={item.name}
          onBack={() => navigate(-1)}
        />

        <div className="mx-auto max-w-4xl p-4 sm:p-6">
          <div className="flex min-h-[500px] flex-col items-center justify-center rounded-[30px] border border-dashed border-neutral-300 bg-white p-8 text-center">
            <Smartphone
              size={58}
              className="text-neutral-200"
            />

            <h2 className="mt-5 text-2xl font-black">
              AR model not available
            </h2>

            <p className="mt-2 max-w-md text-sm leading-6 text-neutral-500">
              A 3D model must be published for this dish
              before it can be placed in augmented reality.
            </p>

            <button
              type="button"
              onClick={() => navigate(-1)}
              className="mt-6 rounded-2xl bg-orange-500 px-6 py-3 font-bold text-white"
            >
              Back to Dish
            </button>
          </div>
        </div>
      </main>
    )
  }

  return (
    <main className="min-h-screen bg-[#f8f7f4] pb-10">
      <Header
        foodName={item.name}
        onBack={() => navigate(-1)}
      />

      <div className="mx-auto max-w-4xl p-4 sm:p-6">
        <ARViewer
          modelUrl={item.glbUrl}
          foodName={item.name}
        />

        <section className="mt-5 rounded-[24px] bg-white p-5 shadow-sm">
          <h2 className="text-xl font-black">
            Place {item.name} on your table
          </h2>

          <div className="mt-4 space-y-3">
            <Instruction
              number="1"
              text="Open this page on a supported mobile device."
            />

            <Instruction
              number="2"
              text='Tap "Place on Table".'
            />

            <Instruction
              number="3"
              text="Move your phone slowly around the table so the device can detect a surface."
            />

            <Instruction
              number="4"
              text="Place the 3D dish on the detected surface and inspect it from different angles."
            />
          </div>

          <div className="mt-5 flex items-start gap-3 rounded-2xl bg-blue-50 p-4">
            <Info
              size={19}
              className="mt-0.5 shrink-0 text-blue-500"
            />

            <p className="text-xs leading-5 text-blue-700">
              AR availability depends on your phone,
              browser and operating system. If AR is not
              supported, you can still inspect the dish in
              interactive 3D.
            </p>
          </div>
        </section>
      </div>
    </main>
  )
}

function Header({
  foodName,
  onBack,
}: {
  foodName: string
  onBack: () => void
}) {
  return (
    <header className="sticky top-0 z-40 border-b border-neutral-200 bg-white/95 backdrop-blur-xl">
      <div className="mx-auto flex max-w-4xl items-center gap-3 px-4 py-4 sm:px-6">
        <button
          type="button"
          onClick={onBack}
          className="flex h-10 w-10 items-center justify-center rounded-full bg-neutral-100"
        >
          <ArrowLeft size={19} />
        </button>

        <div>
          <p className="text-[10px] font-black uppercase tracking-[0.18em] text-orange-500">
            Augmented Reality
          </p>

          <h1 className="font-black">
            {foodName}
          </h1>
        </div>
      </div>
    </header>
  )
}

function Instruction({
  number,
  text,
}: {
  number: string
  text: string
}) {
  return (
    <div className="flex items-start gap-3">
      <div className="flex h-7 w-7 shrink-0 items-center justify-center rounded-full bg-orange-500 text-xs font-black text-white">
        {number}
      </div>

      <p className="pt-1 text-sm leading-5 text-neutral-600">
        {text}
      </p>
    </div>
  )
}