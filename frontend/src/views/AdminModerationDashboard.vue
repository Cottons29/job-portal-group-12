<template>
  <div class="flex h-screen bg-slate-50 font-sans text-slate-800 overflow-hidden">
    <!-- Sidebar -->
    <aside class="w-64 bg-white shadow-sm flex flex-col justify-between flex-shrink-0 z-10 border-r border-slate-100">
      <div>
        <!-- Brand -->
        <div class="p-6">
          <h1 class="text-2xl font-display font-extrabold text-blue-600 leading-tight">FirstStep</h1>
          <span class="text-xs font-bold text-slate-400 uppercase tracking-wider">Admin Portal</span>
        </div>

        <!-- Navigation -->
        <nav class="mt-2 px-4 flex flex-col gap-1">
          <button
              @click="activeTab = 'dashboard'"
              :class="[
                'flex items-center gap-3 px-4 py-3 rounded-xl transition-colors text-sm font-semibold w-full text-left',
                activeTab === 'dashboard' ? 'bg-blue-50 text-blue-600 font-bold' : 'text-slate-600 hover:bg-slate-50'
              ]"
          >
            <BuildingOfficeIcon class="w-5 h-5" />
            Dashboard
          </button>
          <button
              @click="activeTab = 'pending'"
              :class="[
                'flex items-center gap-3 px-4 py-3 rounded-xl transition-colors text-sm font-semibold w-full text-left',
                activeTab === 'pending' ? 'bg-blue-50 text-blue-600 font-bold' : 'text-slate-600 hover:bg-slate-50'
              ]"
          >
            <ExclamationTriangleIcon class="w-5 h-5" />
            Pending Employers
          </button>
          <button
              @click="activeTab = 'verified'"
              :class="[
                'flex items-center gap-3 px-4 py-3 rounded-xl transition-colors text-sm font-semibold w-full text-left',
                activeTab === 'verified' ? 'bg-blue-50 text-blue-600 font-bold' : 'text-slate-600 hover:bg-slate-50'
              ]"
          >
            <ShieldCheckIcon class="w-5 h-5" />
            Verified SMEs
          </button>
          <button
              @click="activeTab = 'stats'"
              :class="[
                'flex items-center gap-3 px-4 py-3 rounded-xl transition-colors text-sm font-semibold w-full text-left',
                activeTab === 'stats' ? 'bg-blue-50 text-blue-600 font-bold' : 'text-slate-600 hover:bg-slate-50'
              ]"
          >
            <ChartBarIcon class="w-5 h-5" />
            System Stats
          </button>
        </nav>
      </div>

      <!-- Bottom Links -->
      <div class="p-4 px-4 flex flex-col gap-1 mb-4 border-t border-slate-100/50">
        <button
            @click="goHome"
            class="flex items-center gap-3 px-4 py-2 rounded-xl text-slate-500 hover:bg-slate-50 transition-colors text-xs font-semibold w-full text-left"
        >
          <HomeIcon class="w-4 h-4" />
          Exit to Portal
        </button>
        <button
            @click="handleLogout"
            class="flex items-center gap-3 px-4 py-2 rounded-xl text-slate-500 hover:bg-red-50 hover:text-red-600 transition-colors text-xs font-semibold w-full text-left"
        >
          <ArrowLeftOnRectangleIcon class="w-4 h-4" />
          Log out
        </button>
      </div>
    </aside>

    <!-- Main Content -->
    <main class="flex-1 overflow-y-auto p-8 lg:px-12 flex flex-col gap-8">

      <!-- HEADER SECTION -->
      <div class="flex flex-col md:flex-row md:items-start justify-between gap-6">
        <div class="max-w-2xl">
          <template v-if="activeTab === 'dashboard'">
            <h2 class="text-3xl font-display font-bold text-blue-600 mb-2">Admin Dashboard</h2>
            <p class="text-slate-500 text-sm leading-relaxed">
              Overview of registrations, platform metrics, and validation queues.
            </p>
          </template>
          <template v-else-if="activeTab === 'pending'">
            <h2 class="text-3xl font-display font-bold text-blue-600 mb-2">Pending Employers</h2>
            <p class="text-slate-500 text-sm leading-relaxed">
              Review and approve new employer registrations to grant access to the talent pool. Ensure all submitted
              Business Patents are valid.
            </p>
          </template>
          <template v-else-if="activeTab === 'verified'">
            <h2 class="text-3xl font-display font-bold text-blue-600 mb-2">Verified SMEs & Employers</h2>
            <p class="text-slate-500 text-sm leading-relaxed">
              Manage existing approved companies. You can revoke verification statuses if documentation is flagged or expired.
            </p>
          </template>
          <template v-else-if="activeTab === 'stats'">
            <h2 class="text-3xl font-display font-bold text-blue-600 mb-2">System Statistics</h2>
            <p class="text-slate-500 text-sm leading-relaxed">
              Analytics on platform balance, signups, and student-to-employer conversion ratios.
            </p>
          </template>
        </div>

        <!-- Search & Filter (Visible for lists) -->
        <div v-if="activeTab === 'pending' || activeTab === 'verified'" class="flex items-center gap-3 flex-shrink-0">
          <div
              class="relative bg-white rounded-xl shadow-sm border border-slate-100 flex items-center px-3 py-2 w-64 focus-within:ring-2 focus-within:ring-blue-100 transition-all">
            <MagnifyingGlassIcon class="w-5 h-5 text-slate-400"/>
            <input
                v-model="searchQuery"
                type="text"
                :placeholder="activeTab === 'pending' ? 'Search pending...' : 'Search verified...'"
                class="w-full bg-transparent border-none focus:ring-0 text-sm px-2 text-slate-700 placeholder:text-slate-400 outline-none"
            />
          </div>
        </div>
      </div>

      <!-- METRIC CARDS -->
      <div class="grid grid-cols-1 md:grid-cols-4 gap-6">
        <div class="bg-white rounded-2xl border border-slate-100 shadow-sm p-6 flex flex-col justify-center">
          <span class="text-xs font-bold text-slate-400 uppercase tracking-wider mb-1">Total Students</span>
          <span class="text-3xl font-display font-bold text-slate-800">{{ stats.totalStudents }}</span>
        </div>
        <div class="bg-white rounded-2xl border border-slate-100 shadow-sm p-6 flex flex-col justify-center">
          <span class="text-xs font-bold text-slate-400 uppercase tracking-wider mb-1">Total Employers</span>
          <span class="text-3xl font-display font-bold text-slate-800">{{ stats.totalEmployers }}</span>
        </div>
        <div class="bg-white rounded-2xl border border-slate-100 shadow-sm p-6 flex flex-col justify-center relative overflow-hidden group">
          <div class="flex items-center justify-between mb-1">
            <span class="text-xs font-bold text-slate-400 uppercase tracking-wider">Pending Review</span>
            <div class="flex items-center gap-1 text-amber-500 bg-amber-50 px-2 py-0.5 rounded-md">
              <ExclamationTriangleIcon class="w-3.5 h-3.5"/>
              <span class="text-[9px] font-bold uppercase tracking-wider">Queue</span>
            </div>
          </div>
          <span class="text-3xl font-display font-bold text-slate-800">{{ stats.pendingEmployers }}</span>
        </div>
        <div class="bg-white rounded-2xl border border-slate-100 shadow-sm p-6 flex flex-col justify-center">
          <span class="text-xs font-bold text-slate-400 uppercase tracking-wider mb-1">Verified SMEs</span>
          <span class="text-3xl font-display font-bold text-green-600">{{ stats.verifiedEmployers }}</span>
        </div>
      </div>

      <!-- TAB CONTENTS -->

      <!-- 1. DASHBOARD OVERVIEW -->
      <div v-if="activeTab === 'dashboard'" class="flex flex-col gap-6">
        <div class="grid grid-cols-1 lg:grid-cols-3 gap-6">
          <!-- Left Columns: Quick Action Queue -->
          <div class="bg-white rounded-2xl border border-slate-100 shadow-sm p-6 lg:col-span-2 flex flex-col gap-4">
            <div class="flex justify-between items-center border-b border-slate-50 pb-4">
              <h3 class="font-bold text-lg text-slate-800">Quick Approval Queue</h3>
              <button @click="activeTab = 'pending'" class="text-xs font-bold text-blue-600 hover:underline">View All</button>
            </div>
            <div v-if="pendingEmployers.length === 0" class="py-8 text-center text-slate-400 text-sm">
              No pending employer registrations to review.
            </div>
            <div v-else class="flex flex-col gap-3">
              <div v-for="employer in pendingEmployers.slice(0, 3)" :key="employer.id"
                   class="flex items-center justify-between p-4 rounded-xl bg-slate-50 border border-slate-100/50 hover:border-blue-100 transition-all">
                <div class="flex items-center gap-3">
                  <div class="w-10 h-10 rounded-lg bg-white shadow-sm flex items-center justify-center text-slate-400">
                    <BuildingOfficeIcon class="w-5 h-5"/>
                  </div>
                  <div>
                    <h4 class="font-bold text-sm text-slate-800">{{ employer.companyName }}</h4>
                    <p class="text-xs text-slate-400">{{ employer.industry }}</p>
                  </div>
                </div>
                <div class="flex items-center gap-2">
                  <button @click="openModal(employer)"
                          class="bg-white border border-slate-200 text-slate-600 text-xs font-bold px-3 py-1.5 rounded-lg hover:bg-slate-50 transition-colors">
                    Review
                  </button>
                </div>
              </div>
            </div>
          </div>

          <!-- Right Column: Verification Stats summary -->
          <div class="bg-white rounded-2xl border border-slate-100 shadow-sm p-6 flex flex-col justify-between gap-6">
            <h3 class="font-bold text-lg text-slate-800 border-b border-slate-50 pb-4">System Ratios</h3>
            
            <div class="flex flex-col gap-4 flex-grow justify-center">
              <div>
                <div class="flex justify-between text-xs font-bold text-slate-500 mb-1">
                  <span>Employer Verification Rate</span>
                  <span>{{ verificationRate }}%</span>
                </div>
                <div class="w-full bg-slate-100 h-2 rounded-full overflow-hidden">
                  <div class="bg-green-500 h-full rounded-full transition-all" :style="{ width: verificationRate + '%' }"></div>
                </div>
              </div>

              <div>
                <div class="flex justify-between text-xs font-bold text-slate-500 mb-1">
                  <span>Pending Validation Ratio</span>
                  <span>{{ pendingRatio }}%</span>
                </div>
                <div class="w-full bg-slate-100 h-2 rounded-full overflow-hidden">
                  <div class="bg-amber-500 h-full rounded-full transition-all" :style="{ width: pendingRatio + '%' }"></div>
                </div>
              </div>
            </div>

            <div class="p-3.5 bg-blue-50/50 rounded-xl border border-blue-100/50">
              <p class="text-xs text-blue-700 leading-relaxed font-semibold">
                Maintaining a high verification rate ensures users on the portal can trust company postings and opportunities.
              </p>
            </div>
          </div>
        </div>
      </div>

      <!-- 2. PENDING EMPLOYERS LIST -->
      <div v-if="activeTab === 'pending'" class="bg-white rounded-2xl border border-slate-100 shadow-sm flex flex-col">
        <div class="overflow-x-auto">
          <table class="w-full text-left">
            <thead>
            <tr class="text-xs font-semibold text-slate-400 uppercase tracking-wider border-b border-slate-100">
              <th class="px-6 py-5">Company Details</th>
              <th class="px-6 py-5">Date Applied</th>
              <th class="px-6 py-5">Status</th>
              <th class="px-6 py-5 text-right font-bold">Actions</th>
            </tr>
            </thead>
            <tbody class="divide-y divide-slate-50">
            <tr v-if="filteredPendingEmployers.length === 0">
              <td colspan="4" class="px-6 py-12 text-center text-slate-400 text-sm">
                No pending registrations found.
              </td>
            </tr>
            <tr v-for="employer in filteredPendingEmployers" :key="employer.id"
                class="hover:bg-slate-50/50 transition-colors group">
              <td class="px-6 py-4">
                <div class="flex items-center gap-4">
                  <div
                      class="w-12 h-12 rounded-xl bg-slate-50 border border-slate-100/80 flex items-center justify-center text-slate-400 group-hover:bg-blue-50 group-hover:text-blue-500 transition-colors">
                    <BuildingOfficeIcon class="w-6 h-6"/>
                  </div>
                  <div class="flex flex-col">
                    <span class="font-bold text-slate-800">{{ employer.companyName }}</span>
                    <span class="text-xs text-slate-400 font-semibold">{{ employer.industry }}</span>
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
                <div class="flex justify-end gap-2">
                  <button @click="openModal(employer)"
                          class="w-9 h-9 rounded-xl flex items-center justify-center bg-blue-50/50 text-blue-600 hover:bg-blue-50 transition-colors focus:outline-none">
                    <EyeIcon class="w-4.5 h-4.5"/>
                  </button>
                </div>
              </td>
            </tr>
            </tbody>
          </table>
        </div>
      </div>

      <!-- 3. VERIFIED SMES LIST -->
      <div v-if="activeTab === 'verified'" class="bg-white rounded-2xl border border-slate-100 shadow-sm flex flex-col">
        <div class="overflow-x-auto">
          <table class="w-full text-left">
            <thead>
            <tr class="text-xs font-semibold text-slate-400 uppercase tracking-wider border-b border-slate-100">
              <th class="px-6 py-5">Company Details</th>
              <th class="px-6 py-5">Verification Status</th>
              <th class="px-6 py-5 text-right font-bold">Actions</th>
            </tr>
            </thead>
            <tbody class="divide-y divide-slate-50">
            <tr v-if="filteredVerifiedEmployers.length === 0">
              <td colspan="3" class="px-6 py-12 text-center text-slate-400 text-sm">
                No verified companies found.
              </td>
            </tr>
            <tr v-for="employer in filteredVerifiedEmployers" :key="employer.id"
                class="hover:bg-slate-50/50 transition-colors group">
              <td class="px-6 py-4">
                <div class="flex items-center gap-4">
                  <div
                      class="w-12 h-12 rounded-xl bg-slate-50 border border-slate-100/80 flex items-center justify-center text-slate-400 group-hover:bg-green-50 group-hover:text-green-500 transition-colors">
                    <BuildingOfficeIcon class="w-6 h-6"/>
                  </div>
                  <div class="flex flex-col">
                    <span class="font-bold text-slate-800">{{ employer.companyName }}</span>
                    <span class="text-xs text-slate-400 font-semibold">{{ employer.industry }}</span>
                  </div>
                </div>
              </td>
              <td class="px-6 py-4">
                <span class="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-bold bg-green-50 text-green-700">
                  <ShieldCheckIcon class="w-4 h-4" />
                  Verified SME
                </span>
              </td>
              <td class="px-6 py-4 text-right">
                <div class="flex justify-end gap-2">
                  <button @click="openModal(employer)"
                          class="px-3.5 py-1.5 rounded-xl text-xs font-bold bg-slate-100 hover:bg-slate-200 text-slate-700 transition-colors">
                    View Patent
                  </button>
                  <button @click="revokeEmployer(employer.id)"
                          class="px-3.5 py-1.5 rounded-xl text-xs font-bold bg-amber-50 hover:bg-amber-100 text-amber-700 transition-colors">
                    Revoke Status
                  </button>
                  <button @click="deleteEmployerDirectly(employer.id)"
                          class="px-3.5 py-1.5 rounded-xl text-xs font-bold bg-red-50 hover:bg-red-100 text-red-600 transition-colors">
                    Delete SME
                  </button>
                </div>
              </td>
            </tr>
            </tbody>
          </table>
        </div>
      </div>

      <!-- 4. SYSTEM STATS & METRICS -->
      <div v-if="activeTab === 'stats'" class="flex flex-col gap-6">
        <div class="bg-white rounded-2xl border border-slate-100 shadow-sm p-8 flex flex-col gap-6">
          <h3 class="font-bold text-xl text-slate-800">Registration Balance Metrics</h3>
          <div class="grid grid-cols-1 md:grid-cols-2 gap-8">
            <div class="flex flex-col justify-center p-6 bg-slate-50 rounded-2xl border border-slate-100">
              <h4 class="text-slate-400 font-bold uppercase tracking-wider text-xs mb-3">Student-to-Employer Ratio</h4>
              <div class="flex items-baseline gap-2 mb-4">
                <span class="text-3xl font-extrabold text-blue-600">{{ studentEmployerRatio }}</span>
                <span class="text-xs font-bold text-slate-400">students per employer</span>
              </div>
              <div class="w-full bg-slate-200 h-2 rounded-full overflow-hidden flex">
                <div class="bg-blue-500 h-full" :style="{ width: studentRatioPercent + '%' }"></div>
                <div class="bg-emerald-500 h-full" :style="{ width: (100 - studentRatioPercent) + '%' }"></div>
              </div>
              <div class="flex justify-between mt-3 text-xs font-bold">
                <span class="text-blue-600">Students ({{ studentRatioPercent }}%)</span>
                <span class="text-emerald-600">Employers ({{ (100 - studentRatioPercent).toFixed(0) }}%)</span>
              </div>
            </div>

            <div class="flex flex-col justify-center p-6 bg-slate-50 rounded-2xl border border-slate-100">
              <h4 class="text-slate-400 font-bold uppercase tracking-wider text-xs mb-3">Validation Efficiency</h4>
              <div class="flex items-baseline gap-2 mb-4">
                <span class="text-3xl font-extrabold text-emerald-600">{{ stats.verifiedEmployers }}</span>
                <span class="text-xs font-bold text-slate-400">verified out of {{ stats.totalEmployers }} total companies</span>
              </div>
              <div class="w-full bg-slate-200 h-2 rounded-full overflow-hidden">
                <div class="bg-emerald-500 h-full" :style="{ width: verificationRate + '%' }"></div>
              </div>
              <div class="flex justify-between mt-3 text-xs font-bold">
                <span class="text-emerald-600">Approved SME Rate ({{ verificationRate }}%)</span>
                <span class="text-slate-400">Pending Review Queue ({{ pendingRatio }}%)</span>
              </div>
            </div>
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
              <h2 class="text-xl font-display font-bold text-slate-800">Review SME Documentation</h2>
              <p class="text-sm text-slate-500 mt-1 font-semibold">{{ selectedEmployer.companyName }} ({{ selectedEmployer.industry }})</p>
            </div>
            <button @click="closeModal"
                    class="text-slate-400 hover:text-slate-700 transition-colors p-2 rounded-full hover:bg-slate-100">
              <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12"></path>
              </svg>
            </button>
          </div>

          <!-- Modal Body (Patent Image / File) -->
          <div class="p-6 bg-slate-50/50 flex-1 overflow-y-auto min-h-[300px] flex items-center justify-center">
            <!-- Render Real uploaded Patent file if it exists -->
            <div v-if="selectedEmployer.patentUrl && selectedEmployer.patentUrl !== 'No document uploaded'"
                 class="w-full bg-white rounded-xl shadow-sm border border-slate-100 overflow-hidden flex flex-col items-center justify-center p-4">
              <template v-if="isImage(selectedEmployer.patentUrl)">
                <img :src="resolveUrl(selectedEmployer.patentUrl)" class="max-w-full h-auto object-contain max-h-[50vh] rounded-lg shadow-sm" alt="Business Patent" />
              </template>
              <template v-else>
                <div class="flex flex-col items-center text-center p-8">
                  <div class="w-16 h-16 bg-blue-50 text-blue-500 rounded-2xl flex items-center justify-center mb-4">
                    <svg class="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path stroke-linecap="round" stroke-linejoin="round" stroke-width="1.5"
                            d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"></path>
                    </svg>
                  </div>
                  <span class="text-lg font-bold text-slate-800">Business Patent File (PDF/Doc)</span>
                  <p class="text-sm text-slate-400 font-semibold mt-1">This document is not an image and cannot be viewed in the browser directly.</p>
                  <a :href="resolveUrl(selectedEmployer.patentUrl)" target="_blank" download class="mt-4 bg-blue-600 hover:bg-blue-700 text-white text-sm font-bold px-5 py-2.5 rounded-xl transition-colors inline-flex items-center gap-2">
                    <ArrowDownTrayIcon class="w-4 h-4 text-white" />
                    Download Patent
                  </a>
                </div>
              </template>
            </div>
            
            <!-- Mock Placeholder only if truly no document uploaded -->
            <div v-else
                class="w-full bg-white rounded-xl shadow-sm flex flex-col items-center justify-center border border-slate-100 p-8">
              <div class="flex flex-col items-center text-center p-8">
                <div class="w-16 h-16 bg-slate-50 text-slate-400 rounded-2xl flex items-center justify-center mb-4 border border-slate-100">
                  <svg class="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="1.5"
                          d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"></path>
                  </svg>
                </div>
                <span class="text-lg font-bold text-slate-800">No Document Uploaded</span>
                <span class="text-xs font-semibold text-slate-400 mt-2 max-w-sm">The company did not upload a business patent file during profile setup.</span>
              </div>
            </div>
          </div>

          <!-- Modal Footer (Actions) -->
          <div class="p-6 flex gap-4 bg-white border-t border-slate-50">
            <!-- If the employer is already verified, we show "Revoke" option -->
            <template v-if="isVerifiedSme(selectedEmployer)">
              <button @click="revokeEmployer(selectedEmployer.id)"
                      class="flex-grow bg-amber-500 hover:bg-amber-600 text-white py-3.5 rounded-xl font-bold transition-colors shadow-sm flex items-center justify-center gap-2">
                Revoke Verification Status
              </button>
              <button @click="rejectEmployer"
                      class="flex-1 bg-transparent border border-red-200 text-red-600 hover:bg-red-50 py-3.5 rounded-xl font-bold transition-colors flex items-center justify-center gap-2">
                Delete SME Account
              </button>
            </template>
            <!-- Otherwise, we show standard approve / reject controls -->
            <template v-else>
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
            </template>
          </div>
        </div>
      </div>
    </Transition>

  </div>
