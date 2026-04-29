<script setup>
import { useRoute } from 'vue-router'

const route = useRoute()
const title = route.meta?.title || 'Coming Soon'
</script>

<template>
  <div class="flex min-h-screen items-center justify-center bg-surface-muted">
    <div class="text-center">
      <h1 class="text-3xl font-bold text-text-primary mb-2">{{ title }}</h1>
      <p class="text-text-secondary">This page is under construction.</p>
      <router-link
        to="/auth"
        class="mt-6 inline-block rounded-full bg-primary px-6 py-2.5 text-sm font-semibold text-white transition hover:bg-primary-dark"
      >
        ← Back to Login
      </router-link>
    </div>
  </div>
</template>
