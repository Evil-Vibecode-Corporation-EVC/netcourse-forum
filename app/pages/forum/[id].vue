<!-- pages/forum/[id].vue -->
<template>
  <main class="min-h-screen bg-slate-950 pt-24 pb-20 px-4 sm:px-6">
    <div class="absolute inset-0 bg-[linear-gradient(to_right,#10b98110_1px,transparent_1px),linear-gradient(to_bottom,#10b98110_1px,transparent_1px)] bg-[size:40px_40px] opacity-30 pointer-events-none"></div>

    <div class="max-w-4xl mx-auto relative z-10">
      <!-- Back -->
      <NuxtLink to="/" class="inline-flex items-center gap-2 text-slate-500 hover:text-emerald-400 font-mono text-sm mb-8 transition-all group">
        <svg class="w-4 h-4 group-hover:-translate-x-1 transition-transform" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><polyline points="15 18 9 12 15 6"/></svg>
        $ cd ~/forum
      </NuxtLink>

      <!-- Loading -->
      <div v-if="loading" class="flex items-center justify-center py-24">
        <div class="w-8 h-8 border-2 border-emerald-500 border-t-transparent rounded-full animate-spin"></div>
      </div>

      <template v-else-if="post">
        <!-- Post card -->
        <article class="bg-slate-900 border border-emerald-500/25 rounded-2xl p-6 sm:p-8 mb-8 relative overflow-hidden">
          <div class="absolute top-0 left-1/2 -translate-x-1/2 w-1/2 h-px bg-gradient-to-r from-transparent via-emerald-500/30 to-transparent"></div>

          <div class="flex items-center gap-1.5 mb-6">
            <div class="w-2.5 h-2.5 bg-red-500 rounded-full"></div>
            <div class="w-2.5 h-2.5 bg-yellow-500 rounded-full"></div>
            <div class="w-2.5 h-2.5 bg-green-500 rounded-full"></div>
            <span class="text-slate-500 font-mono text-xs ml-2">post_#{{ post.id }}.md</span>

            <div v-if="canEditPost" class="ml-auto flex items-center gap-2">
              <button @click="showEditModal = true" class="flex items-center gap-1.5 px-3 py-1.5 bg-slate-800 border border-slate-700 hover:border-emerald-500/40 text-slate-400 hover:text-emerald-400 font-mono text-xs rounded-lg transition-all">
                <svg class="w-3.5 h-3.5" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7"/><path d="M18.5 2.5a2.121 2.121 0 0 1 3 3L12 15l-4 1 1-4 9.5-9.5z"/></svg>
                edit
              </button>
              <button @click="showDeletePostModal = true" class="flex items-center gap-1.5 px-3 py-1.5 bg-slate-800 border border-slate-700 hover:border-red-500/40 text-slate-400 hover:text-red-400 font-mono text-xs rounded-lg transition-all">
                <svg class="w-3.5 h-3.5" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><polyline points="3 6 5 6 21 6"/><path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a1 1 0 0 1 1-1h4a1 1 0 0 1 1 1v2"/></svg>
                delete
              </button>
            </div>
          </div>

          <!-- Автор поста с tooltip -->
          <div class="flex items-center gap-3 mb-5">
            <UserTooltip :user-id="post.user?.id || post.userId">
              <div class="w-10 h-10 rounded-full bg-emerald-500/15 border border-emerald-500/30 flex items-center justify-center overflow-hidden hover:border-emerald-500/60 transition-all cursor-pointer">
                <img v-if="post.user?.avatarUrl" :src="post.user.avatarUrl" class="w-full h-full object-cover" />
                <span v-else class="text-emerald-400 font-mono font-bold">{{ post.user?.username?.charAt(0).toUpperCase() }}</span>
              </div>
            </UserTooltip>
            <div>
              <div class="text-emerald-400 font-mono text-sm font-semibold">{{ post.user?.username }}</div>
              <div class="text-slate-500 font-mono text-xs">{{ formatDate(post.createdAt) }}</div>
            </div>
          </div>

          <h1 class="text-2xl sm:text-3xl font-bold text-white mb-5 leading-snug">{{ post.title }}</h1>

          <div class="text-slate-300 leading-relaxed whitespace-pre-wrap font-mono text-sm bg-slate-800/50 border border-slate-700/50 rounded-xl p-5 mb-5">{{ post.body }}</div>

          <!-- Теги поста -->
          <div v-if="post.tags?.length" class="flex flex-wrap gap-1.5 mb-5">
            <NuxtLink
              v-for="tag in post.tags"
              :key="tag"
              to="/"
              class="px-2.5 py-0.5 bg-emerald-500/10 border border-emerald-500/20 rounded-lg text-emerald-400 font-mono text-xs hover:bg-emerald-500/20 transition-all"
            >
              #{{ tag }}
            </NuxtLink>
          </div>

          <!-- Лайки поста -->
          <div class="flex items-center gap-4 border-t border-slate-800 pt-4">
            <button
              @click="togglePostLike"
              :disabled="!isAuthenticated"
              class="flex items-center gap-2 px-4 py-2 rounded-xl border transition-all font-mono text-sm"
              :class="postLiked
                ? 'bg-emerald-500/15 border-emerald-500/40 text-emerald-400'
                : 'bg-slate-800 border-slate-700 text-slate-400 hover:border-emerald-500/40 hover:text-emerald-400'"
              :title="isAuthenticated ? (postLiked ? 'Убрать лайк' : 'Лайк') : 'Войдите'"
            >
              <svg
                class="w-4 h-4 transition-transform hover:scale-110"
                :class="postLiked ? 'fill-emerald-400' : 'fill-none'"
                viewBox="0 0 24 24" stroke="currentColor" stroke-width="2"
              >
                <path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z"/>
              </svg>
              <span>{{ postLikesCount }}</span>
              <span class="text-xs text-slate-500">{{ postLiked ? 'liked' : 'like' }}</span>
            </button>

            <span class="text-slate-600 font-mono text-xs">
              <span class="w-1.5 h-1.5 bg-emerald-500/50 rounded-full inline-block mr-1.5"></span>
              {{ replyMeta.total }} replies
            </span>
          </div>
        </article>

        <!-- Replies section -->
        <section>
          <div class="flex items-center gap-3 mb-6">
            <div class="flex gap-1">
              <div class="w-2 h-2 bg-red-500 rounded-full"></div>
              <div class="w-2 h-2 bg-yellow-500 rounded-full"></div>
              <div class="w-2 h-2 bg-green-500 rounded-full"></div>
            </div>
            <span class="text-slate-400 font-mono text-sm">replies</span>
            <span class="bg-slate-800 border border-slate-700 text-slate-400 font-mono text-xs px-2 py-0.5 rounded-lg">{{ replyMeta.total }}</span>
          </div>

          <!-- Reply form -->
          <div v-if="isAuthenticated" class="bg-slate-900 border border-emerald-500/20 rounded-xl p-5 mb-6">
            <div class="flex items-center gap-1.5 mb-4">
              <div class="w-2 h-2 bg-red-500 rounded-full"></div>
              <div class="w-2 h-2 bg-yellow-500 rounded-full"></div>
              <div class="w-2 h-2 bg-green-500 rounded-full"></div>
              <span class="text-slate-500 font-mono text-xs ml-1">new_reply.sh</span>
            </div>
            <textarea
              v-model="replyBody"
              rows="3"
              placeholder="// Напишите ваш ответ..."
              class="w-full bg-slate-800 border border-slate-700 focus:border-emerald-500/50 rounded-xl px-4 py-3 text-white font-mono text-sm placeholder-slate-600 outline-none transition-all resize-none mb-3"
            ></textarea>
            <div class="flex justify-end">
              <button
                @click="submitReply"
                :disabled="!replyBody.trim() || replyLoading"
                class="flex items-center gap-2 px-5 py-2.5 bg-emerald-500/10 border border-emerald-500/30 hover:bg-emerald-500/20 hover:border-emerald-500/60 text-emerald-400 font-mono text-sm rounded-xl transition-all disabled:opacity-40 disabled:cursor-not-allowed"
              >
                <div v-if="replyLoading" class="w-3.5 h-3.5 border-2 border-emerald-400 border-t-transparent rounded-full animate-spin"></div>
                <span>$ reply.sh</span>
              </button>
            </div>
          </div>
          <div v-else class="bg-slate-900/50 border border-dashed border-slate-700 rounded-xl p-5 mb-6 text-center">
            <span class="text-slate-500 font-mono text-sm">
              <NuxtLink to="/login" class="text-emerald-400 hover:underline">$ login</NuxtLink>
              , чтобы оставить ответ
            </span>
          </div>

          <!-- Replies list -->
          <div v-if="repliesLoading" class="flex justify-center py-12">
            <div class="w-6 h-6 border-2 border-emerald-500 border-t-transparent rounded-full animate-spin"></div>
          </div>

          <div v-else class="space-y-4">
            <div
              v-for="reply in replies"
              :key="reply.id"
              class="group bg-slate-900 border border-slate-800 hover:border-slate-700 rounded-xl p-5 transition-all"
            >
              <div class="flex items-start gap-3">
                <!-- Аватар ответа с tooltip -->
                <UserTooltip :user-id="reply.user?.id || reply.userId">
                  <div class="w-8 h-8 rounded-full bg-slate-800 border border-slate-700 flex items-center justify-center overflow-hidden shrink-0 hover:border-emerald-500/40 transition-all cursor-pointer">
                    <img v-if="reply.user?.avatarUrl" :src="reply.user.avatarUrl" class="w-full h-full object-cover" />
                    <span v-else class="text-slate-400 font-mono text-xs font-bold">{{ reply.user?.username?.charAt(0).toUpperCase() }}</span>
                  </div>
                </UserTooltip>

                <div class="flex-1 min-w-0">
                  <div class="flex items-center gap-2 mb-2 flex-wrap">
                    <span class="text-emerald-400 font-mono text-sm font-semibold">{{ reply.user?.username }}</span>
                    <span class="text-slate-600 font-mono text-xs">{{ formatDate(reply.createdAt) }}</span>
                    <span v-if="reply.updatedAt !== reply.createdAt" class="text-slate-600 font-mono text-xs italic">(edited)</span>
                  </div>

                  <div v-if="editingReplyId !== reply.id">
                    <p class="text-slate-300 font-mono text-sm leading-relaxed whitespace-pre-wrap">{{ reply.body }}</p>
                    <!-- Лайк ответа -->
                    <div class="mt-3">
                      <button
                        @click="toggleReplyLike(reply)"
                        :disabled="!isAuthenticated"
                        class="flex items-center gap-1.5 font-mono text-xs transition-all"
                        :class="reply.likedByMe ? 'text-emerald-400' : 'text-slate-500 hover:text-emerald-400'"
                        :title="isAuthenticated ? (reply.likedByMe ? 'Убрать лайк' : 'Лайк') : 'Войдите'"
                      >
                        <svg
                          class="w-3.5 h-3.5 transition-transform hover:scale-110"
                          :class="reply.likedByMe ? 'fill-emerald-400' : 'fill-none'"
                          viewBox="0 0 24 24" stroke="currentColor" stroke-width="2"
                        >
                          <path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z"/>
                        </svg>
                        <span>{{ reply.likesCount ?? 0 }}</span>
                      </button>
                    </div>
                  </div>
                  <div v-else>
                    <textarea
                      v-model="editReplyBody"
                      rows="3"
                      class="w-full bg-slate-800 border border-emerald-500/40 rounded-lg px-3 py-2 text-white font-mono text-sm outline-none resize-none mb-2"
                    ></textarea>
                    <div class="flex gap-2">
                      <button @click="saveEditReply(reply)" :disabled="editReplyLoading" class="px-3 py-1.5 bg-emerald-500/10 border border-emerald-500/30 text-emerald-400 font-mono text-xs rounded-lg hover:bg-emerald-500/20 transition-all disabled:opacity-40">
                        {{ editReplyLoading ? '...' : '$ save' }}
                      </button>
                      <button @click="editingReplyId = null" class="px-3 py-1.5 bg-slate-800 border border-slate-700 text-slate-400 font-mono text-xs rounded-lg hover:bg-slate-700 transition-all">
                        $ cancel
                      </button>
                    </div>
                  </div>
                </div>

                <div v-if="canEditReply(reply) && editingReplyId !== reply.id" class="flex items-center gap-1 opacity-0 group-hover:opacity-100 transition-opacity shrink-0">
                  <button @click="startEditReply(reply)" class="p-1.5 rounded-lg bg-slate-800 border border-slate-700 hover:border-emerald-500/40 text-slate-400 hover:text-emerald-400 transition-all">
                    <svg class="w-3 h-3" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7"/><path d="M18.5 2.5a2.121 2.121 0 0 1 3 3L12 15l-4 1 1-4 9.5-9.5z"/></svg>
                  </button>
                  <button @click="openDeleteReply(reply)" class="p-1.5 rounded-lg bg-slate-800 border border-slate-700 hover:border-red-500/40 text-slate-400 hover:text-red-400 transition-all">
                    <svg class="w-3 h-3" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><polyline points="3 6 5 6 21 6"/><path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a1 1 0 0 1 1-1h4a1 1 0 0 1 1 1v2"/></svg>
                  </button>
                </div>
              </div>
            </div>

            <div v-if="!replies.length && !repliesLoading" class="text-center py-10">
              <div class="text-slate-600 font-mono text-sm">// no replies yet — be the first!</div>
            </div>
          </div>

          <!-- Reply pagination -->
          <div v-if="replyMeta.totalPages > 1" class="flex justify-center gap-2 mt-8">
            <button @click="loadReplies(replyMeta.page - 1)" :disabled="replyMeta.page === 1" class="px-4 py-2 bg-slate-900 border border-slate-700 text-slate-400 font-mono text-sm rounded-xl transition-all disabled:opacity-40">← prev</button>
            <button @click="loadReplies(replyMeta.page + 1)" :disabled="replyMeta.page === replyMeta.totalPages" class="px-4 py-2 bg-slate-900 border border-slate-700 text-slate-400 font-mono text-sm rounded-xl transition-all disabled:opacity-40">next →</button>
          </div>
        </section>
      </template>

      <!-- Not found -->
      <div v-else class="text-center py-24">
        <div class="text-slate-400 font-mono text-lg">// post not found</div>
        <NuxtLink to="/" class="mt-4 inline-block text-emerald-400 font-mono hover:underline">$ cd ~/forum</NuxtLink>
      </div>
    </div>

    <!-- Modals -->
    <PostModal v-model="showEditModal" :edit-post="post" @submitted="onPostUpdated" />
    <ConfirmModal v-model="showDeletePostModal" title="Удалить пост?" message="Пост и все ответы будут удалены безвозвратно." @confirm="confirmDeletePost" />
    <ConfirmModal v-model="showDeleteReplyModal" title="Удалить ответ?" message="Ответ будет удалён безвозвратно." @confirm="confirmDeleteReply" />
    <ToastContainer :toasts="toasts" @remove="removeToast" />
  </main>
