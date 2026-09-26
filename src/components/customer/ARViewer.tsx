import {
  Box,
  Maximize2,
  RotateCcw,
  ScanLine,
} from 'lucide-react'
import { useRef } from 'react'

type ARViewerProps = {
  modelUrl: string
  foodName: string
}

export default function ARViewer({
  modelUrl,
  foodName,
}: ARViewerProps) {
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

    if (viewer?.requestFullscreen) {
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
          ar
          ar-modes="webxr scene-viewer quick-look"
          camera-controls
          auto-rotate
          shadow-intensity="1"
          exposure="1"
          interaction-prompt="auto"
          touch-action="pan-y"
          ar-scale="auto"
          style={{
            width: '100%',
            height: '100%',
            background:
              'radial-gradient(circle, #3a3a3a 0%, #171717 70%)',
          }}
        >
          <button
            slot="ar-button"
            className="absolute bottom-4 left-1/2 flex -translate-x-1/2 items-center gap-2 whitespace-nowrap rounded-2xl bg-orange-500 px-5 py-3 text-sm font-black text-white shadow-xl"
          >
            <ScanLine size={18} />
            Place on Table
          </button>
        </model-viewer>

        <div className="pointer-events-none absolute left-4 top-4 rounded-full bg-black/60 px-3 py-1.5 text-xs font-bold text-white backdrop-blur">
          AR Food View
        </div>
      </div>

      <div className="grid grid-cols-2 gap-2 border-t border-white/10 bg-neutral-900 p-3">
        <button
          type="button"
          onClick={resetCamera}
          className="flex h-11 items-center justify-center gap-2 rounded-xl bg-white/10 text-sm font-bold text-white"
        >
          <RotateCcw size={17} />
          Reset
        </button>

        <button
          type="button"
          onClick={fullscreen}
          className="flex h-11 items-center justify-center gap-2 rounded-xl bg-white/10 text-sm font-bold text-white"
        >
          <Maximize2 size={17} />
          Fullscreen
        </button>
      </div>

      <div className="flex items-center gap-2 bg-neutral-900 px-4 pb-4 text-xs text-neutral-400">
        <Box size={14} />
        Rotate and zoom in 3D, or use Place on Table on an AR-supported phone.
      </div>
    </div>
  )
}