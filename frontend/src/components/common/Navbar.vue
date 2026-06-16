<template>
  <header class="bg-white border-b px-6 py-3 flex items-center justify-between">

    <!-- LEFT: Logo -->
    <RouterLink to="/home" class="flex items-center gap-2 hover:opacity-90 transition">
      <div class="w-8 h-8 bg-blue-600 rounded-full flex items-center justify-center text-white">
        <BriefcaseBusiness class="w-4.5 h-4.5" />
      </div>
      <span class="font-semibold text-lg text-slate-800">FirstStep</span>
    </RouterLink>

    <!-- CENTER: Navigation -->
    <nav class="flex gap-6 text-sm">
      <RouterLink
        to="/job-feed"
        class="text-blue-600 font-medium border-b-2 border-blue-600 pb-1"
      >
        Explore
      </RouterLink>

      <RouterLink to="/job-feed" class="text-gray-500 hover:text-blue-600 transition">
        Internships
      </RouterLink>

      <RouterLink to="/home" class="text-gray-500 hover:text-blue-600 transition">
        Dashboard
      </RouterLink>

      <a href="#" class="text-gray-500 hover:text-blue-600 transition">
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
      <RouterLink
        to="/notifications"
        class="w-9 h-9 rounded-full flex items-center justify-center text-gray-500 hover:text-blue-600 hover:bg-gray-100 transition"
        aria-label="Notifications"
      >
        <Bell class="w-5 h-5" />
      </RouterLink>

      <!-- Bookmark -->
      <RouterLink
        :to="{ name: 'saved-jobs' }"
        class="w-9 h-9 rounded-full flex items-center justify-center text-gray-500 hover:text-blue-600 hover:bg-gray-100 transition"
        aria-label="Saved jobs"
      >
        <Bookmark class="w-5 h-5" />
      </RouterLink>

      <!-- Avatar -->
      <RouterLink to="/profile" class="w-8 h-8 bg-blue-100 hover:bg-blue-200 text-blue-800 font-bold rounded-full flex items-center justify-center transition text-xs border border-blue-200">
        U
      </RouterLink>

    </div>

  </header>
</template>

<script setup lang="ts">
import { RouterLink } from 'vue-router'
import { Bell, Bookmark, BriefcaseBusiness } from 'lucide-vue-next'
</script>
