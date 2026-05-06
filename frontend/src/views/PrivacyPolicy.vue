<template>
  <main class="info-shell">
    <section class="info-panel">
      <RouterLink to="/" class="home-pill">
        <HomeIcon class="h-7 w-7"/>
        <span>Home</span>
      </RouterLink>

      <div class="page-heading">
        <p class="eyebrow">Your data</p>
        <h1>Privacy Policy</h1>
        <p>
          FirstStep respects your privacy. This policy explains the types of information we collect
          and how we use it to provide a safer job discovery experience.
        </p>
      </div>

      <div class="info-list">
        <article v-for="item in policyItems" :key="item.title" class="info-row">
          <span class="icon-bubble" :class="item.tone">
            <component :is="item.icon" class="h-8 w-8"/>
          </span>
          <div>
            <h2>{{ item.title }}</h2>
            <p>{{ item.description }}</p>
          </div>
        </article>
      </div>
    </section>
  </main>
</template>

<script setup>
import {
  ClipboardDocumentListIcon,
  HomeIcon,
  LockClosedIcon,
  ShieldCheckIcon,
  UserCircleIcon
} from '@heroicons/vue/24/outline'

const policyItems = [
  {
    title: 'Information we collect',
    description: 'We may collect account details, profile information, application activity, and basic usage data when you use the platform.',
    icon: ClipboardDocumentListIcon,
    tone: 'tone-green'
  },
  {
    title: 'How we use information',
    description: 'We use information to manage accounts, recommend opportunities, improve services, prevent misuse, and communicate important updates.',
    icon: UserCircleIcon,
    tone: 'tone-blue'
  },
  {
    title: 'Sharing and security',
    description: 'We only share information when needed to deliver the service, comply with legal obligations, or protect users.',
    icon: LockClosedIcon,
    tone: 'tone-purple'
  },
  {
    title: 'Your choices',
    description: 'You can review and update your account information, and you may contact us with privacy questions or data requests.',
    icon: ShieldCheckIcon,
    tone: 'tone-pink'
  }
]
</script>

<style scoped>
@import './info-pages.css';
</style>
