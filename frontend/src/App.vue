<script setup>
import {computed} from 'vue'
import {RouterView, useRoute} from 'vue-router'
import Navbar from './components/navbar.vue'
import Footer from './components/footer.vue'
import ThemeModeToggle from './components/ThemeModeToggle.vue'

const route = useRoute()
const placeholderRouteNames = ['welcome', 'home', 'search', 'messages', 'notifications', 'create', 'profile', 'settings']
const isPlaceholderRoute = computed(() => placeholderRouteNames.includes(route.name?.toString() || ''))
const showGlobalThemeToggle = computed(() => !isPlaceholderRoute.value)
const showFooter = computed(() => !isPlaceholderRoute.value)
</script>


<template>
  <ThemeModeToggle v-if="showGlobalThemeToggle"/>
  <RouterView v-slot="{ Component }">
    <component :is="Component"/>
  </RouterView>
  <Footer v-if="showFooter"/>
</template>

