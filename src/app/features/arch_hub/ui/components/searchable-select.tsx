import { useState, useMemo } from 'react'
import { Check, ChevronDown, Search } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover'
import { cn } from '@/lib/utils'

interface SearchableSelectProps {
  options: Array<{ value: string; label: string }>
  value: string
  onValueChange: (value: string) => void
  placeholder?: string
  className?: string
  error?: string
}

export function SearchableSelect({
  options,
  value,
  onValueChange,
  placeholder = "Select an option",
  className,
  error
}: SearchableSelectProps) {
  const [open, setOpen] = useState(false)
  const [searchQuery, setSearchQuery] = useState('')

  const filteredOptions = useMemo(() => {
    if (!searchQuery) return options
    return options.filter(option =>
      option.label.toLowerCase().includes(searchQuery.toLowerCase()) ||
      option.value.toLowerCase().includes(searchQuery.toLowerCase())
    )
  }, [options, searchQuery])

  const selectedOption = options.find(option => option.value === value)

  return (
    <Popover open={open} onOpenChange={setOpen}>
      <PopoverTrigger asChild>
        <Button
          variant="outline"
          role="combobox"
          aria-expanded={open}
          className={cn(
            "w-full justify-between",
            !selectedOption && "text-muted-foreground",
            error && "border-red-500",
            className
          )}
        >
          {selectedOption ? selectedOption.label : placeholder}
          <ChevronDown className="ml-2 h-4 w-4 shrink-0 opacity-50" />
        </Button>
      </PopoverTrigger>
      <PopoverContent className="w-full p-0" align="start">
        <div className="p-2">
          <div className="relative">
            <Search className="absolute left-2 top-2.5 h-4 w-4 text-muted-foreground" />
            <Input
              placeholder="Search..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="pl-8"
            />
          </div>
        </div>
        <div className="max-h-60 overflow-auto">
          {filteredOptions.length === 0 ? (
            <div className="p-4 text-center text-sm text-muted-foreground">
              No options found.
            </div>
          ) : (
            filteredOptions.map((option) => (
              <button
                key={option.value}
                className={cn(
                  "flex w-full items-center justify-between px-4 py-2 text-sm hover:bg-muted",
                  value === option.value && "bg-muted"
                )}
                onClick={() => {
                  onValueChange(option.value)
                  setOpen(false)
                  setSearchQuery('')
                }}
              >
                {option.label}
                {value === option.value && (
                  <Check className="h-4 w-4" />
                )}
              </button>
            ))
          )}
        </div>
      </PopoverContent>
    </Popover>
  )
}