</template>

<script setup>
import {ref, computed, onMounted} from 'vue'
import { useRouter } from 'vue-router'
import api, { resolveUrl } from '@/lib/api'
import { useAuthStore } from '@/stores/auth'
import {
  MagnifyingGlassIcon,
  AdjustmentsHorizontalIcon,
  ExclamationTriangleIcon,
  BuildingOfficeIcon,
  EyeIcon,
  ChevronLeftIcon,
  ChevronRightIcon,
  ArrowDownTrayIcon,
  ShieldCheckIcon,
  UsersIcon,
  ChartBarIcon,
  ArrowLeftOnRectangleIcon,
  HomeIcon
} from '@heroicons/vue/24/outline'

const router = useRouter()
const authStore = useAuthStore()

const activeTab = ref('dashboard') // 'dashboard' | 'pending' | 'verified' | 'stats'
const pendingEmployers = ref([])
const verifiedEmployersList = ref([])
const selectedEmployer = ref(null)
const searchQuery = ref('')

const stats = ref({
  totalStudents: 0,
  totalEmployers: 0,
  verifiedEmployers: 0,
  pendingEmployers: 0,
})

// Computations
const verificationRate = computed(() => {
  if (stats.value.totalEmployers === 0) return 0
  return Math.round((stats.value.verifiedEmployers / stats.value.totalEmployers) * 100)
})

