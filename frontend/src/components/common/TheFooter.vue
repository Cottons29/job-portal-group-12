<template>
  <div class="flex items-center justify-between px-6 py-3 bg-white shadow">

    <!-- LEFT: Logo -->
    <div class="flex items-center gap-2">
      <div class="w-8 h-8 bg-blue-600 rounded"></div>
      <span class="font-semibold text-lg">StudentJobs</span>
    </div>

    <!-- CENTER: Navigation -->
    <div class="flex gap-6 text-gray-600">
      <a href="#" class="hover:text-blue-600">Home</a>
      <a href="#" class="hover:text-blue-600">Jobs</a>
      <a href="#" class="hover:text-blue-600">Applications</a>
    </div>

    <!-- RIGHT: User -->
    <div class="flex items-center gap-3">
      <span class="text-sm text-gray-600">John</span>
      <div class="w-8 h-8 bg-gray-300 rounded-full"></div>
    </div>

  </div>
</template>

<script setup lang="ts">
// no logic needed yet
</script>