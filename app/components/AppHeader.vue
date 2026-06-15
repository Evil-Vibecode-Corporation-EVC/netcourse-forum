<template>
  <nav class="fixed top-0 left-0 right-0 z-50 bg-slate-950/65 backdrop-blur-md border-b border-emerald-500/20">
    <div class="max-w-7xl mx-auto px-4 sm:px-6 py-3 sm:py-4 flex items-center justify-between">
      <NuxtLink to="/" @click="closeMobileMenu">
        <div class="flex items-center gap-2 sm:gap-3">
          <div class="relative">
            <div class="w-8 h-8 sm:w-10 sm:h-10 border-2 border-emerald-500 rounded-lg flex items-center justify-center">
              <div class="w-1.5 h-1.5 sm:w-2 sm:h-2 bg-emerald-500 rounded-full animate-pulse"></div>
            </div>
            <div class="absolute -top-1 -right-1 w-2.5 h-2.5 sm:w-3 sm:h-3 bg-emerald-500 rounded-full"></div>
          </div>
          <span class="text-lg sm:text-xl font-bold text-emerald-500 font-mono">
            Net<span class="text-white">Course/Forum</span>
          </span>
        </div>
      </NuxtLink>

      <div class="hidden md:flex items-center gap-6 lg:gap-8">
        <button 
          @click="handleBackToMain"
          class="flex items-center gap-2 px-3 py-1.5 bg-slate-800/50 hover:bg-slate-700/50 border border-slate-600 hover:border-emerald-500/40 rounded-lg transition-all group"
        >
          <svg class="w-4 h-4 text-emerald-500 group-hover:-translate-x-0.5 transition-transform" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
            <path d="M3 9l9-7 9 7v11a2 2 0 0 1-2 2h-5v-8H9v8H5a2 2 0 0 1-2-2z"/>
            <polyline points="9 22 9 12 15 12 15 22"/>
          </svg>
            <span class="text-slate-300 text-sm font-mono">{{ $t('header.backToMain') }}</span>
          </button>

          <div class="flex items-center gap-1">
            <button
                :class="[
                    'px-2 py-1 text-xs font-mono rounded transition-colors',
                    $locale === 'ru'
                        ? 'text-emerald-400 bg-emerald-500/10'
                        : 'text-slate-500 hover:text-slate-300'
                ]"
                @click="$setLocale('ru')"
            >
                RU
            </button>

            <span class="text-slate-600 text-xs">|</span>

            <button
                :class="[
                    'px-2 py-1 text-xs font-mono rounded transition-colors',
                    $locale === 'kz'
                        ? 'text-emerald-400 bg-emerald-500/10'
                        : 'text-slate-500 hover:text-slate-300'
                ]"
                @click="$setLocale('kz')"
            >
                KZ
            </button>
        </div>

        <div v-if="isAuthenticated" class="flex items-center gap-4">
          <div class="relative">
            <button
              @click="toggleProfileMenu"
              class="flex items-center gap-2 p-1 rounded-lg hover:bg-slate-800/50 transition-colors"
            >
              <div class="relative shrink-0">
                <div class="w-8 h-8 bg-emerald-500/20 border border-emerald-500/30 rounded-full flex items-center justify-center overflow-hidden">
                  <img 
                    v-if="currentUser?.avatarUrl && !avatarError"
                    :src="currentUser.avatarUrl" 
                    :alt="$t('header.avatar')"
                    class="w-full h-full object-cover"
                    @error="avatarError = true"
                  />
                  <span v-if="!currentUser?.avatarUrl || avatarError" class="text-sm text-emerald-500 font-mono font-bold">
                    {{ currentUser?.username?.charAt(0).toUpperCase() || 'U' }}
                  </span>
                </div>
                <img
                  v-if="equippedBadge?.imageUrl"
                  :src="equippedBadge.imageUrl"
                  :alt="equippedBadge.name"
                  class="absolute -bottom-1 -right-1 w-5 h-5 object-contain z-10"
                />
              </div>
              <span class="text-slate-300 text-sm font-mono hidden lg:block max-w-[120px] truncate">
                {{ currentUser?.username }}
              </span>
            </button>

            <Transition
              enter-active-class="transition ease-out duration-100"
              enter-from-class="transform opacity-0 scale-95"
              enter-to-class="transform opacity-100 scale-100"
              leave-active-class="transition ease-in duration-75"
              leave-from-class="transform opacity-100 scale-100"
              leave-to-class="transform opacity-0 scale-95"
            >
              <div v-if="isProfileMenuOpen" class="absolute top-full right-0 mt-2 w-48 bg-slate-900/95 backdrop-blur-md border border-emerald-500/30 rounded-lg shadow-lg py-2 z-50">
                <button
                  @click="handleProfileClick"
                  class="w-full px-4 py-2 text-slate-300 hover:bg-slate-800/50 transition-colors text-left font-mono text-sm flex items-center gap-2"
                >
                  <svg class="w-4 h-4 text-emerald-500" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                    <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"/>
                    <circle cx="12" cy="7" r="4"/>
                  </svg>
                  {{ $t('header.profile') }}
                </button>
                <button
                  @click="handleLogout"
                  class="w-full px-4 py-2 text-red-400 hover:bg-red-500/10 transition-colors text-left font-mono text-sm flex items-center gap-2"
                >
                  <svg class="w-4 h-4 text-red-400" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                    <path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4"/>
                    <polyline points="16 17 21 12 16 7"/>
                    <line x1="21" y1="12" x2="9" y2="12"/>
                  </svg>
                  {{ $t('header.logout') }}
                </button>
              </div>
            </Transition>
          </div>
        </div>

        <NuxtLink 
          v-else
          to="/login" 
          class="px-4 sm:px-5 py-2 bg-emerald-500 text-slate-950 rounded-lg font-semibold hover:bg-emerald-400 transition-colors font-mono text-sm"
        >
          $ login
        </NuxtLink>
      </div>

      <button
        class="md:hidden flex flex-col items-center justify-center w-8 h-8 relative"
        @click="toggleMobileMenu"
        :aria-label="$t('header.openMenu')"
      >
        <span 
          :class="[
            'absolute w-6 h-0.5 bg-emerald-500 transition-all duration-300 ease-in-out',
            isMobileMenuOpen ? 'rotate-45' : '-translate-y-2'
          ]"
        ></span>
        <span 
          :class="[
            'absolute w-6 h-0.5 bg-emerald-500 transition-all duration-300 ease-in-out',
            isMobileMenuOpen ? 'opacity-0' : 'opacity-100'
          ]"
        ></span>
        <span 
          :class="[
            'absolute w-6 h-0.5 bg-emerald-500 transition-all duration-300 ease-in-out',
            isMobileMenuOpen ? '-rotate-45' : 'translate-y-2'
          ]"
        ></span>
      </button>
    </div>

    <Transition
      enter-active-class="transition ease-out duration-200"
      enter-from-class="transform opacity-0 -translate-y-2"
      enter-to-class="transform opacity-100 translate-y-0"
      leave-active-class="transition ease-in duration-150"
      leave-from-class="transform opacity-100 translate-y-0"
      leave-to-class="transform opacity-0 -translate-y-2"
    >
      <div
        v-if="isMobileMenuOpen"
        class="md:hidden bg-slate-950/95 backdrop-blur-md border-b border-emerald-500/20"
      >
        <div class="px-4 py-6 space-y-4">
          <button
            @click="handleBackToMain"
            class="flex items-center justify-center gap-2 w-full px-6 py-2.5 bg-slate-800/50 border border-slate-600 hover:border-emerald-500/40 rounded-lg transition-all"
          >
            <svg class="w-4 h-4 text-emerald-500" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
              <path d="M3 9l9-7 9 7v11a2 2 0 0 1-2 2h-5v-8H9v8H5a2 2 0 0 1-2-2z"/>
              <polyline points="9 22 9 12 15 12 15 22"/>
            </svg>
            <span class="text-slate-300 font-mono text-base">{{ $t('header.backToMain') }}</span>
          </button>
          <div class="flex justify-center gap-3 pt-2 pb-2">
            <button
              :class="[
                'px-3 py-1 text-sm font-mono rounded transition-colors',
                $locale === 'ru'
                  ? 'text-emerald-400 bg-emerald-500/10'
                  : 'text-slate-500 hover:text-slate-300'
              ]"
              @click="$setLocale('ru')"
            >
              RU
            </button>

            <span class="text-slate-600">|</span>

            <button
              :class="[
                'px-3 py-1 text-sm font-mono rounded transition-colors',
                $locale === 'kz'
                  ? 'text-emerald-400 bg-emerald-500/10'
                  : 'text-slate-500 hover:text-slate-300'
              ]"
              @click="$setLocale('kz')"
            >
              KZ
            </button>
          </div>
          <div v-if="isAuthenticated" class="flex flex-col gap-3 pt-4 border-t border-emerald-500/20">
            <div class="flex items-center justify-center gap-3 py-2">
              <div class="relative shrink-0">
                <div class="w-10 h-10 bg-emerald-500/20 border border-emerald-500/30 rounded-full flex items-center justify-center overflow-hidden">
                  <img 
                    v-if="currentUser?.avatarUrl && !avatarError"
                    :src="currentUser.avatarUrl" 
                    :alt="$t('header.avatar')"
                    class="w-full h-full object-cover"
                    @error="avatarError = true"
                  />
                  <span v-if="!currentUser?.avatarUrl || avatarError" class="text-lg text-emerald-500 font-mono font-bold">
                    {{ currentUser?.username?.charAt(0).toUpperCase() || 'U' }}
                  </span>
                </div>
                <img
                  v-if="equippedBadge?.imageUrl"
                  :src="equippedBadge.imageUrl"
                  :alt="equippedBadge.name"
                  class="absolute -bottom-1 -right-1 w-5 h-5 object-contain z-10"
                />
              </div>
              <span class="text-slate-300 font-mono text-sm sm:text-base max-w-[150px] truncate">
                {{ currentUser?.username }}
              </span>
            </div>

            <NuxtLink
              to="/profile"
              class="px-6 py-2.5 bg-emerald-500 text-slate-950 rounded-lg font-semibold hover:bg-emerald-400 transition-colors font-mono text-base text-center"
              @click="closeMobileMenu"
            >
              $ profile
            </NuxtLink>
            <button
              @click="handleLogoutMobile"
              class="px-6 py-2.5 bg-transparent text-red-400 rounded-lg font-semibold hover:bg-red-500/10 transition-colors font-mono text-base border border-red-500/50"
            >
              $ logout
            </button>
          </div>

          <div v-else class="flex justify-center pt-4">
            <NuxtLink
              to="/login"
              class="px-8 py-3 bg-emerald-500 text-slate-950 rounded-lg font-semibold hover:bg-emerald-400 transition-colors font-mono text-base"
              @click="closeMobileMenu"
            >
              $ login
            </NuxtLink>
          </div>
        </div>
      </div>
    </Transition>
  </nav>

  <Transition
    enter-active-class="transition ease-out duration-200"
    enter-from-class="opacity-0"
    enter-to-class="opacity-100"
    leave-active-class="transition ease-in duration-150"
    leave-from-class="opacity-100"
    leave-to-class="opacity-0"
  >
    <div 
      v-if="isProfileMenuOpen"
      class="fixed inset-0 z-40" 
      @click="closeProfileMenu"
    />
  </Transition>
