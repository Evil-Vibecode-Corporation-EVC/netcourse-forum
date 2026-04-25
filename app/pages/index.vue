<!-- pages/index.vue -->
<template>
  <main class="min-h-screen bg-slate-950 pt-16">
    <!-- Hero секция -->
    <section class="relative pt-20 pb-16 px-6 overflow-hidden">
      <div class="absolute inset-0 bg-[linear-gradient(to_right,#10b98115_1px,transparent_1px),linear-gradient(to_bottom,#10b98115_1px,transparent_1px)] bg-[size:40px_40px]"></div>
      <div class="absolute top-0 left-1/2 -translate-x-1/2 w-96 h-96 bg-emerald-500/10 rounded-full blur-3xl pointer-events-none"></div>

      <div class="max-w-5xl mx-auto relative z-10 text-center">
        <div class="inline-flex items-center gap-2 px-4 py-2 bg-emerald-500/10 border border-emerald-500/30 rounded-full mb-6 font-mono text-sm text-emerald-400">
          <span class="w-2 h-2 bg-emerald-500 rounded-full animate-pulse"></span>
          forum.online — {{ meta.total }} discussions
        </div>

        <h1 class="text-4xl sm:text-5xl lg:text-6xl font-bold text-white mb-6 leading-tight">
          <span class="font-mono text-emerald-500">root@forum:~#</span>
          <br />
          <span class="bg-gradient-to-r from-emerald-400 to-cyan-400 bg-clip-text text-transparent">
            Community Hub
          </span>
        </h1>

        <p class="text-slate-400 font-mono text-sm sm:text-base max-w-xl mx-auto mb-10 leading-relaxed">
          // Задавай вопросы, делись знаниями,<br />обсуждай курсы и находи единомышленников
        </p>

        <div class="flex flex-col sm:flex-row items-center justify-center gap-4">
          <button
            v-if="isAuthenticated"
            @click="showPostModal = true"
            class="flex items-center gap-2 px-6 py-3 bg-emerald-500 hover:bg-emerald-400 text-slate-950 font-mono font-bold rounded-xl transition-all hover:shadow-lg hover:shadow-emerald-500/30"
          >
            <span class="text-lg leading-none">+</span>
            $ new_post.sh
          </button>
          <NuxtLink
            v-else
            to="/login"
            class="flex items-center gap-2 px-6 py-3 bg-emerald-500 hover:bg-emerald-400 text-slate-950 font-mono font-bold rounded-xl transition-all"
          >
            $ login_to_post
          </NuxtLink>
          <a href="#posts" class="flex items-center gap-2 px-6 py-3 bg-slate-900 border border-slate-700 hover:border-emerald-500/40 text-slate-300 font-mono rounded-xl transition-all">
            $ browse_posts
          </a>
        </div>
      </div>
    </section>

    <div class="max-w-7xl mx-auto px-4 sm:px-6 pb-20">
      <!-- Главные темы -->
      <section class="mb-16">
        <div class="flex items-center gap-3 mb-6">
          <div class="flex gap-1">
            <div class="w-2.5 h-2.5 bg-red-500 rounded-full"></div>
            <div class="w-2.5 h-2.5 bg-yellow-500 rounded-full"></div>
            <div class="w-2.5 h-2.5 bg-green-500 rounded-full"></div>
          </div>
          <span class="text-slate-400 font-mono text-sm">featured_topics</span>
        </div>

        <div class="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div class="group bg-slate-900 border border-emerald-500/20 hover:border-emerald-500/40 rounded-xl p-6 transition-all hover:-translate-y-1 duration-300">
            <div class="flex items-center gap-3 mb-4">
              <div class="w-10 h-10 bg-emerald-500/20 rounded-lg flex items-center justify-center">
                <svg class="w-5 h-5 text-emerald-400" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M21 16v2a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-2M7 10l5 5 5-5"/><path d="M12 15V3"/></svg>
              </div>
              <span class="text-emerald-400 font-mono text-xs bg-emerald-500/10 px-2 py-1 rounded">#popular</span>
            </div>
            <h3 class="text-white font-semibold text-lg mb-2 group-hover:text-emerald-400 transition-colors">JavaScript</h3>
            <p class="text-slate-400 text-sm leading-relaxed mb-4">Обсуждение JavaScript, фреймворков, библиотек и лучших практик.</p>
            <div class="flex items-center gap-4 text-xs font-mono text-slate-500"><span>124 темы</span><span>1.2k ответов</span></div>
          </div>

          <div class="group bg-slate-900 border border-emerald-500/20 hover:border-emerald-500/40 rounded-xl p-6 transition-all hover:-translate-y-1 duration-300">
            <div class="flex items-center gap-3 mb-4">
              <div class="w-10 h-10 bg-emerald-500/20 rounded-lg flex items-center justify-center">
                <svg class="w-5 h-5 text-emerald-400" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><rect x="2" y="3" width="20" height="14" rx="2" ry="2"/><line x1="8" y1="21" x2="16" y2="21"/><line x1="12" y1="17" x2="12" y2="21"/></svg>
              </div>
              <span class="text-emerald-400 font-mono text-xs bg-emerald-500/10 px-2 py-1 rounded">#trending</span>
            </div>
            <h3 class="text-white font-semibold text-lg mb-2 group-hover:text-emerald-400 transition-colors">Backend Development</h3>
            <p class="text-slate-400 text-sm leading-relaxed mb-4">Node.js, Python, базы данных, API и серверная разработка.</p>
            <div class="flex items-center gap-4 text-xs font-mono text-slate-500"><span>89 тем</span><span>845 ответов</span></div>
          </div>

          <div class="group bg-slate-900 border border-emerald-500/20 hover:border-emerald-500/40 rounded-xl p-6 transition-all hover:-translate-y-1 duration-300">
            <div class="flex items-center gap-3 mb-4">
              <div class="w-10 h-10 bg-emerald-500/20 rounded-lg flex items-center justify-center">
                <svg class="w-5 h-5 text-emerald-400" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><circle cx="12" cy="12" r="10"/><line x1="2" y1="12" x2="22" y2="12"/><path d="M12 2a15.3 15.3 0 0 1 4 10 15.3 15.3 0 0 1-4 10 15.3 15.3 0 0 1-4-10 15.3 15.3 0 0 1 4-10z"/></svg>
              </div>
              <span class="text-emerald-400 font-mono text-xs bg-emerald-500/10 px-2 py-1 rounded">#new</span>
            </div>
            <h3 class="text-white font-semibold text-lg mb-2 group-hover:text-emerald-400 transition-colors">Frontend & UI/UX</h3>
            <p class="text-slate-400 text-sm leading-relaxed mb-4">React, Vue, дизайн, анимации и пользовательские интерфейсы.</p>
            <div class="flex items-center gap-4 text-xs font-mono text-slate-500"><span>156 тем</span><span>2.1k ответов</span></div>
          </div>
        </div>
      </section>

      <!-- Категории и теги -->
      <section class="mb-16">
        <div class="flex items-center gap-3 mb-6">
          <div class="flex gap-1">
            <div class="w-2.5 h-2.5 bg-red-500 rounded-full"></div>
            <div class="w-2.5 h-2.5 bg-yellow-500 rounded-full"></div>
            <div class="w-2.5 h-2.5 bg-green-500 rounded-full"></div>
          </div>
          <span class="text-slate-400 font-mono text-sm">categories & tags</span>
        </div>

        <div class="bg-slate-900/50 border border-emerald-500/20 rounded-xl p-6">
          <div class="mb-6">
            <div class="text-slate-400 font-mono text-xs mb-3 flex items-center gap-2">
              <span class="w-1.5 h-1.5 bg-emerald-500 rounded-full"></span>
              categories
            </div>
            <div class="flex flex-wrap gap-2">
              <button
                v-for="cat in categories"
                :key="cat"
                @click="filterByTag(cat)"
                class="px-3 py-1.5 bg-slate-800 border rounded-lg font-mono text-sm transition-all"
                :class="activeTag === cat
                  ? 'border-emerald-500/60 text-emerald-400 bg-emerald-500/10'
                  : 'border-slate-700 text-slate-300 hover:border-emerald-500/40 hover:text-emerald-400'"
              >
                #{{ cat }}
              </button>
            </div>
          </div>

          <div>
            <div class="text-slate-400 font-mono text-xs mb-3 flex items-center gap-2">
              <span class="w-1.5 h-1.5 bg-emerald-500 rounded-full"></span>
              popular tags
            </div>
            <div class="flex flex-wrap gap-2">
              <button
                v-for="tag in popularTags"
                :key="tag"
                @click="filterByTag(tag)"
                class="px-2.5 py-1 border rounded-lg font-mono text-xs transition-all"
                :class="activeTag === tag
                  ? 'bg-emerald-500/20 border-emerald-500/50 text-emerald-400'
                  : 'bg-emerald-500/10 border-emerald-500/20 text-emerald-400 hover:bg-emerald-500/20'"
              >
                #{{ tag }}
              </button>
              <button
                v-if="activeTag"
                @click="activeTag = ''"
                class="px-2.5 py-1 bg-red-500/10 border border-red-500/20 rounded-lg text-red-400 font-mono text-xs hover:bg-red-500/20 transition-all"
              >
                ✕ сбросить
              </button>
            </div>
          </div>
        </div>
      </section>

      <!-- Посты -->
      <section id="posts">
        <div class="flex items-center justify-between mb-6 gap-4 flex-wrap">
          <div class="flex items-center gap-3">
            <div class="flex gap-1">
              <div class="w-2.5 h-2.5 bg-red-500 rounded-full"></div>
              <div class="w-2.5 h-2.5 bg-yellow-500 rounded-full"></div>
              <div class="w-2.5 h-2.5 bg-green-500 rounded-full"></div>
            </div>
            <span class="text-slate-400 font-mono text-sm">latest_discussions</span>
            <span class="bg-emerald-500/10 border border-emerald-500/20 text-emerald-400 font-mono text-xs px-2.5 py-1 rounded-lg">{{ filteredPosts.length }}</span>
            <span v-if="activeTag" class="flex items-center gap-1 px-2 py-0.5 bg-emerald-500/10 border border-emerald-500/25 rounded text-emerald-400 font-mono text-xs">
              #{{ activeTag }}
            </span>
          </div>
          <button
            v-if="isAuthenticated"
            @click="showPostModal = true"
            class="flex items-center gap-2 px-4 py-2 bg-emerald-500/10 border border-emerald-500/30 hover:bg-emerald-500/20 hover:border-emerald-500/50 text-emerald-400 font-mono text-sm rounded-xl transition-all"
          >
            <span>+</span> new post
          </button>
        </div>

        <!-- Loading -->
        <div v-if="loading" class="flex items-center justify-center py-24">
          <div class="text-center">
            <div class="w-8 h-8 border-2 border-emerald-500 border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
            <div class="text-emerald-500 font-mono text-sm">$ loading_posts...</div>
          </div>
        </div>

        <!-- Error -->
        <div v-else-if="error" class="text-center py-16">
          <div class="text-red-400 font-mono mb-4">✗ {{ error }}</div>
          <button @click="loadPosts" class="px-5 py-2 bg-slate-800 border border-slate-700 text-slate-300 font-mono text-sm rounded-xl hover:bg-slate-700 transition-all">
            $ retry.sh
          </button>
        </div>

        <!-- Posts list -->
        <div v-else-if="filteredPosts.length" class="space-y-3">
          <div
            v-for="post in filteredPosts"
            :key="post.id"
            class="group bg-slate-900 border border-slate-800 hover:border-emerald-500/30 rounded-xl p-5 transition-all cursor-pointer"
            @click="navigateTo(`/forum/${post.id}`)"
          >
            <div class="flex items-start gap-4">
              <!-- Аватар с tooltip -->
              <UserTooltip :user-id="post.user?.id || post.userId" @click.stop>
                <div class="w-10 h-10 rounded-full bg-emerald-500/15 border border-emerald-500/30 flex items-center justify-center overflow-hidden shrink-0 hover:border-emerald-500/60 transition-all cursor-pointer">
                  <img v-if="post.user?.avatarUrl" :src="post.user.avatarUrl" class="w-full h-full object-cover" />
                  <span v-else class="text-emerald-400 font-mono text-sm font-bold">
                    {{ post.user?.username?.charAt(0).toUpperCase() || '?' }}
                  </span>
                </div>
              </UserTooltip>

              <!-- Content -->
              <div class="flex-1 min-w-0">
                <div class="flex items-center gap-2 flex-wrap mb-2">
                  <span class="text-emerald-400 font-mono text-sm font-semibold">{{ post.user?.username || 'anonymous' }}</span>
                  <span class="text-slate-600 font-mono text-xs">·</span>
                  <span class="text-slate-500 font-mono text-xs">{{ formatDate(post.createdAt) }}</span>
                  <span v-if="post.updatedAt !== post.createdAt" class="text-slate-600 font-mono text-xs italic">(edited)</span>
                </div>

                <h3 class="text-white font-semibold text-lg mb-2 group-hover:text-emerald-400 transition-colors">
                  {{ post.title }}
                </h3>

                <p class="text-slate-400 text-sm leading-relaxed line-clamp-2 mb-3">
                  {{ post.body }}
                </p>

                <!-- Теги поста -->
                <div v-if="post.tags?.length" class="flex flex-wrap gap-1.5 mb-3" @click.stop>
                  <button
                    v-for="tag in post.tags"
                    :key="tag"
                    @click.stop="filterByTag(tag)"
                    class="px-2 py-0.5 bg-emerald-500/10 border border-emerald-500/20 rounded text-emerald-400 font-mono text-xs hover:bg-emerald-500/20 transition-all"
                  >
                    #{{ tag }}
                  </button>
                </div>

                <div class="flex items-center gap-4 text-xs font-mono text-slate-500">
                  <span class="flex items-center gap-1.5">
                    <svg class="w-3.5 h-3.5 text-slate-600" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z"/></svg>
                    {{ post.replies?.length || 0 }} replies
                  </span>

                  <!-- Лайки -->
                  <button
                    class="flex items-center gap-1.5 transition-all"
                    :class="post.likedByMe ? 'text-emerald-400' : 'text-slate-500 hover:text-emerald-400'"
                    @click.stop="toggleLike(post)"
                    :disabled="!isAuthenticated"
                    :title="isAuthenticated ? (post.likedByMe ? 'Убрать лайк' : 'Лайк') : 'Войдите'"
                  >
                    <svg
                      class="w-3.5 h-3.5 transition-transform hover:scale-110"
                      :class="post.likedByMe ? 'fill-emerald-400' : 'fill-none'"
                      viewBox="0 0 24 24" stroke="currentColor" stroke-width="2"
                    >
                      <path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z"/>
                    </svg>
                    <span>{{ post.likesCount ?? 0 }}</span>
                  </button>

                  <span class="flex items-center gap-1.5 ml-auto">
                    <span class="w-1 h-1 bg-emerald-500/60 rounded-full"></span>
                    #{{ post.id }}
                  </span>
                </div>
              </div>

              <!-- Actions -->
              <div v-if="canEditPost(post)" class="flex items-center gap-1 opacity-0 group-hover:opacity-100 transition-opacity" @click.stop>
                <button @click="openEdit(post)" class="p-2 rounded-lg bg-slate-800 hover:bg-slate-700 border border-slate-700 hover:border-emerald-500/40 text-slate-400 hover:text-emerald-400 transition-all" title="Редактировать">
                  <svg class="w-3.5 h-3.5" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7"/><path d="M18.5 2.5a2.121 2.121 0 0 1 3 3L12 15l-4 1 1-4 9.5-9.5z"/></svg>
                </button>
                <button @click="openDelete(post)" class="p-2 rounded-lg bg-slate-800 hover:bg-red-900/40 border border-slate-700 hover:border-red-500/40 text-slate-400 hover:text-red-400 transition-all" title="Удалить">
                  <svg class="w-3.5 h-3.5" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><polyline points="3 6 5 6 21 6"/><path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a1 1 0 0 1 1-1h4a1 1 0 0 1 1 1v2"/></svg>
                </button>
              </div>
            </div>
          </div>
        </div>

        <!-- Empty -->
        <div v-else class="text-center py-24">
          <div class="w-16 h-16 rounded-full bg-slate-800 border border-slate-700 flex items-center justify-center mx-auto mb-4">
            <svg class="w-8 h-8 text-slate-600" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5"><path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z"/></svg>
          </div>
          <div class="text-slate-400 font-mono mb-2">
            {{ activeTag ? `// нет постов с тегом #${activeTag}` : '// no posts yet' }}
          </div>
          <div class="text-slate-600 font-mono text-sm">Будьте первым, кто начнёт обсуждение!</div>
        </div>

        <!-- Pagination -->
        <div v-if="meta.totalPages > 1" class="flex items-center justify-center gap-2 mt-10">
          <button @click="changePage(meta.page - 1)" :disabled="meta.page === 1" class="px-4 py-2 bg-slate-900 border border-slate-700 hover:border-emerald-500/40 text-slate-400 font-mono text-sm rounded-xl transition-all disabled:opacity-40 disabled:cursor-not-allowed">← prev</button>
          <div class="flex gap-1">
            <button
              v-for="p in meta.totalPages"
              :key="p"
              @click="changePage(p)"
              class="w-9 h-9 font-mono text-sm rounded-lg transition-all border"
              :class="p === meta.page ? 'bg-emerald-500/15 border-emerald-500/40 text-emerald-400' : 'bg-slate-900 border-slate-700 text-slate-500 hover:border-slate-600 hover:text-slate-300'"
            >{{ p }}</button>
          </div>
          <button @click="changePage(meta.page + 1)" :disabled="meta.page === meta.totalPages" class="px-4 py-2 bg-slate-900 border border-slate-700 hover:border-emerald-500/40 text-slate-400 font-mono text-sm rounded-xl transition-all disabled:opacity-40 disabled:cursor-not-allowed">next →</button>
        </div>
      </section>
    </div>

    <!-- Modals -->
    <PostModal v-model="showPostModal" @submitted="onPostCreated" />
    <PostModal v-model="showEditModal" :edit-post="editTarget" @submitted="onPostUpdated" />
    <ConfirmModal v-model="showDeleteModal" title="Удалить пост?" message="Пост и все ответы к нему будут удалены безвозвратно." @confirm="confirmDelete" />
    <ToastContainer :toasts="toasts" @remove="removeToast" />
  </main>
