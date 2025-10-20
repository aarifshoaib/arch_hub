import { DateCalendar } from '@mui/x-date-pickers/DateCalendar'
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider'
import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs'
import { styled } from '@mui/material/styles'
import dayjs, { Dayjs } from 'dayjs'

const StyledDateCalendar = styled(DateCalendar)(({ theme }) => ({
  '& .MuiPickersDay-root': {
    fontSize: '0.875rem',
    '&.Mui-selected': {
      backgroundColor: theme.palette.primary.main,
      color: theme.palette.primary.contrastText,
      '&:hover': {
        backgroundColor: theme.palette.primary.dark,
      },
    },
  },
  '& .MuiPickersCalendarHeader-root': {
    paddingLeft: '0.75rem',
    paddingRight: '0.75rem',
  },
}))

export interface CalendarProps {
  className?: string
  showOutsideDays?: boolean
  selected?: Date
  onSelect?: (date: Date | undefined) => void
  disabled?: boolean
  [key: string]: any
}

export function Calendar({
  className,
  showOutsideDays = true,
  selected,
  onSelect,
  disabled,
  ...props
}: CalendarProps) {
  const handleDateChange = (newValue: Dayjs | null) => {
    if (onSelect) {
      onSelect(newValue ? newValue.toDate() : undefined)
    }
  }

  return (
    <LocalizationProvider dateAdapter={AdapterDayjs}>
      <StyledDateCalendar
        className={className}
        value={selected ? dayjs(selected) : null}
        onChange={handleDateChange}
        disabled={disabled}
        {...props}
      />
    </LocalizationProvider>
  )
}

Calendar.displayName = "Calendar"
