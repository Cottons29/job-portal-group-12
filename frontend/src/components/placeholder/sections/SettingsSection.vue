<script setup>
import { ArrowRightOnRectangleIcon } from '@heroicons/vue/24/outline'

defineProps({
  settingsMenuItems: {
    type: Array,
    required: true
  },
  activeSettingsSection: {
    type: String,
    required: true
  },
  profileLoadError: {
    type: String,
    default: ''
  },
  personalInfoRows: {
    type: Array,
    required: true
  },
  securityRows: {
    type: Array,
    required: true
  },
  passkeyLoading: {
    type: Boolean,
    default: false
  },
  passkeyMessage: {
    type: String,
    default: ''
  },
  passkeyError: {
    type: String,
    default: ''
  },
  passwordError: {
    type: String,
    default: ''
  },
  passwordMessage: {
    type: String,
    default: ''
  },
  logoutError: {
    type: String,
    default: ''
  },
  authLoading: {
    type: Boolean,
    default: false
  }
})

defineEmits([
  'update:activeSettingsSection',
  'openPersonalInfoEditor',
  'handleLogout'
])
</script>

<template>
  <div class="grid gap-4 xl:grid-cols-[15rem_minmax(0,0.78fr)] xl:justify-start">
    <aside class="space-y-2 xl:sticky xl:top-28 xl:h-fit">
      <button
          v-for="item in settingsMenuItems"
          :key="item.label"
          :class="[
              item.active ? 'bg-surface-container-high text-on-surface' : 'text-on-surface-variant hover:bg-surface-container-low',
              'flex w-full items-center gap-3 rounded-full px-3 py-2.5 text-left text-sm font-black transition'
          ]"
          type="button"
          @click="$emit('update:activeSettingsSection', item.section)"
      >
        <span :class="[item.bg, 'grid h-9 w-9 shrink-0 place-items-center rounded-xl']">
          <component :is="item.icon" :class="[item.color, 'h-4 w-4']"/>
        </span>
        <span class="leading-tight">{{ item.label }}</span>
      </button>
    </aside>

    <section v-if="activeSettingsSection === 'personal'" class="mx-auto min-w-39/40 max-w-2xl">
      <h2 class="mb-4 text-center font-display text-xl font-black tracking-[-0.04em] text-on-surface sm:text-2xl">
        Personal info
      </h2>

      <p v-if="profileLoadError" class="mb-3 rounded-2xl bg-red-500/10 px-4 py-3 text-xs font-bold text-red-300">
        {{ profileLoadError }}
      </p>

      <div class="overflow-hidden rounded-[1.25rem] bg-surface-container-low ring-1 ring-white/5">
        <article
            v-for="(row, index) in personalInfoRows"
            :key="row.label"
            :class="[
                index === 0 ? 'rounded-t-[1.25rem]' : '',
                index === personalInfoRows.length - 1 ? 'rounded-b-[1.25rem]' : '',
                'flex cursor-pointer items-center gap-3 border-b border-surface last:border-b-0 bg-surface-container-low px-3 py-3 transition hover:bg-surface-container-high sm:px-4'
            ]"
            role="button"
            tabindex="0"
            @click="$emit('openPersonalInfoEditor', row)"
            @keydown.enter.prevent="$emit('openPersonalInfoEditor', row)"
            @keydown.space.prevent="$emit('openPersonalInfoEditor', row)"
        >
          <component :is="row.icon" class="h-4 w-4 shrink-0 text-on-surface-variant"/>
          <div class="min-w-0 flex-1">
            <h3 class="text-base font-black tracking-[-0.03em] text-on-surface">{{ row.label }}</h3>
            <p
                v-for="value in row.values"
                :key="value"
                class="mt-0.5 truncate text-xs font-bold text-on-surface-variant"
            >
              {{ value }}
            </p>
          </div>
          <img
              v-if="row.avatar"
              :alt="row.label"
              class="h-10 w-10 rounded-full object-cover ring-2 ring-surface-container-low"
              :src="row.avatar"
          />
          <span class="text-lg font-black text-on-surface-variant/70">›</span>
        </article>
      </div>
    </section>

    <section v-else-if="activeSettingsSection === 'security'" class="mx-auto min-w-39/40 max-w-2xl">
      <h2 class="mb-4 text-center font-display text-xl font-black tracking-[-0.04em] text-on-surface sm:text-2xl">
        Security & sign-in
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
                class="mt-0.5 truncate text-xs font-bold text-on-surface-variant"
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

    <section v-else-if="activeSettingsSection === 'privacy'" class="mx-auto min-w-39/40 max-w-2xl">
      <h2 class="mb-4 text-center font-display text-xl font-black tracking-[-0.04em] text-on-surface sm:text-2xl">
        Data & privacy
      </h2>
      <div
          class="rounded-[1.25rem] bg-surface-container-low p-5 text-sm font-bold text-on-surface-variant ring-1 ring-white/5">
        Manage privacy and account data controls here when they are connected.
      </div>
    </section>

    <section v-else-if="activeSettingsSection === 'logout'" class="mx-auto min-w-39/40 max-w-2xl">
      <h2 class="mb-4 text-center font-display text-xl font-black tracking-[-0.04em] text-on-surface sm:text-2xl">
        Logout
      </h2>
      <div class="rounded-[1.25rem] bg-surface-container-low p-5 text-center ring-1 ring-white/5">
        <span class="mx-auto grid h-14 w-14 place-items-center rounded-2xl bg-red-500/15">
          <ArrowRightOnRectangleIcon class="h-7 w-7 text-red-300"/>
        </span>
        <h3 class="mt-4 font-display text-2xl font-black tracking-[-0.04em] text-on-surface">Ready to leave?</h3>
        <p class="mx-auto mt-2 max-w-sm text-sm font-bold text-on-surface-variant">
          Logout will end your current session and return you to the authentication page.
        </p>
        <p v-if="logoutError" class="mt-4 rounded-2xl bg-red-500/10 px-4 py-3 text-xs font-bold text-red-300">
          {{ logoutError }}</p>
        <button
            class="mt-5 rounded-full bg-red-500 px-6 py-3 text-sm font-black text-white transition hover:bg-red-400 disabled:cursor-not-allowed disabled:opacity-60"
            :disabled="authLoading"
            type="button"
            @click="$emit('handleLogout')"
        >
          {{ authLoading ? 'Logging out...' : 'Logout' }}
        </button>
      </div>
    </section>
  </div>
</template>
