import * as React from "react"
import { Popover as MuiPopover } from '@mui/material'
import { styled } from '@mui/material/styles'

const StyledPopover = styled(MuiPopover)(({ theme }) => ({
  '& .MuiPopover-paper': {
    borderRadius: '6px',
    border: `1px solid ${theme.palette.divider}`,
    boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.1), 0 2px 4px -2px rgb(0 0 0 / 0.1)',
    padding: '1rem',
    minWidth: '288px',
  },
}))

export interface PopoverComponentProps {
  children: React.ReactNode
  open?: boolean
  onOpenChange?: (open: boolean) => void
}

export const Popover = ({ children, open: controlledOpen, onOpenChange }: PopoverComponentProps) => {
  const [internalOpen, setInternalOpen] = React.useState(false)
  const [anchorEl, setAnchorEl] = React.useState<HTMLElement | null>(null)

  const open = controlledOpen !== undefined ? controlledOpen : internalOpen

  const handleOpenChange = (newOpen: boolean) => {
    if (onOpenChange) {
      onOpenChange(newOpen)
    } else {
      setInternalOpen(newOpen)
    }
  }

  const childrenArray = React.Children.toArray(children)
  const trigger = childrenArray.find((child: any) => child?.type?.displayName === 'PopoverTrigger')
  const content = childrenArray.find((child: any) => child?.type?.displayName === 'PopoverContent')

  return (
    <>
      {trigger && React.isValidElement(trigger) && React.cloneElement(trigger as React.ReactElement<any>, {
        onClick: (e: React.MouseEvent<HTMLElement>) => {
          setAnchorEl(e.currentTarget)
          handleOpenChange(true)
        },
      } as any)}
      <StyledPopover
        open={open}
        anchorEl={anchorEl}
        onClose={() => {
          setAnchorEl(null)
          handleOpenChange(false)
        }}
        anchorOrigin={{
          vertical: 'bottom',
          horizontal: 'center',
        }}
        transformOrigin={{
          vertical: 'top',
          horizontal: 'center',
        }}
      >
        {content}
      </StyledPopover>
    </>
  )
}

export interface PopoverTriggerProps extends React.HTMLAttributes<HTMLElement> {
  asChild?: boolean
}

export const PopoverTrigger = ({ children }: PopoverTriggerProps) => {
  return <>{children}</>
}
PopoverTrigger.displayName = 'PopoverTrigger'

export interface PopoverContentProps extends React.HTMLAttributes<HTMLDivElement> {
  align?: string
}

export const PopoverContent = ({ children, className }: PopoverContentProps) => {
  return (
    <div className={className}>
      {children}
    </div>
  )
}
PopoverContent.displayName = 'PopoverContent'
