<!-- components/UserTooltip.vue -->
<template>
  <div class="relative inline-flex" @mouseenter="handleEnter" @mouseleave="handleLeave">
    <!-- Аватарка — клик идёт на профиль -->
    <NuxtLink :to="`/profile/${userId}`" @click.stop>
      <slot />
    </NuxtLink>

    <!-- Невидимый мост между аватаркой и тултипом, чтобы мышь не «проваливалась» -->
    <div
      v-if="showTooltip"
      class="absolute left-0 top-full w-full"
      style="height: 8px;"
    ></div>

    <!-- Tooltip -->
    <Transition name="tooltip-fade">
      <div
        v-if="showTooltip"
        class="absolute z-50 left-0 top-full mt-2 w-64"
        style="min-width: 240px;"
      >
        <div class="bg-slate-900 border border-emerald-500/30 rounded-xl p-4 shadow-2xl shadow-emerald-500/10 relative overflow-hidden">
          <!-- Верхняя линия декор -->
          <div class="absolute top-0 left-1/2 -translate-x-1/2 w-2/3 h-px bg-gradient-to-r from-transparent via-emerald-500/40 to-transparent"></div>

          <!-- Загрузка -->
          <div v-if="loading" class="flex items-center justify-center py-4">
            <div class="w-5 h-5 border-2 border-emerald-500 border-t-transparent rounded-full animate-spin"></div>
          </div>

          <!-- Ошибка -->
          <div v-else-if="fetchError" class="text-slate-500 font-mono text-xs text-center py-2">
            // не удалось загрузить
          </div>

          <!-- Данные профиля -->
          <div v-else-if="profile">
            <!-- Шапка: аватар + имя -->
            <div class="flex items-center gap-3 mb-3">
              <div class="w-10 h-10 rounded-full bg-emerald-500/15 border border-emerald-500/30 flex items-center justify-center overflow-hidden shrink-0">
                <img v-if="profile.avatarUrl" :src="profile.avatarUrl" class="w-full h-full object-cover" />
                <span v-else class="text-emerald-400 font-mono font-bold text-sm">
                  {{ profile.username?.charAt(0).toUpperCase() || '?' }}
                </span>
              </div>
              <div class="flex-1 min-w-0">
                <div class="text-white font-semibold text-sm truncate">{{ profile.username }}</div>
                <div class="text-emerald-500 font-mono text-xs">@{{ profile.username }}</div>
              </div>
            </div>

            <!-- Bio -->
            <p v-if="profile.bio" class="text-slate-400 text-xs leading-relaxed mb-3 line-clamp-2 font-mono">
              // {{ profile.bio }}
            </p>

            <!-- Статистика -->
            <div class="flex items-center gap-3 mb-3">
              <div class="flex-1 bg-slate-800 rounded-lg px-3 py-2 text-center">
                <div class="text-white font-mono text-sm font-bold">{{ profile.stats?.postsCount ?? 0 }}</div>
                <div class="text-slate-500 font-mono text-xs">posts</div>
              </div>
              <div class="flex-1 bg-slate-800 rounded-lg px-3 py-2 text-center">
                <div class="text-white font-mono text-sm font-bold">{{ profile.stats?.repliesCount ?? 0 }}</div>
                <div class="text-slate-500 font-mono text-xs">replies</div>
              </div>
            </div>

            <!-- Сертификаты -->
            <div v-if="profile.certifications?.length" class="mb-3">
              <div class="text-slate-500 font-mono text-xs mb-1.5 flex items-center gap-1.5">
                <span class="w-1 h-1 bg-emerald-500 rounded-full"></span>
                certifications
              </div>
              <div class="flex flex-wrap gap-1">
                <span
                  v-for="cert in profile.certifications.slice(0, 2)"
                  :key="cert.id"
                  class="px-2 py-0.5 bg-emerald-500/10 border border-emerald-500/20 rounded text-emerald-400 font-mono text-xs truncate max-w-[100px]"
                  :title="cert.course?.title"
                >
                  {{ cert.course?.title }}
                </span>
                <span v-if="profile.certifications.length > 2" class="px-2 py-0.5 bg-slate-800 border border-slate-700 rounded text-slate-500 font-mono text-xs">
                  +{{ profile.certifications.length - 2 }}
                </span>
              </div>
            </div>

            <!-- Соц. сети -->
            <div v-if="profile.socialLinks?.length" class="flex gap-2 mb-3">
              <a
                v-for="link in profile.socialLinks.slice(0, 3)"
                :key="link.id"
                :href="link.url"
                target="_blank"
                class="p-1.5 bg-slate-800 border border-slate-700 rounded-lg text-slate-400 hover:text-emerald-400 hover:border-emerald-500/40 transition-all"
                :title="link.platform"
                @click.stop
              >
                <!-- GitHub -->
                <svg v-if="link.platform === 'github'" class="w-3.5 h-3.5" viewBox="0 0 24 24" fill="currentColor">
                  <path d="M12 0C5.37 0 0 5.37 0 12c0 5.31 3.435 9.795 8.205 11.385.6.105.825-.255.825-.57 0-.285-.015-1.23-.015-2.235-3.015.555-3.795-.735-4.035-1.41-.135-.345-.72-1.41-1.23-1.695-.42-.225-1.02-.78-.015-.795.945-.015 1.62.87 1.845 1.23 1.08 1.815 2.805 1.305 3.495.99.105-.78.42-1.305.765-1.605-2.67-.3-5.46-1.335-5.46-5.925 0-1.305.465-2.385 1.23-3.225-.12-.3-.54-1.53.12-3.18 0 0 1.005-.315 3.3 1.23.96-.27 1.98-.405 3-.405s2.04.135 3 .405c2.295-1.56 3.3-1.23 3.3-1.23.66 1.65.24 2.88.12 3.18.765.84 1.23 1.905 1.23 3.225 0 4.605-2.805 5.625-5.475 5.925.435.375.81 1.095.81 2.22 0 1.605-.015 2.895-.015 3.3 0 .315.225.69.825.57A12.02 12.02 0 0 0 24 12c0-6.63-5.37-12-12-12z"/>
                </svg>
                <!-- Twitter/X -->
                <svg v-else-if="link.platform === 'twitter'" class="w-3.5 h-3.5" viewBox="0 0 24 24" fill="currentColor">
                  <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z"/>
                </svg>
                <!-- YouTube -->
                <svg v-else-if="link.platform === 'youtube'" class="w-3.5 h-3.5" viewBox="0 0 24 24" fill="currentColor">
                  <path d="M23.495 6.205a3.007 3.007 0 0 0-2.088-2.088c-1.87-.501-9.396-.501-9.396-.501s-7.507-.01-9.396.501A3.007 3.007 0 0 0 .527 6.205a31.247 31.247 0 0 0-.522 5.805 31.247 31.247 0 0 0 .522 5.783 3.007 3.007 0 0 0 2.088 2.088c1.868.502 9.396.502 9.396.502s7.506 0 9.396-.502a3.007 3.007 0 0 0 2.088-2.088 31.247 31.247 0 0 0 .5-5.783 31.247 31.247 0 0 0-.5-5.805zM9.609 15.601V8.408l6.264 3.602z"/>
                </svg>
                <!-- Website/other -->
                <svg v-else class="w-3.5 h-3.5" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                  <circle cx="12" cy="12" r="10"/><line x1="2" y1="12" x2="22" y2="12"/><path d="M12 2a15.3 15.3 0 0 1 4 10 15.3 15.3 0 0 1-4 10 15.3 15.3 0 0 1-4-10 15.3 15.3 0 0 1 4-10z"/>
                </svg>
              </a>
            </div>

            <!-- Кнопка перехода в профиль -->
            <NuxtLink
              :to="`/profile/${userId}`"
              class="block w-full text-center py-1.5 bg-emerald-500/10 border border-emerald-500/25 hover:bg-emerald-500/20 hover:border-emerald-500/50 text-emerald-400 font-mono text-xs rounded-lg transition-all"
              @click.stop
            >
              $ view_profile →
            </NuxtLink>
          </div>
        </div>
        <!-- Стрелочка вверху -->
        <div class="absolute -top-1.5 left-4 w-3 h-3 bg-slate-900 border-l border-t border-emerald-500/30 rotate-45"></div>
      </div>
    </Transition>
  </div>
