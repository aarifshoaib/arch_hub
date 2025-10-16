import React from 'react'
import { ThemeProvider } from './theme-provider'

type ProvidersProps = {
  children: React.ReactNode
}

export function Providers({ children }: ProvidersProps) {
  console.log('Providers component rendering...')
  
  return (
    <ThemeProvider defaultTheme="system" storageKey="arc-hub-theme">
      {children}
    </ThemeProvider>
  )
}
