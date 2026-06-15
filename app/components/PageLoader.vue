<template>
  <div class="flex items-center justify-center min-h-[70vh]">
    <div class="text-center">
      <div class="relative w-16 h-16 mx-auto mb-6">
        <div class="absolute inset-0 rounded-full border-2 border-emerald-500/20 animate-ping"></div>
        <div class="absolute inset-2 rounded-full border-2 border-emerald-500/40 animate-ping" style="animation-delay: 0.3s"></div>
        <div class="absolute inset-0 rounded-full border-2 border-t-emerald-400 border-emerald-500/10 animate-spin"></div>
        <div class="absolute inset-4 rounded-full bg-emerald-500/10 flex items-center justify-center">
          <svg v-if="icon === 'user'" class="w-4 h-4 text-emerald-400" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
            <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"/>
            <circle cx="12" cy="7" r="4"/>
          </svg>
          <svg v-else-if="icon === 'book'" class="w-4 h-4 text-emerald-400" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
            <path d="M4 19.5A2.5 2.5 0 0 1 6.5 17H20"/>
            <path d="M6.5 2H20v20H6.5A2.5 2.5 0 0 1 4 19.5v-15A2.5 2.5 0 0 1 6.5 2z"/>
            <path d="M12 6v7"/>
            <path d="M9 9l3-3 3 3"/>
          </svg>
          <svg v-else-if="icon === 'message'" class="w-4 h-4 text-emerald-400" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
            <path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z"/>
          </svg>
          <svg v-else-if="icon === 'star'" class="w-4 h-4 text-emerald-400" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
            <polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2"/>
          </svg>
          <svg v-else-if="icon === 'help'" class="w-4 h-4 text-emerald-400" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
            <circle cx="12" cy="12" r="10"/>
            <path d="M9.09 9a3 3 0 0 1 5.83 1c0 2-3 3-3 3"/>
            <line x1="12" y1="17" x2="12.01" y2="17"/>
          </svg>
          <svg v-else class="w-4 h-4 text-emerald-400" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
            <circle cx="12" cy="12" r="10"/>
            <polyline points="12 6 12 12 16 14"/>
          </svg>
        </div>
      </div>
      <p class="text-emerald-400/70 font-mono text-sm animate-pulse">{{ text }}</p>
    </div>
  </div>
</template>

<script setup lang="ts">
defineProps<{
  icon?: 'user' | 'book' | 'message' | 'star' | 'help'
  text: string
}>()
</script>
