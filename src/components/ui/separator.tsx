import * as React from "react"
import { Divider, type DividerProps } from '@mui/material'
import { styled } from '@mui/material/styles'

const StyledDivider = styled(Divider)(({ theme }) => ({
  borderColor: theme.palette.divider,
}))

export interface SeparatorProps extends DividerProps {
  className?: string
  decorative?: boolean
}

export const Separator = React.forwardRef<HTMLHRElement, SeparatorProps>(
  ({ className, orientation = 'horizontal', decorative = true, ...props }, ref) => {
    return (
      <StyledDivider
        ref={ref}
        className={className}
        orientation={orientation}
        {...props}
      />
    )
  }
)

Separator.displayName = "Separator"
