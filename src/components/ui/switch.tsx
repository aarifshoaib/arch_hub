import { Switch as MuiSwitch, type SwitchProps as MuiSwitchProps } from '@mui/material'
import { styled } from '@mui/material/styles'

const StyledSwitch = styled(MuiSwitch)(({ theme }) => ({
  width: 32,
  height: 18,
  padding: 0,
  display: 'flex',
  '&:active': {
    '& .MuiSwitch-thumb': {
      width: 16,
    },
    '& .MuiSwitch-switchBase.Mui-checked': {
      transform: 'translateX(14px)',
    },
  },
  '& .MuiSwitch-switchBase': {
    padding: 1,
    '&.Mui-checked': {
      transform: 'translateX(14px)',
      color: '#fff',
      '& + .MuiSwitch-track': {
        opacity: 1,
        backgroundColor: '#2563eb',
      },
    },
  },
  '& .MuiSwitch-thumb': {
    boxShadow: '0 2px 4px 0 rgb(0 35 11 / 20%)',
    width: 16,
    height: 16,
    borderRadius: 8,
    transition: theme.transitions.create(['width'], {
      duration: 200,
    }),
  },
  '& .MuiSwitch-track': {
    borderRadius: 9,
    opacity: 1,
    backgroundColor: theme.palette.mode === 'dark' ? 'rgba(255,255,255,.35)' : 'rgba(0,0,0,.25)',
    boxSizing: 'border-box',
  },
}))

export interface SwitchProps extends Omit<MuiSwitchProps, 'onChange'> {
  className?: string
  onCheckedChange?: (checked: boolean) => void
}

export function Switch({ className, onCheckedChange, ...props }: SwitchProps) {
  const handleChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    if (onCheckedChange) {
      onCheckedChange(event.target.checked)
    }
  }

  return <StyledSwitch className={className} onChange={handleChange} {...props} />
}
