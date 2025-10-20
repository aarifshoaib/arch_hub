import React, { useMemo } from 'react'
import { ThemeProvider as MuiThemeProvider, CssBaseline } from '@mui/material'
import { ThemeProvider } from './theme-provider'
import { SidebarProvider } from '../features/arch_hub/contexts/sidebar-context'
import { lightTheme, darkTheme } from './mui-theme'
import { useTheme } from './theme-provider'

type ProvidersProps = {
  children: React.ReactNode
}

function MuiThemeWrapper({ children }: { children: React.ReactNode }) {
  const { theme } = useTheme()

  const muiTheme = useMemo(() => {
    if (theme === 'dark') return darkTheme
    if (theme === 'light') return lightTheme

    // System theme
    const prefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches
    return prefersDark ? darkTheme : lightTheme
  }, [theme])

  return (
    <MuiThemeProvider theme={muiTheme}>
      <CssBaseline />
      {children}
    </MuiThemeProvider>
  )
}

export function Providers({ children }: ProvidersProps) {
  return (
    <ThemeProvider defaultTheme="system" storageKey="arc-hub-theme">
      <MuiThemeWrapper>
        <SidebarProvider>
          {children}
        </SidebarProvider>
      </MuiThemeWrapper>
    </ThemeProvider>
  )
}
