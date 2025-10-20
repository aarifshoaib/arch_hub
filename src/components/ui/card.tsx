import * as React from "react"
import {
  Card as MuiCard,
  Typography,
  Box,
} from '@mui/material'
import { styled } from '@mui/material/styles'

const StyledCard = styled(MuiCard)(({ theme }) => ({
  borderRadius: '12px',
  boxShadow: 'none',
  border: `1px solid ${theme.palette.mode === 'dark' ? 'rgba(255, 255, 255, 0.1)' : 'rgba(0, 0, 0, 0.1)'}`,
  backgroundColor: theme.palette.mode === 'dark' ? '#1e293b' : '#ffffff',
  display: 'flex',
  flexDirection: 'column',
  gap: '1.5rem',
  padding: '1.5rem 0',
}))

const StyledCardHeader = styled(Box)(() => ({
  padding: '0 1.5rem',
  display: 'grid',
  gridAutoRows: 'min-content',
  gridTemplateRows: 'auto auto',
  alignItems: 'start',
  gap: '0.5rem',
  '&.has-action': {
    gridTemplateColumns: '1fr auto',
  },
}))

const StyledCardContent = styled(Box)(() => ({
  padding: '0 1.5rem',
}))

const StyledCardFooter = styled(Box)(({ theme }) => ({
  display: 'flex',
  alignItems: 'center',
  padding: '0 1.5rem',
  '&.border-t': {
    paddingTop: '1.5rem',
    borderTop: `1px solid ${theme.palette.divider}`,
  },
}))

export function Card({ className, ...props }: React.ComponentProps<"div">) {
  return (
    <StyledCard className={className} {...props} />
  )
}

export function CardHeader({ className, ...props }: React.ComponentProps<"div">) {
  const hasAction = React.Children.toArray(props.children).some(
    (child: any) => child?.props?.['data-slot'] === 'card-action'
  )

  return (
    <StyledCardHeader
      className={`${hasAction ? 'has-action' : ''} ${className || ''}`}
      {...props}
    />
  )
}

export function CardTitle({ className, ...props }: React.ComponentProps<"div">) {
  return (
    <Typography
      variant="h6"
      component="div"
      sx={{
        fontWeight: 600,
        fontSize: '1rem',
        lineHeight: 1,
      }}
      className={className}
      {...props}
    />
  )
}

export function CardDescription({ className, ...props }: React.ComponentProps<"div">) {
  return (
    <Typography
      variant="body2"
      color="text.secondary"
      component="div"
      sx={{ fontSize: '0.875rem' }}
      className={className}
      {...props}
    />
  )
}

export function CardAction({ className, ...props }: React.ComponentProps<"div">) {
  return (
    <Box
      data-slot="card-action"
      sx={{
        gridColumn: 2,
        gridRow: '1 / span 2',
        justifySelf: 'end',
        alignSelf: 'start',
      }}
      className={className}
      {...props}
    />
  )
}

export function CardContent({ className, ...props }: React.ComponentProps<"div">) {
  return (
    <StyledCardContent className={className} {...props} />
  )
}

export function CardFooter({ className, ...props }: React.ComponentProps<"div">) {
  const hasBorderTop = className?.includes('border-t')

  return (
    <StyledCardFooter
      className={`${hasBorderTop ? 'border-t' : ''} ${className || ''}`}
      {...props}
    />
  )
}