const pendingRatio = computed(() => {
  if (stats.value.totalEmployers === 0) return 0
  return Math.round((stats.value.pendingEmployers / stats.value.totalEmployers) * 100)
})

const studentEmployerRatio = computed(() => {
  if (stats.value.totalEmployers === 0) return stats.value.totalStudents
  return (stats.value.totalStudents / stats.value.totalEmployers).toFixed(1)
})

const studentRatioPercent = computed(() => {
  const sum = stats.value.totalStudents + stats.value.totalEmployers
  if (sum === 0) return 50
  return Math.round((stats.value.totalStudents / sum) * 100)
})

// Search filters
const filteredPendingEmployers = computed(() => {
  if (!searchQuery.value.trim()) return pendingEmployers.value
  const q = searchQuery.value.toLowerCase()
  return pendingEmployers.value.filter(emp =>
    emp.companyName?.toLowerCase().includes(q) ||
    emp.industry?.toLowerCase().includes(q)
  )
})

const filteredVerifiedEmployers = computed(() => {
  if (!searchQuery.value.trim()) return verifiedEmployersList.value
  const q = searchQuery.value.toLowerCase()
  return verifiedEmployersList.value.filter(emp =>
    emp.companyName?.toLowerCase().includes(q) ||
    emp.industry?.toLowerCase().includes(q)
  )
})

