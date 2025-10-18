import { Button } from '@/components/ui/button'
import { ChevronLeft, ChevronRight } from 'lucide-react'

interface FormNavigationProps {
  onNext: () => void
  onPrevious: () => void
  onSaveDraft: () => void
  canGoNext: boolean
  canGoPrevious: boolean
  isLastStep: boolean
  className?: string
}

export function FormNavigation({
  onNext,
  onPrevious,
  onSaveDraft,
  canGoNext,
  canGoPrevious,
  isLastStep,
  className
}: FormNavigationProps) {
  return (
    <div className={`flex items-center justify-between pt-6 border-t border-border ${className}`}>
      <div className="flex items-center space-x-3">
        <Button
          variant="outline"
          onClick={onPrevious}
          disabled={!canGoPrevious}
          className="flex items-center space-x-2"
        >
          <ChevronLeft className="h-4 w-4" />
          <span>Previous</span>
        </Button>
        
        <Button
          variant="outline"
          onClick={onSaveDraft}
          className="flex items-center space-x-2"
        >
          <span>Save Draft</span>
        </Button>
      </div>

      <div className="flex items-center space-x-3">
        <Button
          onClick={onNext}
          disabled={!canGoNext}
          className="flex items-center space-x-2"
        >
          <span>{isLastStep ? 'Submit' : 'Next'}</span>
          <ChevronRight className="h-4 w-4" />
        </Button>
      </div>
    </div>
  )
}
