<script setup>
import { computed } from 'vue'
import { RouterView, useRoute } from 'vue-router'
import Navbar from './components/navbar.vue'
import Footer from './components/footer.vue'
import ThemeModeToggle from './components/ThemeModeToggle.vue'

const route = useRoute()
const showGlobalThemeToggle = computed(() => route.path !== '/dashboard')
</script>


<template>
  <!--  <Navbar />-->
  <ThemeModeToggle v-if="showGlobalThemeToggle" />
  <RouterView />
  <Footer />
</template>


