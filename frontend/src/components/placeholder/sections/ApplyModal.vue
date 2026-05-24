<script setup lang="ts">
import { ref, computed, onMounted } from 'vue'
import {
  UserIcon,
  EnvelopeIcon,
  PhoneIcon,
  DocumentTextIcon,
  PaperClipIcon,
  ArrowRightIcon,
  ArrowLeftIcon,
  CheckCircleIcon,
  XMarkIcon,
  CloudArrowUpIcon
} from '@heroicons/vue/24/outline'
import type { Post } from '@/types/profile'
import { useAuthStore } from '@/stores/auth'
import api from '@/lib/api'

const props = withDefaults(defineProps<{
  post: Post
  isSubmitting?: boolean
  submitError?: string
}>(), {
  isSubmitting: false,
  submitError: ''
})

const emit = defineEmits(['close', 'submit'])

const authStore = useAuthStore()

// Step control: 1 = Contact Info, 2 = Resume, 3 = Cover Letter, 4 = Review
const currentStep = ref(1)
const totalSteps = 4

// Step 1 data
const fullName = ref('')
const email = ref('')
const phone = ref('')

// Step 2 data
const resumeType = ref<'profile' | 'custom'>('profile')
const customFile = ref<File | null>(null)
const customFileName = ref('')
const isUploadingResume = ref(false)
const uploadedCvUrl = ref('')
const isDragging = ref(false)

// Step 3 data
const coverLetter = ref('')

// Pre-fill from store
onMounted(() => {
  if (authStore.user) {
    fullName.value = authStore.user.fullName || authStore.user.user_name || ''
    email.value = authStore.user.email || ''
    phone.value = authStore.user.phone || ''
    if (!authStore.user.cvUrl) {
      resumeType.value = 'custom'
    }
  }
})

// Validation per step
const isStepValid = computed(() => {
  if (currentStep.value === 1) {
    return fullName.value.trim() !== '' && email.value.trim() !== ''
  }
  if (currentStep.value === 2) {
    if (resumeType.value === 'profile') {
      return !!authStore.user?.cvUrl
    } else {
      return !!customFile.value || !!uploadedCvUrl.value
    }
  }
  return true
})

function handleFileSelect(e: any) {
  const file = e.target.files?.[0]
  if (file) {
    customFile.value = file
    customFileName.value = file.name
    uploadCustomResume(file)
  }
}

function handleDrop(e: any) {
  isDragging.value = false
  const file = e.dataTransfer?.files?.[0]
  if (file) {
    customFile.value = file
    customFileName.value = file.name
    uploadCustomResume(file)
  }
}

async function uploadCustomResume(file: File) {
  isUploadingResume.value = true
  try {
    const formData = new FormData()
    formData.append('file', file)
    const { data } = await api.post('/upload/single', formData, {
      headers: { 'Content-Type': 'multipart/form-data' }
    })
    uploadedCvUrl.value = data.file.url
  } catch (error) {
    console.error('Resume upload failed:', error)
    alert('Failed to upload custom resume. Please try again.')
  } finally {
    isUploadingResume.value = false
  }
}

function nextStep() {
  if (currentStep.value < totalSteps && isStepValid.value) {
    currentStep.value++
  }
}

function prevStep() {
  if (currentStep.value > 1) {
    currentStep.value--
  }
}

function handleSubmit() {
  const finalCvUrl = resumeType.value === 'profile' 
    ? authStore.user?.cvUrl 
    : uploadedCvUrl.value

  emit('submit', { 
    postId: props.post.id, 
    coverLetter: coverLetter.value.trim(),
    cvUrl: finalCvUrl
  })
}
</script>