const isVerifiedSme = (employer) => {
  if (!employer) return false
  // Check if this employer is in the verifiedEmployersList
  return verifiedEmployersList.value.some(emp => emp.id === employer.id)
}

// Data loaders
const fetchPendingEmployers = async () => {
  try {
    const response = await api.get('/admin/employers/pending')
    pendingEmployers.value = response.data.map(emp => {
      const applied = new Date(emp.createdAt)
      const diffTime = Math.abs(new Date() - applied)
      const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24))

      return {
        id: emp.id,
        companyName: emp.companyName || 'Unnamed SME',
        industry: emp.industry || 'General Industry',
        appliedDate: new Intl.DateTimeFormat('en-US', {
          month: 'short',
          day: 'numeric',
          year: 'numeric'
        }).format(applied),
        createdAt: emp.createdAt,
        status: diffDays > 3 ? 'Action Required' : 'Pending Review',
        patentUrl: emp.patentUrl || ''
      }
    })
  } catch (error) {
    console.error('Failed to fetch pending employers:', error)
  }
}

const fetchVerifiedEmployers = async () => {
  try {
    const response = await api.get('/admin/employers/verified')
    verifiedEmployersList.value = response.data.map(emp => {
      return {
        id: emp.id,
        companyName: emp.companyName || 'Unnamed SME',
        industry: emp.industry || 'General Industry',
        appliedDate: new Intl.DateTimeFormat('en-US', {
          month: 'short',
          day: 'numeric',
          year: 'numeric'
        }).format(new Date(emp.createdAt)),
        createdAt: emp.createdAt,
        patentUrl: emp.patentUrl || ''
      }
    })
  } catch (error) {
    console.error('Failed to fetch verified employers:', error)
  }
}

