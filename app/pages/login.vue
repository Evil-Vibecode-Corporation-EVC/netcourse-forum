<template>
  <main class="min-h-screen bg-slate-950 flex items-center justify-center px-4 pt-16">
    <div
      class="absolute inset-0 bg-[linear-gradient(to_right,#10b98110_1px,transparent_1px),linear-gradient(to_bottom,#10b98110_1px,transparent_1px)] bg-[size:40px_40px] pointer-events-none">
    </div>

    <div
      class="relative bg-slate-900 border border-emerald-500/30 rounded-2xl p-8 w-full max-w-md shadow-2xl shadow-emerald-500/5 overflow-hidden">
      <div
        class="absolute top-0 left-1/2 -translate-x-1/2 w-2/3 h-px bg-gradient-to-r from-transparent via-emerald-500/50 to-transparent">
      </div>

      <div class="flex items-center gap-1.5 mb-8">
        <div class="w-2.5 h-2.5 bg-red-500 rounded-full"></div>
        <div class="w-2.5 h-2.5 bg-yellow-500 rounded-full"></div>
        <div class="w-2.5 h-2.5 bg-green-500 rounded-full"></div>
        <span class="text-slate-500 font-mono text-xs ml-2">
          auth/login.sh
        </span>
      </div>

      <h1 class="text-2xl font-bold text-white font-mono mb-1">
        $ sudo login
      </h1>

      <p class="text-slate-500 font-mono text-sm mb-8">
        {{ $t('auth.loginPrompt') }}
      </p>

      <form @submit.prevent="handleLogin" class="space-y-4">
        <div>
          <label class="block text-slate-400 font-mono text-xs mb-1.5">
            // email
          </label>

          <input
            v-model="form.email"
            type="email"
            required
            placeholder="user@example.com"
            class="w-full bg-slate-800 border border-slate-700 focus:border-emerald-500/60 rounded-xl px-4 py-3 text-white font-mono text-sm placeholder-slate-600 outline-none transition-all"
          />
        </div>

        <div>
          <label class="block text-slate-400 font-mono text-xs mb-1.5">
            // password
          </label>

          <input
            v-model="form.password"
            type="password"
            required
            placeholder="••••••••"
            class="w-full bg-slate-800 border border-slate-700 focus:border-emerald-500/60 rounded-xl px-4 py-3 text-white font-mono text-sm placeholder-slate-600 outline-none transition-all"
          />
        </div>

        <div
          v-if="errorMsg"
          class="px-4 py-3 bg-red-500/10 border border-red-500/30 rounded-xl text-red-400 font-mono text-sm"
        >
          ✗ {{ errorMsg }}
        </div>

        <button
          type="submit"
          :disabled="loading"
          class="w-full py-3 bg-emerald-500 hover:bg-emerald-400 text-slate-950 font-mono font-bold rounded-xl transition-all disabled:opacity-50 flex items-center justify-center gap-2"
        >
          <div
            v-if="loading"
            class="w-4 h-4 border-2 border-slate-950 border-t-transparent rounded-full animate-spin"
          ></div>

          <span>
            {{ loading ? $t('auth.loadingLogin') : '$ ./login.sh' }}
          </span>
        </button>
      </form>

      <p class="text-center text-slate-500 font-mono text-sm mt-6">
        {{ $t('auth.noAccount') }}

        <NuxtLink
          to="/register"
          class="text-emerald-400 hover:underline ml-1"
        >
          $ register
        </NuxtLink>
      </p>
    </div>
  </main>
</template>

<script setup lang="ts">
const { login } = useAuth()
const { handleApiError } = useApi()
const { $t } = useNuxtApp()

const form = reactive({
  email: '',
  password: ''
})

const loading = ref(false)
const errorMsg = ref('')

const handleLogin = async () => {
  loading.value = true
  errorMsg.value = ''

  try {
    await login(form)
  } catch (e) {
    errorMsg.value = handleApiError(e, $t('auth.invalidCredentials'))
  } finally {
    loading.value = false
  }
}
</script>