<script setup lang="ts">
import PostCard from '../PostCard.vue'
import BaseModal from './BaseModal.vue'
import type { Post } from '@/types/profile'

defineProps<{
  post: Post
  userRole?: string | null
  userId?: string | null
  appliedPostIds?: Set<string | number>
}>()

defineEmits(['close', 'engagement-change', 'apply', 'view-applicants'])
</script>

<template>
  <BaseModal close-label="Close post" @close="$emit('close')">
    <PostCard
      class=" ml-10 mr-10"
      :post="post"
      :user-role="userRole"
      :user-id="userId"
      :applied-post-ids="appliedPostIds"
      full
      @engagement-change="$emit('engagement-change', $event)"
      @apply="$emit('apply', $event)"
      @view-applicants="$emit('view-applicants', $event)"
    />
  </BaseModal>
</template>