</template>

<script setup>
const props = defineProps({
  userId: { type: Number, required: true },
})

const { apiRequest } = useApi()

const showTooltip = ref(false)
const loading = ref(false)
const fetchError = ref(false)
const profile = ref(null)
let hideTimer = null
let showTimer = null
let fetched = false

const handleEnter = () => {
  // Отменяем таймер скрытия если мышь вернулась
  clearTimeout(hideTimer)
  // Показываем с небольшой задержкой
  showTimer = setTimeout(() => {
    showTooltip.value = true
    if (!fetched) fetchProfile()
  }, 250)
}

const handleLeave = () => {
  // Отменяем таймер показа если мышь ушла быстро
  clearTimeout(showTimer)
  // Даём время переместить мышь в тултип (200мс)
  hideTimer = setTimeout(() => {
    showTooltip.value = false
  }, 200)
}

const fetchProfile = async () => {
  loading.value = true
  fetchError.value = false
  try {
    const data = await apiRequest(`/profiles/${props.userId}`)
    profile.value = data
    fetched = true
  } catch (e) {
    fetchError.value = true
  } finally {
    loading.value = false
  }
}

onUnmounted(() => {
  clearTimeout(hideTimer)
  clearTimeout(showTimer)
})
</script>

<style scoped>
.tooltip-fade-enter-active { transition: all 0.18s cubic-bezier(0.34, 1.4, 0.64, 1); }
.tooltip-fade-leave-active { transition: all 0.12s ease; }
.tooltip-fade-enter-from { opacity: 0; transform: translateY(-6px) scale(0.97); }
.tooltip-fade-leave-to { opacity: 0; transform: translateY(-4px) scale(0.98); }
</style>