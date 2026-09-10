import { AnimatePresence } from 'framer-motion'
import { Menu } from 'lucide-react'
import { Suspense, useEffect, useState } from 'react'
import { useLocation, useOutlet } from 'react-router-dom'

import { CommandPalette } from '@/components/CommandPalette'
import { Logo } from '@/components/Logo'
import { PageFallback } from '@/components/PageFallback'
import { PageTransition } from '@/components/PageTransition'
import { Sidebar } from '@/components/Sidebar'
import { Button } from '@/components/ui/button'
import { Sheet, SheetContent, SheetTitle, SheetTrigger } from '@/components/ui/sheet'

export function Layout() {
  const [mobileOpen, setMobileOpen] = useState(false)
  const [paletteOpen, setPaletteOpen] = useState(false)
  const location = useLocation()
  const outlet = useOutlet()

  useEffect(() => {
    const onKeyDown = (e: KeyboardEvent) => {
      if ((e.metaKey || e.ctrlKey) && e.key.toLowerCase() === 'k') {
        e.preventDefault()
        setPaletteOpen((open) => !open)
      }
    }
    window.addEventListener('keydown', onKeyDown)
    return () => window.removeEventListener('keydown', onKeyDown)
  }, [])

  return (
    <div className="min-h-screen bg-background">
      <aside className="fixed inset-y-0 left-0 z-30 hidden w-[260px] border-r bg-card lg:block">
        <Sidebar onOpenCommandPalette={() => setPaletteOpen(true)} />
      </aside>

      <div className="lg:pl-[260px]">
        <header className="sticky top-0 z-20 flex h-14 items-center gap-2 border-b bg-background px-3 lg:hidden">
          <Sheet open={mobileOpen} onOpenChange={setMobileOpen}>
            <SheetTrigger asChild>
              <Button type="button" variant="ghost" size="icon" aria-label="Open navigation">
                <Menu aria-hidden="true" />
              </Button>
            </SheetTrigger>
            <SheetContent side="left" className="w-[280px] p-0">
              <SheetTitle className="sr-only">Navigation</SheetTitle>
              <Sidebar
                onNavigate={() => setMobileOpen(false)}
                onOpenCommandPalette={() => {
                  setMobileOpen(false)
                  setPaletteOpen(true)
                }}
              />
            </SheetContent>
          </Sheet>
          <Logo />
        </header>

        <main className="mx-auto w-full max-w-6xl px-4 py-6 sm:px-8 sm:py-8">
          <AnimatePresence mode="wait" initial={false}>
            <PageTransition key={location.pathname}>
              <Suspense fallback={<PageFallback />}>{outlet}</Suspense>
            </PageTransition>
          </AnimatePresence>
        </main>
      </div>

      <CommandPalette open={paletteOpen} onOpenChange={setPaletteOpen} />
    </div>
  )
}
