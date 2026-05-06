<template>
  <div class="flex h-screen bg-slate-50 font-sans text-slate-800 overflow-hidden">
    <!-- Sidebar -->
    <aside class="w-64 bg-white shadow-sm flex flex-col justify-between flex-shrink-0 z-10">
      <div>
        <!-- Brand -->
        <div class="p-6">
          <h1 class="text-2xl font-display font-extrabold text-blue-600 leading-tight">FirstStep</h1>
          <span class="text-xs font-bold text-slate-400 uppercase tracking-wider">Admin</span>
        </div>

        <!-- Navigation -->
        <nav class="mt-2 px-4 flex flex-col gap-1">
          <a href="#"
             class="flex items-center gap-3 px-4 py-3 rounded-lg text-slate-600 hover:bg-slate-50 transition-colors font-medium">
            Dashboard
          </a>
          <a href="#"
             class="flex items-center gap-3 px-4 py-3 rounded-lg bg-blue-50 text-blue-600 font-bold transition-colors">
            Pending Employers
          </a>
          <a href="#"
             class="flex items-center gap-3 px-4 py-3 rounded-lg text-slate-600 hover:bg-slate-50 transition-colors font-medium">
            Verified SMEs
          </a>
          <a href="#"
             class="flex items-center gap-3 px-4 py-3 rounded-lg text-slate-600 hover:bg-slate-50 transition-colors font-medium">
            System Stats
          </a>
        </nav>
      </div>

      <!-- Bottom Links -->
      <div class="p-4 px-4 flex flex-col gap-1 mb-4 border-t border-slate-100/50">
        <a href="#"
           class="flex items-center gap-3 px-4 py-2 rounded-lg text-slate-500 hover:bg-slate-50 transition-colors text-sm font-medium">
          Support
        </a>
        <a href="#"
           class="flex items-center gap-3 px-4 py-2 rounded-lg text-slate-500 hover:bg-red-50 hover:text-red-600 transition-colors text-sm font-medium">
          Log out
        </a>
      </div>
    </aside>

    <!-- Main Content -->
    <main class="flex-1 overflow-y-auto p-8 lg:px-12 flex flex-col gap-8">

      <!-- Header Section -->
      <div class="flex flex-col md:flex-row md:items-start justify-between gap-6">
        <div class="max-w-2xl">
          <h2 class="text-3xl font-display font-bold text-blue-600 mb-2">Pending Employers</h2>
          <p class="text-slate-500 text-sm leading-relaxed">
            Review and approve new employer registrations to grant access to the talent pool. Ensure all submitted
            Business Patents are valid.
          </p>
        </div>

        <!-- Search & Filter -->
        <div class="flex items-center gap-3 flex-shrink-0">
          <div
              class="relative bg-white rounded-lg shadow-sm flex items-center px-3 py-2 w-64 focus-within:ring-2 focus-within:ring-blue-100 transition-all">
            <MagnifyingGlassIcon class="w-5 h-5 text-slate-400"/>
            <input type="text" placeholder="Search employers..."
                   class="w-full bg-transparent border-none focus:ring-0 text-sm px-2 text-slate-700 placeholder:text-slate-400 outline-none"/>
          </div>
          <button class="bg-white p-2.5 rounded-lg shadow-sm text-slate-500 hover:text-blue-600 transition-colors">
            <AdjustmentsHorizontalIcon class="w-5 h-5"/>
          </button>
        </div>
      </div>

      <!-- Metric Cards -->
      <div class="grid grid-cols-1 md:grid-cols-3 gap-6">
        <!-- Card 1 -->
        <div class="bg-white rounded-xl shadow-sm p-6 flex flex-col justify-center">
          <span class="text-sm font-semibold text-slate-500 mb-1">Total Pending</span>
          <span class="text-4xl font-display font-bold text-slate-800">{{ totalPending }}</span>
        </div>
        <!-- Card 2 -->
        <div class="bg-white rounded-xl shadow-sm p-6 flex flex-col justify-center relative overflow-hidden group">
          <div class="flex items-center justify-between mb-1">
            <span class="text-sm font-semibold text-slate-500">High Priority</span>
            <div class="flex items-center gap-1 text-amber-500 bg-amber-50 px-2 py-1 rounded-md">
              <ExclamationTriangleIcon class="w-4 h-4"/>
              <span class="text-[10px] font-bold uppercase tracking-wider">Requires Review</span>
            </div>
          </div>
          <span class="text-4xl font-display font-bold text-slate-800">{{ highPriorityCount }}</span>
        </div>
        <!-- Card 3 -->
        <div class="bg-white rounded-xl shadow-sm p-6 flex flex-col justify-center">
          <span class="text-sm font-semibold text-slate-500 mb-1">Average Wait Time</span>
          <span class="text-4xl font-display font-bold text-slate-800">{{ averageWaitTime }} <span
              class="text-lg text-slate-400 font-medium">days</span></span>
        </div>
      </div>

      <!-- Data Table -->
      <div class="bg-white rounded-xl shadow-sm flex flex-col">
        <div class="overflow-x-auto">
          <table class="w-full text-left">
            <thead>
            <tr class="text-xs font-semibold text-slate-500 uppercase tracking-wider border-b border-slate-100">
              <th class="px-6 py-5">Company Details</th>
              <th class="px-6 py-5">Date Applied</th>
              <th class="px-6 py-5">Status</th>
              <th class="px-6 py-5 text-right">Actions</th>
            </tr>
            </thead>
            <tbody class="divide-y divide-slate-50/80">
            <tr v-for="employer in pendingEmployers" :key="employer.id"
                class="hover:bg-slate-50/50 transition-colors group">
              <td class="px-6 py-4">
                <div class="flex items-center gap-4">
                  <div
                      class="w-12 h-12 rounded-lg bg-slate-100 flex items-center justify-center text-slate-400 group-hover:bg-blue-50 group-hover:text-blue-500 transition-colors">
                    <BuildingOfficeIcon class="w-6 h-6"/>
                  </div>
                  <div class="flex flex-col">
                    <span class="font-bold text-slate-800">{{ employer.companyName }}</span>
                    <span class="text-xs text-slate-500">{{ employer.industry }}</span>
                  </div>
                </div>
              </td>
              <td class="px-6 py-4 text-sm text-slate-600 font-medium">
                {{ employer.appliedDate }}
              </td>
              <td class="px-6 py-4">
                  <span v-if="employer.status === 'Pending Review'"
                        class="inline-flex items-center px-2.5 py-1 rounded-full text-xs font-bold bg-slate-100 text-slate-700">
                    Pending Review
                  </span>
                <span v-else-if="employer.status === 'Action Required'"
                      class="inline-flex items-center px-2.5 py-1 rounded-full text-xs font-bold bg-amber-50 text-amber-700">
                    Action Required
                  </span>
              </td>
              <td class="px-6 py-4 text-right">
                <div class="flex justify-end">
                  <button @click="openModal(employer)"
                          class="w-10 h-10 rounded-full flex items-center justify-center text-blue-600 hover:bg-blue-50 transition-colors focus:outline-none focus:ring-2 focus:ring-blue-100">
                    <EyeIcon class="w-5 h-5"/>
                  </button>
                </div>
              </td>
            </tr>
            </tbody>
          </table>
        </div>

        <!-- Pagination -->
        <div class="px-6 py-4 border-t border-slate-50 flex items-center justify-between text-sm text-slate-500">
          <span>Showing {{ pendingEmployers.length > 0 ? 1 : 0 }}-{{ pendingEmployers.length }} of {{ totalPending }} pending applications</span>
          <div class="flex items-center gap-1">
            <button class="p-1 hover:text-blue-600 disabled:opacity-50">
              <ChevronLeftIcon class="w-5 h-5"/>
            </button>
            <button class="w-8 h-8 rounded-lg bg-blue-50 text-blue-600 font-bold flex items-center justify-center">1
            </button>
            <button class="p-1 hover:text-blue-600 disabled:opacity-50">
              <ChevronRightIcon class="w-5 h-5"/>
            </button>
          </div>
        </div>
      </div>

    </main>

    <!-- PatentViewerModal -->
    <Transition name="modal">
      <div v-if="selectedEmployer"
           class="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-sm">
        <div class="bg-white w-full max-w-3xl rounded-2xl shadow-xl overflow-hidden flex flex-col max-h-[90vh]">
          <!-- Modal Header -->
          <div class="flex items-center justify-between p-6 pb-4">
            <div>
              <h2 class="text-xl font-display font-bold text-slate-800">Review Patent</h2>
              <p class="text-sm text-slate-500 mt-1">{{ selectedEmployer.companyName }}</p>
            </div>
            <button @click="closeModal"
                    class="text-slate-400 hover:text-slate-700 transition-colors p-2 rounded-full hover:bg-slate-100">
              <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12"></path>
              </svg>
            </button>
          </div>

          <!-- Modal Body (Patent Image) -->
          <div class="p-6 bg-slate-50/50 flex-1 overflow-y-auto">
            <!-- Placeholder Image Container -->
            <div
                class="w-full bg-white rounded-xl shadow-sm flex flex-col items-center justify-center border border-slate-100 aspect-[1/1.4] sm:aspect-[4/3]">
              <div class="flex flex-col items-center text-center p-8">
                <div class="w-16 h-16 bg-blue-50 text-blue-500 rounded-2xl flex items-center justify-center mb-4">
                  <svg class="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="1.5"
                          d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"></path>
                  </svg>
                </div>
                <span class="text-lg font-bold text-slate-800">Business Patent Document</span>
                <span class="text-sm text-slate-500 mt-2 max-w-sm">This is a placeholder for the official documentation submitted by the employer during registration.</span>
                <span class="text-xs font-mono text-slate-400 mt-6 bg-slate-50 px-3 py-1 rounded-md">{{
                    selectedEmployer.patentUrl
                  }}</span>
              </div>
            </div>
          </div>

          <!-- Modal Footer (Actions) -->
          <div class="p-6 flex gap-4 bg-white border-t border-slate-50">
            <button @click="approveEmployer"
                    class="flex-1 bg-green-500 hover:bg-green-600 text-white py-3.5 rounded-xl font-bold transition-colors shadow-sm flex items-center justify-center gap-2">
              <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2.5" d="M5 13l4 4L19 7"></path>
              </svg>
              Approve Employer
            </button>
            <button @click="rejectEmployer"
                    class="flex-1 bg-transparent border-2 border-red-100 text-red-600 hover:bg-red-50 py-3.5 rounded-xl font-bold transition-colors flex items-center justify-center gap-2">
              <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2.5"
                      d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16"></path>
              </svg>
              Reject & Delete
            </button>
          </div>
        </div>
      </div>
    </Transition>

  </div>
