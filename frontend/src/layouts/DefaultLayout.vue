<template>
  <div class="min-h-screen bg-gray-50">
    <Navbar />
    <div class="p-6">
      <RouterView />
    </div>
  </div>
</template>

<script setup lang="ts">
import { RouterView } from 'vue-router'
import Navbar from '@/components/common/Navbar.vue'
</script>
