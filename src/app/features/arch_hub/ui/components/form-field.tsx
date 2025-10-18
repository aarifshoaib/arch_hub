import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Textarea } from '@/components/ui/textarea'
import { Checkbox } from '@/components/ui/checkbox'
import { Calendar } from '@/components/ui/calendar'
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover'
import { Button } from '@/components/ui/button'
import { CalendarIcon } from 'lucide-react'
import { format } from 'date-fns'
import { cn } from '@/lib/utils'
import { SearchableSelect } from './searchable-select'

interface FormFieldProps {
  field: {
    type: string
    field: string
    title: string
    placeholder?: string
    multiline?: boolean
    rows?: number
    inputType?: string
    isRequired?: boolean
    columnSize?: number
  }
  value: string | boolean | Date | undefined
  onChange: (value: string | boolean | Date | undefined) => void
  error?: string
  options?: Array<{ value: string; label: string }>
}

export function FormField({ field, value, onChange, error, options = [] }: FormFieldProps) {
  const renderField = () => {
    switch (field.type) {
      case 'textbox':
        if (field.multiline) {
          return (
            <Textarea
              id={field.field}
              placeholder={field.placeholder}
              rows={field.rows || 4}
              value={(value as string) || ''}
              onChange={(e: React.ChangeEvent<HTMLTextAreaElement>) => onChange(e.target.value)}
              className={cn(error && 'border-red-500')}
            />
          )
        }
        return (
          <Input
            id={field.field}
            type={field.inputType || 'text'}
            placeholder={field.placeholder}
            value={(value as string) || ''}
            onChange={(e: React.ChangeEvent<HTMLInputElement>) => onChange(e.target.value)}
            className={cn(error && 'border-red-500')}
          />
        )

      case 'select':
        return (
          <SearchableSelect
            options={options}
            value={(value as string) || ''}
            onValueChange={(val: string) => onChange(val)}
            placeholder={field.placeholder || 'Select an option'}
            error={error}
          />
        )

      case 'checkbox':
        return (
          <div className="flex items-center space-x-2">
            <Checkbox
              id={field.field}
              checked={(value as boolean) || false}
              onCheckedChange={(checked: boolean) => onChange(checked)}
              className={cn(error && 'border-red-500')}
            />
            <Label htmlFor={field.field} className="text-sm font-medium">
              {field.title}
            </Label>
          </div>
        )

      case 'datetime':
        return (
          <Popover>
            <PopoverTrigger asChild>
              <Button
                variant="outline"
                className={cn(
                  'w-full justify-start text-left font-normal',
                  !value && 'text-muted-foreground',
                  error && 'border-red-500'
                )}
              >
                <CalendarIcon className="mr-2 h-4 w-4" />
                {value ? format(new Date(value as string), 'PPP') : <span>Pick a date</span>}
              </Button>
            </PopoverTrigger>
            <PopoverContent className="w-auto p-0">
              <Calendar
                mode="single"
                selected={value ? new Date(value as string) : undefined}
                onSelect={(date: Date | undefined) => onChange(date?.toISOString())}
                initialFocus
              />
            </PopoverContent>
          </Popover>
        )

      default:
        return (
          <Input
            id={field.field}
            placeholder={field.placeholder}
            value={(value as string) || ''}
            onChange={(e: React.ChangeEvent<HTMLInputElement>) => onChange(e.target.value)}
            className={cn(error && 'border-red-500')}
          />
        )
    }
  }

  return (
    <div className={field.columnSize === 12 ? 'space-y-2 lg:col-span-2' : 'space-y-2 lg:col-span-1'}>
      {field.type !== 'checkbox' && (
        <Label htmlFor={field.field} className="text-sm font-medium">
          {field.title}
          {field.isRequired && <span className="text-red-500 ml-1">*</span>}
        </Label>
      )}
      {renderField()}
      {error && (
        <p className="text-sm text-red-500">{error}</p>
      )}
    </div>
  )
}
