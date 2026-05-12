<script setup>
import DataAndPrivacy from "@/components/placeholder/sections/settings/DataAndPrivacy.vue";
import Languages from "@/components/placeholder/sections/settings/Languages.vue";
import Logout from "@/components/placeholder/sections/settings/Logout.vue";
import SecurityAndSignin from "@/components/placeholder/sections/settings/SecurityAndSignin.vue";
import PersonalInfo from "@/components/placeholder/sections/settings/PersonalInfo.vue";

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
  languageOptions: {
    type: Array,
    required: true
  },
  currentLocale: {
    type: String,
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
  'update:locale',
  'openPersonalInfoEditor',
  'handleLogout'
])
</script>

<template>
  <div class="grid gap-10 md:grid-cols-[15rem_minmax(0,1fr)] md:justify-start lg:gap-30 xl:grid-cols-[15rem_minmax(0,0.78fr)]">
    <aside class="space-y-2 md:sticky md:top-28 md:h-fit">
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

    <PersonalInfo
        v-if="activeSettingsSection === 'personal'"
        :profile-load-error="profileLoadError"
        :personal-info-rows="personalInfoRows"
        @open-personal-info-editor="$emit('openPersonalInfoEditor', $event)"
    />

    <SecurityAndSignin
        v-else-if="activeSettingsSection === 'security'"
        :security-rows="securityRows"
        :passkey-loading="passkeyLoading"
        :passkey-message="passkeyMessage"
        :passkey-error="passkeyError"
        :password-error="passwordError"
        :password-message="passwordMessage"
    />

    <DataAndPrivacy
        v-else-if="activeSettingsSection === 'privacy'"
    />

    <Languages
        v-else-if="activeSettingsSection === 'languages'"
        :language-options="languageOptions"
        :current-locale="currentLocale"
        @update:locale="$emit('update:locale', $event)"
    />

    <Logout
        v-else-if="activeSettingsSection === 'logout'"
        :logout-error="logoutError"
        :auth-loading="authLoading"
        @handle-logout="$emit('handleLogout')"
    />
  </div>
</template>
