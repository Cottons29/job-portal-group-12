<template>
  <div class="min-h-screen bg-surface">
    <!-- Top Bar Navigation -->
    <header class="sticky top-0 z-50 bg-surface-container-lowest border-b border-outline-variant px-4 py-3 flex items-center justify-between">
      <!-- Logo -->
      <div class="flex items-center">
        <h1 class="text-xl font-display font-bold text-primary">FirstStep</h1>
      </div>
      <!-- Links -->
      <nav class="hidden md:flex items-center gap-6">
        <a href="#" class="text-sm font-semibold text-on-surface hover:text-primary transition-colors">Browse Jobs</a>
        <a href="#" class="text-sm font-semibold text-on-surface hover:text-primary transition-colors">For Students</a>
        <a href="#" class="text-sm font-semibold text-on-surface hover:text-primary transition-colors">For Employers</a>
      </nav>
      <!-- Auth Actions -->
      <div class="flex items-center gap-4">
        <router-link to="/auth" class="text-sm font-semibold text-primary hover:text-primary-container transition-colors">Log In</router-link>
        <!-- Generic Avatar placeholder -->
        <div class="w-8 h-8 rounded-full bg-surface-container-high flex items-center justify-center text-on-surface-variant">
           <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z"></path></svg>
        </div>
      </div>
    </header>

    <!-- Main Layout Container -->
    <main class="max-w-5xl mx-auto pt-8 pb-20 px-4 flex flex-col md:flex-row gap-8">
      
      <!-- Feed Column -->
      <div class="w-full md:w-[65%] flex flex-col gap-8">
        
        <!-- Partner Stories -->
        <section class="bg-surface-container-lowest rounded-2xl shadow-sm border border-outline-variant/30 p-4 overflow-x-auto flex gap-4 no-scrollbar">
          <!-- Story Rings -->
          <div v-for="partner in partners" :key="partner.name" class="flex flex-col items-center gap-1 min-w-[72px] cursor-pointer group">
            <div class="w-16 h-16 rounded-full p-[2px] bg-gradient-to-tr from-primary to-cyan-400 group-hover:scale-105 transition-transform">
              <div class="w-full h-full rounded-full bg-surface-container-lowest border-2 border-surface-container-lowest overflow-hidden flex items-center justify-center p-2">
                <span class="text-[10px] font-bold text-center leading-tight text-on-surface">{{ partner.name }}</span>
              </div>
            </div>
            <span class="text-[10px] text-on-surface-variant font-medium text-center truncate w-full px-1">{{ partner.status }}</span>
          </div>
        </section>

        <!-- Hero "Post" -->
        <section class="bg-surface-container-lowest rounded-2xl shadow-sm border border-outline-variant/30 overflow-hidden">
          <div class="p-4 flex items-center justify-between border-b border-outline-variant/30">
            <div class="flex items-center gap-3">
              <div class="w-8 h-8 rounded-full bg-primary flex items-center justify-center text-white font-bold text-sm">FS</div>
              <div class="flex flex-col">
                <span class="text-sm font-semibold text-on-surface leading-none">FirstStep Official</span>
                <span class="text-xs text-on-surface-variant mt-1">Phnom Penh, KH</span>
              </div>
            </div>
            <button class="text-primary text-sm font-bold hover:text-primary-container transition-colors">Follow</button>
          </div>
          
          <div class="p-8 text-center bg-surface-container-low/30">
            <h2 class="text-4xl font-display font-extrabold text-on-surface tracking-tight mb-4">
              Your First <span class="text-primary">Career Step</span> Starts Here.
            </h2>
            <p class="text-on-surface-variant text-sm max-w-md mx-auto mb-8">
              Connect with top local SMEs, discover campus opportunities, and build your professional journey while you study.
            </p>

            <!-- Search Bar -->
            <div class="relative max-w-lg mx-auto bg-surface-container-lowest rounded-xl shadow-md flex items-center p-2 border border-outline-variant/50 focus-within:border-primary/50 transition-colors">
              <MagnifyingGlassIcon class="w-5 h-5 text-on-surface-variant ml-2" />
              <input type="text" placeholder="Search for jobs, skills, or companies..." class="w-full bg-transparent border-none focus:ring-0 text-sm px-3 text-on-surface placeholder:text-on-surface-variant/70 outline-none" />
              <button class="bg-primary hover:bg-primary-container text-white px-4 py-2 rounded-lg text-sm font-semibold transition-colors shadow-sm">Search</button>
            </div>
            
            <div class="flex justify-center gap-2 mt-4 flex-wrap">
              <span class="px-3 py-1 bg-surface-container-high rounded-full text-xs font-semibold text-on-surface-variant cursor-pointer hover:bg-primary hover:text-white transition-colors">Marketing</span>
              <span class="px-3 py-1 bg-surface-container-high rounded-full text-xs font-semibold text-on-surface-variant cursor-pointer hover:bg-primary hover:text-white transition-colors">Design</span>
              <span class="px-3 py-1 bg-surface-container-high rounded-full text-xs font-semibold text-on-surface-variant cursor-pointer hover:bg-primary hover:text-white transition-colors">Tech</span>
            </div>
          </div>
          
          <div class="p-4 flex gap-4 text-on-surface-variant">
            <HeartIcon class="w-6 h-6 hover:text-red-500 cursor-pointer transition-colors" />
            <ChatBubbleOvalLeftIcon class="w-6 h-6 hover:text-primary cursor-pointer transition-colors" />
            <PaperAirplaneIcon class="w-6 h-6 hover:text-primary cursor-pointer transition-colors" />
          </div>
          <div class="px-4 pb-4">
            <span class="font-semibold text-sm text-on-surface">1,245 likes</span>
            <p class="text-sm mt-1 text-on-surface"><span class="font-semibold">firststep</span> We've just launched our new portal! Start browsing thousands of entry-level jobs tailored for students in Cambodia. 🚀</p>
          </div>
        </section>

        <!-- Real-Time Stats -->
        <section class="grid grid-cols-3 gap-4">
          <div class="bg-surface-container-lowest rounded-xl p-4 shadow-sm border border-outline-variant/30 flex flex-col items-center justify-center text-center hover:shadow-md transition-shadow">
            <BuildingStorefrontIcon class="w-6 h-6 text-primary mb-2" />
            <span class="text-lg font-bold text-on-surface">50+</span>
            <span class="text-xs text-on-surface-variant font-medium mt-1">Trusted Employers</span>
          </div>
          <div class="bg-surface-container-lowest rounded-xl p-4 shadow-sm border border-outline-variant/30 flex flex-col items-center justify-center text-center hover:shadow-md transition-shadow">
            <AcademicCapIcon class="w-6 h-6 text-primary mb-2" />
            <span class="text-lg font-bold text-on-surface">1,200+</span>
            <span class="text-xs text-on-surface-variant font-medium mt-1">Active Students</span>
          </div>
          <div class="bg-surface-container-lowest rounded-xl p-4 shadow-sm border border-outline-variant/30 flex flex-col items-center justify-center text-center hover:shadow-md transition-shadow">
            <BriefcaseIcon class="w-6 h-6 text-primary mb-2" />
            <span class="text-lg font-bold text-on-surface">200+</span>
            <span class="text-xs text-on-surface-variant font-medium mt-1">Active Jobs</span>
          </div>
        </section>

        <!-- Explore Pathways (Categories) -->
        <section class="bg-surface-container-lowest rounded-2xl shadow-sm border border-outline-variant/30 p-6">
          <h3 class="text-lg font-bold text-on-surface mb-4">Explore Pathways</h3>
          <div class="grid grid-cols-2 lg:grid-cols-3 gap-4">
            <div v-for="category in categories" :key="category.title" class="flex flex-col p-4 rounded-xl border border-outline-variant/30 hover:border-primary/50 hover:shadow-md cursor-pointer transition-all group bg-surface">
              <component :is="category.icon" class="w-6 h-6 text-on-surface-variant group-hover:text-primary mb-3 transition-colors" />
              <h4 class="text-sm font-semibold text-on-surface mb-1">{{ category.title }}</h4>
              <p class="text-xs text-on-surface-variant">{{ category.desc }}</p>
            </div>
          </div>
        </section>

        <!-- Path to Employment (Timeline) -->
        <section class="bg-surface-container-lowest rounded-2xl shadow-sm border border-outline-variant/30 p-6">
          <h3 class="text-lg font-bold text-on-surface mb-4">Your Path to Employment</h3>
          <div class="flex flex-col md:flex-row gap-4">
            <div class="flex-1 flex items-center gap-3 bg-surface p-3 rounded-xl border border-outline-variant/30 shadow-sm">
              <div class="w-8 h-8 rounded-full bg-primary/10 text-primary flex items-center justify-center font-bold text-sm shrink-0">1</div>
              <span class="text-sm font-semibold text-on-surface">Create Profile</span>
            </div>
            <div class="flex-1 flex items-center gap-3 bg-surface p-3 rounded-xl border border-outline-variant/30 shadow-sm">
              <div class="w-8 h-8 rounded-full bg-primary/10 text-primary flex items-center justify-center font-bold text-sm shrink-0">2</div>
              <span class="text-sm font-semibold text-on-surface">Quick Apply</span>
            </div>
            <div class="flex-1 flex items-center gap-3 bg-surface p-3 rounded-xl border border-outline-variant/30 shadow-sm">
              <div class="w-8 h-8 rounded-full bg-primary/10 text-primary flex items-center justify-center font-bold text-sm shrink-0">3</div>
              <span class="text-sm font-semibold text-on-surface">Start Working</span>
            </div>
          </div>
        </section>

        <!-- Featured Opportunities (Jobs Feed) -->
        <div class="flex flex-col gap-6">
          <h3 class="text-lg font-bold text-on-surface px-2">Featured Opportunities</h3>
          
          <article v-for="job in jobs" :key="job.title" class="bg-surface-container-lowest rounded-2xl shadow-sm border border-outline-variant/30 overflow-hidden">
            <!-- Header -->
            <div class="p-4 flex items-center justify-between border-b border-outline-variant/30">
              <div class="flex items-center gap-3">
                <div class="w-10 h-10 rounded-full bg-surface-container-high flex items-center justify-center overflow-hidden">
                  <span class="text-sm font-bold text-primary">{{ job.company.charAt(0) }}</span>
                </div>
                <div class="flex flex-col">
                  <span class="text-sm font-semibold text-on-surface leading-none">{{ job.company }}</span>
                  <span class="text-xs text-on-surface-variant mt-1">{{ job.location }}</span>
                </div>
              </div>
              <span class="text-xs font-medium text-on-surface-variant">{{ job.time }}</span>
            </div>
            
            <!-- Graphic -->
            <div class="bg-surface-container h-48 flex items-center justify-center border-b border-outline-variant/30 relative overflow-hidden group">
               <!-- Abstract decorative background for the job graphic -->
               <div class="absolute inset-0 opacity-10 group-hover:opacity-20 transition-opacity bg-[radial-gradient(ellipse_at_center,_var(--tw-gradient-stops))] from-primary to-transparent"></div>
               <div class="relative z-10 text-center px-4">
                 <h4 class="text-2xl font-display font-bold text-primary">{{ job.title }}</h4>
                 <p class="text-sm font-semibold text-on-surface-variant mt-2">{{ job.wage }}</p>
               </div>
            </div>
            
            <!-- Actions -->
            <div class="p-4 flex items-center justify-between">
              <div class="flex gap-4 text-on-surface-variant">
                <HeartIcon class="w-6 h-6 hover:text-red-500 cursor-pointer transition-colors" />
                <PaperAirplaneIcon class="w-6 h-6 hover:text-primary cursor-pointer transition-colors" />
              </div>
              <BookmarkIcon class="w-6 h-6 text-on-surface-variant hover:text-primary cursor-pointer transition-colors" />
            </div>
            
            <!-- Details & CTA -->
            <div class="px-4 pb-4">
              <p class="text-sm text-on-surface mb-4 line-clamp-2">
                <span class="font-semibold">{{ job.company }}</span> is looking for a {{ job.title }}. {{ job.desc }}
              </p>
              <button class="w-full bg-primary hover:bg-primary-container text-white py-2.5 rounded-lg text-sm font-bold transition-colors shadow-sm hover:shadow">Apply Now</button>
            </div>
          </article>
          
          <!-- Get More Updates Callout -->
          <article class="bg-gradient-to-r from-primary to-primary-container rounded-2xl shadow-md p-8 text-center text-white mt-2">
            <h3 class="text-xl font-display font-bold mb-2">Get More Updates</h3>
            <p class="text-sm text-white/90 mb-6 max-w-sm mx-auto">Sign up to see 200+ other active roles tailored just for you!</p>
            <router-link to="/auth" class="bg-white text-primary px-6 py-2.5 rounded-lg text-sm font-bold transition-all hover:bg-surface shadow-sm inline-block hover:scale-105 transform">Create Your Free Account</router-link>
          </article>

          <!-- SME Testimonials (Aesthetic Push) -->
          <section class="bg-surface-container-lowest rounded-2xl shadow-sm border border-outline-variant/30 p-6 mt-4">
            <h3 class="text-lg font-bold text-on-surface mb-4">Upcoming SME Partner Spotlights</h3>
            <div class="grid grid-cols-1 sm:grid-cols-2 gap-4">
               <div class="bg-surface p-4 rounded-xl border border-outline-variant/30 flex flex-col gap-3 shadow-sm hover:shadow-md transition-shadow">
                 <div class="flex items-center gap-3">
                   <div class="w-10 h-10 rounded-full bg-surface-container-high flex items-center justify-center text-sm font-bold text-primary">R</div>
                   <div>
                     <p class="text-sm font-semibold text-on-surface">Rithy Sok</p>
                     <p class="text-xs text-on-surface-variant">Owner, Local Cafe</p>
                   </div>
                 </div>
                 <p class="text-xs italic text-on-surface-variant leading-relaxed">"FirstStep connected us with enthusiastic student baristas who fit perfectly into our weekend shifts."</p>
               </div>
               <div class="bg-surface p-4 rounded-xl border border-outline-variant/30 flex flex-col gap-3 shadow-sm hover:shadow-md transition-shadow">
                 <div class="flex items-center gap-3">
                   <div class="w-10 h-10 rounded-full bg-surface-container-high flex items-center justify-center text-sm font-bold text-primary">M</div>
                   <div>
                     <p class="text-sm font-semibold text-on-surface">Maly Chheng</p>
                     <p class="text-xs text-on-surface-variant">HR Manager, Tech Corp</p>
                   </div>
                 </div>
                 <p class="text-xs italic text-on-surface-variant leading-relaxed">"Finding reliable data entry and tech support talent has never been faster. Highly recommend the platform."</p>
               </div>
            </div>
          </section>

        </div>
      </div>
      
      <!-- Suggestions Column (Sticky on Desktop) -->
      <div class="w-full md:w-[35%] hidden md:block">
        <div class="sticky top-24 flex flex-col gap-6">
          
          <!-- User Mini Profile -->
          <div class="flex items-center justify-between bg-surface-container-lowest p-4 rounded-2xl border border-outline-variant/30 shadow-sm">
            <div class="flex items-center gap-3">
              <div class="w-12 h-12 rounded-full bg-surface-container-high flex items-center justify-center">
                 <svg class="w-6 h-6 text-on-surface-variant" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z"></path></svg>
              </div>
              <div class="flex flex-col">
                <span class="text-sm font-bold text-on-surface">Welcome, Student</span>
                <span class="text-[11px] text-on-surface-variant mt-0.5">Create an account to track applications</span>
              </div>
            </div>
            <router-link to="/auth" class="text-xs font-bold text-primary hover:text-primary-container transition-colors">Sign Up</router-link>
          </div>
          
          <!-- Trending SMEs -->
          <div class="bg-surface-container-lowest p-4 rounded-2xl border border-outline-variant/30 shadow-sm">
            <div class="flex items-center justify-between mb-4">
              <h3 class="text-sm font-bold text-on-surface-variant">Trending SMEs in Phnom Penh</h3>
              <button class="text-xs font-bold text-on-surface hover:text-primary transition-colors">See All</button>
            </div>
            <div class="flex flex-col gap-4">
              <div v-for="sme in trendingSmes" :key="sme.name" class="flex items-center justify-between group">
                <div class="flex items-center gap-3 cursor-pointer">
                  <div class="w-9 h-9 rounded-full bg-surface-container flex items-center justify-center text-xs font-bold text-primary group-hover:scale-105 transition-transform">{{ sme.name.charAt(0) }}</div>
                  <div class="flex flex-col">
                    <span class="text-sm font-semibold text-on-surface">{{ sme.name }}</span>
                    <span class="text-[11px] text-on-surface-variant mt-0.5">{{ sme.type }}</span>
                  </div>
                </div>
                <button class="text-xs font-bold text-primary hover:text-primary-container transition-colors">Follow</button>
              </div>
            </div>
          </div>
          
          <!-- Campus Role Gaps -->
          <div class="bg-surface-container-lowest p-4 rounded-2xl border border-outline-variant/30 shadow-sm">
            <div class="flex items-center justify-between mb-3">
              <h3 class="text-sm font-bold text-on-surface-variant">Campus Role Gaps</h3>
            </div>
            <div class="flex flex-col gap-2">
              <div class="flex items-center justify-between bg-surface p-2.5 rounded-xl border border-outline-variant/30 hover:border-primary/30 cursor-pointer transition-colors group" v-for="gap in roleGaps" :key="gap.role">
                <span class="text-xs font-semibold text-on-surface group-hover:text-primary transition-colors">{{ gap.role }}</span>
                <span class="text-[10px] bg-primary/10 text-primary px-2 py-0.5 rounded-full font-bold">High Demand</span>
              </div>
            </div>
          </div>
          
          <!-- Employer CTA -->
          <div class="bg-surface-container-lowest p-5 rounded-2xl border border-outline-variant/30 text-center shadow-sm">
            <h3 class="text-sm font-bold text-on-surface mb-2">Looking to Hire Local Talent?</h3>
            <p class="text-[11px] text-on-surface-variant mb-4 leading-relaxed">Post your open roles to reach thousands of active university students in Cambodia.</p>
            <button class="w-full bg-transparent border border-primary text-primary hover:bg-primary/5 py-2 rounded-lg text-sm font-bold transition-colors">Post a Job</button>
          </div>

          <!-- Mini Footer -->
          <div class="flex flex-col mt-2 px-2">
            <div class="flex flex-wrap gap-x-3 gap-y-1.5">
              <a href="#" class="text-[11px] text-on-surface-variant hover:text-on-surface transition-colors">About Us</a>
              <a href="#" class="text-[11px] text-on-surface-variant hover:text-on-surface transition-colors">Privacy Policy</a>
              <a href="#" class="text-[11px] text-on-surface-variant hover:text-on-surface transition-colors">Terms of Service</a>
              <a href="#" class="text-[11px] text-on-surface-variant hover:text-on-surface transition-colors">Contact Support</a>
            </div>
            <p class="text-[11px] text-on-surface-variant/80 mt-3">© 2024 FirstStep Editor, Empowering the next generation.</p>
          </div>

        </div>
      </div>
      
    </main>
  </div>
