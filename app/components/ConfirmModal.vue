<template>
  <Teleport to="body">
    <Transition name="modal-fade">
      <div v-if="modelValue" class="fixed inset-0 z-50 flex items-center justify-center p-4" @click.self="$emit('update:modelValue', false)">
        <div class="absolute inset-0 bg-slate-950/80 backdrop-blur-sm"></div>
        <div class="relative bg-slate-900 border border-red-500/30 rounded-2xl p-6 w-full max-w-sm shadow-2xl">
          <div class="flex items-center gap-1.5 mb-5">
            <div class="w-2.5 h-2.5 bg-red-500 rounded-full"></div>
            <div class="w-2.5 h-2.5 bg-yellow-500 rounded-full"></div>
            <div class="w-2.5 h-2.5 bg-green-500 rounded-full"></div>
            <span class="text-slate-500 font-mono text-xs ml-2">confirm_delete.sh</span>
          </div>
          <div class="w-12 h-12 rounded-full bg-red-500/10 border border-red-500/30 flex items-center justify-center mx-auto mb-4">
            <svg class="w-6 h-6 text-red-400" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><polyline points="3 6 5 6 21 6"/><path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a1 1 0 0 1 1-1h4a1 1 0 0 1 1 1v2"/></svg>
          </div>
          <h3 class="text-white font-mono font-bold text-center mb-2">{{ title || $t('modal.confirmDelete') }}</h3>
          <p class="text-slate-400 font-mono text-sm text-center mb-6">{{ message || $t('modal.confirmDeleteMsg') }}</p>
          <div class="flex gap-3">
            <button @click="$emit('confirm')" class="flex-1 py-2.5 bg-red-500/10 border border-red-500/30 hover:bg-red-500/20 text-red-400 font-mono text-sm rounded-xl transition-all">
              $ confirm
            </button>
            <button @click="$emit('update:modelValue', false)" class="flex-1 py-2.5 bg-slate-800 border border-slate-700 text-slate-400 font-mono text-sm rounded-xl hover:bg-slate-700 transition-all">
              $ cancel
            </button>
          </div>
        </div>
      </div>
    </Transition>
  </Teleport>
</template>

<script setup lang="ts">
defineProps({
  modelValue: { type: Boolean, default: false },
  title: { type: String, default: '' },
  message: { type: String, default: '' }
})
defineEmits(['update:modelValue', 'confirm'])
</script>

<style scoped>
.modal-fade-enter-active, .modal-fade-leave-active { transition: opacity 0.2s ease; }
.modal-fade-enter-from, .modal-fade-leave-to { opacity: 0; }
</style>