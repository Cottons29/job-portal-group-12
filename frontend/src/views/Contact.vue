<template>
  <main class="info-shell">
    <section class="info-panel">
      <RouterLink to="/" class="home-pill">
        <HomeIcon class="h-7 w-7"/>
        <span>Home</span>
      </RouterLink>

      <div class="page-heading">
        <p class="eyebrow">Get in touch</p>
        <h1>Contact</h1>
        <p>
          Have questions about FirstStep, need support, or want to partner with us? We would love to
          hear from you.
        </p>
      </div>

      <div class="info-list">
        <article v-for="item in contactItems" :key="item.title" class="info-row">
          <span class="icon-bubble" :class="item.tone">
            <component :is="item.icon" class="h-8 w-8"/>
          </span>
          <div>
            <h2>{{ item.title }}</h2>
            <p v-if="item.href"><a :href="item.href">{{ item.value }}</a></p>
            <p v-else>{{ item.value }}</p>
            <p>{{ item.description }}</p>
          </div>
        </article>
      </div>
    </section>
  </main>
</template>

<script setup>
import {ClockIcon, EnvelopeIcon, HomeIcon, MapPinIcon} from '@heroicons/vue/24/outline'

const contactItems = [
  {
    title: 'Email',
    value: 'support@firststep.com',
    description: 'Send us your questions and we will respond as soon as possible.',
    href: 'mailto:support@firststep.com',
    icon: EnvelopeIcon,
    tone: 'tone-green'
  },
  {
    title: 'Location',
    value: 'Phnom Penh, Cambodia',
    description: 'Supporting students and employers across Cambodia.',
    icon: MapPinIcon,
    tone: 'tone-blue'
  },
  {
    title: 'Support hours',
    value: 'Monday - Friday, 9:00 AM - 5:00 PM',
    description: 'Our team is available during business hours for student, employer, and partner support.',
    icon: ClockIcon,
    tone: 'tone-orange'
  }
]
</script>

<style scoped>
@import './info-pages.css';
</style>
