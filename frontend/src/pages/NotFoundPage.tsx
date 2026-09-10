import { FileSearch } from 'lucide-react'
import { Link } from 'react-router-dom'

import { EmptyState } from '@/components/EmptyState'
import { Button } from '@/components/ui/button'

export function NotFoundPage() {
  return (
    <EmptyState
      icon={FileSearch}
      title="Page not found"
      description="The page you're looking for doesn't exist or has moved."
      action={
        <Button asChild variant="outline">
          <Link to="/dashboard">Back to dashboard</Link>
        </Button>
      }
      className="min-h-[420px]"
    />
  )
}
