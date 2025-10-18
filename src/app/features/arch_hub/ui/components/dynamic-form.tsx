import { useState, useEffect } from 'react'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { FormField } from './form-field'
import { FormStepper } from './form-stepper'
import { FormNavigation } from './form-navigation'
import { BaseTypesService } from '../../services/base-types-service'
import { fieldValidationSchemas } from '../../validation/application-schema'
import formMetadataJson from '../../data/form_metadata.json'
import type { FormMetadata, SelectField } from '../../types/form-metadata'
import {
  CheckCircle
} from 'lucide-react'

const formMetadata = formMetadataJson as FormMetadata

interface DynamicFormProps {
  onSubmit: (data: any) => void
  initialData?: any
}

export function DynamicForm({ onSubmit, initialData = {} }: DynamicFormProps) {
  const [formData, setFormData] = useState<any>(initialData)
  const [errors, setErrors] = useState<Record<string, string>>({})
  const [currentStep, setCurrentStep] = useState(0)
  const [_isSubmitting, setIsSubmitting] = useState(false)
  const [completedSteps, setCompletedSteps] = useState<Set<number>>(new Set())

  // Initialize stepper steps
  useEffect(() => {
    // Mark first step as current
    setCurrentStep(0)
  }, [])

  const steps = formMetadata.sections.map((section, index) => ({
    id: section.id,
    title: section.title,
    description: section.description || '',
    completed: completedSteps.has(index),
    current: currentStep === index
  }))

  const handleFieldChange = (fieldName: string, value: any) => {
    setFormData((prev: any) => {
      const newData = {
        ...prev,
        [fieldName]: value
      }

      // Clear dependent fields when parent field changes
      const currentSection = formMetadata.sections[currentStep]
      const dependentFields = currentSection.fields.filter(field => {
        const selectField = field as SelectField
        return selectField.dataFilter?.dependsOn === fieldName
      })

      dependentFields.forEach(dependentField => {
        newData[dependentField.field] = ''
      })

      return newData
    })

    // Clear error when user starts typing
    if (errors[fieldName]) {
      setErrors(prev => ({
        ...prev,
        [fieldName]: ''
      }))
    }
  }

  const handleStepChange = (step: number) => {
    if (step >= 0 && step < formMetadata.sections.length) {
      setCurrentStep(step)
    }
  }

  const handleNext = () => {
    if (currentStep < formMetadata.sections.length - 1) {
      // Validate current step
      const currentSection = formMetadata.sections[currentStep]
      const currentErrors = validateStep(currentSection)
      
      if (Object.keys(currentErrors).length === 0) {
        setCompletedSteps(prev => new Set([...prev, currentStep]))
        setCurrentStep(prev => prev + 1)
      } else {
        setErrors(currentErrors)
      }
    } else {
      // Last step - submit form
      handleSubmit()
    }
  }

  const handlePrevious = () => {
    if (currentStep > 0) {
      setCurrentStep(prev => prev - 1)
    }
  }

  const handleSaveDraft = () => {
    // Save current form data as draft
    localStorage.setItem('catalogue-draft', JSON.stringify(formData))
    // You could also show a toast notification here
  }

  const validateStep = (section: any): Record<string, string> => {
    const stepErrors: Record<string, string> = {}
    
    section.fields.forEach((field: any) => {
      const value = formData[field.field]
      const error = validateField(field, value)
      if (error) {
        stepErrors[field.field] = error
      }
    })
    
    return stepErrors
  }

  const validateField = (field: any, value: any): string | null => {
    const validation = field.validation
    if (!validation) return null

    const isRequired = validation.required
    const minLength = validation.minLength
    const maxLength = validation.maxLength
    const pattern = validation.pattern

    switch (field.type) {
      case 'textbox':
        if (isRequired) {
          return fieldValidationSchemas.textbox.required(value, minLength, maxLength, pattern)
        } else {
          return fieldValidationSchemas.textbox.optional(value, maxLength, pattern)
        }

      case 'select':
        if (isRequired) {
          return fieldValidationSchemas.select.required(value)
        } else {
          return fieldValidationSchemas.select.optional(value)
        }

      case 'checkbox':
        if (isRequired) {
          return fieldValidationSchemas.checkbox.required(value)
        } else {
          return fieldValidationSchemas.checkbox.optional(value)
        }

      case 'datetime':
        if (isRequired) {
          return fieldValidationSchemas.datetime.required(value)
        } else {
          return fieldValidationSchemas.datetime.optional(value)
        }

      default:
        return null
    }
  }

  const validateForm = (): boolean => {
    const newErrors: Record<string, string> = {}

    formMetadata.sections.forEach(section => {
      section.fields.forEach(field => {
        const fieldName = field.field
        const value = formData[fieldName]
        const error = validateField(field, value)

        if (error) {
          newErrors[fieldName] = error
        }
      })
    })

    setErrors(newErrors)
    return Object.keys(newErrors).length === 0
  }

  const handleSubmit = async (e?: React.FormEvent) => {
    e?.preventDefault()

    if (!validateForm()) {
      return
    }

    setIsSubmitting(true)
    try {
      await onSubmit(formData)
    } catch (error) {
      console.error('Form submission error:', error)
    } finally {
      setIsSubmitting(false)
    }
  }

  const getFieldOptions = (field: any): Array<{ value: string; label: string }> => {
    if (field.data) {
      return field.data
    }

    if (field.dataSource === 'base_types' && field.dataFilter) {
      // Handle dependent dropdowns
      if (field.dataFilter.dependsOn) {
        const dependentFieldValue = getFieldValue({ field: field.dataFilter.dependsOn })
        if (!dependentFieldValue) {
          return []
        }
        return BaseTypesService.getSelectOptionsByParent(
          field.dataFilter.base_type,
          field.dataFilter.dependsOn,
          dependentFieldValue
        )
      }
      
      return BaseTypesService.getSelectOptions(field.dataFilter.base_type)
    }

    return []
  }

  const getFieldValue = (field: any) => {
    const fieldName = field.field
    return formData[fieldName] || field.defaultValue || ''
  }

  const getSectionIcon = (iconClass: string) => {
    // Map icon classes to Lucide icons
    const iconMap: Record<string, React.ComponentType<any>> = {
      'ti ti-info-circle': CheckCircle,
      'ti ti-building': CheckCircle,
      'ti ti-building-store': CheckCircle,
      'ti ti-timeline': CheckCircle,
      'ti ti-world': CheckCircle,
      'ti ti-plug': CheckCircle,
      'ti ti-settings': CheckCircle
    }
    
    const IconComponent = iconMap[iconClass] || CheckCircle
    return <IconComponent className="h-4 w-4" />
  }

  return (
    <div className="w-full max-w-none">
      {/* Stepper */}
      <FormStepper
        steps={steps}
        currentStep={currentStep}
        onStepChange={handleStepChange}
        className="mb-4"
      />

      {/* Current Step Content */}
      <Card className="bg-card border-border">
        <CardHeader>
          <CardTitle className="flex items-center space-x-3">
            {getSectionIcon(formMetadata.sections[currentStep].icon)}
            <span>{formMetadata.sections[currentStep].title}</span>
            {formMetadata.sections[currentStep].description && (
              <span className="text-sm text-muted-foreground font-normal">
                - {formMetadata.sections[currentStep].description}
              </span>
            )}
          </CardTitle>
        </CardHeader>

        <CardContent>
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {formMetadata.sections[currentStep].fields
              .sort((a, b) => (a.sequence || 0) - (b.sequence || 0))
              .map((field) => (
                <div 
                  key={field.field} 
                  className={field.columnSize === 12 ? 'lg:col-span-2' : 'lg:col-span-1'}
                >
                  <FormField
                    field={field}
                    value={getFieldValue(field)}
                    onChange={(value) => handleFieldChange(field.field, value)}
                    error={errors[field.field]}
                    options={getFieldOptions(field)}
                  />
                </div>
              ))}
          </div>
        </CardContent>
      </Card>

      {/* Navigation Controls */}
      <FormNavigation
        onNext={handleNext}
        onPrevious={handlePrevious}
        onSaveDraft={handleSaveDraft}
        canGoNext={currentStep < formMetadata.sections.length - 1 || Object.keys(errors).length === 0}
        canGoPrevious={currentStep > 0}
        isLastStep={currentStep === formMetadata.sections.length - 1}
        className="mt-6"
      />
    </div>
  )
}