<template>
  <div
    class="fixed inset-0 z-50 overflow-y-auto bg-black/65 px-4 py-6 backdrop-blur-sm sm:py-10"
    @click.self="$emit('close')"
  >
    <div class="mx-auto w-full max-w-xl">
      <!-- Top Close Button -->
      <div class="mb-3 flex justify-end">
        <button
          class="grid h-10 w-10 place-items-center rounded-full bg-surface-container-low text-2xl font-black text-on-surface-variant opacity-40 shadow-xl ring-1 ring-white/10 transition hover:text-on-surface hover:opacity-100"
          type="button"
          aria-label="Close"
          @click="$emit('close')"
        >
          ×
        </button>
      </div>

      <!-- Main Modal Card -->
      <div class="rounded-[2.5rem] bg-surface-container-low p-6 shadow-2xl ring-1 ring-white/5 sm:p-10">
        <!-- LinkedIn-style Modal Header -->
        <div class="flex items-center justify-between border-b border-on-surface/5 pb-4">
          <div>
            <p class="text-xs font-black uppercase tracking-[0.18em] text-primary">Easy Apply</p>
            <h2 class="mt-1 font-display text-2xl font-black tracking-[-0.04em] text-on-surface">
              {{ post.title }}
            </h2>
            <p class="text-xs font-bold text-on-surface-variant mt-0.5">
              {{ post.company }} • {{ post.location || 'Phnom Penh' }}
            </p>
          </div>
        </div>

        <!-- Step Indicator -->
        <div class="mt-6 flex items-center justify-between gap-2 px-2">
          <div
            v-for="step in totalSteps"
            :key="step"
            class="flex-1 flex items-center gap-2"
          >
            <div
              :class="[
                'h-2 rounded-full transition-all duration-300',
                step === currentStep ? 'w-10 bg-primary' :
                step < currentStep ? 'w-6 bg-emerald-500' : 'w-4 bg-surface-container-highest'
              ]"
            />
          </div>
          <span class="text-[11px] font-black uppercase tracking-wider text-on-surface-variant/80 shrink-0">
            Step {{ currentStep }} of {{ totalSteps }}
          </span>
        </div>

        <!-- Dynamic Step Contents -->
        <div class="mt-8 min-h-[220px]">
          <!-- STEP 1: Contact Info -->
          <div v-if="currentStep === 1" class="space-y-5">
            <h3 class="text-lg font-black tracking-tight text-on-surface">Contact Information</h3>
            <p class="text-xs text-on-surface-variant leading-5">
              Please verify your contact details. Employers will use this information to reach out to you.
            </p>

            <div class="space-y-4">
              <!-- Name Input -->
              <div>
                <label class="flex items-center gap-2 text-[10px] font-black uppercase tracking-wider text-on-surface-variant mb-2">
                  <UserIcon class="h-3.5 w-3.5 text-primary" /> Full Name
                </label>
                <div class="rounded-full bg-surface border border-outline/30 focus-within:border-primary focus-within:ring-2 focus-within:ring-primary/20 transition duration-150">
                  <input
                    v-model="fullName"
                    type="text"
                    class="w-full bg-transparent px-5 py-3 text-sm font-bold text-on-surface outline-none rounded-full"
                    placeholder="Enter your full name"
                  />
                </div>
              </div>

              <!-- Email Input -->
              <div>
                <label class="flex items-center gap-2 text-[10px] font-black uppercase tracking-wider text-on-surface-variant mb-2">
                  <EnvelopeIcon class="h-3.5 w-3.5 text-primary" /> Email Address
                </label>
                <div class="rounded-full bg-surface border border-outline/30 focus-within:border-primary focus-within:ring-2 focus-within:ring-primary/20 transition duration-150">
                  <input
                    v-model="email"
                    type="email"
                    class="w-full bg-transparent px-5 py-3 text-sm font-bold text-on-surface outline-none rounded-full"
                    placeholder="Enter your email"
                  />
                </div>
              </div>

              <!-- Phone Input -->
              <div>
                <label class="flex items-center gap-2 text-[10px] font-black uppercase tracking-wider text-on-surface-variant mb-2">
                  <PhoneIcon class="h-3.5 w-3.5 text-primary" /> Phone Number
                </label>
                <div class="rounded-full bg-surface border border-outline/30 focus-within:border-primary focus-within:ring-2 focus-within:ring-primary/20 transition duration-150">
                  <input
                    v-model="phone"
                    type="tel"
                    class="w-full bg-transparent px-5 py-3 text-sm font-bold text-on-surface outline-none rounded-full"
                    placeholder="Enter your phone number"
                  />
                </div>
              </div>
            </div>
          </div>

          <!-- STEP 2: Resume Selection -->
          <div v-if="currentStep === 2" class="space-y-5">
            <h3 class="text-lg font-black tracking-tight text-on-surface">Choose Resume</h3>
            <p class="text-xs text-on-surface-variant leading-5">
              Select the resume you want to use for this application.
            </p>

            <div class="space-y-4">
              <!-- Profile Resume Option -->
              <label
                v-if="authStore.user?.cvUrl"
                :class="[
                  'flex items-start gap-4 p-4 rounded-2xl border cursor-pointer transition',
                  resumeType === 'profile'
                    ? 'border-primary bg-primary/5 ring-1 ring-primary'
                    : 'border-outline/20 bg-surface hover:border-outline/45'
                ]"
              >
                <input
                  type="radio"
                  name="resumeType"
                  value="profile"
                  v-model="resumeType"
                  class="mt-1 h-4 w-4 accent-primary"
                />
                <div class="flex-1 -mt-0.5">
                  <p class="text-sm font-black text-on-surface flex items-center gap-1.5">
                    <PaperClipIcon class="h-4 w-4 text-primary" />
                    Use Profile Resume
                  </p>
                  <p class="text-xs text-on-surface-variant/80 mt-1">
                    Apply using the resume uploaded in your student profile settings.
                  </p>
                  <a
                    :href="'/api' + authStore.user.cvUrl"
                    target="_blank"
                    class="inline-block mt-2 text-xs font-bold text-primary hover:underline"
                    @click.stop
                  >
                    Preview Profile Resume (PDF)
                  </a>
                </div>
              </label>

              <!-- Custom Resume Option -->
              <label
                :class="[
                  'flex items-start gap-4 p-4 rounded-2xl border cursor-pointer transition',
                  resumeType === 'custom'
                    ? 'border-primary bg-primary/5 ring-1 ring-primary'
                    : 'border-outline/20 bg-surface hover:border-outline/45'
                ]"
              >
                <input
                  type="radio"
                  name="resumeType"
                  value="custom"
                  v-model="resumeType"
                  class="mt-1 h-4 w-4 accent-primary"
                />
                <div class="flex-1 -mt-0.5">
                  <p class="text-sm font-black text-on-surface flex items-center gap-1.5">
                    <CloudArrowUpIcon class="h-4 w-4 text-primary" />
                    Upload Custom Resume
                  </p>
                  <p class="text-xs text-on-surface-variant/80 mt-1">
                    Upload a specific CV tailored for this role. (PDF only, max 5MB).
                  </p>
                </div>
              </label>

              <!-- Drag and Drop for Custom Resume -->
              <div
                v-if="resumeType === 'custom'"
                :class="[
                  'relative rounded-2xl p-6 text-center transition-all duration-300 border-[1.5px] border-dashed',
                  isDragging
                    ? 'border-primary bg-primary/10'
                    : 'border-outline-variant bg-surface hover:border-primary'
                ]"
                @dragover.prevent="isDragging = true"
                @dragleave="isDragging = false"
                @drop.prevent="handleDrop"
                @click="$refs.cvInput.click()"
              >
                <input ref="cvInput" type="file" accept=".pdf" class="hidden" @change="handleFileSelect" />
                <template v-if="!customFileName && !uploadedCvUrl">
                  <CloudArrowUpIcon class="mx-auto h-8 w-8 text-primary mb-2" />
                  <p class="text-xs font-black text-on-surface mb-1">
                    Drag and drop your PDF CV here
                  </p>
                  <p class="text-[10px] text-on-surface-variant underline cursor-pointer hover:text-primary">
                    Or Browse Files
                  </p>
                </template>
                <template v-else>
                  <div class="flex items-center justify-center gap-2">
                    <CheckCircleIcon class="h-5 w-5 text-emerald-500 shrink-0" />
                    <span class="text-xs font-bold text-on-surface truncate max-w-[250px]">{{ customFileName || 'Custom Resume.pdf' }}</span>
                    <button
                      type="button"
                      class="text-xs font-bold text-red-500 hover:underline ml-2"
                      @click.stop="customFile = null; customFileName = ''; uploadedCvUrl = ''"
                    >
                      Remove
                    </button>
                  </div>
                  <p v-if="isUploadingResume" class="text-[10px] text-primary font-bold mt-2 animate-pulse">
                    Uploading file securely...
                  </p>
                </template>
              </div>
            </div>
          </div>

          <!-- STEP 3: Cover Letter -->
          <div v-if="currentStep === 3" class="space-y-5">
            <h3 class="text-lg font-black tracking-tight text-on-surface">Cover Letter</h3>
            <p class="text-xs text-on-surface-variant leading-5">
              Introduce yourself to the employer and explain why you're the perfect fit for this opportunity.
            </p>

            <label class="block space-y-2">
              <span class="text-xs font-black text-on-surface">Cover letter <span class="font-semibold text-on-surface-variant">(optional)</span></span>
              <textarea
                v-model="coverLetter"
                class="min-h-[160px] w-full resize-y rounded-2xl bg-surface px-4 py-3 text-sm font-bold leading-6 text-on-surface outline-none ring-1 ring-outline/30 transition placeholder:text-on-surface-variant/70 focus:ring-2 focus:ring-primary"
                placeholder="Tell the employer why you're a great fit for this role..."
                maxlength="3000"
              />
              <p class="text-right text-[10px] font-bold text-on-surface-variant">
                {{ coverLetter.length }} / 3000
              </p>
            </label>
          </div>

          <!-- STEP 4: Review Application -->
          <div v-if="currentStep === 4" class="space-y-6">
            <h3 class="text-lg font-black tracking-tight text-on-surface">Review Application</h3>
            <p class="text-xs text-on-surface-variant leading-5">
              Review your application details before submission.
            </p>

            <div class="space-y-4 rounded-2xl bg-surface p-5 ring-1 ring-on-surface/5">
              <!-- Review Contact Info -->
              <div class="border-b border-on-surface/5 pb-3">
                <p class="text-[10px] font-black uppercase text-on-surface-variant/80 tracking-wider">Contact Details</p>
                <p class="mt-1 text-sm font-black text-on-surface">{{ fullName }}</p>
                <div class="mt-1 flex flex-wrap items-center gap-x-4 gap-y-1 text-xs text-on-surface-variant/80">
                  <span class="inline-flex items-center gap-1"><EnvelopeIcon class="h-3.5 w-3.5" /> {{ email }}</span>
                  <span class="inline-flex items-center gap-1"><PhoneIcon class="h-3.5 w-3.5" /> {{ phone }}</span>
                </div>
              </div>

              <!-- Review Resume -->
              <div class="border-b border-on-surface/5 pb-3">
                <p class="text-[10px] font-black uppercase text-on-surface-variant/80 tracking-wider">Resume Attachment</p>
                <div class="mt-2 flex items-center gap-2 text-xs font-bold text-on-surface">
                  <PaperClipIcon class="h-4 w-4 text-primary" />
                  <span v-if="resumeType === 'profile'">Profile Resume (PDF)</span>
                  <span v-else>{{ customFileName || 'Custom Resume.pdf' }}</span>
                </div>
              </div>

              <!-- Review Cover Letter -->
              <div>
                <p class="text-[10px] font-black uppercase text-on-surface-variant/80 tracking-wider">Cover Letter Summary</p>
                <p v-if="coverLetter.trim()" class="mt-2 text-xs text-on-surface-variant line-clamp-3 leading-5 italic bg-surface-container-low p-3 rounded-xl border border-on-surface/5">
                  "{{ coverLetter }}"
                </p>
                <p v-else class="mt-2 text-xs text-on-surface-variant/60 italic">No cover letter attached.</p>
              </div>
            </div>

            <!-- Error Banner -->
            <p v-if="submitError" class="rounded-2xl bg-red-500/10 px-4 py-3 text-xs font-bold text-red-300">
              {{ submitError }}
            </p>
          </div>
        </div>

        <!-- Modal Footer Actions -->
        <div class="mt-8 flex items-center justify-between border-t border-on-surface/5 pt-5">
          <!-- Back button (hidden on step 1) -->
          <button
            v-if="currentStep > 1"
            type="button"
            class="flex items-center gap-2 rounded-full border border-outline/30 bg-surface px-5 py-2.5 text-xs font-black text-on-surface transition hover:bg-surface-container-high"
            @click="prevStep"
          >
            <ArrowLeftIcon class="h-4 w-4" />
            Back
          </button>
          <div v-else />

          <!-- Next or Submit Button -->
          <button
            v-if="currentStep < totalSteps"
            type="button"
            class="flex items-center gap-2 rounded-full bg-primary px-6 py-2.5 text-xs font-black text-on-primary transition hover:opacity-90 disabled:cursor-not-allowed disabled:opacity-50"
            :disabled="!isStepValid"
            @click="nextStep"
          >
            Next Step
            <ArrowRightIcon class="h-4 w-4" />
          </button>
          <button
            v-else
            type="button"
            class="flex items-center gap-2 rounded-full bg-emerald-500 px-6 py-2.5 text-xs font-black text-white transition hover:opacity-90 disabled:cursor-not-allowed disabled:opacity-50"
            :disabled="isSubmitting"
            @click="handleSubmit"
          >
            Submit Application
            <CheckCircleIcon class="h-4 w-4" />
          </button>
        </div>
      </div>
    </div>
  </div>
</template>
