    import { defineStore } from 'pinia'
import { ref, computed } from 'vue'

export const useEmployerProfileStore = defineStore('employerProfile', () => {
  // ── Step tracking ──
  const currentStep = ref(1)
  const totalSteps = 2

  // ── Form Data ──
  const companyId = ref('')
  const companyName = ref('')
  const industry = ref('')
  const location = ref('')
  
  // ── Files ──
  const logoFile = ref(null)
  const logoFileName = ref('')
  const patentFile = ref(null)
  const patentFileName = ref('')

  // ── Validation ──
  const step1Valid = computed(() => {
    return companyName.value.toString().trim() !== '' &&
           industry.value !== '' &&
           location.value !== '' &&
           (logoFile.value !== null || companyId.value !== '') &&
           patentFile.value !== null
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

  function setLogoFile(file) {
    logoFile.value = file
    logoFileName.value = file ? file.name : ''
  }

  function setPatentFile(file) {
    patentFile.value = file
    patentFileName.value = file ? file.name : ''
  }

  function resetForm() {
    currentStep.value = 1
    companyId.value = ''
    companyName.value = ''
    industry.value = ''
    location.value = ''
    logoFile.value = null
    logoFileName.value = ''
    patentFile.value = null
    patentFileName.value = ''
  }

  return {
    currentStep,
    totalSteps,
    companyId,
    companyName,
    industry,
    location,
    logoFile,
    logoFileName,
    patentFile,
    patentFileName,
    step1Valid,
    nextStep,
    prevStep,
    setLogoFile,
    setPatentFile,
    resetForm,
  }
})
