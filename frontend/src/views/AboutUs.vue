<template>
  <main class="info-shell">
    <section class="info-panel">
      <RouterLink to="/" class="home-pill">
        <HomeIcon class="h-7 w-7"/>
        <span>Home</span>
      </RouterLink>

      <div class="page-heading">
        <p class="eyebrow">About FirstStep</p>
        <h1>About Us</h1>
        <p>
          FirstStep connects Cambodian students with flexible work, internships, and early-career
          opportunities that help them build confidence while continuing their education.
        </p>
      </div>

      <div class="info-list">
        <article v-for="item in aboutItems" :key="item.title" class="info-row">
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
import {AcademicCapIcon, BriefcaseIcon, HeartIcon, HomeIcon, UserGroupIcon} from '@heroicons/vue/24/outline'

const aboutItems = [
  {
    title: 'Student-first career steps',
    description: 'We help students discover trusted local roles that fit their studies, schedules, and first-career goals.',
    icon: AcademicCapIcon,
    tone: 'tone-blue'
  },
  {
    title: 'Local employer network',
    description: 'Universities, SMEs, and employers can highlight meaningful work and find motivated campus-ready talent.',
    icon: BriefcaseIcon,
    tone: 'tone-green'
  },
  {
    title: 'Confidence through experience',
    description: 'Every feature is designed to make applications clearer, safer, and more encouraging for first-time workers.',
    icon: HeartIcon,
    tone: 'tone-purple'
  },
  {
    title: 'Community growth',
    description: 'We value trust, inclusion, and partnerships that strengthen Cambodia’s next generation of professionals.',
    icon: UserGroupIcon,
    tone: 'tone-pink'
  }
]
</script>

<style scoped>
@import './info-pages.css';
</style>