const fetchStats = async () => {
  try {
    const response = await api.get('/admin/stats')
    stats.value = response.data
  } catch (error) {
    console.error('Failed to fetch stats:', error)
  }
}

const loadData = async () => {
  await Promise.all([
    fetchPendingEmployers(),
    fetchVerifiedEmployers(),
    fetchStats()
  ])
}

onMounted(() => {
  loadData()
})

const openModal = (employer) => {
  selectedEmployer.value = employer
}

const closeModal = () => {
  selectedEmployer.value = null
}

const approveEmployer = async () => {
  if (!selectedEmployer.value) return
  try {
    await api.patch(`/admin/employers/${selectedEmployer.value.id}/approve`)
    closeModal()
    await loadData()
  } catch (error) {
    console.error('Failed to approve employer:', error)
    alert('An error occurred while approving the employer.')
  }
}

const rejectEmployer = async () => {
  if (!selectedEmployer.value) return
  try {
    await api.delete(`/admin/employers/${selectedEmployer.value.id}/reject`)
    closeModal()
    await loadData()
  } catch (error) {
    console.error('Failed to reject employer:', error)
    alert('An error occurred while rejecting the employer.')
  }
}

const revokeEmployer = async (employerId) => {
  try {
    await api.patch(`/admin/employers/${employerId}/revoke`)
    if (selectedEmployer.value && selectedEmployer.value.id === employerId) {
      closeModal()
    }
    await loadData()
  } catch (error) {
    console.error('Failed to revoke employer:', error)
    alert('An error occurred while revoking the employer.')
  }
}

const deleteEmployerDirectly = async (employerId) => {
  if (!confirm('Are you sure you want to permanently delete this employer account?')) return
  try {
    await api.delete(`/admin/employers/${employerId}/reject`)
    await loadData()
  } catch (error) {
    console.error('Failed to delete employer:', error)
    alert('An error occurred while deleting the employer.')
  }
}

const isImage = (url) => {
  if (!url) return false
  const ext = url.split('.').pop().toLowerCase()
  return ['jpg', 'jpeg', 'png', 'gif', 'webp', 'bmp', 'svg'].includes(ext)
}

const goHome = () => {
  router.push('/home')
}

const handleLogout = async () => {
  await authStore.logout(router)
}
</script>
