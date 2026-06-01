import ru from '../locales/ru.json'
import kz from '../locales/kz.json'

export default defineNuxtPlugin(() => {
  const locales: Record<string, Record<string, unknown>> = { ru, kz }

  const locale = useState<string>('i18n:locale', () => 'ru')

  if (process.client) {
    const saved = localStorage.getItem('forum_locale')
    if (saved && locales[saved]) {
      locale.value = saved
    }
  }

  const t = (key: string, params?: Record<string, string | number>): string => {
    const keys = key.split('.')
    let value: unknown = locales[locale.value]
    for (const k of keys) {
      if (value && typeof value === 'object') {
        value = (value as Record<string, unknown>)[k]
      } else {
        return key
      }
    }
    if (typeof value !== 'string') return key
    if (params) {
      return value.replace(/\{(\w+)\}/g, (_, p: string) => String(params[p] ?? `{${p}}`))
    }
    return value
  }

  const setLocale = (l: string) => {
    if (locales[l]) {
      locale.value = l
      if (process.client) {
        localStorage.setItem('forum_locale', l)
      }
    }
  }

  return {
    provide: {
      t,
      locale: readonly(locale),
      setLocale
    }
  }
})
