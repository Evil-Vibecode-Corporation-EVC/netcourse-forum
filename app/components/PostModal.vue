<!-- components/PostModal.vue -->
<template>
  <Teleport to="body">
    <Transition name="modal-fade">
      <div v-if="modelValue" class="fixed inset-0 z-50 flex items-center justify-center p-4" @click.self="$emit('update:modelValue', false)">
        <div class="absolute inset-0 bg-slate-950/80 backdrop-blur-sm"></div>
        <Transition name="modal-scale">
          <div v-if="modelValue" class="relative bg-slate-900 border border-emerald-500/30 rounded-2xl p-6 w-full max-w-2xl shadow-2xl shadow-emerald-500/5 overflow-hidden">
            <div class="absolute inset-0 bg-[linear-gradient(to_right,#10b98108_1px,transparent_1px),linear-gradient(to_bottom,#10b98108_1px,transparent_1px)] bg-[size:24px_24px] pointer-events-none rounded-2xl"></div>
            <div class="absolute top-0 left-1/2 -translate-x-1/2 w-2/3 h-px bg-gradient-to-r from-transparent via-emerald-500/50 to-transparent"></div>

            <div class="relative flex items-center gap-1.5 mb-6">
              <div class="w-2.5 h-2.5 bg-red-500 rounded-full"></div>
              <div class="w-2.5 h-2.5 bg-yellow-500 rounded-full"></div>
              <div class="w-2.5 h-2.5 bg-green-500 rounded-full"></div>
              <span class="text-slate-500 font-mono text-xs ml-2">{{ isEdit ? 'edit_post.sh' : 'new_post.sh' }}</span>
              <button @click="$emit('update:modelValue', false)" class="absolute right-0 w-7 h-7 flex items-center justify-center rounded-lg bg-slate-800 border border-slate-700 hover:border-slate-500 text-slate-400 hover:text-white transition-all">
                <span class="text-sm leading-none">×</span>
              </button>
            </div>

            <h2 class="relative text-lg font-bold text-white font-mono mb-5">
              {{ isEdit ? '> edit_post' : '> create_post' }}
            </h2>

            <form @submit.prevent="handleSubmit" class="relative space-y-4">
              <!-- title -->
              <div>
                <label class="block text-slate-400 font-mono text-xs mb-1.5">// title *</label>
                <input
                  v-model="form.title"
                  type="text"
                  :placeholder="$t('modal.titlePlaceholder')"
                  required
                  class="w-full bg-slate-800 border border-slate-700 focus:border-emerald-500/60 rounded-xl px-4 py-3 text-white font-mono text-sm placeholder-slate-600 outline-none transition-all"
                />
              </div>

              <!-- body -->
              <div>
                <label class="block text-slate-400 font-mono text-xs mb-1.5">// body *</label>
                <textarea
                  v-model="form.body"
                  rows="6"
                  :placeholder="$t('modal.bodyPlaceholder')"
                  required
                  class="w-full bg-slate-800 border border-slate-700 focus:border-emerald-500/60 rounded-xl px-4 py-3 text-white font-mono text-sm placeholder-slate-600 outline-none transition-all resize-none leading-relaxed"
                ></textarea>
              </div>

              <!-- Теги -->
              <div>
                <label class="block text-slate-400 font-mono text-xs mb-1.5">// tags <span class="text-slate-600">{{ $t('modal.optional') }}</span></label>
                <div class="bg-slate-800 border border-slate-700 focus-within:border-emerald-500/60 rounded-xl px-4 py-3 transition-all">
                  <div class="flex flex-wrap gap-1.5 mb-2" v-if="form.tags.length">
                    <span
                      v-for="(tag, i) in form.tags"
                      :key="i"
                      class="flex items-center gap-1 px-2 py-0.5 bg-emerald-500/10 border border-emerald-500/25 rounded text-emerald-400 font-mono text-xs"
                    >
                      #{{ tag }}
                      <button type="button" @click="removeTag(i)" class="text-emerald-500/60 hover:text-red-400 leading-none ml-0.5 transition-colors">×</button>
                    </span>
                  </div>
                  <input
                    v-model="tagInput"
                    type="text"
                    :placeholder="$t('modal.tagPlaceholder')"
                    class="w-full bg-transparent text-white font-mono text-sm placeholder-slate-600 outline-none"
                    @keydown="onTagKeydown"
                  />
                </div>
                <div class="flex flex-wrap gap-1.5 mt-2">
                  <button
                    v-for="suggested in suggestedTags.filter(t => !form.tags.includes(t))"
                    :key="suggested"
                    type="button"
                    @click="form.tags.push(suggested)"
                    class="px-2 py-0.5 bg-slate-800 border border-slate-700 hover:border-emerald-500/30 hover:text-emerald-400 rounded text-slate-500 font-mono text-xs transition-all"
                  >
                    +#{{ suggested }}
                  </button>
                </div>
              </div>

              <!-- Выбор курса (необязательно) -->
              <div v-if="isAuthenticated">
                <label class="block text-slate-400 font-mono text-xs mb-1.5">// course <span class="text-slate-600">{{ $t('modal.optional') }}</span></label>
                <select
                  v-model="form.courseId"
                  class="w-full bg-slate-800 border border-slate-700 focus:border-emerald-500/60 rounded-xl px-4 py-3 text-white font-mono text-sm outline-none transition-all"
                >
                  <option :value="null">{{ $t('modal.noCourse') }}</option>
                  <option
                    v-for="c in completedCourses"
                    :key="c.id"
                    :value="c.id"
                  >
                    {{ c.title }}
                  </option>
                </select>
                <div v-if="loadingCourses" class="text-xs text-slate-500 mt-1">{{ $t('modal.loadingCourses') }}</div>
                <div v-else-if="completedCourses.length === 0" class="text-xs text-slate-500 mt-1">{{ $t('modal.noCompletedCourses') }}</div>
              </div>

              <!-- Оценка курса (появляется только когда выбран курс) -->
              <div v-if="form.courseId && isAuthenticated" class="p-4 bg-slate-800/50 border border-slate-700/50 rounded-xl">
                <span class="block text-slate-400 font-mono text-xs mb-2">{{ $t('modal.courseRating') }}</span>
                <div class="flex items-center gap-1">
                  <button
                    v-for="n in 5"
                    :key="n"
                    type="button"
                    class="group/star relative"
                    @click="form.rating = n"
                    @mouseenter="hoveredRating = n"
                    @mouseleave="hoveredRating = 0"
                  >
                    <svg
                      class="w-7 h-7 transition-all duration-150"
                      :class="[
                        n <= activeStar
                          ? 'text-amber-400 drop-shadow-[0_0_6px_rgba(251,191,36,0.4)]'
                          : 'text-slate-600',
                        'hover:scale-110'
                      ]"
                      viewBox="0 0 20 20"
                      fill="currentColor"
                    >
                      <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z"/>
                    </svg>
                    <span
                      class="absolute -top-7 left-1/2 -translate-x-1/2 bg-slate-800 border border-slate-700 text-white font-mono text-xs px-2 py-0.5 rounded opacity-0 group-hover/star:opacity-100 transition-opacity pointer-events-none whitespace-nowrap"
                    >
                      {{ n }} / 5
                    </span>
                  </button>
                  <span class="text-slate-500 font-mono text-xs ml-2">{{ form.rating ? `${form.rating} / 5` : '' }}</span>
                  <button
                    v-if="form.rating"
                    class="ml-1 text-xs text-slate-500 hover:text-red-400 font-mono transition-colors"
                    @click="form.rating = null"
                  >
                    ✕
                  </button>
                </div>
              </div>

              <!-- Вложения -->
              <div>
                <label class="block text-slate-400 font-mono text-xs mb-1.5">// attachments <span class="text-slate-600">{{ $t('modal.optional') }}</span></label>
                <div class="bg-slate-800 border border-slate-700 focus-within:border-emerald-500/60 rounded-xl p-3 transition-all">
                  <!-- Существующие вложения (при редактировании) -->
                  <div v-if="isEdit && editPost?.attachments?.length" class="flex flex-wrap gap-2 mb-3">
                    <div
                      v-for="att in editPost.attachments"
                      :key="att.id"
                      class="flex items-center gap-2 px-3 py-1.5 bg-slate-700/50 border border-slate-600 rounded-lg"
                    >
                      <span v-if="att.mimeType?.startsWith('image/')" class="text-emerald-400 text-xs">🖼</span>
                      <span v-else class="text-slate-400 text-xs">📎</span>
                      <a :href="att.r2Key" target="_blank" class="text-slate-300 font-mono text-xs hover:text-emerald-400 truncate max-w-[120px]">{{ att.fileName }}</a>
                      <button
                        type="button"
                        @click="deleteExistingAttachment(att.id)"
                        class="text-slate-500 hover:text-red-400 text-xs leading-none transition-colors"
                      >×</button>
                    </div>
                  </div>
                  <div
                    class="flex items-center gap-2 cursor-pointer"
                    @click="$refs.fileInput.click()"
                  >
                    <svg class="w-4 h-4 text-slate-500" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                      <path d="M21.44 11.05l-9.19 9.19a6 6 0 0 1-8.49-8.49l9.19-9.19a4 4 0 0 1 5.66 5.66l-9.2 9.19a2 2 0 0 1-2.83-2.83l8.49-8.48"/>
                    </svg>
                    <span class="text-slate-400 font-mono text-xs">{{ selectedFiles.length ? selectedFiles.map(f => f.name).join(', ') : $t('modal.attachFiles') }}</span>
                  </div>
                  <input
                    ref="fileInput"
                    type="file"
                    multiple
                    accept="image/jpeg,image/png,image/webp,image/gif,application/pdf,application/msword,application/vnd.openxmlformats-officedocument.wordprocessingml.document"
                    class="hidden"
                    @change="onFilesSelected"
                  />
                </div>
                <div v-if="uploadError" class="mt-2 px-3 py-2 bg-red-500/10 border border-red-500/30 rounded-lg text-red-400 font-mono text-xs">
                  ✗ {{ uploadError }}
                </div>
              </div>

              <div v-if="errorMsg" class="px-4 py-3 bg-red-500/10 border border-red-500/30 rounded-xl text-red-400 font-mono text-sm">
                ✗ {{ errorMsg }}
              </div>

              <div class="flex gap-3 pt-1">
                <button
                  type="submit"
                  :disabled="loading"
                  class="flex-1 py-3 bg-emerald-500/10 border border-emerald-500/30 hover:bg-emerald-500/20 hover:border-emerald-500/60 text-emerald-400 font-mono text-sm font-semibold rounded-xl transition-all disabled:opacity-50 flex items-center justify-center gap-2"
                >
                  <div v-if="loading" class="w-4 h-4 border-2 border-emerald-400 border-t-transparent rounded-full animate-spin"></div>
                  <span>{{ loading ? $t('modal.sending') : (isEdit ? '$ update.sh' : '$ publish.sh') }}</span>
                </button>
                <button
                  type="button"
                  @click="$emit('update:modelValue', false)"
                  class="flex-1 py-3 bg-slate-800 border border-slate-700 hover:bg-slate-700 text-slate-400 font-mono text-sm rounded-xl transition-all"
                >
                  $ cancel
                </button>
              </div>
            </form>
          </div>
        </Transition>
      </div>
    </Transition>
  </Teleport>
