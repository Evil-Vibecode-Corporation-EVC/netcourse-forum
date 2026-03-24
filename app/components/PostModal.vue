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
              <div>
                <label class="block text-slate-400 font-mono text-xs mb-1.5">// title *</label>
                <input
                  v-model="form.title"
                  type="text"
                  placeholder="Введите заголовок поста..."
                  required
                  class="w-full bg-slate-800 border border-slate-700 focus:border-emerald-500/60 rounded-xl px-4 py-3 text-white font-mono text-sm placeholder-slate-600 outline-none transition-all"
                />
              </div>
              <div>
                <label class="block text-slate-400 font-mono text-xs mb-1.5">// body *</label>
                <textarea
                  v-model="form.body"
                  rows="6"
                  placeholder="Напишите содержание поста..."
                  required
                  class="w-full bg-slate-800 border border-slate-700 focus:border-emerald-500/60 rounded-xl px-4 py-3 text-white font-mono text-sm placeholder-slate-600 outline-none transition-all resize-none leading-relaxed"
                ></textarea>
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
                  <span>{{ loading ? 'Отправка...' : (isEdit ? '$ update.sh' : '$ publish.sh') }}</span>
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

<script setup>
const props = defineProps({
  modelValue: { type: Boolean, default: false },
  editPost: { type: Object, default: null }
})

const emit = defineEmits(['update:modelValue', 'submitted'])

const isEdit = computed(() => !!props.editPost)
const form = reactive({ title: '', body: '' })
const loading = ref(false)
const errorMsg = ref('')
const { forumAPI } = useApi()

watch(() => props.editPost, (val) => {
  if (val) {
    form.title = val.title
    form.body = val.body
  } else {
    form.title = ''
    form.body = ''
  }
}, { immediate: true })

watch(() => props.modelValue, (val) => {
  if (!val) {
    errorMsg.value = ''
    if (!props.editPost) {
      form.title = ''
      form.body = ''
    }
  }
})

const handleSubmit = async () => {
  loading.value = true
  errorMsg.value = ''
  try {
    let result
    if (isEdit.value) {
      result = await forumAPI.updatePost(props.editPost.id, { title: form.title, body: form.body })
    } else {
      result = await forumAPI.createPost({ title: form.title, body: form.body })
    }
    emit('submitted', result)
    emit('update:modelValue', false)
  } catch (e) {
    errorMsg.value = e.message || 'Произошла ошибка'
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