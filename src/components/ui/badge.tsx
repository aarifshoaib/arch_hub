import { Chip, type ChipProps } from '@mui/material'
import { styled } from '@mui/material/styles'

const StyledChip = styled(Chip)(() => ({
  borderRadius: '6px',
  fontSize: '0.75rem',
  fontWeight: 500,
  height: 'auto',
  minHeight: '22px',
  padding: '2px 0',
  '& .MuiChip-label': {
    padding: '0.25rem 0.5rem',
    display: 'flex',
    alignItems: 'center',
    gap: '0.25rem',
    lineHeight: 1.5,
  },
  '& .MuiChip-label svg': {
    width: '12px',
    height: '12px',
  },
}))

export interface BadgeProps extends Omit<ChipProps, 'variant' | 'children'> {
  variant?: 'default' | 'secondary' | 'destructive' | 'outline'
  asChild?: boolean
  children?: React.ReactNode
}

const getChipStyle = (variant?: string) => {
  switch (variant) {
    case 'default':
      return {
        backgroundColor: '#2563eb',
        color: '#ffffff',
        border: 'none',
      }
    case 'secondary':
      return {
        backgroundColor: '#f3f4f6',
        color: '#111827',
        border: 'none',
      }
    case 'destructive':
      return {
        backgroundColor: '#dc2626',
        color: '#ffffff',
        border: 'none',
      }
    case 'outline':
      return {
        backgroundColor: 'transparent',
        border: '1px solid currentColor',
      }
    default:
      return {}
  }
}

export function Badge({
  variant = 'default',
  asChild = false,
  className,
  sx,
  children,
  ...props
}: BadgeProps) {
  const customStyle = getChipStyle(variant)
  const combinedSx = {
    ...customStyle,
    ...sx,
    '& .MuiChip-label': {
      display: 'flex',
      alignItems: 'center',
      gap: '0.25rem',
      padding: '0 0.5rem',
    },
  }

  return (
    <StyledChip
      size="small"
      label={children}
      className={className}
      sx={combinedSx}
      {...props}
    />
  )
}

export const badgeVariants = () => ({})
