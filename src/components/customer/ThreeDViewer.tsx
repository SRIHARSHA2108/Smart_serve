import { Box, Maximize2, RotateCcw } from 'lucide-react'
import { useRef } from 'react'

type ThreeDViewerProps = {
  modelUrl: string
  foodName: string
}

export default function ThreeDViewer({
  modelUrl,
  foodName,
}: ThreeDViewerProps) {
  const viewerRef = useRef<HTMLElement | null>(null)

  const resetCamera = () => {
    const viewer = viewerRef.current as
      | (HTMLElement & {
          cameraOrbit?: string
          cameraTarget?: string
          fieldOfView?: string
        })
      | null

    if (!viewer) return

    viewer.cameraOrbit = '0deg 75deg 105%'
    viewer.cameraTarget = 'auto auto auto'
    viewer.fieldOfView = 'auto'
  }

  const fullscreen = async () => {
    const viewer = viewerRef.current

    if (!viewer) return

    if (viewer.requestFullscreen) {
      await viewer.requestFullscreen()
    }
  }

  return (
    <div className="overflow-hidden rounded-[28px] bg-neutral-950 shadow-2xl">
      <div className="relative aspect-square sm:aspect-[4/3]">
        <model-viewer
          ref={viewerRef}
          src={modelUrl}
          alt={`3D model of ${foodName}`}
          camera-controls
          auto-rotate
          shadow-intensity="1"
          exposure="1"
          interaction-prompt="auto"
          touch-action="pan-y"
          style={{
            width: '100%',
            height: '100%',
            background:
              'radial-gradient(circle, #3a3a3a 0%, #171717 70%)',
          }}
        />

        <div className="pointer-events-none absolute left-4 top-4 rounded-full bg-black/60 px-3 py-1.5 text-xs font-bold text-white backdrop-blur">
          3D Food View
        </div>
      </div>

      <div className="grid grid-cols-2 gap-2 border-t border-white/10 bg-neutral-900 p-3">
        <button
          type="button"
          onClick={resetCamera}
          className="flex h-11 items-center justify-center gap-2 rounded-xl bg-white/10 text-sm font-bold text-white hover:bg-white/15"
        >
          <RotateCcw size={17} />
          Reset
        </button>

        <button
          type="button"
          onClick={fullscreen}
          className="flex h-11 items-center justify-center gap-2 rounded-xl bg-white/10 text-sm font-bold text-white hover:bg-white/15"
        >
          <Maximize2 size={17} />
          Fullscreen
        </button>
      </div>

      <div className="flex items-center gap-2 bg-neutral-900 px-4 pb-4 text-xs text-neutral-400">
        <Box size={14} />
        Drag to rotate · Pinch/scroll to zoom
      </div>
    </div>
  )
}