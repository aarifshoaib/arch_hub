import { createTheme, type ThemeOptions } from '@mui/material/styles'

const commonTheme: ThemeOptions = {
  shape: {
    borderRadius: 10, // matches --radius: 0.625rem (10px)
  },
  typography: {
    fontFamily: 'system-ui, Avenir, Helvetica, Arial, sans-serif',
    fontSize: 14,
    button: {
      textTransform: 'none',
      fontWeight: 500,
    },
  },
  components: {
    MuiButton: {
      styleOverrides: {
        root: {
          borderRadius: '6px',
          textTransform: 'none',
          fontWeight: 500,
          fontSize: '0.875rem',
          padding: '0.5rem 1rem',
          boxShadow: 'none',
          '&:hover': {
            boxShadow: 'none',
          },
        },
        sizeSmall: {
          height: '32px',
          padding: '0.375rem 0.75rem',
        },
        sizeLarge: {
          height: '40px',
          padding: '0.625rem 1.5rem',
        },
      },
      defaultProps: {
        disableElevation: true,
      },
    },
    MuiCard: {
      styleOverrides: {
        root: {
          borderRadius: '12px',
          boxShadow: '0 1px 3px 0 rgb(0 0 0 / 0.1)',
        },
      },
    },
    MuiPaper: {
      styleOverrides: {
        root: {
          borderRadius: '12px',
        },
        elevation1: {
          boxShadow: '0 1px 3px 0 rgb(0 0 0 / 0.1)',
        },
      },
    },
    MuiTextField: {
      styleOverrides: {
        root: {
          '& .MuiOutlinedInput-root': {
            borderRadius: '6px',
          },
        },
      },
    },
    MuiSelect: {
      styleOverrides: {
        root: {
          borderRadius: '6px',
        },
      },
    },
    MuiChip: {
      styleOverrides: {
        root: {
          borderRadius: '6px',
          fontWeight: 500,
        },
      },
    },
  },
}

export const lightTheme = createTheme({
  ...commonTheme,
  palette: {
    mode: 'light',
    primary: {
      main: '#2563eb', // blue-600
      contrastText: '#ffffff',
    },
    secondary: {
      main: '#f3f4f6', // gray-100
      contrastText: '#111827', // gray-900
    },
    error: {
      main: '#dc2626', // red-600
      light: '#fef2f2',
      contrastText: '#ffffff',
    },
    warning: {
      main: '#f59e0b',
      light: '#fef3c7',
    },
    info: {
      main: '#3b82f6',
      light: '#dbeafe',
    },
    success: {
      main: '#10b981',
      light: '#d1fae5',
    },
    background: {
      default: '#ffffff',
      paper: '#ffffff',
    },
    text: {
      primary: '#111827', // gray-900
      secondary: '#6b7280', // gray-500
      disabled: '#9ca3af',
    },
    divider: '#e5e7eb', // gray-200
    action: {
      active: '#6b7280',
      hover: '#f9fafb', // gray-50
      selected: '#f3f4f6', // gray-100
      disabled: '#d1d5db',
      disabledBackground: '#f3f4f6',
    },
  },
})

export const darkTheme = createTheme({
  ...commonTheme,
  palette: {
    mode: 'dark',
    primary: {
      main: '#2563eb', // blue-600
      dark: '#1d4ed8', // blue-700
      contrastText: '#ffffff',
    },
    secondary: {
      main: '#374151', // gray-700
      contrastText: '#f9fafb', // gray-50
    },
    error: {
      main: '#ef4444', // red-500
      light: '#7f1d1d',
      contrastText: '#ffffff',
    },
    warning: {
      main: '#f59e0b',
      light: '#78350f',
    },
    info: {
      main: '#3b82f6',
      light: '#1e3a8a',
    },
    success: {
      main: '#10b981',
      light: '#064e3b',
    },
    background: {
      default: '#0f172a', // slate-900
      paper: '#1e293b', // slate-800
    },
    text: {
      primary: '#f3f4f6', // gray-100
      secondary: '#9ca3af', // gray-400
      disabled: '#6b7280',
    },
    divider: 'rgba(255, 255, 255, 0.1)',
    action: {
      active: '#9ca3af',
      hover: 'rgba(255, 255, 255, 0.05)',
      selected: 'rgba(255, 255, 255, 0.08)',
      disabled: '#6b7280',
      disabledBackground: '#374151',
    },
  },
})
