<template>
  <Navbar />
    <RouterView />
  <Footer />
</template>

<script setup>
import { RouterView } from 'vue-router'
import Navbar from './components/navbar.vue'
import Footer from './components/footer.vue'
</script>
