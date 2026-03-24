// composables/useApi.ts
export const useApi = () => {
  const config = useRuntimeConfig()
  const router = useRouter()

  const apiRequest = async (endpoint: string, options: any = {}) => {
    const url = `${config.public.apiBase}${endpoint}`

    const requestConfig: any = {
      headers: {
        'Content-Type': 'application/json',
      },
      ...options,
    }

    // Добавляем токен авторизации если есть
    if (process.client) {
      const token = localStorage.getItem('authToken')
      if (token) {
        requestConfig.headers.Authorization = `Bearer ${token}`
      }
    }

    // Преобразуем body в JSON если это объект
    if (requestConfig.body && typeof requestConfig.body === 'object') {
      requestConfig.body = JSON.stringify(requestConfig.body)
    }

    try {
      const response = await fetch(url, requestConfig)

      const contentType = response.headers.get('content-type')

      // Обработка пустых ответов (204 No Content)
      if (response.status === 204 || !contentType || !contentType.includes('application/json')) {
        if (response.ok) {
          return { success: true }
        } else {
          const text = await response.text()
          throw new Error(`HTTP ${response.status}: ${text || response.statusText}`)
        }
      }

      // Парсим JSON ответ
      let data
      try {
        data = await response.json()
      } catch (e) {
        if (response.ok) {
          return { success: true }
        }
        throw new Error(`Invalid JSON response from server: ${response.status} ${response.statusText}`)
      }

      // Проверяем статус ответа
      if (!response.ok) {
        const errorMessage = data.message || data.error || `HTTP Error: ${response.status}`
        throw new Error(errorMessage)
      }

      return data

    } catch (error: any) {
      let userMessage = error.message

      // Пользовательские сообщения для типовых ошибок
      if (error.message.includes('Failed to fetch') || 
          error.message.includes('NetworkError') ||
          error.message.includes('Network Error')) {
        userMessage = 'Не удалось подключиться к серверу. Проверьте интернет-соединение.'
      } 
      else if (error.message.includes('timeout')) {
        userMessage = 'Сервер не отвечает. Попробуйте позже.'
      }
      else if (error.message.includes('Invalid JSON') || error.message.includes('HTTP Error')) {
        userMessage = 'Некорректный ответ сервера.'
      }

      throw new Error(userMessage)
    }
  }

  // ============ ФОРУМ ============
  const forumAPI = {
    // Посты
    getPosts: (page = 1, limit = 20) => apiRequest(`/forum/posts?page=${page}&limit=${limit}`),
    getPost: (id: number) => apiRequest(`/forum/posts/${id}`),
    createPost: (data: { title: string; body: string }) => apiRequest('/forum/posts', {
      method: 'POST',
      body: data
    }),
    updatePost: (id: number, data: { title?: string; body?: string }) => apiRequest(`/forum/posts/${id}`, {
      method: 'PUT',
      body: data
    }),
    deletePost: (id: number) => apiRequest(`/forum/posts/${id}`, {
      method: 'DELETE'
    }),

    // Ответы
    getReplies: (postId: number, page = 1, limit = 20) => 
      apiRequest(`/forum/posts/${postId}/replies?page=${page}&limit=${limit}`),
    createReply: (postId: number, body: string) => apiRequest(`/forum/posts/${postId}/replies`, {
      method: 'POST',
      body: { body }
    }),
    updateReply: (postId: number, replyId: number, body: string) => apiRequest(`/forum/posts/${postId}/replies/${replyId}`, {
      method: 'PUT',
      body: { body }
    }),
    deleteReply: (postId: number, replyId: number) => apiRequest(`/forum/posts/${postId}/replies/${replyId}`, {
      method: 'DELETE'
    })
  }

  // ============ АУТЕНТИФИКАЦИЯ ============
  const authAPI = {
    register: (userData: any) => apiRequest('/auth/register', {
      method: 'POST',
      body: userData
    }),

    login: (credentials: any) => apiRequest('/auth/login', {
      method: 'POST',
      body: credentials
    }),

    saveAuthData: (token: string, user: any) => {
      if (process.client) {
        localStorage.setItem('authToken', token)
        localStorage.setItem('userData', JSON.stringify(user))
      }
    },

    logout: () => {
      if (process.client) {
        localStorage.removeItem('authToken')
        localStorage.removeItem('userData')
      }
    },

    getCurrentUser: () => {
      if (process.client) {
        const userStr = localStorage.getItem('userData')
        return userStr ? JSON.parse(userStr) : null
      }
      return null
    },

    isAuthenticated: () => {
      if (process.client) {
        return !!localStorage.getItem('authToken')
      }
      return false
    },

    getToken: () => {
      if (process.client) {
        return localStorage.getItem('authToken')
      }
      return null
    }
  }

  // ============ УТИЛИТЫ ============
  const handleApiError = (error: any, defaultMessage = 'Произошла ошибка') => {
    console.error('API Error Handling:', error)

    const message = error.message || defaultMessage

    if (message.includes('401') || message.includes('Unauthorized')) {
      authAPI.logout()
      if (process.client) {
        router.push('/login')
      }
      return 'Сессия истекла. Пожалуйста, войдите снова.'
    }
    if (message.includes('403') || message.includes('Forbidden')) {
      return 'Недостаточно прав для выполнения этого действия.'
    }
    if (message.includes('404') || message.includes('Not Found')) {
      return 'Запрашиваемый ресурс не найден.'
    }
    if (message.includes('409') || message.includes('Conflict')) {
      return 'Ресурс уже существует или возник конфликт данных.'
    }
    if (message.includes('422') || message.includes('Validation')) {
      return 'Некорректные данные. Проверьте введенную информацию.'
    }
    if (message.includes('500') || message.includes('Server Error')) {
      return 'Внутренняя ошибка сервера. Пожалуйста, попробуйте позже.'
    }

    return message
  }

  const sanitizeData = (data: any) => {
    const cleaned: any = {}

    Object.keys(data).forEach(key => {
      let value = data[key]

      if (typeof value === 'string') {
        value = value.trim()
        
        if (key === 'email' && !value.includes('@')) {
          throw new Error('Некорректный email адрес')
        }
      }

      if (value !== '' && value !== null && value !== undefined) {
        cleaned[key] = value
      }
    })

    return cleaned
  }

  return {
    apiRequest,
    forumAPI,
    authAPI,
    handleApiError,
    sanitizeData
  }
}