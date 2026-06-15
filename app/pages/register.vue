<template>
  <main class="min-h-screen bg-slate-950 flex items-center justify-center px-4 pt-16">
    <div class="absolute inset-0 bg-[linear-gradient(to_right,#10b98110_1px,transparent_1px),linear-gradient(to_bottom,#10b98110_1px,transparent_1px)] bg-[size:40px_40px] pointer-events-none"></div>

    <div class="relative bg-slate-900 border border-emerald-500/30 rounded-2xl p-8 w-full max-w-md shadow-2xl shadow-emerald-500/5 overflow-hidden">
      <div class="absolute top-0 left-1/2 -translate-x-1/2 w-2/3 h-px bg-gradient-to-r from-transparent via-emerald-500/50 to-transparent"></div>

      <div class="flex items-center gap-1.5 mb-8">
        <div class="w-2.5 h-2.5 bg-red-500 rounded-full"></div>
        <div class="w-2.5 h-2.5 bg-yellow-500 rounded-full"></div>
        <div class="w-2.5 h-2.5 bg-green-500 rounded-full"></div>
        <span class="text-slate-500 font-mono text-xs ml-2">auth/register.sh</span>
      </div>

      <h1 class="text-2xl font-bold text-white font-mono mb-1">$ ./register.sh</h1>
      <p class="text-slate-500 font-mono text-sm mb-8">{{ $t('auth.registerPrompt') }}</p>

      <form @submit.prevent="handleRegister" class="space-y-4">
        <div>
          <label class="block text-slate-400 font-mono text-xs mb-1.5">// username</label>
          <input v-model="form.username" type="text" required placeholder="JohnDoe"
            class="w-full bg-slate-800 border border-slate-700 focus:border-emerald-500/60 rounded-xl px-4 py-3 text-white font-mono text-sm placeholder-slate-600 outline-none transition-all" />
        </div>
        <div>
          <label class="block text-slate-400 font-mono text-xs mb-1.5">// email</label>
          <input v-model="form.email" type="email" required placeholder="user@example.com"
            class="w-full bg-slate-800 border border-slate-700 focus:border-emerald-500/60 rounded-xl px-4 py-3 text-white font-mono text-sm placeholder-slate-600 outline-none transition-all" />
        </div>
        <div>
          <label class="block text-slate-400 font-mono text-xs mb-1.5">// password</label>
          <input v-model="form.password" type="password" required placeholder="••••••••"
            class="w-full bg-slate-800 border border-slate-700 focus:border-emerald-500/60 rounded-xl px-4 py-3 text-white font-mono text-sm placeholder-slate-600 outline-none transition-all" />
          <div v-if="form.password.length > 0" class="mt-3 space-y-2.5">
            <div v-for="rule in passwordRulesList" :key="rule.key"
              class="flex items-center gap-2.5 font-mono text-xs transition-all duration-300"
              :class="rule.met ? 'text-emerald-400' : 'text-slate-500'">
              <span
                class="w-5 h-5 rounded-full border-2 flex items-center justify-center shrink-0 transition-all duration-500"
                :class="rule.met
                  ? 'bg-emerald-500/20 border-emerald-500/60 text-emerald-400 scale-100 opacity-100'
                  : 'border-slate-600/40 text-transparent scale-90 opacity-50'">
                <svg class="w-3 h-3 transition-all duration-300" :class="rule.met ? 'scale-100' : 'scale-0'"
                  viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="4" stroke-linecap="round" stroke-linejoin="round">
                  <polyline points="20 6 9 17 4 12"/>
                </svg>
              </span>
              {{ $t('auth.passwordRules.' + rule.key) }}
            </div>
            <div class="pt-0.5">
              <div class="h-0.5 bg-slate-700/40 rounded-full overflow-hidden">
                <div class="h-full rounded-full transition-all duration-500 ease-out"
                  :style="{ width: passwordStrength.percent + '%' }"
                  :class="passwordStrength.barClass"></div>
              </div>
            </div>
            <div class="flex justify-end">
              <span class="font-mono text-[10px] uppercase tracking-[0.15em] transition-all duration-300"
                :class="passwordStrength.color">
                {{ $t('auth.passwordStrength.' + passwordStrength.labelKey) }}
              </span>
            </div>
          </div>
        </div>

        <div class="pt-1 flex justify-center overflow-hidden">
          <div class="cf-turnstile" :data-sitekey="siteKey" data-callback="onTurnstileSuccess"
            data-expired-callback="onTurnstileExpired" data-error-callback="onTurnstileError"></div>
        </div>

        <div v-if="errorMsg" class="px-4 py-3 bg-red-500/10 border border-red-500/30 rounded-xl text-red-400 font-mono text-sm">
          ✗ {{ errorMsg }}
        </div>
        <div v-if="successMsg" class="px-4 py-3 bg-emerald-500/10 border border-emerald-500/30 rounded-xl text-emerald-400 font-mono text-sm">
          ✓ {{ successMsg }}
        </div>

        <button type="submit" :disabled="loading"
          class="w-full py-3 bg-emerald-500 hover:bg-emerald-400 text-slate-950 font-mono font-bold rounded-xl transition-all disabled:opacity-50 flex items-center justify-center gap-2">
          <div v-if="loading" class="w-4 h-4 border-2 border-slate-950 border-t-transparent rounded-full animate-spin"></div>
          <span>{{ loading ? $t('auth.registerLoading') : '$ create_account.sh' }}</span>
        </button>
      </form>

      <p class="text-center text-slate-500 font-mono text-sm mt-6">
        {{ $t('auth.alreadyHaveAccount') }}
        <NuxtLink to="/login" class="text-emerald-400 hover:underline ml-1">$ login</NuxtLink>
      </p>
    </div>
  </main>
