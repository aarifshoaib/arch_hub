import * as React from "react"
import { Button as MuiButton, type ButtonProps as MuiButtonProps } from '@mui/material'
import { styled } from '@mui/material/styles'

const StyledButton = styled(MuiButton)(() => ({
  borderRadius: '6px',
  textTransform: 'none',
  fontWeight: 500,
  fontSize: '0.875rem',
  padding: '0.5rem 1rem',
  boxShadow: 'none',
  '&:hover': {
    boxShadow: 'none',
  },
}))

export interface ButtonProps extends Omit<MuiButtonProps, 'variant' | 'size'> {
  variant?: 'default' | 'destructive' | 'outline' | 'secondary' | 'ghost' | 'link'
  size?: 'default' | 'sm' | 'lg' | 'icon' | 'icon-sm' | 'icon-lg'
  asChild?: boolean
}

const getMuiVariant = (variant?: string): MuiButtonProps['variant'] => {
  switch (variant) {
    case 'outline':
      return 'outlined'
    case 'ghost':
    case 'link':
      return 'text'
    default:
      return 'contained'
  }
}

const getMuiSize = (size?: string): MuiButtonProps['size'] => {
  switch (size) {
    case 'sm':
    case 'icon-sm':
      return 'small'
    case 'lg':
    case 'icon-lg':
      return 'large'
    default:
      return 'medium'
  }
}

const getMuiColor = (variant?: string): MuiButtonProps['color'] => {
  switch (variant) {
    case 'destructive':
      return 'error'
    case 'secondary':
      return 'secondary'
    default:
      return 'primary'
  }
}

const getCustomStyles = (variant?: string, size?: string) => {
  const styles: React.CSSProperties = {}

  // Size styles
  if (size === 'icon' || size === 'icon-sm' || size === 'icon-lg') {
    const iconSize = size === 'icon-sm' ? '32px' : size === 'icon-lg' ? '40px' : '36px'
    styles.minWidth = iconSize
    styles.width = iconSize
    styles.height = iconSize
    styles.padding = '0'
  }

  // Variant styles
  if (variant === 'ghost') {
    styles.backgroundColor = 'transparent'
    styles.color = 'inherit'
    styles.border = 'none'
  } else if (variant === 'outline') {
    styles.backgroundColor = 'transparent'
    styles.color = 'inherit'
    styles.borderColor = 'rgba(255, 255, 255, 0.1)'
  } else if (variant === 'secondary') {
    styles.backgroundColor = 'rgba(255, 255, 255, 0.05)'
    styles.color = 'inherit'
  } else if (variant === 'link') {
    styles.backgroundColor = 'transparent'
    styles.color = '#2563eb'
    styles.textDecoration = 'underline'
    styles.textUnderlineOffset = '4px'
  }

  return styles
}

export function Button({
  variant = 'default',
  size = 'default',
  asChild = false,
  style,
  ...props
}: ButtonProps) {
  const muiVariant = getMuiVariant(variant)
  const muiSize = getMuiSize(size)
  const muiColor = getMuiColor(variant)
  const customStyles = getCustomStyles(variant, size)

  return (
    <StyledButton
      variant={muiVariant}
      size={muiSize}
      color={muiColor}
      style={{ ...customStyles, ...style }}
      disableElevation
      {...props}
    />
  )
}

export const buttonVariants = () => ({})