</template>

<script setup>
const route = useRoute()
const router = useRouter()
const { isAuthenticated, user, initialize } = useAuth()
const { forumAPI, apiRequest, handleApiError } = useApi()
const { toasts, success, error: showError, remove: removeToast } = useToast()

const postId = computed(() => Number(route.params.id))
const post = ref(null)
const loading = ref(true)

const replies = ref([])
const repliesLoading = ref(false)
const replyMeta = ref({ page: 1, totalPages: 1, total: 0 })

const replyBody = ref('')
const replyLoading = ref(false)

const editingReplyId = ref(null)
const editReplyBody = ref('')
const editReplyLoading = ref(false)

const showEditModal = ref(false)
const showDeletePostModal = ref(false)
const showDeleteReplyModal = ref(false)
const deleteReplyTarget = ref(null)

// Лайки поста (локальное состояние)
const postLiked = ref(false)
const postLikesCount = ref(0)

const canEditPost = computed(() => {
  if (!user.value || !post.value) return false
  return user.value.id === post.value.userId || user.value.role === 'ADMIN'
})

const canEditReply = (reply) => {
  if (!user.value) return false
  return user.value.id === reply.userId || user.value.role === 'ADMIN'
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

const loadPost = async () => {
  loading.value = true
  try {
    const data = await forumAPI.getPost(postId.value)
    post.value = data
    postLiked.value = data.likedByMe ?? false
    postLikesCount.value = data.likesCount ?? 0
  } catch (e) {
    showError(handleApiError(e, 'Не удалось загрузить пост'))
  } finally {
    loading.value = false
  }
}

const loadReplies = async (page = 1) => {
  repliesLoading.value = true
  try {
    const res = await forumAPI.getReplies(postId.value, page)
    replies.value = res.data || []
    replyMeta.value = res.meta || { page: 1, totalPages: 1, total: 0 }
  } catch (e) {
    showError(handleApiError(e, 'Не удалось загрузить ответы'))
  } finally {
    repliesLoading.value = false
  }
}

const togglePostLike = async () => {
  if (!isAuthenticated.value) return
  const wasLiked = postLiked.value
  postLiked.value = !wasLiked
  postLikesCount.value += wasLiked ? -1 : 1
  try {
    if (wasLiked) {
      await apiRequest(`/forum/posts/${postId.value}/likes`, { method: 'DELETE' })
    } else {
      await apiRequest(`/forum/posts/${postId.value}/likes`, { method: 'POST' })
    }
  } catch {
    postLiked.value = wasLiked
    postLikesCount.value += wasLiked ? 1 : -1
  }
}

const toggleReplyLike = async (reply) => {
  if (!isAuthenticated.value) return
  const wasLiked = reply.likedByMe
  reply.likedByMe = !wasLiked
  reply.likesCount = (reply.likesCount ?? 0) + (wasLiked ? -1 : 1)
  try {
    if (wasLiked) {
      await apiRequest(`/forum/posts/${postId.value}/replies/${reply.id}/likes`, { method: 'DELETE' })
    } else {
      await apiRequest(`/forum/posts/${postId.value}/replies/${reply.id}/likes`, { method: 'POST' })
    }
  } catch {
    reply.likedByMe = wasLiked
    reply.likesCount += wasLiked ? 1 : -1
  }
}

const submitReply = async () => {
  if (!replyBody.value.trim()) return
  replyLoading.value = true
  try {
    const created = await forumAPI.createReply(postId.value, replyBody.value.trim())
    replies.value.push(created)
    replyMeta.value.total++
    replyBody.value = ''
    success('Ответ опубликован!')
  } catch (e) {
    showError(handleApiError(e, 'Не удалось отправить ответ'))
  } finally {
    replyLoading.value = false
  }
}

const startEditReply = (reply) => {
  editingReplyId.value = reply.id
  editReplyBody.value = reply.body
}

const saveEditReply = async (reply) => {
  editReplyLoading.value = true
  try {
    const updated = await forumAPI.updateReply(postId.value, reply.id, editReplyBody.value)
    const idx = replies.value.findIndex(r => r.id === reply.id)
    if (idx !== -1) replies.value[idx] = { ...replies.value[idx], ...updated }
    editingReplyId.value = null
    success('Ответ обновлён!')
  } catch (e) {
    showError(handleApiError(e, 'Не удалось обновить ответ'))
  } finally {
    editReplyLoading.value = false
  }
}

const openDeleteReply = (reply) => {
  deleteReplyTarget.value = reply
  showDeleteReplyModal.value = true
}

const confirmDeleteReply = async () => {
  if (!deleteReplyTarget.value) return
  try {
    await forumAPI.deleteReply(postId.value, deleteReplyTarget.value.id)
    replies.value = replies.value.filter(r => r.id !== deleteReplyTarget.value.id)
    replyMeta.value.total--
    success('Ответ удалён')
  } catch (e) {
    showError(handleApiError(e, 'Не удалось удалить ответ'))
  } finally {
    showDeleteReplyModal.value = false
    deleteReplyTarget.value = null
  }
}

const onPostUpdated = (updated) => {
  post.value = { ...post.value, ...updated }
  success('Пост обновлён!')
}

const confirmDeletePost = async () => {
  try {
    await forumAPI.deletePost(postId.value)
    success('Пост удалён')
    router.push('/')
  } catch (e) {
    showError(handleApiError(e, 'Не удалось удалить пост'))
  } finally {
    showDeletePostModal.value = false
  }
}

onMounted(() => {
  initialize()
  loadPost()
  loadReplies()
})
</script>