<!-- components/ForumPostCard.vue -->
<template>
  <article
    class="group relative bg-slate-900 border border-emerald-500/20 hover:border-emerald-500/50 rounded-xl p-5 transition-all duration-300 hover:shadow-lg hover:shadow-emerald-500/10 cursor-pointer"
    @click="$emit('click')"
  >
    <div class="absolute top-0 right-0 w-6 h-6 border-t border-r border-emerald-500/30 group-hover:border-emerald-500/60 rounded-tr-xl transition-all"></div>

    <div class="flex items-start gap-3 mb-3">
      <!-- Аватар с tooltip -->
      <UserTooltip :user-id="post.user?.id || post.userId" @click.stop>
        <div class="w-9 h-9 rounded-full bg-emerald-500/15 border border-emerald-500/30 flex items-center justify-center overflow-hidden shrink-0 mt-0.5 hover:border-emerald-500/60 transition-all cursor-pointer">
          <img v-if="post.user?.avatarUrl" :src="post.user.avatarUrl" class="w-full h-full object-cover" />
          <span v-else class="text-emerald-400 font-mono text-sm font-bold">
            {{ post.user?.username?.charAt(0).toUpperCase() || '?' }}
          </span>
        </div>
      </UserTooltip>

      <div class="flex-1 min-w-0">
        <div class="flex items-center gap-2 flex-wrap">
          <span class="text-emerald-400 font-mono text-sm font-semibold">{{ post.user?.username || 'anonymous' }}</span>
          <span class="text-slate-600 font-mono text-xs">·</span>
          <span class="text-slate-500 font-mono text-xs">{{ formatDate(post.createdAt) }}</span>
          <span v-if="post.updatedAt !== post.createdAt" class="text-slate-600 font-mono text-xs italic">(edited)</span>
        </div>
      </div>

      <div v-if="canEdit" class="flex items-center gap-1 opacity-0 group-hover:opacity-100 transition-opacity" @click.stop>
        <button
          @click="$emit('edit', post)"
          class="p-1.5 rounded-lg bg-slate-800 hover:bg-slate-700 border border-slate-700 hover:border-emerald-500/40 text-slate-400 hover:text-emerald-400 transition-all"
          title="Редактировать"
        >
          <svg class="w-3.5 h-3.5" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7"/><path d="M18.5 2.5a2.121 2.121 0 0 1 3 3L12 15l-4 1 1-4 9.5-9.5z"/></svg>
        </button>
        <button
          @click="$emit('delete', post)"
          class="p-1.5 rounded-lg bg-slate-800 hover:bg-red-900/40 border border-slate-700 hover:border-red-500/40 text-slate-400 hover:text-red-400 transition-all"
          title="Удалить"
        >
          <svg class="w-3.5 h-3.5" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><polyline points="3 6 5 6 21 6"/><path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a1 1 0 0 1 1-1h4a1 1 0 0 1 1 1v2"/></svg>
        </button>
      </div>
    </div>

    <h3 class="text-white font-semibold text-base mb-2 group-hover:text-emerald-400 transition-colors leading-snug line-clamp-2">
      {{ post.title }}
    </h3>

    <p class="text-slate-400 text-sm leading-relaxed line-clamp-3 mb-3">
      {{ post.body }}
    </p>

    <!-- Теги -->
    <div v-if="post.tags?.length" class="flex flex-wrap gap-1.5 mb-3" @click.stop>
      <span
        v-for="tag in post.tags"
        :key="tag"
        class="px-2 py-0.5 bg-emerald-500/10 border border-emerald-500/20 rounded text-emerald-400 font-mono text-xs hover:bg-emerald-500/20 transition-all cursor-pointer"
      >
        #{{ tag }}
      </span>
    </div>

    <div class="flex items-center gap-4 text-xs font-mono text-slate-500">
      <span class="flex items-center gap-1.5">
        <svg class="w-3.5 h-3.5 text-slate-600" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z"/></svg>
        {{ post.replies?.length || 0 }} replies
      </span>

      <!-- Лайки -->
      <button
        class="flex items-center gap-1.5 transition-all group/like"
        :class="localLiked ? 'text-emerald-400' : 'text-slate-500 hover:text-emerald-400'"
        @click.stop="toggleLike"
        :disabled="!currentUser"
        :title="currentUser ? (localLiked ? 'Убрать лайк' : 'Лайк') : 'Войдите чтобы лайкнуть'"
      >
        <svg
          class="w-3.5 h-3.5 transition-transform group-hover/like:scale-110"
          :class="localLiked ? 'fill-emerald-400' : 'fill-none'"
          viewBox="0 0 24 24" stroke="currentColor" stroke-width="2"
        >
          <path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z"/>
        </svg>
        <span>{{ localLikes }}</span>
      </button>

      <span class="flex items-center gap-1.5 ml-auto">
        <span class="w-1.5 h-1.5 bg-emerald-500/60 rounded-full"></span>
        #{{ post.id }}
      </span>
    </div>
  </article>
</template>

<script setup>
const props = defineProps({
  post: {
    type: Object,
    required: true,
    default: () => ({})
  },
  currentUser: {
    type: Object,
    default: null
  }
})

const emit = defineEmits(['click', 'edit', 'delete'])

const localLiked = ref(props.post.likedByMe ?? false)
const localLikes = ref(props.post.likesCount ?? 0)

const { apiRequest } = useApi()

const canEdit = computed(() => {
  if (!props.currentUser || !props.post) return false
  return props.currentUser.id === props.post.userId || props.currentUser.role === 'ADMIN'
})

const toggleLike = async () => {
  if (!props.currentUser) return
  const wasLiked = localLiked.value
  // Оптимистичное обновление
  localLiked.value = !wasLiked
  localLikes.value += wasLiked ? -1 : 1
  try {
    if (wasLiked) {
      await apiRequest(`/forum/posts/${props.post.id}/likes`, { method: 'DELETE' })
    } else {
      await apiRequest(`/forum/posts/${props.post.id}/likes`, { method: 'POST' })
    }
  } catch {
    // откатываем при ошибке
    localLiked.value = wasLiked
    localLikes.value += wasLiked ? 1 : -1
  }
}

const formatDate = (dateStr) => {
  if (!dateStr) return ''
  const d = new Date(dateStr)
  const now = new Date()
  const diff = Math.floor((now.getTime() - d.getTime()) / 1000)
  if (diff < 60) return 'только что'
  if (diff < 3600) return `${Math.floor(diff / 60)} мин. назад`
  if (diff < 86400) return `${Math.floor(diff / 3600)} ч. назад`
  return d.toLocaleDateString('ru-RU')
}
</script>