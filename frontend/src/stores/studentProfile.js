import { defineStore } from 'pinia'
import { ref, computed } from 'vue'

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
    step1Valid,
    step2Valid,
    nextStep,
    prevStep,
    addSkill,
    removeSkill,
    toggleCurrency,
    setCvFile,
    resetForm,
  }
})
