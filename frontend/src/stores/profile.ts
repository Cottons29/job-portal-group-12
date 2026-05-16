import { defineStore } from 'pinia'
import { ref, reactive } from 'vue'
import api from '@/lib/api'
import { isAxiosError } from 'axios'
import { useAuthStore } from './auth'

export const useProfileStore = defineStore('profile', () => {
  const auth = useAuthStore()

  const profileForm = reactive({
    user_name: '',
    email: '',
    phone: '',
    name: '',
    gender: '',
    avatar: '',
    university: '',
    major: '',
    yearLevel: '',
    bio: '',
    jobType: '',
    expectedSalary: '',
    currency: 'USD',
    skills: [],
    availability: null,
    companyName: '',
    industry: '',
    address: '',
    website: '',
    companyDescription: ''
  })

  const isSavingProfile = ref(false)
  const profileLoadError = ref('')
  const profileSaveError = ref('')
  const selectedUserProfile = ref(null)
  const isProfileLoading = ref(false)
  const isProfileModalOpen = ref(false)

  function applyProfileData(profile, accountUser) {
    if (accountUser) {
      profileForm.user_name = accountUser.user_name || ''
      profileForm.email = accountUser.email || ''
      profileForm.phone = accountUser.phone || ''
    }

    profileForm.name = profile?.fullName || ''
    profileForm.gender = profile?.gender || ''
    profileForm.avatar = profile?.profileImageUrl || profile?.logoUrl || ''
    profileForm.university = profile?.university || ''
    profileForm.major = profile?.major || ''
    profileForm.yearLevel = profile?.yearLevel || ''
    profileForm.bio = profile?.bio || ''
    profileForm.jobType = profile?.jobType || ''
    profileForm.expectedSalary = profile?.expectedSalary || ''
    profileForm.currency = profile?.currency || 'USD'
    if (Array.isArray(profile?.skills)) profileForm.skills = profile.skills
    if (profile?.availability) profileForm.availability = profile.availability

    profileForm.companyName = profile?.companyName || ''
    profileForm.industry = profile?.industry || ''
    profileForm.address = profile?.address || ''
    profileForm.website = profile?.website || ''
    profileForm.companyDescription = profile?.companyDescription || ''
  }

  async function fetchPersonalInfo() {
    profileLoadError.value = ''
    try {
      const isEmployer = auth.user?.role?.toLowerCase() === 'employer'
      const endpoint = isEmployer ? '/employer-profile/me' : '/student-profile/me'

      const [{ data: profileData }, accountUser] = await Promise.all([
        api.get(endpoint),
        auth.refreshUser(),
      ])

      applyProfileData(profileData.profile, accountUser)
    } catch (error) {
      profileLoadError.value = isAxiosError(error) ? error.response?.data?.message || error.message : 'Failed to load personal info.'
    }
  }

  function buildProfileFormData() {
    const formData = new FormData()
    const isEmployer = auth.user?.role?.toLowerCase() === 'employer'

    formData.append('user_name', profileForm.user_name || '')
    formData.append('email', profileForm.email || '')
    formData.append('phone', profileForm.phone || '')

    if (isEmployer) {
      formData.append('companyName', profileForm.companyName || '')
      formData.append('industry', profileForm.industry || '')
      formData.append('address', profileForm.address || '')
      formData.append('website', profileForm.website || '')
      formData.append('companyDescription', profileForm.companyDescription || '')
    } else {
      formData.append('fullName', profileForm.name || 'Student User')
      formData.append('gender', profileForm.gender || '')
      formData.append('profileImageUrl', profileForm.avatar || '')
      formData.append('university', profileForm.university || 'Not set')
      formData.append('major', profileForm.major || 'Not set')
      formData.append('yearLevel', profileForm.yearLevel || '')
      formData.append('bio', profileForm.bio || '')
      formData.append('jobType', profileForm.jobType || '')
      formData.append('expectedSalary', profileForm.expectedSalary || '')
      formData.append('currency', profileForm.currency || 'USD')
      formData.append('skills', JSON.stringify(profileForm.skills || []))
      formData.append('availability', JSON.stringify(profileForm.availability || null))
    }
    return formData
  }

  async function savePersonalInfoEdit(field, value) {
    profileSaveError.value = ''
    isSavingProfile.value = true

    try {
      if (field) profileForm[field] = value.trim()
      const isEmployer = auth.user?.role?.toLowerCase() === 'employer'
      const endpoint = isEmployer ? '/employer-profile/setup' : '/student-profile'

      const { data } = await api.post(endpoint, buildProfileFormData())
      applyProfileData(isEmployer ? data : data.profile, null)
      return true
    } catch (error) {
      profileSaveError.value = isAxiosError(error) ? error.response?.data?.message || error.message : 'Failed to save personal info.'
      return false
    } finally {
      isSavingProfile.value = false
    }
  }

  async function showUserProfile(userId) {
    if (!userId) return
    isProfileLoading.value = true
    isProfileModalOpen.value = true
    selectedUserProfile.value = null

    try {
      let profile;
      try {
        const { data } = await api.get(`/student-profile/${userId}`)
        profile = data.profile
      } catch (e) {
        const { data } = await api.get(`/employer-profile/${userId}`)
        profile = data.profile
      }

      if (profile) {
        selectedUserProfile.value = {
          name: profile.fullName || profile.companyName || 'User',
          user_name: profile.user?.user_name,
          avatar: profile.profileImageUrl || profile.logoUrl,
          bio: profile.bio || profile.companyDescription,
          education: profile.university ? `${profile.university} - ${profile.major}` : profile.industry,
          category: profile.yearLevel ? `Year ${profile.yearLevel}` : profile.address,
          postCount: 0
        }
      } else {
        selectedUserProfile.value = { name: 'User not found' }
      }
    } catch (error) {
      selectedUserProfile.value = { name: 'Error loading profile' }
    } finally {
      isProfileLoading.value = false
    }
  }

  function closeProfileModal() {
    isProfileModalOpen.value = false
    selectedUserProfile.value = null
  }

  return {
    profileForm,
    isSavingProfile,
    profileLoadError,
    profileSaveError,
    selectedUserProfile,
    isProfileLoading,
    isProfileModalOpen,
    fetchPersonalInfo,
    savePersonalInfoEdit,
    showUserProfile,
    closeProfileModal
  }
})
