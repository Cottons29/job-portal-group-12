<template>
  <div class="flex h-screen bg-slate-50 font-sans text-slate-800 overflow-hidden relative">
    <!-- Overlay for mobile sidebar -->
    <div 
      v-if="isSidebarOpen" 
      @click="isSidebarOpen = false"
      class="fixed inset-0 z-20 bg-slate-900/40 lg:hidden"
    ></div>

    <!-- Sidebar -->
    <aside 
      :class="[
        isSidebarOpen ? 'translate-x-0' : '-translate-x-full lg:translate-x-0',
        'fixed inset-y-0 left-0 w-64 bg-white shadow-md lg:shadow-none flex flex-col justify-between flex-shrink-0 z-30 border-r border-slate-100 transition-transform duration-300 ease-in-out lg:static lg:w-64'
      ]"
    >
      <div>
        <!-- Brand -->
        <div class="p-6">
          <h1 class="text-2xl font-display font-extrabold text-blue-600 leading-tight">FirstStep</h1>
          <span class="text-xs font-bold text-slate-400 uppercase tracking-wider">Admin Portal</span>
        </div>

        <!-- Navigation -->
        <nav class="mt-2 px-4 flex flex-col gap-1">
          <button
              @click="activeTab = 'dashboard'; isSidebarOpen = false"
              :class="[
                'flex items-center gap-3 px-4 py-3 rounded-xl transition-colors text-sm font-semibold w-full text-left',
                activeTab === 'dashboard' ? 'bg-blue-50 text-blue-600 font-bold' : 'text-slate-600 hover:bg-slate-50'
              ]"
          >
            <BuildingOfficeIcon class="w-5 h-5" />
            Dashboard
          </button>
          <button
              @click="activeTab = 'pending'; isSidebarOpen = false"
              :class="[
                'flex items-center gap-3 px-4 py-3 rounded-xl transition-colors text-sm font-semibold w-full text-left',
                activeTab === 'pending' ? 'bg-blue-50 text-blue-600 font-bold' : 'text-slate-600 hover:bg-slate-50'
              ]"
          >
            <ExclamationTriangleIcon class="w-5 h-5" />
            Pending Employers
          </button>
          <button
              @click="activeTab = 'verified'; isSidebarOpen = false"
              :class="[
                'flex items-center gap-3 px-4 py-3 rounded-xl transition-colors text-sm font-semibold w-full text-left',
                activeTab === 'verified' ? 'bg-blue-50 text-blue-600 font-bold' : 'text-slate-600 hover:bg-slate-50'
              ]"
          >
            <ShieldCheckIcon class="w-5 h-5" />
            Verified SMEs
          </button>
          <button
              @click="activeTab = 'stats'; isSidebarOpen = false"
              :class="[
                'flex items-center gap-3 px-4 py-3 rounded-xl transition-colors text-sm font-semibold w-full text-left',
                activeTab === 'stats' ? 'bg-blue-50 text-blue-600 font-bold' : 'text-slate-600 hover:bg-slate-50'
              ]"
          >
            <ChartBarIcon class="w-5 h-5" />
            System Stats
          </button>
          <button
              @click="activeTab = 'posts'; isSidebarOpen = false"
              :class="[
                'flex items-center gap-3 px-4 py-3 rounded-xl transition-colors text-sm font-semibold w-full text-left',
                activeTab === 'posts' ? 'bg-blue-50 text-blue-600 font-bold' : 'text-slate-600 hover:bg-slate-50'
              ]"
          >
            <FlagIcon class="w-5 h-5" />
            Flagged Posts
          </button>
        </nav>
      </div>

      <!-- Bottom Links -->
      <div class="p-4 px-4 flex flex-col gap-1 mb-4 border-t border-slate-100/50">
        <button
            @click="goHome; isSidebarOpen = false"
            class="flex items-center gap-3 px-4 py-2 rounded-xl text-slate-500 hover:bg-slate-50 transition-colors text-xs font-semibold w-full text-left"
        >
          <HomeIcon class="w-4 h-4" />
          Exit to Portal
        </button>
        <button
            @click="handleLogout; isSidebarOpen = false"
            class="flex items-center gap-3 px-4 py-2 rounded-xl text-slate-500 hover:bg-red-50 hover:text-red-600 transition-colors text-xs font-semibold w-full text-left"
        >
          <ArrowLeftOnRectangleIcon class="w-4 h-4" />
          Log out
        </button>
      </div>
    </aside>

    <!-- Main Content -->
    <main class="flex-1 overflow-y-auto p-4 sm:p-8 lg:px-12 flex flex-col gap-8">
      <!-- Mobile header toggle -->
      <div class="flex items-center gap-3 lg:hidden bg-white p-4 rounded-2xl border border-slate-100 shadow-sm">
        <button 
          @click="isSidebarOpen = true"
          class="p-2 rounded-xl bg-slate-50 border border-slate-200 text-slate-600 hover:bg-slate-100 transition-colors"
          aria-label="Open sidebar"
        >
          <Bars3Icon class="w-6 h-6" />
        </button>
        <div>
          <h1 class="text-lg font-display font-extrabold text-blue-600">FirstStep</h1>
          <p class="text-[10px] font-bold text-slate-400 uppercase tracking-wider">Admin Portal</p>
        </div>
      </div>

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
            <h2 class="text-3xl font-display font-bold text-blue-600 mb-2">Pending {{ currentEntity === 'employer' ? 'Employers' : 'Students' }}</h2>
            <p class="text-slate-500 text-sm leading-relaxed">
              Review and approve new {{ currentEntity === 'employer' ? 'employer registrations. Ensure business patents are valid.' : 'student ID submissions for verification.' }}
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
          <template v-else-if="activeTab === 'posts'">
            <h2 class="text-3xl font-display font-bold text-blue-600 mb-2">Flagged Posts & Jobs</h2>
            <p class="text-slate-500 text-sm leading-relaxed">
              Review posts that have been flagged by users. You can approve them to clear flags or permanently delete them.
            </p>
          </template>
        </div>

        <!-- Search & Filter (Visible for lists) -->
        <div v-if="activeTab === 'pending' || activeTab === 'verified'" class="flex flex-col sm:flex-row sm:items-center gap-3 flex-shrink-0 w-full sm:w-auto">
          <div class="inline-flex rounded-lg bg-white p-1 border border-slate-100 w-full sm:w-auto justify-center">
            <button @click="currentEntity = 'employer'" :class="['px-3 py-1 rounded-md text-sm font-semibold flex-1 sm:flex-none', currentEntity === 'employer' ? 'bg-blue-600 text-white' : 'text-slate-600']">Employers</button>
            <button @click="currentEntity = 'student'" :class="['px-3 py-1 rounded-md text-sm font-semibold flex-1 sm:flex-none', currentEntity === 'student' ? 'bg-blue-600 text-white' : 'text-slate-600']">Students</button>
          </div>

          <div
              class="relative bg-white rounded-xl shadow-sm border border-slate-100 flex items-center px-3 py-2 w-full sm:w-64 focus-within:ring-2 focus-within:ring-blue-100 transition-all">
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
      <div class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-6">
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
          <span class="text-xs font-bold text-slate-400 uppercase tracking-wider mb-1">Active Jobs</span>
          <span class="text-3xl font-display font-bold text-blue-600">{{ stats.totalJobs || 0 }}</span>
        </div>
        <div class="bg-white rounded-2xl border border-slate-100 shadow-sm p-6 flex flex-col justify-center relative overflow-hidden group">
          <div class="flex items-center justify-between mb-1">
            <span class="text-xs font-bold text-slate-400 uppercase tracking-wider">Flagged Posts</span>
            <div v-if="stats.flaggedPosts > 0" class="flex items-center gap-1 text-red-500 bg-red-50 px-2 py-0.5 rounded-md">
              <FlagIcon class="w-3.5 h-3.5"/>
              <span class="text-[9px] font-bold uppercase tracking-wider">Alert</span>
            </div>
          </div>
          <span :class="['text-3xl font-display font-bold', stats.flaggedPosts > 0 ? 'text-red-600' : 'text-slate-800']">{{ stats.flaggedPosts || 0 }}</span>
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
                  <button @click="openModal(employer, 'employer')"
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
              <th class="px-6 py-5">{{ currentEntity === 'employer' ? 'Company Details' : 'Student Details' }}</th>
              <th class="px-6 py-5">Date Applied</th>
              <th class="px-6 py-5">Status</th>
              <th class="px-6 py-5 text-right font-bold">Actions</th>
            </tr>
            </thead>
            <tbody class="divide-y divide-slate-50">
            <tr v-if="filteredPendingList.length === 0">
              <td colspan="4" class="px-6 py-12 text-center text-slate-400 text-sm">
                No pending registrations found.
              </td>
            </tr>
            <tr v-for="item in filteredPendingList" :key="item.id"
                class="hover:bg-slate-50/50 transition-colors group">
              <td class="px-6 py-4">
                <div class="flex items-center gap-4">
                  <div
                      class="w-12 h-12 rounded-xl bg-slate-50 border border-slate-100/80 flex items-center justify-center text-slate-400 group-hover:bg-blue-50 group-hover:text-blue-500 transition-colors">
                    </div>
                  <div class="flex flex-col">
                    <div class="flex items-center gap-2">
                      <span class="font-bold text-slate-800">{{ currentEntity === 'employer' ? item.companyName : item.fullName }}</span>
                      <span v-if="currentEntity === 'student' && item.status !== 'Verified'" class="text-xs font-bold text-red-600 bg-red-50 px-2 py-0.5 rounded-full">Not Verified</span>
                    </div>
                    <span class="text-xs text-slate-400 font-semibold">{{ currentEntity === 'employer' ? item.industry : item.university }}</span>
                    <template v-if="currentEntity === 'employer'">
                      <BuildingOfficeIcon class="w-6 h-6"/>
                    </template>
                    <template v-else>
                      <UsersIcon class="w-6 h-6"/>
                    </template>
                  </div>
                  <div class="flex flex-col">
                    <span class="font-bold text-slate-800">{{ currentEntity === 'employer' ? item.companyName : item.fullName }}</span>
                    <span class="text-xs text-slate-400 font-semibold">{{ currentEntity === 'employer' ? item.industry : item.university }}</span>
                  </div>
                </div>
              </td>
              <td class="px-6 py-4 text-sm text-slate-600 font-medium">
                {{ item.appliedDate }}
              </td>
              <td class="px-6 py-4">
                <span v-if="item.status === 'Pending Review' || item.status === 'Pending Verification'"
                      class="inline-flex items-center px-2.5 py-1 rounded-full text-xs font-bold bg-slate-100 text-slate-700">
                  {{ item.status }}
                </span>
                <span v-else-if="item.status === 'Action Required'"
                      class="inline-flex items-center px-2.5 py-1 rounded-full text-xs font-bold bg-amber-50 text-amber-700">
                  Action Required
                </span>
              </td>
              <td class="px-6 py-4 text-right">
                <div class="flex justify-end gap-2">
                  <button @click="openModal(item, currentEntity)"
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
            <tr v-if="filteredVerifiedList.length === 0">
              <td colspan="3" class="px-6 py-12 text-center text-slate-400 text-sm">
                No verified {{ currentEntity === 'employer' ? 'companies' : 'students' }} found.
              </td>
            </tr>
            <tr v-for="item in filteredVerifiedList" :key="item.id"
                class="hover:bg-slate-50/50 transition-colors group">
              <td class="px-6 py-4">
                <div class="flex items-center gap-4">
                  <div
                      class="w-12 h-12 rounded-xl bg-slate-50 border border-slate-100/80 flex items-center justify-center text-slate-400 group-hover:bg-green-50 group-hover:text-green-500 transition-colors">
                    <template v-if="currentEntity === 'employer'">
                      <BuildingOfficeIcon class="w-6 h-6"/>
                    </template>
                    <template v-else>
                      <UsersIcon class="w-6 h-6"/>
                    </template>
                  </div>
                  <div class="flex flex-col">
                    <span class="font-bold text-slate-800">{{ currentEntity === 'employer' ? item.companyName : item.fullName }}</span>
                    <span class="text-xs text-slate-400 font-semibold">{{ currentEntity === 'employer' ? item.industry : item.university }}</span>
                  </div>
                </div>
              </td>
              <td class="px-6 py-4">
                <span v-if="currentEntity === 'employer'"
                      class="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-bold bg-green-50 text-green-700">
                  <ShieldCheckIcon class="w-4 h-4" />
                  Verified SME
                </span>
                <span v-else
                      class="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-bold bg-green-50 text-green-700">
                  <ShieldCheckIcon class="w-4 h-4" />
                  Verified Student
                </span>
              </td>
              <td class="px-6 py-4 text-right">
                <div class="flex justify-end gap-2">
                  <button @click="openModal(item, currentEntity)"
                          class="px-3.5 py-1.5 rounded-xl text-xs font-bold bg-slate-100 hover:bg-slate-200 text-slate-700 transition-colors">
                    {{ currentEntity === 'employer' ? 'View Patent' : 'View ID' }}
                  </button>
                  <button @click="revokeSelected(item.id)"
                          class="px-3.5 py-1.5 rounded-xl text-xs font-bold bg-amber-50 hover:bg-amber-100 text-amber-700 transition-colors">
                    Revoke Status
                  </button>
                  <button v-if="currentEntity === 'employer'" @click="deleteEmployerDirectly(item.id)"
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

      <!-- 5. FLAGGED POSTS LIST -->
      <div v-if="activeTab === 'posts'" class="bg-white rounded-2xl border border-slate-100 shadow-sm flex flex-col">
        <div class="overflow-x-auto">
          <table class="w-full text-left">
            <thead>
            <tr class="text-xs font-semibold text-slate-400 uppercase tracking-wider border-b border-slate-100">
              <th class="px-6 py-5">Post/Job Details</th>
              <th class="px-6 py-5">Author</th>
              <th class="px-6 py-5">Type</th>
              <th class="px-6 py-5 text-right font-bold">Actions</th>
            </tr>
            </thead>
            <tbody class="divide-y divide-slate-50">
            <tr v-if="flaggedPostsList.length === 0">
              <td colspan="4" class="px-6 py-12 text-center text-slate-400 text-sm">
                No flagged posts found.
              </td>
            </tr>
            <tr v-for="post in flaggedPostsList" :key="post.id"
                class="hover:bg-slate-50/50 transition-colors group">
              <td class="px-6 py-4">
                <div class="flex flex-col max-w-md">
                  <span class="font-bold text-slate-800 text-sm truncate">{{ post.title }}</span>
                  <span class="text-xs text-slate-400 font-semibold line-clamp-2 mt-1">{{ post.content }}</span>
                </div>
              </td>
              <td class="px-6 py-4 text-xs font-medium text-slate-600">
                <div class="flex flex-col">
                  <span class="font-bold text-slate-700">{{ post.author?.companyName || post.author?.fullName || 'Unknown' }}</span>
                  <span class="text-[10px] text-slate-400 capitalize">{{ post.author?.role?.toLowerCase() }}</span>
                </div>
              </td>
              <td class="px-6 py-4">
                <span :class="['inline-flex items-center px-2.5 py-1 rounded-full text-xs font-bold', post.isJob ? 'bg-blue-50 text-blue-700' : 'bg-slate-100 text-slate-700']">
                  {{ post.isJob ? 'Job Listing' : 'Social Post' }}
                </span>
              </td>
              <td class="px-6 py-4 text-right">
                <div class="flex justify-end gap-2">
                  <button @click="approvePost(post.id)"
                          class="px-3.5 py-1.5 rounded-xl text-xs font-bold bg-green-50 hover:bg-green-100 text-green-700 transition-colors">
                    Approve / Dismiss Flag
                  </button>
                  <button @click="deletePost(post.id)"
                          class="px-3.5 py-1.5 rounded-xl text-xs font-bold bg-red-50 hover:bg-red-100 text-red-600 transition-colors">
                    Delete Post
                  </button>
                </div>
              </td>
            </tr>
            </tbody>
          </table>
        </div>
      </div>

    </main>

    <!-- Document Review Modal (Employer / Student) -->
    <Transition name="modal">
      <div v-if="selectedItem"
           class="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-sm">
        <div class="bg-white w-full max-w-3xl rounded-2xl shadow-xl overflow-hidden flex flex-col max-h-[90vh]">
          <!-- Modal Header -->
          <div class="flex items-center justify-between p-6 pb-4">
            <div>
              <h2 class="text-xl font-display font-bold text-slate-800">Review {{ selectedEntity === 'employer' ? 'SME Documentation' : 'Student ID' }}</h2>
              <p class="text-sm text-slate-500 mt-1 font-semibold">
                {{ selectedEntity === 'employer' ? `${selectedItem.companyName} (${selectedItem.industry})` : `${selectedItem.fullName} — ${selectedItem.university}` }}
              </p>
            </div>
            <button @click="closeModal"
                    class="text-slate-400 hover:text-slate-700 transition-colors p-2 rounded-full hover:bg-slate-100">
              <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12"></path>
              </svg>
            </button>
          </div>

          <!-- Modal Body (Document Image / File) -->
          <div class="p-6 bg-slate-50/50 flex-1 overflow-y-auto min-h-[300px] flex items-center justify-center">
            <div v-if="(selectedEntity === 'employer' ? selectedItem.patentUrl : selectedItem.idCardUrl)"
                 class="w-full bg-white rounded-xl shadow-sm border border-slate-100 overflow-hidden flex flex-col items-center justify-center p-4">
              <template v-if="selectedEntity === 'employer'">
                <template v-if="isImage(selectedItem.patentUrl)">
                  <img :src="resolveUrl(selectedItem.patentUrl)" class="max-w-full h-auto object-contain max-h-[50vh] rounded-lg shadow-sm" alt="Business Patent" />
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
                    <a :href="resolveUrl(selectedItem.patentUrl)" target="_blank" download class="mt-4 bg-blue-600 hover:bg-blue-700 text-white text-sm font-bold px-5 py-2.5 rounded-xl transition-colors inline-flex items-center gap-2">
                      <ArrowDownTrayIcon class="w-4 h-4 text-white" />
                      Download Patent
                    </a>
                  </div>
                </template>
              </template>

              <template v-else>
                <template v-if="isImage(selectedItem.idCardUrl)">
                  <img :src="resolveUrl(selectedItem.idCardUrl)" class="max-w-full h-auto object-contain max-h-[50vh] rounded-lg shadow-sm" alt="Student ID" />
                </template>
                <template v-else>
                  <div class="flex flex-col items-center text-center p-8">
                    <div class="w-16 h-16 bg-blue-50 text-blue-500 rounded-2xl flex items-center justify-center mb-4">
                      <svg class="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="1.5"
                              d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"></path>
                      </svg>
                    </div>
                    <span class="text-lg font-bold text-slate-800">ID Document (PDF/Doc)</span>
                    <p class="text-sm text-slate-400 font-semibold mt-1">This document is not an image and cannot be viewed in the browser directly.</p>
                    <a :href="resolveUrl(selectedItem.idCardUrl)" target="_blank" download class="mt-4 bg-blue-600 hover:bg-blue-700 text-white text-sm font-bold px-5 py-2.5 rounded-xl transition-colors inline-flex items-center gap-2">
                      <ArrowDownTrayIcon class="w-4 h-4 text-white" />
                      Download ID Document
                    </a>
                  </div>
                </template>
              </template>
            </div>

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
                <span class="text-xs font-semibold text-slate-400 mt-2 max-w-sm">No document was uploaded for this submission.</span>
              </div>
            </div>
          </div>

          <!-- Modal Footer (Actions) -->
          <div class="p-6 flex gap-4 bg-white border-t border-slate-50">
            <template v-if="selectedEntity === 'employer'">
              <template v-if="isVerifiedSme(selectedItem)">
                <button @click="revokeSelected(selectedItem.id)"
                        class="flex-grow bg-amber-500 hover:bg-amber-600 text-white py-3.5 rounded-xl font-bold transition-colors shadow-sm flex items-center justify-center gap-2">
                  Revoke Verification Status
                </button>
                <button @click="rejectSelected"
                        class="flex-1 bg-transparent border border-red-200 text-red-600 hover:bg-red-50 py-3.5 rounded-xl font-bold transition-colors flex items-center justify-center gap-2">
                  Delete SME Account
                </button>
              </template>
              <template v-else>
                <button @click="approveSelected"
                        class="flex-1 bg-green-500 hover:bg-green-600 text-white py-3.5 rounded-xl font-bold transition-colors shadow-sm flex items-center justify-center gap-2">
                  <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2.5" d="M5 13l4 4L19 7"></path>
                  </svg>
                  Approve Employer
                </button>
                <button @click="rejectSelected"
                        class="flex-1 bg-transparent border-2 border-red-100 text-red-600 hover:bg-red-50 py-3.5 rounded-xl font-bold transition-colors flex items-center justify-center gap-2">
                  <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2.5"
                          d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16"></path>
                  </svg>
                  Reject & Delete
                </button>
              </template>
            </template>

            <template v-else>
              <template v-if="verifiedStudentsList.some(s => s.id === selectedItem.id)">
                <button @click="revokeSelected(selectedItem.id)"
                        class="flex-grow bg-amber-500 hover:bg-amber-600 text-white py-3.5 rounded-xl font-bold transition-colors shadow-sm flex items-center justify-center gap-2">
                  Revoke Student Verification
                </button>
              </template>
              <template v-else>
                <button @click="approveSelected"
                        class="flex-1 bg-green-500 hover:bg-green-600 text-white py-3.5 rounded-xl font-bold transition-colors shadow-sm flex items-center justify-center gap-2">
                  <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2.5" d="M5 13l4 4L19 7"></path>
                  </svg>
                  Approve Student
                </button>
                <button @click="rejectSelected"
                        class="flex-1 bg-transparent border-2 border-red-100 text-red-600 hover:bg-red-50 py-3.5 rounded-xl font-bold transition-colors flex items-center justify-center gap-2">
                  <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2.5"
                          d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16"></path>
                  </svg>
                  Reject Student
                </button>
              </template>
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
  ExclamationTriangleIcon,
  BuildingOfficeIcon,
  EyeIcon,
  ArrowDownTrayIcon,
  ShieldCheckIcon,
  UsersIcon,
  ChartBarIcon,
  ArrowLeftOnRectangleIcon,
  HomeIcon,
  Bars3Icon,
  FlagIcon
} from '@heroicons/vue/24/outline'