</template>

<script setup>
import { 
  MagnifyingGlassIcon, 
  BriefcaseIcon,
  AcademicCapIcon,
  BuildingStorefrontIcon,
  PaintBrushIcon,
  ComputerDesktopIcon,
  DocumentTextIcon,
  HeartIcon,
  ChatBubbleOvalLeftIcon,
  PaperAirplaneIcon,
  BookmarkIcon
} from '@heroicons/vue/24/outline'

const partners = [
  { name: 'Brown Coffee', status: 'Recently Active' },
  { name: 'Chip Mong', status: 'Featured SME' },
  { name: 'RUPP', status: 'University' },
  { name: 'Smart Axiata', status: 'Featured SME' },
  { name: 'Wing Bank', status: 'Recently Active' },
  { name: 'Pi Pay', status: 'Featured SME' },
  { name: 'Foodpanda', status: 'Recently Active' },
]

const categories = [
  { title: 'Academic Tutoring', desc: 'Peer teaching & mentoring', icon: AcademicCapIcon },
  { title: 'Retail', desc: 'Customer service & sales', icon: BuildingStorefrontIcon },
  { title: 'Hospitality', desc: 'Cafes, restaurants & events', icon: ChatBubbleOvalLeftIcon },
  { title: 'Creative', desc: 'Design, writing & media', icon: PaintBrushIcon },
  { title: 'Tech Support', desc: 'IT & software assistance', icon: ComputerDesktopIcon },
  { title: 'Admin', desc: 'Data entry & organization', icon: DocumentTextIcon },
]

