<!-- pages/profile/index.vue -->
<template>
  <main class="min-h-screen bg-gradient-to-br from-slate-950 via-slate-900 to-slate-950 pt-20 pb-20 px-4 sm:px-6 relative overflow-hidden">
    <!-- Static background -->
    <div class="absolute inset-0 bg-[radial-gradient(ellipse_at_top_right,_var(--tw-gradient-stops))] from-emerald-500/10 via-transparent to-transparent pointer-events-none"></div>
    <div class="absolute inset-0 bg-[linear-gradient(to_right,#10b98108_1px,transparent_1px),linear-gradient(to_bottom,#10b98108_1px,transparent_1px)] bg-[size:40px_40px] pointer-events-none"></div>

    <!-- Loading -->
    <div v-if="loading" class="flex items-center justify-center min-h-[70vh]">
      <div class="text-center">
        <div class="w-12 h-12 rounded-full border-2 border-emerald-500/30 border-t-emerald-500 mx-auto mb-5"></div>
        <p class="text-emerald-400/70 font-mono text-sm">{{ $t('profile.loading') }}</p>
      </div>
    </div>

    <!-- Profile Content -->
    <div v-else-if="userData" class="max-w-6xl mx-auto relative z-10">
      <!-- Profile Header -->
      <div class="relative bg-slate-900/70 backdrop-blur-sm border border-emerald-500/20 rounded-2xl overflow-hidden mb-8">
        <div class="absolute top-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-emerald-500/40 to-transparent"></div>
        <div class="p-6 md:p-8">
          <!-- Terminal header -->
          <div class="flex items-center gap-2 pb-4 mb-6 border-b border-slate-800/80">
            <div class="flex gap-1.5">
              <div class="w-3 h-3 rounded-full bg-red-500/80"></div>
              <div class="w-3 h-3 rounded-full bg-yellow-500/80"></div>
              <div class="w-3 h-3 rounded-full bg-green-500/80"></div>
            </div>
            <span class="text-slate-500 font-mono text-xs ml-2">$ whoami --my-profile</span>
            <div class="ml-auto flex items-center gap-2">
              <span class="relative flex h-2 w-2">
                <span class="absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
                <span class="relative inline-flex rounded-full h-2 w-2 bg-emerald-500"></span>
              </span>
              <span class="text-emerald-400/70 font-mono text-xs">online</span>
            </div>
          </div>

          <div class="flex flex-col lg:flex-row gap-8 items-center lg:items-start">
            <!-- Avatar -->
            <div class="flex flex-col items-center gap-4">
              <div class="relative">
                <div class="absolute -inset-1 bg-gradient-to-r from-emerald-500 to-teal-500 rounded-full blur-md opacity-20"></div>
                <div class="relative w-32 h-32 rounded-full bg-gradient-to-br from-emerald-500/20 to-slate-800 border-2 border-emerald-500/40 flex items-center justify-center overflow-hidden shadow-xl">
                  <img v-if="userData.avatarUrl" :src="userData.avatarUrl" class="w-full h-full object-cover" />
                  <span v-else class="text-5xl text-emerald-400 font-mono font-bold">{{ userData.username?.charAt(0).toUpperCase() }}</span>
                </div>
              </div>

              <!-- Social links -->
              <div v-if="socialLinks.length" class="flex flex-wrap justify-center gap-2">
                <a v-for="link in socialLinks" :key="link.id" :href="link.url" target="_blank" rel="noopener noreferrer"
                  class="p-2.5 rounded-full bg-slate-800/80 border border-slate-700/80 text-slate-400">
                  <img v-if="link.platform === 'github'" src="https://cdn-icons-png.flaticon.com/256/25/25231.png" class="w-4 h-4 brightness-0 invert opacity-80" />
                  <img v-else-if="link.platform === 'twitter'" src="https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcRJ3X0LHh-DqOD8MPrmr8K0XtCnIH6ftjqFQw&s" class="w-4 h-4 rounded-sm object-contain" />
                  <img v-else-if="link.platform === 'youtube'" src="https://static.vecteezy.com/system/resources/thumbnails/018/930/572/small_2x/youtube-logo-youtube-icon-transparent-free-png.png" class="w-4 h-4 object-contain" />
                  <svg v-else class="w-4 h-4" viewBox="0 0 24 24" fill="none" stroke="currentColor"><circle cx="12" cy="12" r="10"/><line x1="2" y1="12" x2="22" y2="12"/><path d="M12 2a15.3 15.3 0 0 1 4 10 15.3 15.3 0 0 1-4 10 15.3 15.3 0 0 1-4-10 15.3 15.3 0 0 1 4-10z"/></svg>
                </a>
              </div>
            </div>

            <!-- User info -->
            <div class="flex-1 text-center lg:text-left">
              <div class="mb-4">
                <h1 class="text-3xl md:text-4xl font-bold bg-gradient-to-r from-white to-emerald-200 bg-clip-text text-transparent font-mono mb-1">{{ userData.username }}</h1>
                <p class="text-emerald-400 font-mono text-sm tracking-wide">{{ userData.email }}</p>
              </div>

              <p v-if="userData.bio" class="text-slate-300 text-sm leading-relaxed mb-6 max-w-xl mx-auto lg:mx-0 italic border-l-2 border-emerald-500/30 pl-4">“{{ userData.bio }}”</p>
              <p v-else class="text-slate-500 text-sm italic mb-6">{{ $t('profile.noBio') }}</p>

              <div class="flex flex-wrap justify-center lg:justify-start gap-4 text-xs font-mono text-slate-500">
                <div v-if="userData.createdAt" class="flex items-center gap-1.5">
                  <svg class="w-3.5 h-3.5" viewBox="0 0 24 24" fill="none" stroke="currentColor"><circle cx="12" cy="12" r="10"/><polyline points="12 6 12 12 16 14"/></svg>
                  <span>{{ $t('profile.since', { date: formatDate(userData.createdAt) }) }}</span>
                </div>
                <div class="flex items-center gap-1.5">
                  <svg class="w-3.5 h-3.5" viewBox="0 0 24 24" fill="none" stroke="currentColor"><path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"/><circle cx="12" cy="7" r="4"/></svg>
                  <span>ID: {{ userData.id }}</span>
                </div>
                <div class="flex items-center gap-1.5">
                  <svg class="w-3.5 h-3.5" viewBox="0 0 24 24" fill="none" stroke="currentColor"><path d="M12 2v4M12 18v4M4.93 4.93l2.83 2.83M16.24 16.24l2.83 2.83M2 12h4M18 12h4M4.93 19.07l2.83-2.83M16.24 7.76l2.83-2.83"/></svg>
                  <span>{{ userData.role || 'USER' }}</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      <!-- Badges -->
      <div v-if="badges.length" class="bg-slate-900/40 backdrop-blur-sm border border-emerald-500/20 rounded-2xl overflow-hidden mb-8">
        <div class="flex items-center gap-2 px-6 py-4 border-b border-slate-800/80">
          <div class="flex gap-1.5">
            <div class="w-2.5 h-2.5 rounded-full bg-red-500/70"></div>
            <div class="w-2.5 h-2.5 rounded-full bg-yellow-500/70"></div>
            <div class="w-2.5 h-2.5 rounded-full bg-green-500/70"></div>
          </div>
          <span class="text-slate-400 font-mono text-xs ml-2">my_badges</span>
          <span class="ml-auto text-emerald-400 text-xs bg-emerald-500/10 px-2 py-0.5 rounded-full border border-emerald-500/20">{{ badges.length }}</span>
        </div>
        <div class="p-5 flex flex-wrap gap-3">
          <div v-for="item in badges" :key="item.id" class="flex items-center gap-3 px-4 py-2.5 rounded-xl bg-slate-800/50 border border-slate-700/50">
            <div class="w-8 h-8 rounded-full bg-slate-700/60 flex items-center justify-center">
              <img v-if="item.badge?.imageUrl" :src="item.badge.imageUrl" class="w-5 h-5 object-contain" />
              <span v-else class="text-emerald-400 text-sm">🏅</span>
            </div>
            <span class="font-mono text-sm font-medium text-slate-300">{{ item.badge?.name }}</span>
          </div>
        </div>
      </div>

      <!-- Certifications -->
      <div v-if="certifications.length" class="bg-slate-900/40 backdrop-blur-sm border border-emerald-500/20 rounded-2xl overflow-hidden mb-8">
        <div class="flex items-center gap-2 px-6 py-4 border-b border-slate-800/80">
          <div class="flex gap-1.5">
            <div class="w-2.5 h-2.5 rounded-full bg-red-500/70"></div>
            <div class="w-2.5 h-2.5 rounded-full bg-yellow-500/70"></div>
            <div class="w-2.5 h-2.5 rounded-full bg-green-500/70"></div>
          </div>
          <span class="text-slate-400 font-mono text-xs ml-2">my_certifications</span>
          <span class="ml-auto text-amber-400 text-xs bg-amber-500/10 px-2 py-0.5 rounded-full border border-amber-500/20">{{ certifications.length }}</span>
        </div>
        <div class="p-5 grid sm:grid-cols-2 gap-3">
          <div v-for="cert in certifications" :key="cert.id" class="flex items-center gap-4 p-3 bg-gradient-to-r from-slate-800/40 to-slate-800/20 rounded-xl border border-slate-700/50">
            <div class="w-10 h-10 bg-amber-500/10 border border-amber-500/20 rounded-xl flex items-center justify-center shrink-0">
              <svg class="w-5 h-5 text-amber-400" viewBox="0 0 24 24" fill="none" stroke="currentColor"><circle cx="12" cy="8" r="6"/><path d="M15.477 12.89L17 22l-5-3-5 3 1.523-9.11"/></svg>
            </div>
            <div class="min-w-0 flex-1">
              <p class="text-white text-sm font-semibold font-mono truncate">{{ cert.course?.title || $t('profile.course') }}</p>
              <p class="text-slate-500 text-xs mt-0.5">{{ $t('profile.issued', { date: formatDate(cert.issuedAt) }) }}</p>
            </div>
          </div>
        </div>
      </div>

      <!-- My Posts -->
      <div class="bg-slate-900/40 backdrop-blur-sm border border-emerald-500/20 rounded-2xl overflow-hidden">
        <div class="flex items-center gap-2 px-6 py-4 border-b border-slate-800/80">
          <div class="flex gap-1.5">
            <div class="w-2.5 h-2.5 rounded-full bg-red-500/70"></div>
            <div class="w-2.5 h-2.5 rounded-full bg-yellow-500/70"></div>
            <div class="w-2.5 h-2.5 rounded-full bg-green-500/70"></div>
          </div>
          <span class="text-slate-400 font-mono text-xs ml-2">my_posts</span>
          <span class="ml-auto text-slate-500 text-xs">{{ myPosts.length }} {{ $t('profile.records') }}</span>
        </div>

        <div v-if="myPosts.length" class="divide-y divide-slate-800/60">
          <NuxtLink v-for="post in myPosts" :key="post.id" :to="`/forum/${post.id}`" class="flex items-start gap-4 px-6 py-5">
            <div class="w-2 h-2 bg-emerald-500/40 rounded-full mt-2.5 shrink-0"></div>
            <div class="flex-1 min-w-0">
              <h3 class="text-slate-100 text-base font-medium line-clamp-1 mb-1.5">{{ post.title }}</h3>
              <div class="flex flex-wrap items-center gap-x-4 gap-y-1 text-xs font-mono text-slate-500">
                <span class="flex items-center gap-1.5">
                  <svg class="w-3.5 h-3.5" viewBox="0 0 24 24" fill="none" stroke="currentColor"><path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z"/></svg>
                  {{ post.replies?.length ?? post._count?.replies ?? 0 }}
                </span>
                <span class="flex items-center gap-1.5">
                  <svg class="w-3.5 h-3.5" viewBox="0 0 24 24" fill="none" stroke="currentColor"><path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z"/></svg>
                  {{ post.likesCount ?? 0 }}
                </span>
                <span>{{ formatDate(post.createdAt) }}</span>
              </div>
            </div>
            <svg class="w-5 h-5 text-slate-600 shrink-0" viewBox="0 0 24 24" fill="none" stroke="currentColor"><path d="M5 12h14M12 5l7 7-7 7"/></svg>
          </NuxtLink>
        </div>
        <div v-else class="flex flex-col items-center justify-center py-16 text-center">
          <div class="w-16 h-16 bg-slate-800/60 rounded-2xl flex items-center justify-center mb-4 border border-slate-700">
            <svg class="w-7 h-7 text-slate-600" viewBox="0 0 24 24" fill="none" stroke="currentColor"><path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z"/></svg>
          </div>
          <p class="text-slate-500 font-mono text-sm">{{ $t('profile.noPosts') }}</p>
          <NuxtLink to="/forum/new" class="mt-4 text-emerald-400 font-mono text-sm hover:underline">{{ $t('profile.createFirstPost') }}</NuxtLink>
        </div>
      </div>
    </div>
  </main>
