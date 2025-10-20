import * as React from "react"
import {
  Select as MuiSelect,
  MenuItem,
  FormControl,
  type SelectProps as MuiSelectProps,
  type SelectChangeEvent,
} from '@mui/material'
import { styled } from '@mui/material/styles'
import { ChevronDown } from "lucide-react"

const StyledSelect = styled(MuiSelect)(({ theme }) => ({
  '& .MuiOutlinedInput-notchedOutline': {
    borderColor: theme.palette.mode === 'dark' ? 'rgba(255, 255, 255, 0.1)' : 'rgba(0, 0, 0, 0.15)',
  },
  '&:hover .MuiOutlinedInput-notchedOutline': {
    borderColor: theme.palette.mode === 'dark' ? 'rgba(255, 255, 255, 0.2)' : 'rgba(0, 0, 0, 0.25)',
  },
  '&.Mui-focused .MuiOutlinedInput-notchedOutline': {
    borderColor: theme.palette.primary.main,
    borderWidth: '1px',
  },
  '& .MuiSelect-select': {
    padding: '0.375rem 0.75rem',
    fontSize: '0.875rem',
    minHeight: '32px',
    display: 'flex',
    alignItems: 'center',
    backgroundColor: theme.palette.mode === 'dark' ? '#1e293b' : '#ffffff',
  },
  '& .MuiSelect-icon': {
    color: theme.palette.text.secondary,
  },
  borderRadius: '6px',
  backgroundColor: theme.palette.mode === 'dark' ? '#1e293b' : '#ffffff',
}))

const StyledMenuItem = styled(MenuItem)(({ theme }) => ({
  fontSize: '0.875rem',
  padding: '0.5rem 1rem',
  minHeight: '36px',
  backgroundColor: theme.palette.mode === 'dark' ? '#1e293b' : '#ffffff',
  '&:hover': {
    backgroundColor: theme.palette.mode === 'dark' ? 'rgba(255, 255, 255, 0.05)' : 'rgba(0, 0, 0, 0.04)',
  },
  '&.Mui-selected': {
    backgroundColor: theme.palette.mode === 'dark' ? 'rgba(37, 99, 235, 0.2)' : 'rgba(37, 99, 235, 0.08)',
    '&:hover': {
      backgroundColor: theme.palette.mode === 'dark' ? 'rgba(37, 99, 235, 0.3)' : 'rgba(37, 99, 235, 0.12)',
    },
  },
}))

// Create a context to share state and items
const SelectContext = React.createContext<{
  value?: string
  onValueChange?: (value: string) => void
  items: React.ReactNode[]
  setItems: (items: React.ReactNode[]) => void
}>({
  items: [],
  setItems: () => {},
})

// Root component - provides context and manages items
export interface SelectRootProps {
  children: React.ReactNode
  value?: string
  onValueChange?: (value: string) => void
}

export const Select = ({ children, value, onValueChange }: SelectRootProps) => {
  // Extract items from SelectContent child synchronously during render
  const items = React.useMemo(() => {
    const childrenArray = React.Children.toArray(children)
    const selectContent = childrenArray.find(
      (child: any) => child?.type?.displayName === 'SelectContent'
    )

    if (selectContent && (selectContent as any).props?.children) {
      const contentChildren = React.Children.toArray((selectContent as any).props.children)
      console.log('Select root extracting items:', contentChildren.length, contentChildren)
      return contentChildren
    }

    return []
  }, [children])

  const setItems = React.useCallback(() => {
    // No-op, items are derived from children
  }, [])

  return (
    <SelectContext.Provider value={{ value, onValueChange, items, setItems }}>
      {children}
    </SelectContext.Provider>
  )
}

// Trigger component - renders the actual MUI Select
export interface SelectTriggerProps extends Omit<MuiSelectProps, 'onChange'> {
  className?: string
  children?: React.ReactNode
}