</template>

<script setup lang="ts">
import { ref, computed, watch, onMounted, onUnmounted } from 'vue'
import { useRoute, navigateTo } from '#app'
import { useAuth } from '~/composables/useAuth'

const { user, isAuthenticated, logout } = useAuth()

const isMobileMenuOpen = ref(false)
const isProfileMenuOpen = ref(false)

const currentUser = computed(() => user.value)

const avatarError = ref(false)
const equippedBadge = ref(null)

const loadEquippedBadge = () => {
  if (!process.client) return
  try {
    const raw = localStorage.getItem('equippedBadge')
    equippedBadge.value = raw ? JSON.parse(raw) : null
  } catch { equippedBadge.value = null }
}

onMounted(() => {
  loadEquippedBadge()
  if (process.client) {
    window.addEventListener('badge-equipped', loadEquippedBadge)
  }
})

onUnmounted(() => {
  if (process.client) {
    window.removeEventListener('badge-equipped', loadEquippedBadge)
  }
})

watch(isAuthenticated, () => {
  avatarError.value = false
  loadEquippedBadge()
})

const route = useRoute()

const toggleMobileMenu = () => {
  isMobileMenuOpen.value = !isMobileMenuOpen.value
  if (isMobileMenuOpen.value) {
    isProfileMenuOpen.value = false
  }
}

const closeMobileMenu = () => {
  isMobileMenuOpen.value = false
}

const toggleProfileMenu = () => {
  isProfileMenuOpen.value = !isProfileMenuOpen.value
}

const closeProfileMenu = () => {
  isProfileMenuOpen.value = false
}

const handleProfileClick = async () => {
  closeProfileMenu()
  closeMobileMenu()
  await navigateTo('/profile')
}

const handleBackToMain = () => {
  window.location.href = 'https://netcourse.tech'
  closeMobileMenu()
  closeProfileMenu()
}

const handleLogout = async () => {
  await logout()
  closeProfileMenu()
  closeMobileMenu()
}

const handleLogoutMobile = async () => {
  await logout()
  closeMobileMenu()
  closeProfileMenu()
}

watch(() => route.path, () => {
  closeMobileMenu()
  closeProfileMenu()
})
</script>