</template>

<script setup lang="ts">
useHead({
  script: [
    {
      src: 'https://challenges.cloudflare.com/turnstile/v0/api.js',
      async: true,
      defer: true
    }
  ]
})

const { register } = useAuth()
const { handleApiError } = useApi()
const { $t } = useNuxtApp()
const runtimeConfig = useRuntimeConfig()

const form = reactive({ username: '', email: '', password: '' })
const loading = ref(false)
const errorMsg = ref('')
const successMsg = ref('')
const passwordChecks = computed(() => ({
  minLength: form.password.length >= 8,
  hasUpper: /[A-Z]/.test(form.password),
  hasSpecial: /[\d!@#$%^&*(),.?":{}|<>]/.test(form.password)
}))

const passwordRulesList = computed(() => [
  { key: 'minLength', met: passwordChecks.value.minLength },
  { key: 'hasUpper', met: passwordChecks.value.hasUpper },
  { key: 'hasSpecial', met: passwordChecks.value.hasSpecial }
])

const passwordStrength = computed(() => {
  const met = Object.values(passwordChecks.value).filter(Boolean).length
  const percent = (met / 3) * 100
  if (met <= 1) return { percent, labelKey: 'weak', color: 'text-red-400/50', barClass: 'bg-red-400/60' }
  if (met === 2) return { percent, labelKey: 'medium', color: 'text-yellow-400/50', barClass: 'bg-yellow-400/60' }
  return { percent, labelKey: 'strong', color: 'text-emerald-400/50', barClass: 'bg-emerald-400' }
})

const turnstileToken = ref('')
const siteKey = runtimeConfig.public.turnstileSiteKey || '0x4AAAAAADc0xYww_LmgQeEr'

const resetTurnstile = () => {
  if (process.client && window.turnstile?.reset) {
    window.turnstile.reset()
  }
  turnstileToken.value = ''
}

onMounted(() => {
  if (!process.client) return
  window.onTurnstileSuccess = (token) => {
    turnstileToken.value = token
  }
  window.onTurnstileExpired = () => {
    resetTurnstile()
  }
  window.onTurnstileError = () => {
    resetTurnstile()
    errorMsg.value = $t('auth.turnstileError')
  }
})

const handleRegister = async () => {
  if (!turnstileToken.value) {
    errorMsg.value = $t('auth.turnstileRequired')
    return
  }
  loading.value = true
  errorMsg.value = ''
  successMsg.value = ''
  try {
    await register({ ...form, turnstileToken: turnstileToken.value })
    successMsg.value = $t('auth.registerSuccess')
  } catch (e) {
    errorMsg.value = handleApiError(e, $t('auth.registerError'))
    resetTurnstile()
  } finally {
    loading.value = false
  }
}
</script>

<style>
.cf-turnstile {
  transform: scale(1);
  transform-origin: center;
}
@media (max-width: 480px) {
  .cf-turnstile {
    transform: scale(0.82);
  }
}
</style>
