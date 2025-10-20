import * as React from "react"
import { FormLabel, type FormLabelProps } from '@mui/material'
import { styled } from '@mui/material/styles'

const StyledLabel = styled(FormLabel)(({ theme }) => ({
  fontSize: '0.875rem',
  fontWeight: 500,
  marginBottom: '0.5rem',
  display: 'block',
  color: theme.palette.text.primary,
  '&.Mui-disabled': {
    cursor: 'not-allowed',
    opacity: 0.7,
  },
}))

export interface LabelProps extends FormLabelProps {
  className?: string
}

export const Label = React.forwardRef<HTMLLabelElement, LabelProps>(
  ({ className, ...props }, ref) => {
    return (
      <StyledLabel
        ref={ref}
        className={className}
        {...props}
      />
    )
  }
)

Label.displayName = "Label"