export const SelectTrigger = React.forwardRef<HTMLDivElement, SelectTriggerProps>(
  ({ className, children, ...props }, ref) => {
    const context = React.useContext(SelectContext)

    const handleChange = (event: SelectChangeEvent<unknown>) => {
      const newValue = event.target.value as string
      console.log('Select handleChange called:', { newValue, hasCallback: !!context.onValueChange })
      if (context.onValueChange) {
        context.onValueChange(newValue)
        console.log('onValueChange callback executed with:', newValue)
      }
    }

    // Extract the renderValue function from children (SelectValue)
    const renderValue = (value: unknown) => {
      const selectedItem = context.items.find((item: any) => {
        return item?.props?.value === value
      })

      if (selectedItem && (selectedItem as any)?.props?.children) {
        return (selectedItem as any).props.children
      }

      return value as string
    }

    console.log('SelectTrigger render:', {
      contextValue: context.value,
      itemsCount: context.items.length,
      items: context.items
    })

    return (
      <FormControl size="small">
        <StyledSelect
          ref={ref}
          className={className}
          value={context.value || ''}
          onChange={handleChange}
          IconComponent={ChevronDown}
          renderValue={renderValue}
          MenuProps={{
            PaperProps: {
              sx: {
                backgroundColor: '#1e293b',
                borderRadius: '6px',
                border: '1px solid rgba(255, 255, 255, 0.1)',
                marginTop: '4px',
                minWidth: '120px',
                maxHeight: '300px',
                boxShadow: '0 10px 15px -3px rgb(0 0 0 / 0.3), 0 4px 6px -4px rgb(0 0 0 / 0.2)',
                '& .MuiList-root': {
                  padding: '4px',
                },
              },
            },
            anchorOrigin: {
              vertical: 'bottom',
              horizontal: 'left',
            },
            transformOrigin: {
              vertical: 'top',
              horizontal: 'left',
            },
          }}
          {...props}
        >
          {context.items}
        </StyledSelect>
      </FormControl>
    )
  }
)
SelectTrigger.displayName = "SelectTrigger"

// Content component - wrapper for items (hidden, only used for structure)
// The Select root component extracts items from this component's children
export const SelectContent = ({ children: _children }: { children: React.ReactNode }) => {
  // Don't render anything - items are extracted by Select root component
  return null
}
SelectContent.displayName = 'SelectContent'

// Value component - displays the selected value
export const SelectValue = ({ placeholder }: { placeholder?: string }) => {
  const context = React.useContext(SelectContext)

  if (!context.value && placeholder) {
    return <span style={{ color: 'rgba(255, 255, 255, 0.5)' }}>{placeholder}</span>
  }

  // Find the selected item and render its children
  const selectedItem = context.items.find((item: any) => {
    return item?.props?.value === context.value
  })

  if (selectedItem && (selectedItem as any)?.props?.children) {
    return <>{(selectedItem as any).props.children}</>
  }

  return <>{context.value}</>
}

// Item component
export interface SelectItemProps {
  value: string
  children: React.ReactNode
  className?: string
}

export const SelectItem = React.forwardRef<HTMLLIElement, SelectItemProps>(
  ({ value, children, className }, ref) => {
    return (
      <StyledMenuItem ref={ref} value={value} className={className}>
        {children}
      </StyledMenuItem>
    )
  }
)
SelectItem.displayName = "SelectItem"

// Group component
export const SelectGroup = ({ children }: { children: React.ReactNode }) => {
  return <>{children}</>
}

// Label component
export const SelectLabel = ({ children, className }: { children: React.ReactNode; className?: string }) => {
  return (
    <MenuItem disabled className={className} sx={{ fontWeight: 600, fontSize: '0.875rem' }}>
      {children}
    </MenuItem>
  )
}

// Separator component
export const SelectSeparator = ({ className }: { className?: string }) => {
  return <MenuItem disabled sx={{ height: '1px', padding: 0, minHeight: '1px' }} className={className} />
}

// Scroll buttons (MUI handles these automatically)
export const SelectScrollUpButton = () => null
export const SelectScrollDownButton = () => null
