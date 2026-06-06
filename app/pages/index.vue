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

        <h1 class="text-3xl sm:text-4xl lg:text-5xl font-bold text-white mb-6 leading-tight">
          <span class="font-mono text-emerald-500">root@forum:~#</span>
          <br />
          <span class="bg-gradient-to-r from-emerald-400 to-cyan-400 bg-clip-text text-transparent">
            Community Hub
          </span>
        </h1>

        <p class="text-slate-400 font-mono text-sm sm:text-base max-w-xl mx-auto mb-10 leading-relaxed">
          {{ $t('forum.home.description') }}
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

      <!-- Популярные теги -->
      <section class="mb-16">
        <div class="flex items-center gap-3 mb-6">
          <div class="flex gap-1">
            <div class="w-2.5 h-2.5 bg-red-500 rounded-full"></div>
            <div class="w-2.5 h-2.5 bg-yellow-500 rounded-full"></div>
            <div class="w-2.5 h-2.5 bg-green-500 rounded-full"></div>
          </div>
          <span class="text-slate-400 font-mono text-sm">popular_tags</span>
        </div>

        <div class="bg-slate-900/50 border border-emerald-500/20 rounded-xl p-6">
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
              ✕ {{ $t('forum.home.reset') }}
            </button>
          </div>
        </div>
      </section>

      <!-- Посты -->
      <section id="posts">
        <div class="flex flex-col gap-4 mb-6">
          <div class="flex flex-wrap items-center justify-between gap-4">
            <div class="flex items-center gap-3 flex-wrap">
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

          <div class="flex flex-wrap items-center gap-3">
            <span class="text-slate-400 font-mono text-xs uppercase tracking-[0.2em]">filter</span>
            <button
              @click="changeCourseFilter('all')"
              :class="courseFilterType === 'all' ? 'bg-emerald-500/15 border-emerald-500/40 text-emerald-400' : 'bg-slate-900 border-slate-700 text-slate-400 hover:border-emerald-500/40 hover:text-emerald-300'"
              class="px-3 py-1.5 border rounded-full text-xs font-mono transition-all"
            >{{ $t('forum.home.filterAll') }}</button>
            <button
              @click="changeCourseFilter('course')"
              :class="courseFilterType === 'course' ? 'bg-emerald-500/15 border-emerald-500/40 text-emerald-300' : 'bg-slate-900 border-slate-700 text-slate-400 hover:border-emerald-500/40 hover:text-emerald-300'"
              class="px-3 py-1.5 border rounded-full text-xs font-mono transition-all"
            >{{ $t('forum.home.filterCourse') }}</button>
            <button
              @click="changeCourseFilter('other')"
              :class="courseFilterType === 'other' ? 'bg-slate-700 border-slate-600 text-slate-200' : 'bg-slate-900 border-slate-700 text-slate-400 hover:border-slate-500 hover:text-slate-300'"
              class="px-3 py-1.5 border rounded-full text-xs font-mono transition-all"
            >{{ $t('forum.home.filterOther') }}</button>

            <div v-if="courseFilterType === 'course'" class="flex items-center gap-3 flex-wrap">
              <span class="text-slate-500 font-mono text-xs">course</span>
              <select
                v-model.number="selectedCourseId"
                class="bg-slate-900 border border-slate-700 text-slate-200 text-sm rounded-xl px-3 py-2 outline-none transition-all"
              >
                <option :value="null">{{ $t('forum.home.allCourses') }}</option>
                <option v-for="course in courseOptions" :key="course.id" :value="course.id">{{ course.title }}</option>
              </select>
            </div>
          </div>
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

        <!-- Posts list с использованием компонента ForumPostCard -->
        <div v-else-if="filteredPosts.length" class="space-y-3">
          <ForumPostCard
            v-for="post in filteredPosts"
            :key="post.id"
            :post="post"
            :course-map="courseMap"
            :current-user="user"
            @click="navigateTo(`/forum/${post.id}`)"
            @edit="openEdit"
            @delete="openDelete"
          />
        </div>

        <!-- Empty -->
        <div v-else class="text-center py-24">
          <div class="w-16 h-16 rounded-full bg-slate-800 border border-slate-700 flex items-center justify-center mx-auto mb-4">
            <svg class="w-8 h-8 text-slate-600" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5"><path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z"/></svg>
          </div>
          <div class="text-slate-400 font-mono mb-2">
            {{ activeTag ? $t('forum.home.emptyWithTag', { tag: activeTag }) : '// no posts yet' }}
          </div>
          <div class="text-slate-600 font-mono text-sm">{{ $t('forum.home.emptyPrompt') }}</div>
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
    <ConfirmModal v-model="showDeleteModal" :title="$t('modal.deletePostTitle')" :message="$t('modal.deletePostMessage')" @confirm="confirmDelete" />
    <ToastContainer :toasts="toasts" @remove="removeToast" />
  </main>