</template>

<script setup lang="ts">
import { ref, reactive, computed, watch } from 'vue'
const { $t } = useNuxtApp()

const props = defineProps({
  modelValue: { type: Boolean, default: false },
  editPost: { type: Object, default: null }
})

const emit = defineEmits(['update:modelValue', 'submitted'])

const { forumAPI, forumAttachmentAPI, courseAPI, apiRequest } = useApi()
const { user, isAuthenticated } = useAuth()
const { error: showError } = useToast()

const isEdit = computed(() => !!props.editPost)
const form = reactive({
  title: '',
  body: '',
  tags: [],
  courseId: null,
  rating: null
})
const tagInput = ref('')
const loading = ref(false)
const errorMsg = ref('')
const selectedFiles = ref<File[]>([])
const uploadError = ref('')
const fileInput = ref<HTMLInputElement | null>(null)
const hoveredRating = ref(0)

const activeStar = computed(() => hoveredRating.value || form.rating || 0)

const suggestedTags = ['python', 'javascript', 'csharp', 'c++', 'linux', 'bash', 'docker', 'git', 'api', 'backend', 'frontend', 'sql', 'сети', 'tcp-ip', 'osi', 'маршрутизация', 'vlan', 'vpn', 'dns', 'dhcp', 'cisco', 'mikrotik', 'wireshark', 'кибербезопасность', 'pentest', 'xss', 'sql-injection', 'osint']