</template>

<script setup>
const { isAuthenticated, user, initialize } = useAuth()
const { forumAPI, apiRequest, handleApiError } = useApi()
const { toasts, success, error: showError, remove: removeToast } = useToast()

const posts = ref([])
const loading = ref(true)
const error = ref('')
const meta = ref({ page: 1, limit: 20, total: 0, totalPages: 1 })
const activeTag = ref('')

const showPostModal = ref(false)
const showEditModal = ref(false)
const showDeleteModal = ref(false)
const editTarget = ref(null)
const deleteTarget = ref(null)

const categories = ['программирование', 'веб-разработка', 'мобильная-разработка', 'devops', 'базы-данных']
const popularTags = ['javascript', 'vue', 'react', 'python', 'nodejs', 'tailwind', 'typescript', 'api']

const filteredPosts = computed(() => {
  if (!activeTag.value) return posts.value
  return posts.value.filter(p => p.tags?.includes(activeTag.value))
})

const filterByTag = (tag) => {
  activeTag.value = activeTag.value === tag ? '' : tag
}

const canEditPost = (post) => {
  if (!user.value) return false
  return user.value.id === post.userId || user.value.role === 'ADMIN'
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

const loadPosts = async (page = 1) => {
  loading.value = true
  error.value = ''
  try {
    const res = await forumAPI.getPosts(page)
    posts.value = res.data || []
    meta.value = res.meta || { page: 1, totalPages: 1, total: 0 }
  } catch (e) {
    error.value = handleApiError(e, 'Не удалось загрузить посты')
  } finally {
    loading.value = false
  }
}

const changePage = (p) => {
  if (p < 1 || p > meta.value.totalPages) return
  loadPosts(p)
}

const toggleLike = async (post) => {
  if (!isAuthenticated.value) return
  const wasLiked = post.likedByMe
  post.likedByMe = !wasLiked
  post.likesCount = (post.likesCount ?? 0) + (wasLiked ? -1 : 1)
  try {
    if (wasLiked) {
      await apiRequest(`/forum/posts/${post.id}/likes`, { method: 'DELETE' })
    } else {
      await apiRequest(`/forum/posts/${post.id}/likes`, { method: 'POST' })
    }
  } catch {
    post.likedByMe = wasLiked
    post.likesCount += wasLiked ? 1 : -1
  }
}

const openEdit = (post) => {
  editTarget.value = post
  showEditModal.value = true
}

const openDelete = (post) => {
  deleteTarget.value = post
  showDeleteModal.value = true
}

const confirmDelete = async () => {
  if (!deleteTarget.value) return
  try {
    await forumAPI.deletePost(deleteTarget.value.id)
    posts.value = posts.value.filter(p => p.id !== deleteTarget.value.id)
    success('Пост удалён')
  } catch (e) {
    showError(handleApiError(e, 'Не удалось удалить пост'))
  } finally {
    showDeleteModal.value = false
    deleteTarget.value = null
  }
}

const onPostCreated = (newPost) => {
  posts.value.unshift(newPost)
  success('Пост опубликован!')
}

const onPostUpdated = (updated) => {
  const idx = posts.value.findIndex(p => p.id === updated.id)
  if (idx !== -1) posts.value[idx] = { ...posts.value[idx], ...updated }
  success('Пост обновлён!')
}

onMounted(() => {
  initialize()
  loadPosts()
})
</script>