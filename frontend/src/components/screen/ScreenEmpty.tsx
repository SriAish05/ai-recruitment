function ResultIllustration() {
  return (
    <svg
      viewBox="0 0 160 96"
      className="h-24 w-40 text-neutral-300 dark:text-neutral-700"
      fill="none"
      stroke="currentColor"
      strokeWidth={1.5}
      aria-hidden="true"
    >
      <rect x="1" y="1" width="158" height="94" rx="8" />
      <circle cx="40" cy="48" r="20" />
      <path d="M40 28a20 20 0 0 1 17.3 30" className="text-neutral-400 dark:text-neutral-600" stroke="currentColor" />
      <rect x="76" y="34" width="36" height="10" rx="5" />
      <line x1="76" y1="56" x2="140" y2="56" strokeLinecap="round" />
      <line x1="76" y1="66" x2="128" y2="66" strokeLinecap="round" />
    </svg>
  )
}

export function ScreenEmpty() {
  return (
    <div className="flex h-full min-h-[420px] flex-col items-center justify-center rounded-lg border border-dashed px-6 py-16 text-center">
      <ResultIllustration />
      <h2 className="mt-6 text-sm font-medium">Upload a resume to see AI screening results</h2>
      <p className="mt-1 max-w-xs text-sm text-muted-foreground">
        The match score, recommendation and rationale will appear here.
      </p>
    </div>
  )
}
