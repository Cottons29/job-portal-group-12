<template>
  <main class="info-shell">
    <section class="info-panel">
      <RouterLink to="/" class="home-pill">
        <HomeIcon class="h-7 w-7"/>
        <span>Home</span>
      </RouterLink>

      <div class="page-heading">
        <p class="eyebrow">Platform rules</p>
        <h1>Terms of Service</h1>
        <p>
          These terms describe the basic rules for using FirstStep. By using the platform, you agree
          to use it responsibly and provide accurate information.
        </p>
      </div>

      <div class="info-list">
        <article v-for="item in termsItems" :key="item.title" class="info-row">
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
import {ArrowPathIcon, BriefcaseIcon, CheckBadgeIcon, HomeIcon, UserCircleIcon} from '@heroicons/vue/24/outline'

const termsItems = [
  {
    title: 'Accounts',
    description: 'You are responsible for keeping your account information accurate and protecting your login credentials.',
    icon: UserCircleIcon,
    tone: 'tone-blue'
  },
  {
    title: 'Acceptable use',
    description: 'Users must not post misleading content, misuse applicant data, interfere with the platform, or use FirstStep for unlawful activity.',
    icon: CheckBadgeIcon,
    tone: 'tone-green'
  },
  {
    title: 'Opportunities',
    description: 'Employers should provide clear, fair, and truthful role information. Students should apply honestly and communicate professionally.',
    icon: BriefcaseIcon,
    tone: 'tone-orange'
  },
  {
    title: 'Changes',
    description: 'We may update these terms as the service grows. Continued use of FirstStep means you accept the latest version.',
    icon: ArrowPathIcon,
    tone: 'tone-purple'
  }
]
</script>

<style scoped>
@import './info-pages.css';
</style>
