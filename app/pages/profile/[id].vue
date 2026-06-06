<template>
  <main class="min-h-screen bg-gradient-to-br from-slate-950 via-slate-900 to-slate-950 pt-20 pb-20 px-4 sm:px-6 relative overflow-hidden">
    <div class="absolute inset-0 bg-[radial-gradient(ellipse_at_top_right,_var(--tw-gradient-stops))] from-emerald-500/10 via-transparent to-transparent pointer-events-none"></div>
    <div class="absolute inset-0 bg-[linear-gradient(to_right,#10b98108_1px,transparent_1px),linear-gradient(to_bottom,#10b98108_1px,transparent_1px)] bg-[size:40px_40px] pointer-events-none"></div>
    <div class="absolute top-1/3 -left-48 w-96 h-96 bg-emerald-500/5 rounded-full blur-[100px]"></div>
    <div class="absolute bottom-1/3 -right-48 w-96 h-96 bg-emerald-500/5 rounded-full blur-[100px]"></div>

    <div v-if="loading" class="flex items-center justify-center min-h-[70vh]">
      <div class="text-center">
        <div class="relative w-16 h-16 mx-auto mb-6">
          <div class="absolute inset-0 rounded-full border-2 border-emerald-500/20 animate-ping"></div>
          <div class="absolute inset-2 rounded-full border-2 border-emerald-500/40 animate-ping" style="animation-delay: 0.3s"></div>
          <div class="absolute inset-0 rounded-full border-2 border-t-emerald-400 border-emerald-500/10 animate-spin"></div>
          <div class="absolute inset-4 rounded-full bg-emerald-500/10 flex items-center justify-center">
            <svg class="w-4 h-4 text-emerald-400" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
              <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"/><circle cx="12" cy="7" r="4"/>
            </svg>
          </div>
        </div>
        <p class="text-emerald-400/70 font-mono text-sm animate-pulse tracking-wide">{{ $t('profile.loading') }}</p>
      </div>
    </div>

    <div v-else-if="error" class="flex items-center justify-center min-h-[70vh]">
      <div class="text-center max-w-md mx-auto">
        <div class="relative inline-block mb-6">
          <div class="text-8xl font-mono font-bold text-emerald-500/10">404</div>
          <div class="absolute inset-0 flex items-center justify-center">
            <svg class="w-16 h-16 text-emerald-500/30" viewBox="0 0 24 24" fill="none" stroke="currentColor">
              <path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z"/>
            </svg>
          </div>
        </div>
        <p class="text-slate-400 font-mono text-sm mb-8">{{ $t('profile.notFound') }}</p>
        <NuxtLink to="/" class="inline-flex items-center gap-2 px-5 py-2 bg-emerald-500/10 border border-emerald-500/30 rounded-full text-emerald-400 font-mono text-sm">
          <span>$ cd ~</span>
          <svg class="w-4 h-4" viewBox="0 0 24 24" fill="none" stroke="currentColor"><path d="M5 12h14M12 5l7 7-7 7"/></svg>
        </NuxtLink>
      </div>
    </div>

    <div v-else-if="profile" class="max-w-6xl mx-auto relative z-10">
      <div class="relative bg-slate-900/70 backdrop-blur-sm border border-emerald-500/20 rounded-2xl overflow-hidden mb-8 shadow-2xl shadow-emerald-500/5">
        <div class="absolute top-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-emerald-500/40 to-transparent"></div>
        <div class="p-6 md:p-8">
          <div class="flex items-center gap-2 pb-4 mb-6 border-b border-slate-800/80">
            <div class="flex gap-1.5">
              <div class="w-3 h-3 rounded-full bg-red-500/80"></div>
              <div class="w-3 h-3 rounded-full bg-yellow-500/80"></div>
              <div class="w-3 h-3 rounded-full bg-green-500/80"></div>
            </div>
            <span class="text-slate-500 font-mono text-xs ml-2">$ whoami --profile</span>
          </div>

          <div class="flex flex-col lg:flex-row gap-8 items-center lg:items-start">
            <div class="flex flex-col items-center gap-4">
              <div class="relative">
                <div class="absolute -inset-1 bg-gradient-to-r from-emerald-500 to-teal-500 rounded-full blur-md opacity-20"></div>
                <div class="relative w-32 h-32 rounded-full bg-gradient-to-br from-emerald-500/20 to-slate-800 border-2 border-emerald-500/40 flex items-center justify-center overflow-hidden shadow-xl">
                  <img v-if="profile.avatarUrl" :src="profile.avatarUrl" class="w-full h-full object-cover" alt="avatar" />
                  <span v-else class="text-5xl text-emerald-400 font-mono font-bold">{{ profile.username?.charAt(0).toUpperCase() }}</span>
                </div>
                <div v-if="profile.equippedBadge" class="absolute -bottom-2 -right-2 w-10 h-10 bg-slate-900 border-2 border-slate-800 rounded-full flex items-center justify-center shadow-lg cursor-help z-10">
                  <img v-if="profile.equippedBadge.imageUrl" :src="profile.equippedBadge.imageUrl" class="w-5 h-5 object-contain" />
                  <span v-else class="text-emerald-400 text-lg">★</span>
                  <div class="absolute bottom-full mb-2 left-1/2 -translate-x-1/2 opacity-0 group-hover:opacity-100 pointer-events-none whitespace-nowrap z-20">
                    <div class="bg-slate-800 border border-emerald-500/40 rounded-lg px-3 py-1.5 font-mono text-xs text-emerald-300 shadow-xl backdrop-blur-sm">{{ profile.equippedBadge.name }}</div>
                  </div>
                </div>
              </div>

              <div v-if="profile.socialLinks?.length" class="flex flex-wrap justify-center gap-2">
                <a v-for="link in profile.socialLinks" :key="link.id" :href="link.url" target="_blank" rel="noopener noreferrer"
                  class="p-2.5 rounded-full bg-slate-800/80 border border-slate-700/80 text-slate-400">
                  <img v-if="link.platform === 'github'" src="https://cdn-icons-png.flaticon.com/256/25/25231.png" class="w-4 h-4 brightness-0 invert opacity-80" />
                  <img v-else-if="link.platform === 'twitter'" src="https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcRJ3X0LHh-DqOD8MPrmr8K0XtCnIH6ftjqFQw&s" class="w-4 h-4 rounded-sm object-contain" />
                  <img v-else-if="link.platform === 'youtube'" src="https://static.vecteezy.com/system/resources/thumbnails/018/930/572/small_2x/youtube-logo-youtube-icon-transparent-free-png.png" class="w-4 h-4 object-contain" />
                  <svg v-else class="w-4 h-4" viewBox="0 0 24 24" fill="none" stroke="currentColor"><circle cx="12" cy="12" r="10"/><line x1="2" y1="12" x2="22" y2="12"/><path d="M12 2a15.3 15.3 0 0 1 4 10 15.3 15.3 0 0 1-4 10 15.3 15.3 0 0 1-4-10 15.3 15.3 0 0 1 4-10z"/></svg>
                </a>
              </div>
            </div>

            <div class="flex-1 text-center lg:text-left">
              <div class="mb-4">
                <h1 class="text-3xl md:text-4xl font-bold bg-gradient-to-r from-white to-emerald-200 bg-clip-text text-transparent font-mono mb-1">{{ profile.username }}</h1>
                <p class="text-emerald-400 font-mono text-sm tracking-wide">@{{ profile.username }}</p>
              </div>

              <p v-if="profile.bio" class="text-slate-300 text-sm leading-relaxed mb-6 max-w-xl mx-auto lg:mx-0 italic border-l-2 border-emerald-500/30 pl-4">“{{ profile.bio }}”</p>

              <div class="grid grid-cols-2 sm:grid-cols-3 gap-4 max-w-md mx-auto lg:mx-0 mb-6">
                <div class="bg-slate-800/50 rounded-xl p-3 text-center border border-slate-700/50">
                  <div class="flex items-center justify-center gap-1 text-emerald-400 mb-1">
                    <svg class="w-4 h-4" viewBox="0 0 24 24" fill="none" stroke="currentColor"><path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z"/></svg>
                    <span class="text-xl font-bold text-white">{{ profile.stats?.postsCount ?? 0 }}</span>
                  </div>
                  <span class="text-slate-400 text-xs font-mono">{{ $t('profile.posts') }}</span>
                </div>
                <div class="bg-slate-800/50 rounded-xl p-3 text-center border border-slate-700/50">
                  <div class="flex items-center justify-center gap-1 text-emerald-400 mb-1">
                    <svg class="w-4 h-4" viewBox="0 0 24 24" fill="none" stroke="currentColor"><polyline points="9 11 12 14 22 4"/><path d="M21 12v7a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h11"/></svg>
                    <span class="text-xl font-bold text-white">{{ profile.stats?.repliesCount ?? 0 }}</span>
                  </div>
                  <span class="text-slate-400 text-xs font-mono">{{ $t('profile.replies') }}</span>
                </div>
                <div v-if="profile.certifications?.length" class="bg-slate-800/50 rounded-xl p-3 text-center border border-slate-700/50">
                  <div class="flex items-center justify-center gap-1 text-yellow-400 mb-1">
                    <svg class="w-4 h-4" viewBox="0 0 24 24" fill="none" stroke="currentColor"><circle cx="12" cy="8" r="6"/><path d="M15.477 12.89L17 22l-5-3-5 3 1.523-9.11"/></svg>
                    <span class="text-xl font-bold text-white">{{ profile.certifications.length }}</span>
                  </div>
                  <span class="text-slate-400 text-xs font-mono">{{ $t('profile.certificates') }}</span>
                </div>
              </div>

              <div v-if="profile.createdAt" class="flex justify-center lg:justify-start text-xs font-mono text-slate-500">
                <div class="flex items-center gap-1.5">
                  <svg class="w-3.5 h-3.5" viewBox="0 0 24 24" fill="none" stroke="currentColor"><circle cx="12" cy="12" r="10"/><polyline points="12 6 12 12 16 14"/></svg>
                  <span>{{ $t('profile.since', { date: formatDate(profile.createdAt) }) }}</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      <div v-if="profile.badges?.length" class="bg-slate-900/40 backdrop-blur-sm border border-emerald-500/20 rounded-2xl overflow-hidden mb-8">
        <div class="flex items-center gap-2 px-6 py-4 border-b border-slate-800/80">
          <div class="flex gap-1.5">
            <div class="w-2.5 h-2.5 rounded-full bg-red-500/70"></div>
            <div class="w-2.5 h-2.5 rounded-full bg-yellow-500/70"></div>
            <div class="w-2.5 h-2.5 rounded-full bg-green-500/70"></div>
          </div>
          <span class="text-slate-400 font-mono text-xs ml-2">badges_collection</span>
          <span class="ml-auto text-emerald-400 text-xs bg-emerald-500/10 px-2 py-0.5 rounded-full border border-emerald-500/20">{{ profile.badges.length }}</span>
        </div>
        <div class="p-5 flex flex-wrap gap-3">
          <div v-for="item in profile.badges" :key="item.id"
            class="relative flex items-center gap-3 px-4 py-2.5 rounded-xl"
            :class="profile.equippedBadge?.id === item.badge?.id ? 'bg-emerald-500/15 border border-emerald-500/40 shadow-lg shadow-emerald-500/5' : 'bg-slate-800/50 border border-slate-700/50'">
            <div class="w-8 h-8 rounded-full flex items-center justify-center" :class="profile.equippedBadge?.id === item.badge?.id ? 'bg-emerald-500/20' : 'bg-slate-700/60'">
              <img v-if="item.badge?.imageUrl" :src="item.badge.imageUrl" class="w-5 h-5 object-contain" />
              <span v-else class="text-emerald-400 text-sm">🏅</span>
            </div>
            <span class="font-mono text-sm font-medium" :class="profile.equippedBadge?.id === item.badge?.id ? 'text-emerald-300' : 'text-slate-300'">{{ item.badge?.name }}</span>
            <div v-if="profile.equippedBadge?.id === item.badge?.id" class="absolute -top-1 -right-1">
              <span class="relative flex h-2.5 w-2.5">
                <span class="absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
                <span class="relative inline-flex rounded-full h-2.5 w-2.5 bg-emerald-500"></span>
              </span>
            </div>
          </div>
        </div>
      </div>

      <div v-if="profile.certifications?.length" class="bg-slate-900/40 backdrop-blur-sm border border-emerald-500/20 rounded-2xl overflow-hidden mb-8">
        <div class="flex items-center gap-2 px-6 py-4 border-b border-slate-800/80">
          <div class="flex gap-1.5">
            <div class="w-2.5 h-2.5 rounded-full bg-red-500/70"></div>
            <div class="w-2.5 h-2.5 rounded-full bg-yellow-500/70"></div>
            <div class="w-2.5 h-2.5 rounded-full bg-green-500/70"></div>
          </div>
          <span class="text-slate-400 font-mono text-xs ml-2">certifications</span>
          <span class="ml-auto text-amber-400 text-xs bg-amber-500/10 px-2 py-0.5 rounded-full border border-amber-500/20">{{ profile.certifications.length }}</span>
        </div>
        <div class="p-4 sm:p-5 grid sm:grid-cols-2 gap-3">
          <div v-for="cert in profile.certifications" :key="cert.id"
            class="relative flex items-center gap-4 p-4 bg-gradient-to-br from-slate-800/60 to-slate-800/20 rounded-xl border border-amber-500/20 hover:border-amber-500/40 transition-all group">
            <div class="absolute top-0 right-0 w-16 h-16 bg-amber-500/5 rounded-bl-3xl rounded-tr-xl pointer-events-none"></div>
            <div class="w-12 h-12 sm:w-10 sm:h-10 bg-gradient-to-br from-amber-500/20 to-amber-500/5 border border-amber-500/30 rounded-xl flex items-center justify-center shrink-0">
              <svg class="w-6 sm:w-5 h-6 sm:h-5 text-amber-400" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8"><circle cx="12" cy="8" r="6"/><path d="M15.477 12.89L17 22l-5-3-5 3 1.523-9.11"/></svg>
            </div>
            <div class="min-w-0 flex-1">
              <p class="text-white text-sm font-semibold font-mono truncate">{{ cert.course?.title || $t('profile.course') }}</p>
              <p class="text-slate-500 text-xs mt-0.5 font-mono">{{ $t('profile.issued', { date: formatDate(cert.issuedAt) }) }}</p>
            </div>
          </div>
        </div>
      </div>

      <div class="bg-slate-900/40 backdrop-blur-sm border border-emerald-500/20 rounded-2xl overflow-hidden">
        <div class="flex items-center gap-2 px-6 py-4 border-b border-slate-800/80">
          <div class="flex gap-1.5">
            <div class="w-2.5 h-2.5 rounded-full bg-red-500/70"></div>
            <div class="w-2.5 h-2.5 rounded-full bg-yellow-500/70"></div>
            <div class="w-2.5 h-2.5 rounded-full bg-green-500/70"></div>
          </div>
          <span class="text-slate-400 font-mono text-xs ml-2">recent_posts</span>
          <span class="ml-auto text-slate-500 text-xs">{{ userPosts.length }} {{ $t('profile.records') }}</span>
        </div>

        <div v-if="userPosts.length" class="divide-y divide-slate-800/60">
          <NuxtLink v-for="post in userPosts" :key="post.id" :to="`/forum/${post.id}`"
            class="flex items-start gap-4 px-6 py-5">
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
            <svg class="w-5 h-5 text-slate-600 shrink-0" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M5 12h14M12 5l7 7-7 7"/></svg>
          </NuxtLink>
        </div>

        <div v-else class="flex flex-col items-center justify-center py-16 text-center">
          <div class="w-16 h-16 bg-slate-800/60 rounded-2xl flex items-center justify-center mb-4 border border-slate-700">
            <svg class="w-7 h-7 text-slate-600" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5"><path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z"/></svg>
          </div>
          <p class="text-slate-500 font-mono text-sm">{{ $t('profile.noUserPosts') }}</p>
          <p class="text-slate-600 text-xs mt-1">{{ $t('profile.soonPosts') }}</p>
        </div>
      </div>
    </div>
  </main>
