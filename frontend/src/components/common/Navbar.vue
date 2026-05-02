<template>
  <header class="bg-white border-b px-6 py-3 flex items-center justify-between">

    <!-- LEFT: Logo -->
    <div class="flex items-center gap-2">
      <div class="w-8 h-8 bg-blue-600 rounded-full flex items-center justify-center text-white">
        <BriefcaseBusiness class="w-4.5 h-4.5" />
      </div>
      <span class="font-semibold text-lg">FirstStep</span>
    </div>

    <!-- CENTER: Navigation -->
    <nav class="flex gap-6 text-sm">
      <a
        href="#"
        class="text-blue-600 font-medium border-b-2 border-blue-600 pb-1"
      >
        Explore
      </a>

      <a href="#" class="text-gray-500 hover:text-blue-600">
        Internships
      </a>

      <a href="#" class="text-gray-500 hover:text-blue-600">
        Resources
      </a>

      <a href="#" class="text-gray-500 hover:text-blue-600">
        Community
      </a>
    </nav>

    <!-- RIGHT: Icons + Avatar -->
    <div class="flex items-center gap-4">
      <RouterLink
        :to="{ name: 'job-posting' }"
        class="rounded-full bg-blue-600 px-5 py-2.5 text-sm font-bold text-white shadow-lg shadow-blue-600/20 transition hover:bg-blue-700"
      >
        Post Job
      </RouterLink>

      <!-- Notification -->
      <button
        type="button"
        aria-label="Notifications"
        class="w-9 h-9 rounded-full flex items-center justify-center text-gray-500 hover:text-blue-600 hover:bg-gray-100"
      >
        <Bell class="w-5 h-5" />
      </button>

      <!-- Bookmark -->
      <button
        type="button"
        aria-label="Saved jobs"
        class="w-9 h-9 rounded-full flex items-center justify-center text-gray-500 hover:text-blue-600 hover:bg-gray-100"
      >
        <Bookmark class="w-5 h-5" />
      </button>

      <!-- Avatar -->
      <div class="w-8 h-8 bg-green-400 rounded-full"></div>

    </div>

  </header>
</template>

<script setup lang="ts">
import { Bell, Bookmark, BriefcaseBusiness } from 'lucide-vue-next'
</script>
