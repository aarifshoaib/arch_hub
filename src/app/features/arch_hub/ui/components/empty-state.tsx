import { Button } from '@/components/ui/button'
import type { LucideIcon } from 'lucide-react'

interface EmptyStateProps {
  icon: LucideIcon
  title: string
  description: string
  actionLabel?: string
  onAction?: () => void
}

export function EmptyState({
  icon: Icon,
  title,
  description,
  actionLabel,
  onAction
}: EmptyStateProps) {
  return (
    <div className="flex flex-col items-center justify-center py-16 px-4 animate-in fade-in duration-500">
      <div className="rounded-full bg-muted p-6 mb-6 hover:scale-110 transition-transform duration-300">
        <Icon className="h-12 w-12 text-muted-foreground animate-in zoom-in duration-700" />
      </div>
      <h3 className="text-xl font-semibold text-foreground mb-2 animate-in slide-in-from-bottom-3 duration-500 delay-100">{title}</h3>
      <p className="text-muted-foreground text-center max-w-md mb-6 animate-in slide-in-from-bottom-3 duration-500 delay-200">
        {description}
      </p>
      {actionLabel && onAction && (
        <Button onClick={onAction} size="lg" className="animate-in slide-in-from-bottom-3 duration-500 delay-300 hover:scale-105 transition-transform">
          {actionLabel}
        </Button>
      )}
    </div>
  )
}