</template>

<script setup lang="ts">
const route = useRoute()
const { apiRequest, forumAPI } = useApi()
const { $t } = useNuxtApp()

const profile = ref(null)
const loading = ref(true)
const error = ref(false)
const userPosts = ref([])

const formatDate = (dateStr) => {
  if (!dateStr) return '—'
  try {
    return new Date(dateStr).toLocaleDateString('ru-RU', { day: 'numeric', month: 'short', year: 'numeric' })
  } catch {
    return '—'
  }
}

const fetchProfile = async () => {
  loading.value = true
  error.value = false
  try {
    const data = await apiRequest(`/profiles/${route.params.id}`)
    profile.value = data

    if (data.recentPosts && Array.isArray(data.recentPosts)) {
      userPosts.value = data.recentPosts
    } else {
      await fetchUserPosts(data.id)
    }
  } catch (e) {
    console.error(e)
    error.value = true
  } finally {
    loading.value = false
  }
}

const fetchUserPosts = async (userId) => {
  try {
    let posts = []
    try {
      const response = await forumAPI.getPosts(1, 50)
      posts = response.data || response || []
    } catch (err) {
      const fallback = await apiRequest('/forum/posts?limit=50')
      posts = fallback.data || fallback || []
    }

    if (Array.isArray(posts)) {
      userPosts.value = posts.filter(post => post.userId === userId || post.user?.id === userId)
    } else {
      userPosts.value = []
    }
  } catch (err) {
    console.error('Failed to fetch user posts', err)
    userPosts.value = []
  }
}

onMounted(fetchProfile)
watch(() => route.params.id, fetchProfile)
</script>

<style scoped>
::-webkit-scrollbar {
  width: 6px;
  height: 6px;
}
::-webkit-scrollbar-track {
  background: #0f172a;
}
::-webkit-scrollbar-thumb {
  background: #10b98140;
  border-radius: 3px;
}
::-webkit-scrollbar-thumb:hover {
  background: #10b98180;
}
</style>