const jobs = [
  { company: 'Brown Coffee', location: 'BKK1, Phnom Penh', time: '5h ago', title: 'Senior Barista & Shift Lead', wage: '$18.50/hr', desc: 'We are looking for an experienced barista to lead weekend shifts and train new junior staff in coffee preparation and customer service.' },
  { company: 'RUPP Writing Center', location: 'Toul Kork, Phnom Penh', time: '1d ago', title: 'Peer Writing Consultant', wage: '$15.00/hr', desc: 'Assist undergraduate students with essay structuring, grammar correction, and academic writing techniques during afternoon shifts.' },
  { company: 'Chip Mong Supermarket', location: 'Sen Sok, Phnom Penh', time: '2d ago', title: 'Logistics & Inventory Associate', wage: '$16.00/hr', desc: 'Manage stock room organization, track incoming deliveries, and assist with floor replenishment on a flexible schedule.' },
]

const trendingSmes = [
  { name: 'Smart Axiata', type: 'Telecommunications' },
  { name: 'Wing Bank', type: 'Financial Services' },
  { name: 'Koy Coffee', type: 'Food & Beverage' },
  { name: 'Nham24', type: 'Delivery Tech' },
]

const roleGaps = [
  { role: 'English-Khmer Translators' },
  { role: 'Data Entry Specialists' },
  { role: 'Social Media Management' },
]
</script>

<style scoped>
/* Hide scrollbar for Chrome, Safari and Opera */
.no-scrollbar::-webkit-scrollbar {
  display: none;
}
/* Hide scrollbar for IE, Edge and Firefox */
.no-scrollbar {
  -ms-overflow-style: none;  /* IE and Edge */
  scrollbar-width: none;  /* Firefox */
}
</style>
