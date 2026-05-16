<script setup lang="ts">
import { ref } from 'vue'
import { useRouter } from 'vue-router'
import { ArrowRightOnRectangleIcon } from '@heroicons/vue/24/outline'
import { useAuthStore } from '@/stores/auth'

const auth = useAuthStore()
const router = useRouter()
const logoutError = ref('')

async function handleLogout() {
  logoutError.value = ''
  try {
    await auth.logout(router)
  } catch (error) {
    logoutError.value = 'Could not logout. Please try again.'
  }
}
</script>

<template>
  <section class="mx-auto min-w-39/40 max-w-2xl">
    <h2 class="mb-4 text-center font-display text-xl font-black tracking-[-0.04em] text-on-surface sm:text-2xl">
      {{ $t('settings.logout') }}
    </h2>
    <div class="rounded-[1.25rem] bg-surface-container-low p-5 text-center ring-1 ring-white/5">
      <span class="mx-auto grid h-14 w-14 place-items-center rounded-2xl bg-red-500/15">
        <ArrowRightOnRectangleIcon class="h-7 w-7 text-red-300"/>
      </span>
      <h3 class="mt-4 font-display text-2xl font-black tracking-[-0.04em] text-on-surface">{{ $t('settings.logoutSection.title') }}</h3>
      <p class="mx-auto mt-2 max-w-sm text-sm font-bold text-on-surface-variant">
        {{ $t('settings.logoutSection.description') }}
      </p>
      <p v-if="logoutError" class="mt-4 rounded-2xl bg-red-500/10 px-4 py-3 text-xs font-bold text-red-300">
        {{ logoutError }}</p>
      <button
          class="mt-5 rounded-full bg-red-500 px-6 py-3 text-sm font-black text-white transition hover:bg-red-400 disabled:cursor-not-allowed disabled:opacity-60"
          :disabled="auth.isLoading"
          type="button"
          @click="handleLogout"
      >
        {{ auth.isLoading ? $t('settings.logoutSection.loggingOut') : $t('settings.logout') }}
      </button>
    </div>
  </section>
</template>

<style scoped>

</style>