const router = useRouter()
const authStore = useAuthStore()

const isSidebarOpen = ref(false)
const activeTab = ref('dashboard') // 'dashboard' | 'pending' | 'verified' | 'stats' | 'posts'
const currentEntity = ref('employer') // 'employer' | 'student'
const pendingEmployers = ref([])
const pendingStudents = ref([])
const verifiedEmployersList = ref([])
const verifiedStudentsList = ref([])
const flaggedPostsList = ref([])
const selectedItem = ref(null)
const selectedEntity = ref('employer')
const searchQuery = ref('')

const stats = ref({
  totalStudents: 0,
  totalEmployers: 0,
  verifiedEmployers: 0,
  pendingEmployers: 0,
  totalJobs: 0,
  flaggedPosts: 0,
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

// Search filters and generic filtered lists
const filteredPendingList = computed(() => {
  const q = searchQuery.value.trim().toLowerCase()
  if (currentEntity.value === 'employer') {
    if (!q) return pendingEmployers.value
    return pendingEmployers.value.filter(emp =>
      emp.companyName?.toLowerCase().includes(q) ||
      emp.industry?.toLowerCase().includes(q)
    )
  } else {
    if (!q) return pendingStudents.value
    return pendingStudents.value.filter(s =>
      s.fullName?.toLowerCase().includes(q) ||
      s.university?.toLowerCase().includes(q)
    )
  }
})

const filteredVerifiedList = computed(() => {
  const q = searchQuery.value.trim().toLowerCase()
  if (currentEntity.value === 'employer') {
    if (!q) return verifiedEmployersList.value
    return verifiedEmployersList.value.filter(emp =>
      emp.companyName?.toLowerCase().includes(q) ||
      emp.industry?.toLowerCase().includes(q)
    )
  } else {
    if (!q) return verifiedStudentsList.value
    return verifiedStudentsList.value.filter(s =>
      s.fullName?.toLowerCase().includes(q) ||
      s.university?.toLowerCase().includes(q)
    )
  }
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

const fetchPendingStudents = async () => {
  try {
    const response = await api.get('/admin/students/pending')
    pendingStudents.value = response.data.map(s => {
      const applied = new Date(s.createdAt)
      const diffTime = Math.abs(new Date() - applied)
      const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24))

      return {
        id: s.id,
        fullName: s.fullName || 'Unnamed Student',
        university: s.university || 'Unknown',
        appliedDate: new Intl.DateTimeFormat('en-US', {
          month: 'short',
          day: 'numeric',
          year: 'numeric'
        }).format(applied),
        createdAt: s.createdAt,
        status: diffDays > 3 ? 'Action Required' : 'Pending Verification',
        idCardUrl: s.idCardUrl || ''
      }
    })
  } catch (error) {
    console.error('Failed to fetch pending students:', error)
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

const fetchVerifiedStudents = async () => {
  try {
    const response = await api.get('/admin/students/verified')
    verifiedStudentsList.value = response.data.map(s => ({
      id: s.id,
      fullName: s.fullName || 'Unnamed Student',
      university: s.university || 'Unknown',
      appliedDate: new Intl.DateTimeFormat('en-US', {
        month: 'short',
        day: 'numeric',
        year: 'numeric'
      }).format(new Date(s.createdAt)),
      createdAt: s.createdAt,
      idCardUrl: s.idCardUrl || ''
    }))
  } catch (error) {
    console.error('Failed to fetch verified students:', error)
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

const fetchFlaggedPosts = async () => {
  try {
    const response = await api.get('/admin/posts/flagged')
    flaggedPostsList.value = response.data
  } catch (error) {
    console.error('Failed to fetch flagged posts:', error)
  }
}

const loadData = async () => {
  await Promise.all([
    fetchPendingEmployers(),
    fetchVerifiedEmployers(),
    fetchPendingStudents(),
    fetchVerifiedStudents(),
    fetchFlaggedPosts(),
    fetchStats()
  ])
}

onMounted(() => {
  loadData()
})

const openModal = (item, entity = 'employer') => {
  selectedItem.value = item
  selectedEntity.value = entity
}

const closeModal = () => {
  selectedItem.value = null
  selectedEntity.value = 'employer'
}

const approveSelected = async () => {
  if (!selectedItem.value) return
  try {
    if (selectedEntity.value === 'employer') {
      await api.patch(`/admin/employers/${selectedItem.value.id}/approve`)
    } else {
      await api.patch(`/admin/students/${selectedItem.value.id}/approve`)
    }

    closeModal()
    await loadData()
  } catch (error) {
    console.error('Failed to approve:', error)
    alert('An error occurred while approving.')
  }
}

const rejectSelected = async () => {
  if (!selectedItem.value) return
  try {
    if (selectedEntity.value === 'employer') {
      await api.delete(`/admin/employers/${selectedItem.value.id}/reject`)
    } else {
      await api.delete(`/admin/students/${selectedItem.value.id}/reject`)
    }
    closeModal()
    await loadData()
  } catch (error) {
    console.error('Failed to reject:', error)
    alert('An error occurred while rejecting.')
  }
}

const revokeSelected = async (id) => {
  try {
    if (selectedEntity.value === 'employer') {
      await api.patch(`/admin/employers/${id}/revoke`)
    } else {
      await api.patch(`/admin/students/${id}/revoke`)
    }
    if (selectedItem.value && selectedItem.value.id === id) {
      closeModal()
    }
    await loadData()
  } catch (error) {
    console.error('Failed to revoke:', error)
    alert('An error occurred while revoking.')
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

const approvePost = async (postId) => {
  try {
    await api.patch(`/admin/posts/${postId}/approve`)
    await loadData()
  } catch (error) {
    console.error('Failed to approve post:', error)
    alert('An error occurred while approving the post.')
  }
}

const deletePost = async (postId) => {
  if (!confirm('Are you sure you want to permanently delete this post?')) return
  try {
    await api.delete(`/admin/posts/${postId}`)
    await loadData()
  } catch (error) {
    console.error('Failed to delete post:', error)
    alert('An error occurred while deleting the post.')
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
