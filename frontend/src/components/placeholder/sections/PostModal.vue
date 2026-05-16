<script setup>
import PostCard from '../PostCard.vue'
import BaseModal from './BaseModal.vue'

defineProps({
  post: {
    type: Object,
    required: true
  },
  userRole: {
    type: String,
    default: null
  },
  userId: {
    type: String,
    default: null
  },
  appliedPostIds: {
    type: Object,
    default: () => new Set()
  }
})

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

