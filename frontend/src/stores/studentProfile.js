import { defineStore } from 'pinia'
import { ref, computed } from 'vue'
import api from '@/lib/api'

export const useStudentProfileStore = defineStore('studentProfile', () => {
  // ── Step tracking ──
  const currentStep = ref(1)
  const totalSteps = 2

  // ── Step 1: Academic Info ──
  const fullName = ref('')
  const university = ref('')
  const major = ref('')
  const yearLevel = ref('')
  const skills = ref([])
  const bio = ref('')

  // ── Step 2: Career Preferences ──
  const jobType = ref('')
  const availability = ref({
    Mon: { morning: false, afternoon: false, evening: false },
    Tue: { morning: false, afternoon: false, evening: false },
    Wed: { morning: false, afternoon: false, evening: false },
    Thu: { morning: false, afternoon: false, evening: false },
    Fri: { morning: false, afternoon: false, evening: false },
    Sat: { morning: false, afternoon: false, evening: false },
    Sun: { morning: false, afternoon: false, evening: false }
  })
  const expectedSalary = ref('')
  const currency = ref('USD') // 'USD' | 'KHR'
  const cvFile = ref(null)
  const cvFileName = ref('')

  // ── Save state ──
  const isSaving = ref(false)
  const saveError = ref('')

  // ── Validation ──
  const step1Valid = computed(() => {
    return fullName.value.trim() !== '' &&
           university.value !== '' &&
           major.value.trim() !== ''
  })

  const step2Valid = computed(() => {
    return true // salary and CV are optional for now
  })

  // ── Actions ──
  function nextStep() {
    if (currentStep.value < totalSteps) {
      currentStep.value++
    }
  }

  function prevStep() {
    if (currentStep.value > 1) {
      currentStep.value--
    }
  }

  function addSkill(skill) {
    const trimmed = skill.trim()
    if (trimmed && !skills.value.includes(trimmed)) {
      skills.value.push(trimmed)
    }
  }

  function removeSkill(index) {
    skills.value.splice(index, 1)
  }

  function toggleCurrency() {
    currency.value = currency.value === 'USD' ? 'KHR' : 'USD'
  }

  function setCvFile(file) {
    cvFile.value = file
    cvFileName.value = file ? file.name : ''
  }

  /**
   * Persist the full onboarding form to the backend.
   *
   * Sends a `multipart/form-data` payload to `POST /student-profile` so the
   * optional CV file can ride alongside the JSON-encoded fields. Complex
   * shapes (`skills`, `availability`) are serialised as JSON strings since
   * `FormData` only carries scalars.
   *
   * Returns the saved profile on success; throws on failure (the caller
   * is expected to handle UX). `saveError` is also populated for stores
   * that prefer to render the error reactively.
   */
  async function saveProfile() {
    saveError.value = ''
    isSaving.value = true
    try {
      const formData = new FormData()
      formData.append('fullName', fullName.value)
      formData.append('university', university.value)
      formData.append('major', major.value)
      formData.append('yearLevel', yearLevel.value || '')
      formData.append('bio', bio.value || '')
      formData.append('jobType', jobType.value || '')
      formData.append('expectedSalary', expectedSalary.value || '')
      formData.append('currency', currency.value || '')
      formData.append('skills', JSON.stringify(skills.value))
      formData.append('availability', JSON.stringify(availability.value))
      if (cvFile.value) {
        formData.append('cv', cvFile.value)
      }

      const { data } = await api.post('/student-profile', formData)
      return data.profile
    } catch (err) {
      saveError.value =
        err.response?.data?.message ||
        err.message ||
        'Failed to save profile. Please try again.'
      throw err
    } finally {
      isSaving.value = false
    }
  }

  function resetForm() {
    currentStep.value = 1
    fullName.value = ''
    university.value = ''
    major.value = ''
    yearLevel.value = ''
    skills.value = []
    bio.value = ''
    jobType.value = ''
    availability.value = {
      Mon: { morning: false, afternoon: false, evening: false },
      Tue: { morning: false, afternoon: false, evening: false },
      Wed: { morning: false, afternoon: false, evening: false },
      Thu: { morning: false, afternoon: false, evening: false },
      Fri: { morning: false, afternoon: false, evening: false },
      Sat: { morning: false, afternoon: false, evening: false },
      Sun: { morning: false, afternoon: false, evening: false }
    }
    expectedSalary.value = ''
    currency.value = 'USD'
    cvFile.value = null
    cvFileName.value = ''
    isSaving.value = false
    saveError.value = ''
  }

  return {
    currentStep,
    totalSteps,
    fullName,
    university,
    major,
    yearLevel,
    skills,
    bio,
    jobType,
    availability,
    expectedSalary,
    currency,
    cvFile,
    cvFileName,
    isSaving,
    saveError,
    step1Valid,
    step2Valid,
    nextStep,
    prevStep,
    addSkill,
    removeSkill,
    toggleCurrency,
    setCvFile,
    saveProfile,
    resetForm,
  }
})
