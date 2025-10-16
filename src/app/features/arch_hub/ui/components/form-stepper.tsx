import React from 'react'
import { Badge } from '@/components/ui/badge'
import { Check } from 'lucide-react'
import { cn } from '@/lib/utils'

interface FormStep {
  id: string
  title: string
  description?: string
  completed?: boolean
  current?: boolean
}

interface FormStepperProps {
  steps: FormStep[]
  currentStep: number
  onStepChange: (step: number) => void
  className?: string
}

export function FormStepper({
  steps,
  currentStep,
  onStepChange,
  className
}: FormStepperProps) {
  return (
    <div className={cn("space-y-4", className)}>
      {/* Step Progress */}
      <div className="flex items-center justify-between">
        <div className="flex items-center space-x-2">
          {steps.map((step, index) => (
            <div key={step.id} className="flex items-center">
              <button
                onClick={() => onStepChange(index)}
                className={cn(
                  "flex items-center justify-center w-8 h-8 rounded-full border-2 transition-colors",
                  step.completed
                    ? "bg-emerald-600 border-emerald-600 text-white"
                    : step.current
                    ? "bg-primary border-primary text-primary-foreground"
                    : "bg-background border-border text-muted-foreground hover:border-primary/50"
                )}
              >
                {step.completed ? (
                  <Check className="h-4 w-4" />
                ) : (
                  <span className="text-xs font-medium">{index + 1}</span>
                )}
              </button>
              <div className="ml-2">
                <p className={cn(
                  "text-xs font-medium",
                  step.current ? "text-primary" : step.completed ? "text-emerald-600" : "text-muted-foreground"
                )}>
                  {step.title}
                </p>
                {step.description && (
                  <p className="text-xs text-muted-foreground">{step.description}</p>
                )}
              </div>
              {index < steps.length - 1 && (
                <div className={cn(
                  "w-6 h-px mx-2",
                  step.completed ? "bg-emerald-600" : "bg-border"
                )} />
              )}
            </div>
          ))}
        </div>
        
        <Badge variant="outline" className="text-xs">
          Step {currentStep + 1} of {steps.length}
        </Badge>
      </div>
    </div>
  )
}
