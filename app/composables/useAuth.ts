export interface User {
  id?: number
  email: string
  username: string
  firstName?: string
  lastName?: string
  avatarUrl?: string
  bio?: string
  role?: string
  createdAt?: string
  updatedAt?: string
}

export const useAuth = () => {
  const router = useRouter()
  const { authAPI, handleApiError, sanitizeData, apiRequest } = useApi()
  const { $t } = useNuxtApp()
  
  const user = useState<User | null>('auth:user', () => null)
  const token = useState<string | null>('auth:token', () => null)
  const loading = useState<boolean>('auth:loading', () => false)

  const normalizeUser = (data: any): any => {
    if (!data) return data
    return {
      ...data,
      avatarUrl: data.avatarUrl || data.avatar_url
    }
  }

  const initialize = () => {
    if (process.client) {
      const savedToken = localStorage.getItem('authToken')
      const savedUser = localStorage.getItem('userData')

      if (savedToken && savedUser) {
        try {
          const parsed = JSON.parse(savedUser)
          user.value = normalizeUser(parsed)
        } catch (error) {
          console.error('Error parsing saved user data:', error)
          logout()
        }
      }
    }
  }

  const isAuthenticated = computed(() => {
    return !!token.value && !!user.value
  })

  const login = async (credentials: any, redirectPath = '/'): Promise<void> => {
    loading.value = true
    
    try {
      const cleanCredentials = sanitizeData(credentials)
      const response = await authAPI.login(cleanCredentials)

      let authToken = response.token || response.accessToken
      let userData = response.user || response

      if (!authToken) {
        throw new Error($t('auth.noToken'))
      }

      if (!userData || !userData.email) {
        userData = {
          id: response.id,
          email: response.email || credentials.email,
          username: response.username || response.name,
          role: response.role,
          avatarUrl: response.avatarUrl || response.avatar_url
        }
      }

      userData = normalizeUser(userData)

      token.value = authToken
      user.value = userData
      
      authAPI.saveAuthData(authToken, userData)

      await navigateTo(redirectPath)

    } catch (error: any) {
      console.error('Login error:', error)
      throw error
    } finally {
      loading.value = false
    }
  }

  const register = async (data: any, redirectPath = '/login'): Promise<void> => {
    loading.value = true
    
    try {
      const cleanData = sanitizeData(data)
      const response = await authAPI.register(cleanData)

      let authToken = response.token || response.accessToken
      
      if (authToken) {
        let userData = response.user || response

        if (!userData || !userData.email) {
          userData = {
            id: response.id,
            email: response.email || data.email,
            username: response.username || data.username,
            role: response.role,
            avatarUrl: response.avatarUrl || response.avatar_url
          }
        }

        userData = normalizeUser(userData)

        token.value = authToken
        user.value = userData
        
        authAPI.saveAuthData(authToken, userData)

        await navigateTo('/')
      } else {
        await navigateTo({
          path: '/login',
          query: {
            message: $t('auth.registerRedirect')
          }
        })
      }

    } catch (error: any) {
      console.error('Register error:', error)
      throw error
    } finally {
      loading.value = false
    }
  }

  const logout = async (redirectToLogin = true) => {
    try {
      token.value = null
      user.value = null
      
      authAPI.logout()

      if (redirectToLogin) {
        await navigateTo('/login')
      }
    } catch (error) {
      console.error('Logout error:', error)
    }
  }

  const getCurrentUser = (): User | null => {
    return user.value
  }

  const getToken = (): string | null => {
    return token.value
  }

  const updateUser = (userData: Partial<User>) => {
    if (user.value) {
      user.value = { ...user.value, ...userData }
      
      if (process.client) {
        localStorage.setItem('userData', JSON.stringify(user.value))
      }
    }
  }

  const refreshUser = async (): Promise<User | null> => {
    if (!user.value?.id) {
      if (process.client) {
        const savedUser = localStorage.getItem('userData')
        if (savedUser) {
          try {
            const parsed = JSON.parse(savedUser)
            if (parsed.id) {
              user.value = parsed
            }
          } catch(e) {}
        }
      }
      if (!user.value?.id) return null
    }
    
    try {
      const response = await apiRequest(`/users/${user.value.id}`)
      const normalized = normalizeUser(response)
      user.value = normalized
      if (process.client) {
        localStorage.setItem('userData', JSON.stringify(normalized))
      }
      return normalized
    } catch (error) {
      console.error('Failed to refresh user:', error)
      return null
    }
  }

  const isAdmin = computed(() => {
    return user.value?.role === 'admin' || user.value?.role === 'administrator' || user.value?.role === 'ADMIN'
  })

  return {
    user: readonly(user),  
    token: readonly(token), 
    loading: readonly(loading),
    isAuthenticated,
    isAdmin,
    
    initialize,
    login,
    register,
    logout,
    getCurrentUser,
    getToken,
    updateUser,
    refreshUser 
  }
}