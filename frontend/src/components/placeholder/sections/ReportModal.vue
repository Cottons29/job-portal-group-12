<script lang="ts" setup>
import { ref } from 'vue'
import BaseModal from './BaseModal.vue'
import api from '@/lib/api'

const props = defineProps<{
  targetType: 'post' | 'user'
  targetId: string
  title?: string
}>()

const emit = defineEmits(['close', 'success'])

const reason = ref('')
const details = ref('')
const submitting = ref(false)
const error = ref('')

const reasons = props.targetType === 'post' 
  ? ['Fraudulent Job Listing', 'Abusive / Offensive Content', 'Spam or Scams', 'Misleading Information', 'Other']
  : ['Abusive / Offensive Behavior', 'Spam or Scam Account', 'Impersonation', 'Other']

// Set default reason
reason.value = reasons[0]

async function handleSubmit() {
  if (submitting.value) return
  submitting.value = true
  error.value = ''
  
  try {
    await api.post('/reports', {
      targetType: props.targetType,
      targetId: props.targetId,
      reason: reason.value,
      details: details.value
    })
    alert('Report submitted successfully. Thank you for helping keep our community safe!')
    emit('success')
    emit('close')
  } catch (err: any) {
    console.error('Failed to submit report:', err)
    error.value = err.response?.data?.message || 'Failed to submit report. Please try again.'
  } finally {
    submitting.value = false
  }
}
</script>

<template>
  <BaseModal close-label="Close report modal" @close="$emit('close')">
    <div class="p-6 bg-surface-container-low rounded-3xl max-w-md w-full mx-auto" @click.stop>
      <h2 class="text-xl font-display font-black text-on-surface mb-2">Report {{ targetType }}</h2>
      <p class="text-xs text-on-surface-variant mb-6 font-semibold">
        Please provide details for the administrators to review. Action will be taken if community standards are violated.
      </p>
      
      <form @submit.prevent="handleSubmit" class="space-y-4">
        <div>
          <label class="block text-xs font-black uppercase tracking-wider text-on-surface-variant mb-1.5">Reason for Report</label>
          <select 
            v-model="reason" 
            class="w-full bg-surface text-on-surface border border-outline-variant/50 rounded-xl px-3.5 py-2.5 text-sm font-bold outline-none focus:ring-2 focus:ring-primary"
          >
            <option v-for="r in reasons" :key="r" :value="r">{{ r }}</option>
          </select>
        </div>
        
        <div>
          <label class="block text-xs font-black uppercase tracking-wider text-on-surface-variant mb-1.5">Additional Details</label>
          <textarea 
            v-model="details" 
            rows="4" 
            placeholder="Please specify why this is being reported..." 
            class="w-full bg-surface text-on-surface border border-outline-variant/50 rounded-xl px-3.5 py-2.5 text-sm font-bold outline-none focus:ring-2 focus:ring-primary resize-none"
          ></textarea>
        </div>
        
        <p v-if="error" class="text-xs font-bold text-red-500">{{ error }}</p>
        
        <div class="flex items-center justify-end gap-3 pt-2">
          <button 
            type="button" 
            @click="$emit('close')" 
            class="px-4 py-2.5 rounded-full text-xs font-black text-on-surface-variant hover:bg-on-surface/5 transition"
          >
            Cancel
          </button>
          <button 
            type="submit" 
            :disabled="submitting"
            class="px-5 py-2.5 rounded-full bg-red-600 hover:bg-red-700 text-white text-xs font-black shadow-sm disabled:opacity-50 transition"
          >
            {{ submitting ? 'Submitting...' : 'Submit Report' }}
          </button>
        </div>
      </form>
    </div>
  </BaseModal>
</template>
