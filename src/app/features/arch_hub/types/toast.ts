export interface ToastData {
  id: string
  title: string
  description?: string
  type: 'success' | 'error' | 'info'
  duration?: number
}