</template>

<script setup>
import {ref, computed, onMounted} from 'vue'
import axios from 'axios'
import {
  MagnifyingGlassIcon,
  AdjustmentsHorizontalIcon,
  ExclamationTriangleIcon,
  BuildingOfficeIcon,
  EyeIcon,
  ChevronLeftIcon,
  ChevronRightIcon
} from '@heroicons/vue/24/outline'

const pendingEmployers = ref([])
const selectedEmployer = ref(null)

const totalPending = computed(() => pendingEmployers.value.length)

const highPriorityCount = computed(() => {
  const now = new Date();
  return pendingEmployers.value.filter(emp => {
    const applied = new Date(emp.createdAt);
    const diffTime = Math.abs(now - applied);
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
    return diffDays > 3;
  }).length;
})

const averageWaitTime = computed(() => {
  if (pendingEmployers.value.length === 0) return 0;
  const now = new Date();
  const totalWait = pendingEmployers.value.reduce((acc, emp) => {
    const applied = new Date(emp.createdAt);
    const diffTime = Math.abs(now - applied);
    const diffDays = diffTime / (1000 * 60 * 60 * 24);
    return acc + diffDays;
  }, 0);
  return (totalWait / pendingEmployers.value.length).toFixed(1);
})

const fetchPendingEmployers = async () => {
  try {
    const response = await axios.get('http://localhost:3000/api/admin/employers/pending');
    pendingEmployers.value = response.data.map(emp => {
      // Determine if action is required based on wait time > 3 days
      const applied = new Date(emp.createdAt);
      const diffTime = Math.abs(new Date() - applied);
      const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));

      return {
        id: emp.id,
        companyName: emp.companyName,
        industry: emp.industry,
        appliedDate: new Intl.DateTimeFormat('en-US', {
          month: 'short',
          day: 'numeric',
          year: 'numeric'
        }).format(applied),
        createdAt: emp.createdAt,
        status: diffDays > 3 ? 'Action Required' : 'Pending Review',
        patentUrl: emp.patentUrl || 'No document uploaded'
      }
    });
  } catch (error) {
    console.error('Failed to fetch pending employers:', error);
  }
}

onMounted(() => {
  fetchPendingEmployers();
})

const openModal = (employer) => {
  selectedEmployer.value = employer
}

const closeModal = () => {
  selectedEmployer.value = null
}

const approveEmployer = async () => {
  if (!selectedEmployer.value) return;
  try {
    await axios.patch(`http://localhost:3000/api/admin/employers/${selectedEmployer.value.id}/approve`);
    pendingEmployers.value = pendingEmployers.value.filter(emp => emp.id !== selectedEmployer.value.id);
    closeModal();
  } catch (error) {
    console.error('Failed to approve employer:', error);
    alert('An error occurred while approving the employer.');
  }
}

const rejectEmployer = async () => {
  if (!selectedEmployer.value) return;
  try {
    await axios.delete(`http://localhost:3000/api/admin/employers/${selectedEmployer.value.id}/reject`);
    pendingEmployers.value = pendingEmployers.value.filter(emp => emp.id !== selectedEmployer.value.id);
    closeModal();
  } catch (error) {
    console.error('Failed to reject employer:', error);
    alert('An error occurred while rejecting the employer.');
  }
}
</script>