</template>

<script setup lang="ts">
import { ref, computed, onMounted } from 'vue'
import ForumPostCard from '~/components/ForumPostCard.vue'

const { $t } = useNuxtApp()

const { isAuthenticated, user, initialize } = useAuth()
const { forumAPI, courseAPI, handleApiError } = useApi()
const { toasts, success, error: showError, remove: removeToast } = useToast()

const posts = ref([])
const courses = ref([])
const loading = ref(true)
const error = ref('')
const meta = ref({ page: 1, limit: 20, total: 0, totalPages: 1 })
const activeTag = ref('')
const courseFilterType = ref('all')
const selectedCourseId = ref(null)

const courseMap = computed(() => {
  return courses.value.reduce((map, course) => {
    map[course.id] = course
    return map
  }, {})
})

const coursePosts = computed(() => posts.value.filter(post => post.courseId))
const courseOptions = computed(() => {
  const ids = new Set(coursePosts.value.map(post => post.courseId))
  return courses.value.filter(course => ids.has(course.id))
})

const filteredPosts = computed(() => {
  let result = posts.value
  if (courseFilterType.value === 'course') {
    result = result.filter(post => post.courseId)
  } else if (courseFilterType.value === 'other') {
    result = result.filter(post => !post.courseId)
  }

  if (selectedCourseId.value) {
    result = result.filter(post => post.courseId === selectedCourseId.value)
  }

  if (!activeTag.value) {
    return result
  }
  return result.filter(post => post.tags?.includes(activeTag.value))
})

const showPostModal = ref(false)
const showEditModal = ref(false)
const showDeleteModal = ref(false)
const editTarget = ref(null)
const deleteTarget = ref(null)

const popularTags = ['python', 'javascript', 'csharp', 'c++', 'linux', 'bash', 'docker', 'git', 'api', 'backend', 'frontend', 'sql', 'сети', 'tcp-ip', 'osi', 'маршрутизация', 'vlan', 'vpn', 'dns', 'dhcp', 'cisco', 'mikrotik', 'wireshark', 'кибербезопасность', 'pentest', 'xss', 'sql-injection', 'osint']

const filterByTag = (tag) => {
  activeTag.value = activeTag.value === tag ? '' : tag
}

const changeCourseFilter = (filter) => {
  courseFilterType.value = filter
  if (filter !== 'course') {
    selectedCourseId.value = null
  }
}

const loadCourses = async () => {
  try {
    const data = await courseAPI.getAll()
    courses.value = Array.isArray(data) ? data : data.data || []
  } catch (e) {
    console.warn($t('errors.loadCourses'), e)
  }
}

const loadPosts = async (page = 1) => {
  loading.value = true
  error.value = ''
  try {
    const res = await forumAPI.getPosts(page)
    posts.value = res.data || []
    meta.value = res.meta || { page: 1, totalPages: 1, total: 0 }
  } catch (e) {
    error.value = handleApiError(e, $t('errors.loadPosts'))
  } finally {
    loading.value = false
  }
}

const changePage = (p) => {
  if (p < 1 || p > meta.value.totalPages) return
  loadPosts(p)
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
    success($t('forum.notifications.postDeleted'))
  } catch (e) {
    showError(handleApiError(e, $t('errors.deletePost')))
  } finally {
    showDeleteModal.value = false
    deleteTarget.value = null
  }
}

const onPostCreated = (newPost) => {
  posts.value.unshift(newPost)
  success($t('forum.notifications.postPublished'))
}

const onPostUpdated = (updated) => {
  const idx = posts.value.findIndex(p => p.id === updated.id)
  if (idx !== -1) posts.value[idx] = { ...posts.value[idx], ...updated }
  success($t('forum.notifications.postUpdated'))
}

onMounted(() => {
  initialize()
  loadPosts()
  loadCourses()
})
</script>