import * as React from "react"
import { TextField, type TextFieldProps } from '@mui/material'
import { styled } from '@mui/material/styles'

const StyledTextField = styled(TextField)(({ theme }) => ({
  '& .MuiOutlinedInput-root': {
    borderRadius: '6px',
    fontSize: '0.875rem',
    '& fieldset': {
      borderColor: theme.palette.divider,
    },
    '&:hover fieldset': {
      borderColor: theme.palette.action.active,
    },
    '&.Mui-focused fieldset': {
      borderColor: theme.palette.primary.main,
      borderWidth: '1px',
    },
  },
  '& .MuiInputBase-input': {
    padding: '0.5rem 0.75rem',
    minHeight: '80px',
  },
}))

export interface TextareaProps extends Omit<TextFieldProps, 'variant'> {
  className?: string
}

export const Textarea = React.forwardRef<HTMLTextAreaElement, TextareaProps>(
  ({ className, ...props }, ref) => {
    return (
      <StyledTextField
        inputRef={ref}
        variant="outlined"
        multiline
        rows={3}
        fullWidth
        className={className}
        {...props}
      />
    )
  }
)

Textarea.displayName = "Textarea"
