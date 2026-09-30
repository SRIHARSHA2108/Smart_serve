import { useEffect, useState } from 'react'
import { Clock3 } from 'lucide-react'

function formatElapsedTime(totalSeconds: number) {
  const minutes = Math.floor(totalSeconds / 60)
  const seconds = totalSeconds % 60

  return `${minutes}:${seconds.toString().padStart(2, '0')}`
}

export default function OrderTimer({
  createdAt,
  completed,
  dark = false,
}: {
  createdAt: string
  completed: boolean
  dark?: boolean
}) {
  const [elapsedSeconds, setElapsedSeconds] = useState(() =>
    Math.max(
      0,
      Math.floor(
        (Date.now() - new Date(createdAt).getTime()) / 1000,
      ),
    ),
  )

  useEffect(() => {
    const updateElapsed = () => {
      setElapsedSeconds(
        Math.max(
          0,
          Math.floor(
            (Date.now() - new Date(createdAt).getTime()) / 1000,
          ),
        ),
      )
    }

    updateElapsed()

    if (completed) return undefined

    const interval = window.setInterval(updateElapsed, 1000)

    return () => window.clearInterval(interval)
  }, [createdAt, completed])

  return (
    <div
      className={`flex items-center gap-2 rounded-2xl px-4 py-3 ${
        dark
          ? 'bg-white/10 text-white'
          : completed
            ? 'bg-green-50 text-green-700'
            : 'bg-orange-50 text-orange-700'
      }`}
    >
      <Clock3 size={18} />

      <div>
        <p className="text-[10px] font-bold uppercase tracking-[0.14em] opacity-70">
          {completed ? 'Service time' : 'Order timer'}
        </p>

        <p className="font-black tabular-nums">
          {formatElapsedTime(elapsedSeconds)}
        </p>
      </div>

      {!completed && (
        <span className="ml-auto h-2 w-2 animate-pulse rounded-full bg-orange-500" />
      )}
    </div>
  )
}
