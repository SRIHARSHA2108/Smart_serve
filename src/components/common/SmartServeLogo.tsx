import { Box, ChefHat } from 'lucide-react'

type SmartServeLogoProps = {
  compact?: boolean
}

export default function SmartServeLogo({
  compact = false,
}: SmartServeLogoProps) {
  return (
    <div className="flex items-center gap-3">
      <div className="relative flex h-11 w-11 items-center justify-center rounded-2xl bg-orange-500 text-white shadow-lg shadow-orange-500/20">
        <ChefHat size={25} strokeWidth={2.2} />

        <div className="absolute -bottom-1 -right-1 flex h-5 w-5 items-center justify-center rounded-md border-2 border-white bg-neutral-900">
          <Box size={11} />
        </div>
      </div>

      {!compact && (
        <div>
          <div className="text-[19px] font-black tracking-tight text-neutral-900">
            SMART <span className="text-orange-500">SERVE</span>
          </div>

          <div className="hidden whitespace-nowrap text-[9px] font-semibold tracking-[0.05em] text-neutral-500 sm:block">
            SEE IT. CHOOSE IT. ENJOY IT.
          </div>
        </div>
      )}
    </div>
  )
}