// Теги
const addTag = () => {
  const val = tagInput.value.trim().toLowerCase().replace(/^#/, '').replace(/[^a-zа-яё0-9-_]/gi, '')
  if (val && !form.tags.includes(val) && form.tags.length < 5) {
    form.tags.push(val)
  }
  tagInput.value = ''
}

const removeTag = (i) => {
  form.tags.splice(i, 1)
}

const onTagKeydown = (e) => {
  if (e.key === 'Enter') {
    e.preventDefault()
    addTag()
  } else if (e.key === ',' || e.key === ' ') {
    e.preventDefault()
    addTag()
  } else if (e.key === 'Backspace' && !tagInput.value && form.tags.length) {
    form.tags.pop()
  }
}

// Курсы
const completedCourses = ref([])
const loadingCourses = ref(false)

const loadCompletedCourses = async () => {
  if (!isAuthenticated.value) return
  loadingCourses.value = true
  try {
    const userData = await apiRequest(`/users/${user.value.id}`)
    const completed = (userData.progresses || [])
      .filter(p => p.status === 'completed')
      .map(p => p.courseId)

    if (completed.length) {
      const courses = await Promise.all(
        completed.map(courseId => courseAPI.getById(courseId))
      )
      completedCourses.value = courses
    } else {
      completedCourses.value = []
    }
  } catch {
    completedCourses.value = []
  } finally {
    loadingCourses.value = false
  }
}

const loadCurrentRating = async (courseId) => {
  try {
    const data = await courseAPI.getMyRating(courseId)
    form.rating = data.rating
  } catch {
    form.rating = null
  }
}

// Инициализация при открытии/редактировании
watch(() => props.editPost, (post) => {
  if (post) {
    form.title = post.title || ''
    form.body = post.body || ''
    form.tags = post.tags ? [...post.tags] : []
    form.courseId = post.courseId || null
    form.rating = null
    if (post.courseId) {
      loadCurrentRating(post.courseId)
    }
  } else {
    form.title = ''
    form.body = ''
    form.tags = []
    form.courseId = null
    form.rating = null
  }
  tagInput.value = ''
  loadCompletedCourses()
}, { immediate: true })

watch(() => props.modelValue, (val) => {
  if (!val) {
    errorMsg.value = ''
    uploadError.value = ''
    tagInput.value = ''
    selectedFiles.value = []
    if (fileInput.value) fileInput.value.value = ''
    if (!props.editPost) {
      form.title = ''
      form.body = ''
      form.tags = []
      form.courseId = null
      form.rating = null
    }
  }
})

const onFilesSelected = (e: Event) => {
  const input = e.target as HTMLInputElement
  if (input.files) {
    selectedFiles.value = Array.from(input.files)
  }
}

const deleteExistingAttachment = async (attachmentId: number) => {
  if (!props.editPost) return
  try {
    await forumAttachmentAPI.deletePost(props.editPost.id, attachmentId)
    if (props.editPost.attachments) {
      props.editPost.attachments = props.editPost.attachments.filter((a: any) => a.id !== attachmentId)
    }
  } catch (e: any) {
    showError(e.message || $t('modal.deleteError'))
  }
}

// Отправка формы
const handleSubmit = async () => {
  loading.value = true
  errorMsg.value = ''
  uploadError.value = ''
  try {
    let result
    const payload = {
      title: form.title,
      body: form.body,
      tags: form.tags,
      courseId: form.courseId || undefined
    }

    if (isEdit.value) {
      result = await forumAPI.updatePost(props.editPost.id, payload)
    } else {
      result = await forumAPI.createPost(payload)
    }

    // Загрузка вложений
    if (selectedFiles.value.length) {
      const postId = result.id
      for (const file of selectedFiles.value) {
        try {
          const att = await forumAttachmentAPI.uploadPost(postId, file)
          if (!result.attachments) result.attachments = []
          result.attachments.push(att)
        } catch (e: any) {
          uploadError.value = e.message || $t('modal.uploadError')
        }
      }
    }

    // Отправка оценки курса, если выбран курс и поставлена оценка
    if (form.courseId && form.rating) {
      try {
        await courseAPI.addOrUpdateRating(form.courseId, form.rating)
      } catch (e) {
        showError(e.message || $t('modal.saveError'))
      }
    }

    emit('submitted', result)
    emit('update:modelValue', false)
  } catch (e) {
    errorMsg.value = e.message || $t('modal.genericError')
  } finally {
    loading.value = false
  }
}
</script>

<style scoped>
.modal-fade-enter-active, .modal-fade-leave-active { transition: opacity 0.25s ease; }
.modal-fade-enter-from, .modal-fade-leave-to { opacity: 0; }
.modal-scale-enter-active { transition: all 0.3s cubic-bezier(0.34, 1.56, 0.64, 1); }
.modal-scale-leave-active { transition: all 0.2s ease; }
.modal-scale-enter-from { opacity: 0; transform: scale(0.9) translateY(20px); }
.modal-scale-leave-to { opacity: 0; transform: scale(0.95); }
</style>