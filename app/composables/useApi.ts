// composables/useApi.ts
export const useApi = () => {
  const config = useRuntimeConfig()
  const router = useRouter()
  const { $t } = useNuxtApp()

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

      if (error.message.includes('Failed to fetch') ||
          error.message.includes('NetworkError') ||
          error.message.includes('Network Error')) {
        userMessage = $t('errors.networkError')
      }
      else if (error.message.includes('timeout')) {
        userMessage = $t('errors.timeout')
      }
      else if (error.message.includes('Invalid JSON') || error.message.includes('HTTP Error')) {
        userMessage = $t('errors.invalidResponse')
      }

      throw new Error(userMessage)
    }
  }

  // ============ ФОРУМ ============
  const forumAPI = {
    // Посты
    getPosts: (page = 1, limit = 20) => apiRequest(`/forum/posts?page=${page}&limit=${limit}`),
    getPost: (id: number) => apiRequest(`/forum/posts/${id}`),
    createPost: (data: { title: string; body: string; tags?: string[] }) => apiRequest('/forum/posts', {
      method: 'POST',
      body: data
    }),
    updatePost: (id: number, data: { title?: string; body?: string; tags?: string[] }) => apiRequest(`/forum/posts/${id}`, {
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
    }),

    // Лайки постов
    likePost: (postId: number) => apiRequest(`/forum/posts/${postId}/likes`, { method: 'POST' }),
    unlikePost: (postId: number) => apiRequest(`/forum/posts/${postId}/likes`, { method: 'DELETE' }),

    // Лайки ответов
    likeReply: (postId: number, replyId: number) => apiRequest(`/forum/posts/${postId}/replies/${replyId}/likes`, { method: 'POST' }),
    unlikeReply: (postId: number, replyId: number) => apiRequest(`/forum/posts/${postId}/replies/${replyId}/likes`, { method: 'DELETE' }),
  }

  // ============ ВЛОЖЕНИЯ ФОРУМА ============
  const uploadFileRequest = async (endpoint: string, method: string, formData: FormData) => {
    const url = `${config.public.apiBase}${endpoint}`
    const headers: Record<string, string> = {}

    if (process.client) {
      const token = localStorage.getItem('authToken')
      if (token) {
        headers.Authorization = `Bearer ${token}`
      }
    }

    const response = await fetch(url, {
      method,
      headers,
      body: formData,
    })

    if (!response.ok) {
      let errorMessage = `HTTP Error: ${response.status}`
      try {
        const data = await response.json()
        errorMessage = data.message || data.error || errorMessage
      } catch {}
      throw new Error(errorMessage)
    }

    return response.json()
  }

  const forumAttachmentAPI = {
    uploadPost: (postId: number, file: File) => {
      const fd = new FormData()
      fd.append('attachment', file)
      return uploadFileRequest(`/forum/posts/${postId}/attachments`, 'POST', fd)
    },
    deletePost: (postId: number, attachmentId: number) =>
      apiRequest(`/forum/posts/${postId}/attachments/${attachmentId}`, { method: 'DELETE' }),
    uploadReply: (postId: number, replyId: number, file: File) => {
      const fd = new FormData()
      fd.append('attachment', file)
      return uploadFileRequest(`/forum/posts/${postId}/replies/${replyId}/attachments`, 'POST', fd)
    },
    deleteReply: (postId: number, replyId: number, attachmentId: number) =>
      apiRequest(`/forum/posts/${postId}/replies/${replyId}/attachments/${attachmentId}`, { method: 'DELETE' }),
  }

  // ============ ПРОФИЛИ (публичные) ============
  const profileAPI = {
    // Получить публичный профиль по ID
    getById: (userId: number) => apiRequest(`/profiles/${userId}`),
    // Получить публичный профиль по username
    getByUsername: (username: string) => apiRequest(`/profiles/u/${username}`),
  }

  // ============ КУРСЫ ============
  const courseAPI = {
    // Получить список всех курсов
    getAll: () => apiRequest('/courses'),
    // Получить курс по ID
    getById: (courseId: number) => apiRequest(`/courses/${courseId}`),

    // Прогресс пользователя по курсу (требуется авторизация)
    getProgress: (courseId: number) => apiRequest(`/courses/${courseId}/progress`),
    // Обновить прогресс (PUT)
    updateProgress: (courseId: number, status: 'not_started' | 'in_progress' | 'completed') =>
      apiRequest(`/courses/${courseId}/progress`, {
        method: 'PUT',
        body: { status }
      }),

    // Рейтинги
    getRating: (courseId: number) => apiRequest(`/courses/${courseId}/ratings`),               // средний рейтинг и количество
    getMyRating: (courseId: number) => apiRequest(`/courses/${courseId}/ratings/me`),           // оценка текущего пользователя
    addOrUpdateRating: (courseId: number, rating: number) =>
      apiRequest(`/courses/${courseId}/ratings`, {
        method: 'POST',
        body: { rating }
      }),
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
  const handleApiError = (error: any, defaultMessage = 'errors.default') => {
    console.error('API Error Handling:', error)

    const message = error.message || $t(defaultMessage)

    if (message.includes('401') || message.includes('Unauthorized')) {
      authAPI.logout()
      if (process.client) {
        router.push('/login')
      }
      return $t('errors.unauthorized')
    }
    if (message.includes('403') || message.includes('Forbidden')) {
      return $t('errors.forbidden')
    }
    if (message.includes('404') || message.includes('Not Found')) {
      return $t('errors.notFound')
    }
    if (message.includes('409') || message.includes('Conflict')) {
      return $t('errors.conflict')
    }
    if (message.includes('422') || message.includes('Validation')) {
      return $t('errors.validation')
    }
    if (message.includes('500') || message.includes('Server Error')) {
      return $t('errors.serverError')
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
          throw new Error($t('errors.validation'))
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
    forumAttachmentAPI,
    profileAPI,
    courseAPI,      // <-- добавлено
    authAPI,
    handleApiError,
    sanitizeData
  }
}