import React from 'react'
import { ThemeProvider } from './theme-provider'
import { SidebarProvider } from '../features/arch_hub/contexts/sidebar-context'

type ProvidersProps = {
  children: React.ReactNode
}

export function Providers({ children }: ProvidersProps) {
  return (
    <ThemeProvider defaultTheme="system" storageKey="arc-hub-theme">
      <SidebarProvider>
        {children}
      </SidebarProvider>
    </ThemeProvider>
  )
}
