export default defineNuxtRouteMiddleware(() => {
  if (process.client) {
    const token = localStorage.getItem('authToken')
    if (!token) return navigateTo('/login')
  }
})