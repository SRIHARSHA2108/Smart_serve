import { useEffect, useState } from 'react'
import {
  ArrowLeft,
  Box,
  CheckCircle2,
  ImagePlus,
  LoaderCircle,
  RotateCw,
  Save,
  Sparkles,
  Trash2,
} from 'lucide-react'
import { useNavigate } from 'react-router-dom'
import { useMenuStore } from '../../store/menuStore'
import { useModelStore } from '../../store/modelStore'
import {
  generate3DModel,
  type ModelGenerationResult,
} from '../../services/modelGenerationService'

const generationStages = [
  'Analyzing food image...',
  'Creating 3D geometry...',
  'Applying texture...',
  'Optimizing model...',
  'Preparing GLB...',
]

export default function ModelStudioPage() {
  const navigate = useNavigate()

  const menuItems = useMenuStore(
    (state) => state.items,
  )

  const models = useModelStore(
    (state) => state.models,
  )

  const saveModel = useModelStore(
    (state) => state.saveModel,
  )

  const deleteModel = useModelStore(
    (state) => state.deleteModel,
  )

  const [foodId, setFoodId] = useState(
    menuItems[0]?.id ?? '',
  )

  const [imageFile, setImageFile] =
    useState<File | null>(null)

  const [previewUrl, setPreviewUrl] =
    useState('')

  const [generating, setGenerating] =
    useState(false)

  const [stageIndex, setStageIndex] =
    useState(0)

  const [result, setResult] =
    useState<ModelGenerationResult | null>(
      null,
    )

  const [saved, setSaved] = useState(false)

  const selectedFood = menuItems.find(
    (item) => item.id === foodId,
  )

  useEffect(() => {
    return () => {
      if (previewUrl.startsWith('blob:')) {
        URL.revokeObjectURL(previewUrl)
      }
    }
  }, [previewUrl])

  const handleImage = (
    file: File | undefined,
  ) => {
    if (!file) return

    if (!file.type.startsWith('image/')) {
      alert('Please select an image file.')
      return
    }

    if (previewUrl.startsWith('blob:')) {
      URL.revokeObjectURL(previewUrl)
    }

    setImageFile(file)
    setPreviewUrl(URL.createObjectURL(file))
    setResult(null)
    setSaved(false)
    setStageIndex(0)
  }

  const handleGenerate = async () => {
    if (!imageFile || !selectedFood) {
      alert(
        'Select a dish and upload a food image first.',
      )
      return
    }

    setGenerating(true)
    setResult(null)
    setSaved(false)
    setStageIndex(0)

    const timer = window.setInterval(() => {
      setStageIndex((current) =>
        Math.min(
          current + 1,
          generationStages.length - 1,
        ),
      )
    }, 900)

    try {
      const generated =
        await generate3DModel(
          imageFile,
          selectedFood.id,
        )

      setResult(generated)
    } catch (error) {
      alert(
        error instanceof Error
          ? error.message
          : 'Unable to generate model.',
      )
    } finally {
      window.clearInterval(timer)
      setGenerating(false)
    }
  }

  const handleSave = () => {
    if (!result || !selectedFood) return

    saveModel({
      foodId: selectedFood.id,
      foodName: selectedFood.name,
      modelUrl: result.modelUrl,
      thumbnailUrl: previewUrl,
      fileSize: result.fileSize,
      status: 'READY',
      createdAt: result.createdAt,
    })

    setSaved(true)
  }

  return (
    <main className="min-h-screen bg-[#f5f5f3]">
      <header className="sticky top-0 z-30 border-b border-neutral-200 bg-white/95 backdrop-blur-xl">
        <div className="mx-auto flex max-w-7xl items-center gap-3 px-4 py-4 sm:px-6">
          <button
            type="button"
            onClick={() =>
              navigate('/manager')
            }
            className="flex h-10 w-10 items-center justify-center rounded-xl bg-neutral-100"
          >
            <ArrowLeft size={19} />
          </button>

          <div>
            <p className="text-xs font-bold uppercase tracking-wider text-orange-500">
              Manager
            </p>

            <h1 className="text-xl font-black">
              3D Model Studio
            </h1>
          </div>
        </div>
      </header>

      <div className="mx-auto max-w-7xl p-4 sm:p-6 lg:p-8">
        <div className="grid gap-6 lg:grid-cols-[1.1fr_0.9fr]">

          {/* CREATOR */}

          <section className="rounded-[28px] border border-neutral-200 bg-white p-5 shadow-sm sm:p-6">
            <div className="flex items-center gap-3">
              <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-orange-50 text-orange-500">
                <Sparkles size={22} />
              </div>

              <div>
                <h2 className="text-lg font-black">
                  Generate Food Model
                </h2>

                <p className="text-xs text-neutral-400">
                  Image → optimized GLB
                </p>
              </div>
            </div>

            <div className="mt-6">
              <label className="text-sm font-bold">
                Menu Item
              </label>

              <select
                value={foodId}
                onChange={(event) => {
                  setFoodId(event.target.value)
                  setResult(null)
                  setSaved(false)
                }}
                className="mt-2 h-12 w-full rounded-xl border border-neutral-200 bg-white px-3 outline-none focus:border-orange-400"
              >
                {menuItems.map((item) => (
                  <option
                    key={item.id}
                    value={item.id}
                  >
                    {item.name}
                  </option>
                ))}
              </select>
            </div>

            <div className="mt-5">
              <label className="text-sm font-bold">
                Food Image
              </label>

              <label className="mt-2 flex min-h-56 cursor-pointer flex-col items-center justify-center overflow-hidden rounded-[22px] border-2 border-dashed border-neutral-200 bg-neutral-50 transition hover:border-orange-300">
                {previewUrl ? (
                  <img
                    src={previewUrl}
                    alt="Food upload preview"
                    className="h-64 w-full object-cover"
                  />
                ) : (
                  <>
                    <ImagePlus
                      size={38}
                      className="text-neutral-300"
                    />

                    <p className="mt-3 text-sm font-bold">
                      Upload food image
                    </p>

                    <p className="mt-1 text-xs text-neutral-400">
                      JPG, PNG or WEBP
                    </p>
                  </>
                )}

                <input
                  type="file"
                  accept="image/*"
                  className="hidden"
                  onChange={(event) =>
                    handleImage(
                      event.target.files?.[0],
                    )
                  }
                />
              </label>
            </div>

            <button
              type="button"
              disabled={
                !imageFile ||
                !selectedFood ||
                generating
              }
              onClick={handleGenerate}
              className="mt-5 flex h-14 w-full items-center justify-center gap-2 rounded-2xl bg-orange-500 font-black text-white disabled:cursor-not-allowed disabled:opacity-40"
            >
              {generating ? (
                <>
                  <LoaderCircle
                    size={19}
                    className="animate-spin"
                  />
                  Generating...
                </>
              ) : (
                <>
                  <Sparkles size={19} />
                  Generate 3D Model
                </>
              )}
            </button>

            {generating && (
              <div className="mt-5 rounded-2xl bg-neutral-50 p-5">
                <p className="text-xs font-bold uppercase tracking-wider text-neutral-400">
                  Processing
                </p>

                <div className="mt-4 space-y-3">
                  {generationStages.map(
                    (stage, index) => (
                      <div
                        key={stage}
                        className="flex items-center gap-3"
                      >
                        <div
                          className={`flex h-7 w-7 items-center justify-center rounded-full ${
                            index < stageIndex
                              ? 'bg-green-500 text-white'
                              : index ===
                                  stageIndex
                                ? 'bg-orange-500 text-white'
                                : 'bg-neutral-200 text-neutral-400'
                          }`}
                        >
                          {index < stageIndex ? (
                            <CheckCircle2
                              size={15}
                            />
                          ) : index ===
                            stageIndex ? (
                            <LoaderCircle
                              size={14}
                              className="animate-spin"
                            />
                          ) : (
                            <span className="text-[10px] font-black">
                              {index + 1}
                            </span>
                          )}
                        </div>

                        <span
                          className={`text-sm ${
                            index <= stageIndex
                              ? 'font-bold text-neutral-800'
                              : 'text-neutral-400'
                          }`}
                        >
                          {stage}
                        </span>
                      </div>
                    ),
                  )}
                </div>
              </div>
            )}
          </section>

          {/* RESULT */}

          <section className="rounded-[28px] border border-neutral-200 bg-white p-5 shadow-sm sm:p-6">
            <div className="flex items-center gap-3">
              <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-neutral-900 text-white">
                <Box size={22} />
              </div>

              <div>
                <h2 className="text-lg font-black">
                  3D Preview
                </h2>

                <p className="text-xs text-neutral-400">
                  Generated model output
                </p>
              </div>
            </div>

            {!result ? (
              <div className="mt-6 flex min-h-[360px] flex-col items-center justify-center rounded-[24px] border border-dashed border-neutral-200 bg-neutral-50 text-center">
                <Box
                  size={50}
                  className="text-neutral-200"
                />

                <p className="mt-4 font-black text-neutral-400">
                  No model generated
                </p>

                <p className="mt-1 max-w-xs text-xs leading-5 text-neutral-400">
                  Select a menu item and upload
                  a food image to start.
                </p>
              </div>
            ) : (
              <>
                <div className="mt-6 overflow-hidden rounded-[24px] bg-neutral-900">
                  <div className="relative aspect-square">
                    <img
                      src={previewUrl}
                      alt={
                        selectedFood?.name ??
                        'Food'
                      }
                      className="h-full w-full object-cover opacity-80"
                    />

                    <div className="absolute inset-0 flex items-center justify-center bg-black/25">
                      <div className="text-center text-white">
                        <Box
                          size={52}
                          className="mx-auto"
                        />

                        <p className="mt-3 font-black">
                          GLB Ready
                        </p>

                        <p className="mt-1 text-xs text-white/70">
                          Real 3D preview connects
                          in the next milestone.
                        </p>
                      </div>
                    </div>
                  </div>
                </div>

                <div className="mt-5 rounded-2xl bg-neutral-50 p-4">
                  <p className="text-xs font-bold uppercase text-neutral-400">
                    Output
                  </p>

                  <p className="mt-2 break-all text-sm font-bold">
                    {result.modelUrl}
                  </p>

                  <p className="mt-1 text-xs text-neutral-400">
                    GLB · Web / Mobile / AR
                  </p>
                </div>

                <div className="mt-4 grid grid-cols-2 gap-2">
                  <button
                    type="button"
                    className="flex h-12 items-center justify-center gap-2 rounded-xl border border-neutral-200 font-bold"
                  >
                    <RotateCw size={17} />
                    Preview 3D
                  </button>

                  <button
                    type="button"
                    disabled={saved}
                    onClick={handleSave}
                    className="flex h-12 items-center justify-center gap-2 rounded-xl bg-neutral-900 font-bold text-white disabled:bg-green-600"
                  >
                    {saved ? (
                      <>
                        <CheckCircle2 size={17} />
                        Saved
                      </>
                    ) : (
                      <>
                        <Save size={17} />
                        Save Model
                      </>
                    )}
                  </button>
                </div>
              </>
            )}
          </section>
        </div>

        {/* SAVED MODELS */}

        <section className="mt-7">
          <div>
            <h2 className="text-xl font-black">
              Saved Models
            </h2>

            <p className="mt-1 text-xs text-neutral-400">
              Restaurant 3D asset library
            </p>
          </div>

          {models.length === 0 ? (
            <div className="mt-4 rounded-[26px] border border-dashed border-neutral-300 bg-white py-14 text-center">
              <Box
                size={36}
                className="mx-auto text-neutral-200"
              />

              <p className="mt-3 text-sm font-bold text-neutral-400">
                No models saved yet.
              </p>
            </div>
          ) : (
            <div className="mt-4 grid gap-4 sm:grid-cols-2 xl:grid-cols-3">
              {models.map((model) => (
                <article
                  key={model.id}
                  className="overflow-hidden rounded-[24px] border border-neutral-200 bg-white shadow-sm"
                >
                  <img
                    src={model.thumbnailUrl}
                    alt={model.foodName}
                    className="aspect-video w-full object-cover"
                  />

                  <div className="p-4">
                    <div className="flex items-start justify-between gap-3">
                      <div>
                        <h3 className="font-black">
                          {model.foodName}
                        </h3>

                        <p className="mt-1 text-[11px] text-neutral-400">
                          GLB · READY
                        </p>
                      </div>

                      <button
                        type="button"
                        onClick={() =>
                          deleteModel(model.id)
                        }
                        className="flex h-9 w-9 items-center justify-center rounded-xl bg-red-50 text-red-500"
                      >
                        <Trash2 size={16} />
                      </button>
                    </div>

                    <p className="mt-3 truncate text-xs text-neutral-400">
                      {model.modelUrl}
                    </p>
                  </div>
                </article>
              ))}
            </div>
          )}
        </section>
      </div>
    </main>
  )
}