import * as React from "react"
import { Checkbox as MuiCheckbox, type CheckboxProps as MuiCheckboxProps } from '@mui/material'
import { styled } from '@mui/material/styles'
import { Check } from "lucide-react"

const StyledCheckbox = styled(MuiCheckbox)(({ theme }) => ({
  padding: 0,
  width: '16px',
  height: '16px',
  borderRadius: '4px',
  '&.Mui-checked': {
    color: theme.palette.primary.main,
  },
  '& .MuiSvgIcon-root': {
    fontSize: '16px',
  },
}))

export interface CheckboxProps extends Omit<MuiCheckboxProps, 'icon' | 'checkedIcon' | 'onChange'> {
  className?: string
  onCheckedChange?: (checked: boolean) => void
}

export const Checkbox = React.forwardRef<HTMLButtonElement, CheckboxProps>(
  ({ className, onCheckedChange, ...props }, ref) => {
    const handleChange = (event: React.ChangeEvent<HTMLInputElement>) => {
      if (onCheckedChange) {
        onCheckedChange(event.target.checked)
      }
    }


    return (
      <StyledCheckbox
        ref={ref}
        className={className}
        onChange={handleChange}
        icon={<span style={{
          display: 'inline-block',
          width: '16px',
          height: '16px',
          border: '1px solid #d1d5db',
          borderRadius: '4px'
        }} />}
        checkedIcon={
          <span style={{
            display: 'inline-flex',
            alignItems: 'center',
            justifyContent: 'center',
            width: '16px',
            height: '16px',
            backgroundColor: '#2563eb',
            borderRadius: '4px',
          }}>
            <Check style={{ width: '12px', height: '12px', color: 'white' }} />
          </span>
        }
        {...props}
      />
    )
  }
)

Checkbox.displayName = "Checkbox"
