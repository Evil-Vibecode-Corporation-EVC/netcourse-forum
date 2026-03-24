// composables/useToast.ts
export const useToast = () => {
  const toasts = useState<any[]>('toasts', () => [])

  const add = (message: string, type: 'success' | 'error' | 'info' = 'info') => {
    const id = Date.now()
    toasts.value.push({ id, message, type })
    setTimeout(() => remove(id), 3500)
  }

  const remove = (id: number) => {
    toasts.value = toasts.value.filter(t => t.id !== id)
  }

  const success = (msg: string) => add(msg, 'success')
  const error = (msg: string) => add(msg, 'error')
  const info = (msg: string) => add(msg, 'info')

  return {
    toasts,
    success,
    error,
    info,
    remove
  }
}