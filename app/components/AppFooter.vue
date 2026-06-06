<!-- components/AppFooter.vue -->
<template>
  <footer class="bg-gradient-to-br from-slate-900 to-slate-800 text-white">
    <div class="max-w-7xl mx-auto px-6 py-12">
      <div class="grid grid-cols-1 md:grid-cols-2 gap-8">
        <!-- Описание -->
        <div>
          <div class="flex items-center mb-3">
            <span class="text-white">Course/Forum</span><span class="text-xl font-bold font-mono text-emerald-500">Net<span class="text-white">Course/Forum</span></span>
          </div>
          <p class="text-slate-300 leading-relaxed font-mono text-sm max-w-md">
            {{ $t('footer.description') }}
          </p>
        </div>

        <!-- Правила -->
        <div class="flex flex-col items-start md:items-end">
          <div class="flex gap-4 flex-wrap">
            <span class="text-slate-400 font-mono text-xs">{{ $t('footer.ruleBeKind') }}</span>
            <span class="text-slate-400 font-mono text-xs">{{ $t('footer.ruleNoSpam') }}</span>
            <span class="text-slate-400 font-mono text-xs">{{ $t('footer.ruleShare') }}</span>
          </div>
        </div>
      </div>

      <div class="mt-8 pt-6 border-t border-slate-700 text-center">
        <p class="text-slate-500 text-xs font-mono">
          © 2026 NetCourse/Forum <span class="text-emerald-500">// powered by EVC </span>
        </p>
      </div>
    </div>
  </footer>
</template>

<script setup lang="ts">

</script>