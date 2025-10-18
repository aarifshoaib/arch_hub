import { useState, useCallback } from 'react'
import type { ToastData } from '../types/toast'

export function useToast() {
  const [toasts, setToasts] = useState<ToastData[]>([])

  const addToast = useCallback((toast: Omit<ToastData, 'id'>) => {
    const id = Math.random().toString(36).substr(2, 9)
    const newToast: ToastData = {
      ...toast,
      id,
    }
    setToasts((prev) => [...prev, newToast])
  }, [])

  const removeToast = useCallback((id: string) => {
    setToasts((prev) => prev.filter((toast) => toast.id !== id))
  }, [])

  const showSuccess = useCallback((title: string, description?: string) => {
    addToast({ title, description, type: 'success' })
  }, [addToast])

  const showError = useCallback((title: string, description?: string) => {
    addToast({ title, description, type: 'error' })
  }, [addToast])

  const showInfo = useCallback((title: string, description?: string) => {
    addToast({ title, description, type: 'info' })
  }, [addToast])

  return {
    toasts,
    addToast,
    removeToast,
    showSuccess,
    showError,
    showInfo,
  }
}
