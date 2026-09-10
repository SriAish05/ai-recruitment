import { animate, motion, useMotionValue, useReducedMotion, useTransform } from 'framer-motion'
import { useEffect } from 'react'

import { cn } from '@/lib/utils'

interface ScoreRingProps {
  /** Integer 0–100 */
  value: number
  size?: number
  strokeWidth?: number
  className?: string
}

export function ScoreRing({ value, size = 168, strokeWidth = 10, className }: ScoreRingProps) {
  const reducedMotion = useReducedMotion()
  const radius = (size - strokeWidth) / 2
  const circumference = 2 * Math.PI * radius

  const progress = useMotionValue(0)
  const dashOffset = useTransform(progress, (p) => circumference * (1 - p / 100))
  const rounded = useTransform(progress, (p) => Math.round(p))

  useEffect(() => {
    if (reducedMotion) {
      progress.set(value)
      return
    }
    const controls = animate(progress, value, { duration: 0.8, ease: 'easeOut' })
    return () => controls.stop()
  }, [value, progress, reducedMotion])

  return (
    <div
      className={cn('relative', className)}
      style={{ width: size, height: size }}
      role="img"
      aria-label={`Match score ${value} out of 100`}
    >
      <svg width={size} height={size} viewBox={`0 0 ${size} ${size}`} className="-rotate-90">
        <circle
          cx={size / 2}
          cy={size / 2}
          r={radius}
          fill="none"
          strokeWidth={strokeWidth}
          className="stroke-neutral-200 dark:stroke-neutral-800"
        />
        <motion.circle
          cx={size / 2}
          cy={size / 2}
          r={radius}
          fill="none"
          strokeWidth={strokeWidth}
          strokeLinecap="round"
          strokeDasharray={circumference}
          style={{ strokeDashoffset: dashOffset }}
          className="stroke-blue-600 dark:stroke-blue-500"
        />
      </svg>
      <div className="absolute inset-0 flex flex-col items-center justify-center">
        <motion.span className="text-4xl font-semibold tabular-nums tracking-tight">
          {rounded}
        </motion.span>
        <span className="mt-0.5 text-xs text-muted-foreground">Match score</span>
      </div>
    </div>
  )
}
