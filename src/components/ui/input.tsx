import * as React from "react"
import { TextField, type TextFieldProps } from '@mui/material'
import { styled } from '@mui/material/styles'

const StyledTextField = styled(TextField)(({ theme }) => ({
  '& .MuiOutlinedInput-root': {
    borderRadius: '6px',
    fontSize: '0.875rem',
    backgroundColor: theme.palette.mode === 'dark' ? '#1e293b' : '#ffffff',
    '& fieldset': {
      borderColor: theme.palette.mode === 'dark' ? 'rgba(255, 255, 255, 0.1)' : 'rgba(0, 0, 0, 0.15)',
    },
    '&:hover fieldset': {
      borderColor: theme.palette.mode === 'dark' ? 'rgba(255, 255, 255, 0.2)' : 'rgba(0, 0, 0, 0.25)',
    },
    '&.Mui-focused fieldset': {
      borderColor: theme.palette.primary.main,
      borderWidth: '1px',
    },
  },
  '& .MuiInputBase-input': {
    padding: '0.5rem 0.75rem',
    height: '36px',
    boxSizing: 'border-box',
    color: theme.palette.text.primary,
  },
}))

export interface InputProps extends Omit<TextFieldProps, 'variant'> {
  className?: string
}

export const Input = React.forwardRef<HTMLInputElement, InputProps>(
  ({ className, ...props }, ref) => {
    return (
      <StyledTextField
        inputRef={ref}
        variant="outlined"
        fullWidth
        className={className}
        {...props}
      />
    )
  }
)

Input.displayName = "Input"
