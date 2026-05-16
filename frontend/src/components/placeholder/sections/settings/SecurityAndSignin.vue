<script setup lang="ts">
import { ref, reactive, onMounted } from 'vue'
import { useI18n } from 'vue-i18n'
import { LockClosedIcon, KeyIcon } from '@heroicons/vue/24/outline'
import api from '@/lib/api'
import { startRegistration } from '@simplewebauthn/browser'

const { t } = useI18n()

const passkeyLoading = ref(false)
const passkeyMessage = ref('')
const passkeyError = ref('')
const passwordLoading = ref(false)
const passwordError = ref('')
const passwordMessage = ref('')
const passkeys = ref([])

const passwordForm = reactive({
  current: '',
  next: '',
  confirm: ''
})

const securityRows = [
  {
    label: t('settings.security.password'),
    values: ['Last changed 3 months ago'],
    icon: LockClosedIcon,
    action: () => { /* open password editor - could be a local ref if needed */ }
  },
  {
    label: t('settings.security.passkey'),
    values: ['Use your fingerprint or face to sign in'],
    icon: KeyIcon,
    buttonLabel: t('settings.security.addPasskey'),
    action: addPasskey
  }
]

async function loadPasskeys() {
  try {
    const { data } = await api.get('/auth/passkey/list')
    passkeys.value = data.passkeys
  } catch (error) {
    console.error('Failed to load passkeys:', error)
  }
}

async function addPasskey() {
  passkeyError.value = ''
  passkeyMessage.value = ''

  if (!window.PublicKeyCredential) {
    passkeyError.value = 'Passkeys are not supported in this browser.'
    return
  }

  passkeyLoading.value = true
  try {
    const { data: options } = await api.post('/auth/passkey/register/options')
    const response = await startRegistration({ optionsJSON: options })
    const { data } = await api.post('/auth/passkey/register/verify', { response })
    passkeys.value = data.passkeys
    passkeyMessage.value = 'Passkey added successfully.'
  } catch (error) {
    passkeyError.value = 'Could not add passkey. Please try again.'
  } finally {
    passkeyLoading.value = false
  }
}

async function updatePassword() {
  passwordError.value = ''
  passwordMessage.value = ''

  if (!passwordForm.current || !passwordForm.next || !passwordForm.confirm) {
    passwordError.value = 'Please fill in all password fields.'
    return
  }

  if (passwordForm.next.length < 8) {
    passwordError.value = 'New password must be at least 8 characters.'
    return
  }

  if (passwordForm.next !== passwordForm.confirm) {
    passwordError.value = 'New passwords do not match.'
    return
  }

  passwordLoading.value = true
  try {
    await api.post('/auth/password', {
      currentPassword: passwordForm.current,
      newPassword: passwordForm.next,
    })
    passwordMessage.value = 'Password updated successfully.'
    passwordForm.current = ''
    passwordForm.next = ''
    passwordForm.confirm = ''
  } catch (error) {
    passwordError.value = 'Could not update password. Check your current password and try again.'
  } finally {
    passwordLoading.value = false
  }
}

onMounted(() => {
  loadPasskeys()
})
</script>

<template>
  <section class="mx-auto min-w-39/40 max-w-2xl">
    <h2 class="mb-4 text-center font-display text-xl font-black tracking-[-0.04em] text-on-surface sm:text-2xl">
      {{ $t('settings.securitySignIn') }}
    </h2>

    <div class="overflow-hidden rounded-[1.25rem] bg-surface-container-low ring-1 ring-white/5">
      <article
          v-for="(row, index) in securityRows"
          :key="row.label"
          :class="[
              index === 0 ? 'rounded-t-[1.25rem]' : '',
              index === securityRows.length - 1 ? 'rounded-b-[1.25rem]' : '',
              'flex cursor-pointer items-center gap-3 border-b border-surface last:border-b-0 bg-surface-container-low px-3 py-3 transition hover:bg-surface-container-high sm:px-4'
          ]"
          role="button"
          tabindex="0"
          @click="row.action"
          @keydown.enter.prevent="row.action"
          @keydown.space.prevent="row.action"
      >
        <component :is="row.icon" class="h-4 w-4 shrink-0 text-on-surface-variant"/>
        <div class="min-w-0 flex-1">
          <h3 class="text-base font-black tracking-[-0.03em] text-on-surface">{{ row.label }}</h3>
          <p
              v-for="value in row.values"
              :key="value"
              class="mt-0.5 text-xs font-bold text-on-surface-variant"
          >
            {{ value }}
          </p>
        </div>
        <button
            v-if="row.buttonLabel"
            class="rounded-full bg-primary px-4 py-2 text-xs font-black text-on-primary transition hover:opacity-90 disabled:opacity-60"
            :disabled="passkeyLoading"
            type="button"
            @click.stop="row.action"
        >
          {{ row.buttonLabel }}
        </button>
        <span v-else class="text-lg font-black text-on-surface-variant/70">›</span>
      </article>
    </div>

    <div class="mt-3 space-y-2">
      <p v-if="passkeyMessage" class="rounded-2xl bg-[#8fd99b]/10 px-4 py-3 text-xs font-bold text-[#8fd99b]">
        {{ passkeyMessage }}</p>
      <p v-if="passkeyError" class="rounded-2xl bg-red-500/10 px-4 py-3 text-xs font-bold text-red-300">
        {{ passkeyError }}</p>
      <p v-if="passwordError" class="rounded-2xl bg-red-500/10 px-4 py-3 text-xs font-bold text-red-300">
        {{ passwordError }}</p>
      <p v-if="passwordMessage" class="rounded-2xl bg-[#8fd99b]/10 px-4 py-3 text-xs font-bold text-[#8fd99b]">
        {{ passwordMessage }}</p>
    </div>
  </section>
</template>

<style scoped>

</style>