</template>

<script setup>
import { ref, onMounted } from 'vue'
import { useAuth } from '~/composables/useAuth'
import { useApi } from '~/composables/useApi'

const { user, isAuthenticated, refreshUser, logout } = useAuth()
const { apiRequest } = useApi()
const { $t } = useNuxtApp()

const loading = ref(true)
const userData = ref(null)
const socialLinks = ref([])
const badges = ref([])
const certifications = ref([])
const myPosts = ref([])

const formatDate = (dateStr) => {
  if (!dateStr) return '—'
  return new Date(dateStr).toLocaleDateString('ru-RU', { day: 'numeric', month: 'short', year: 'numeric' })
}

const loadProfile = async () => {
  loading.value = true
  try {
    // Получаем актуальные данные пользователя
    let currentUser = user.value
    if (!currentUser?.id) {
      await refreshUser()
      currentUser = user.value
    }
    
    if (!currentUser?.id) {
      throw new Error('Пользователь не авторизован')
    }
    
    // Загружаем данные пользователя
    const userResponse = await apiRequest(`/users/${currentUser.id}`)
    userData.value = userResponse
    
    // Загружаем соц. ссылки
    const linksResponse = await apiRequest('/social-links')
    socialLinks.value = linksResponse
    
    // Загружаем значки
    const badgesResponse = await apiRequest('/badges/me')
    badges.value = badgesResponse
    
    // Загружаем сертификаты
    const certsResponse = await apiRequest('/certifications/me')
    certifications.value = certsResponse
    
    // Загружаем посты пользователя
    const postsResponse = await apiRequest('/forum/posts?limit=50')
    const allPosts = postsResponse.data || postsResponse || []
    myPosts.value = allPosts.filter(p => p.userId === userData.value.id || p.user?.id === userData.value.id)
    
  } catch (err) {
    console.error('Error loading profile:', err)
    if (err.message?.includes('401') || err.message?.includes('Unauthorized')) {
      await logout()
      await navigateTo('/login')
    }
  } finally {
    loading.value = false
  }
}

onMounted(async () => {
  if (!isAuthenticated.value) {
    await navigateTo('/login')
    return
  }
  await loadProfile()
})
</script>