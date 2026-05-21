import { defineStore } from 'pinia'
import { ref, reactive } from 'vue'
import api, { resolveUrl } from '@/lib/api'
import { isAxiosError } from 'axios'
import { useAuthStore } from './auth'
import { usePostStore } from './posts'

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
    companyDescription: '',
    isVerified: false,
    isStudentVerified: false,
    idCardUrl: ''
  })

  const isSavingProfile = ref(false)
  const profileLoadError = ref('')
  const profileSaveError = ref('')
  const selectedUserProfile = ref(null)
  const isProfileLoading = ref(false)
  const isProfileModalOpen = ref(false)

  function applyProfileData(profile: any, accountUser: any) {
    if (accountUser) {
      profileForm.user_name = accountUser.user_name || ''
      profileForm.email = accountUser.email || ''
      profileForm.phone = accountUser.phone || ''
    }

    profileForm.name = profile?.fullName || ''
    profileForm.gender = profile?.gender || ''
    profileForm.avatar = resolveUrl(profile?.profileImageUrl || profile?.logoUrl || '')
    profileForm.university = profile?.university || ''
    profileForm.major = profile?.major || ''
    profileForm.yearLevel = profile?.yearLevel || ''
    profileForm.bio = profile?.bio || ''
    profileForm.jobType = profile?.jobType || ''
    profileForm.expectedSalary = profile?.expectedSalary || ''
    profileForm.currency = profile?.currency || 'USD'
    if (Array.isArray(profile?.skills)) profileForm.skills = profile.skills
    if (profile?.availability) profileForm.availability = profile.availability
    profileForm.isVerified = !!profile?.isVerified
    profileForm.isStudentVerified = !!profile?.isStudentVerified
    profileForm.idCardUrl = profile?.idCardUrl || ''

    profileForm.companyName = profile?.companyName || ''
    profileForm.industry = profile?.industry || ''
    profileForm.address = profile?.address || ''
    profileForm.website = profile?.website || ''
    profileForm.companyDescription = profile?.companyDescription || ''
  }

  const focusStats = ref<any[]>([])
  const focusStatsLoading = ref(false)

  async function fetchFocusStats() {
    focusStatsLoading.value = true
    try {
      const { data } = await api.get('/profile/focus-stats')
      focusStats.value = data.stats || []
    } catch (error) {
      console.error('Failed to fetch focus stats:', error)
    } finally {
      focusStatsLoading.value = false
    }
  }

  async function fetchPersonalInfo() {
    profileLoadError.value = ''
    try {
      const endpoint = '/profile/me'

      const [{ data: profileData }, accountUser] = await Promise.all([
        api.get(endpoint),
        auth.refreshUser(),
      ])

      applyProfileData(profileData.profile, accountUser)
      await fetchFocusStats()
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
      
      if (profileForm.avatar instanceof File) {
        formData.append('avatarFile', profileForm.avatar)
      } else {
        formData.append('logoUrl', profileForm.avatar || '')
      }
    } else {
      formData.append('fullName', profileForm.name || 'Student User')
      formData.append('gender', profileForm.gender || '')
      
      if (profileForm.avatar instanceof File) {
        formData.append('avatarFile', profileForm.avatar)
      } else {
        formData.append('profileImageUrl', profileForm.avatar || '')
      }
      
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

  async function savePersonalInfoEdit(field: any, value: any) {
    profileSaveError.value = ''
    isSavingProfile.value = true

    try {
      //@ts-ignore
      if (field) {
        if (typeof value === 'string') {
          profileForm[field] = value.trim()
        } else {
          profileForm[field] = value
        }
      }
      const endpoint = '/profile/update'

      const { data } = await api.post(endpoint, buildProfileFormData())
      applyProfileData(data, null)
      return true
    } catch (error) {
      profileSaveError.value = isAxiosError(error) ? error.response?.data?.message || error.message : 'Failed to save personal info.'
      return false
    } finally {
      isSavingProfile.value = false
    }
  }
  //@ts-ignore
  async function showUserProfile(userId) {
    if (!userId) return
    isProfileLoading.value = true
    isProfileModalOpen.value = true
    selectedUserProfile.value = null

    try {
      const [profileRes, postsRes, followersRes, followingRes] = await Promise.all([
        api.get(`/profile/${userId}`),
        api.get('/posts', { params: { authorId: userId, limit: 12 } }),
        api.get(`/follows/${userId}/followers`),
        api.get(`/follows/${userId}/following`),
      ])

      const profile = profileRes.data.profile
      const postStore = usePostStore()

      if (profile) {
        //@ts-ignore
        selectedUserProfile.value = {
          id: profile.id,
          name: profile.fullName || profile.companyName || 'User',
          user_name: profile.user?.user_name,
          avatar: resolveUrl(profile.profileImageUrl || profile.logoUrl),
          bio: profile.bio || profile.companyDescription,
          education: profile.university ? `${profile.university} - ${profile.major}` : profile.industry,
          category: profile.yearLevel ? `Year ${profile.yearLevel}` : profile.address,
          postCount: postsRes.data.total || 0,
          followersCount: followersRes.data.followers?.length || 0,
          followingCount: followingRes.data.following?.length || 0,
          posts: (postsRes.data.posts || []).map(postStore.mapPost)
        }
      } else {
        //@ts-ignore
        selectedUserProfile.value = { name: 'User not found' }
      }
    } catch (error) {
      //@ts-ignore
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
    focusStats,
    fetchFocusStats,
    fetchPersonalInfo,
    savePersonalInfoEdit,
    showUserProfile,
    closeProfileModal
  }
})
