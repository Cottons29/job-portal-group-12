<template>
  <div class="min-h-screen bg-[#18191b] text-on-surface lg:overflow-hidden">
    <div class="mx-auto flex min-h-screen max-w-[1440px] bg-surface">
      <PlaceholderSidebar
          :items="sidebarItems"
          :show-labels="showSidebarLabels"
          :applied-theme="appliedTheme"
          @toggle-labels="showSidebarLabels = !showSidebarLabels"
          @toggle-theme="toggleThemeMode"
      />

      <main class="flex-1 bg-surface px-4 pb-28 pt-5 sm:px-6 lg:h-screen lg:overflow-y-auto lg:px-8 lg:pb-10">
        <header class="stickyV -mx-4 mb-6 bg-surface/90 px-4 py-3 backdrop-blur-xl sm:-mx-6 sm:px-6 lg:-mx-8 lg:px-8">
          <div class="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
            <div>
              <p class="text-xs font-black uppercase tracking-[0.22em] text-primary">{{ pageContent.eyebrow }}</p>
              <h1 class="font-display text-3xl font-black tracking-[-0.04em] text-on-surface sm:text-4xl">
                {{ pageContent.title }}
              </h1>
              <p v-if="pageContent.description" class="mt-2 max-w-2xl text-sm font-semibold text-on-surface-variant">
                {{ pageContent.description }}
              </p>
            </div>
            <div v-if="activePage === 'home'" class="hidden flex-1 justify-end md:flex">
              <label
                  class="flex w-full max-w-sm items-center gap-3 rounded-full bg-surface-container-low px-5 py-3 text-sm font-bold text-on-surface-variant">
                <MagnifyingGlassIcon class="h-5 w-5 text-primary"/>
                <input
                    class="w-full bg-transparent outline-none placeholder:text-on-surface-variant/70"
                    placeholder="Search jobs, people, companies"
                />
              </label>
            </div>
          </div>
        </header>

        <div v-if="activePage === 'home'" class="grid gap-6 xl:grid-cols-[minmax(0,1fr)_22rem]">
          <section class="min-w-0 space-y-6">
            <StoryStrip :stories="stories"/>
            <ComposeCard :actions="composeActions"/>
            <p v-if="postsError" class="rounded-2xl bg-red-500/10 px-4 py-3 text-xs font-bold text-red-300">
              {{ postsError }}
            </p>
            <p v-else-if="postsLoading"
               class="rounded-2xl bg-surface-container-low px-4 py-3 text-sm font-bold text-on-surface-variant">
              Loading posts...
            </p>
            <p v-else-if="!posts.length"
               class="rounded-2xl bg-surface-container-low px-4 py-3 text-sm font-bold text-on-surface-variant">
              No posts yet. Create the first post to share it with your network.
            </p>
            <PostCard v-for="post in posts" :key="post.id" :post="post"/>
          </section>

          <aside class="space-y-6 xl:sticky xl:top-28 xl:h-fit">
            <FocusPanel :cards="focusCards"/>
            <SuggestionsPanel :suggestions="suggestions"/>
          </aside>
        </div>

        <div v-else-if="activePage === 'settings'"
             class="grid gap-4 xl:grid-cols-[15rem_minmax(0,0.78fr)] xl:justify-start ">
          <aside class="space-y-2 xl:sticky xl:top-28 xl:h-fit">
            <button
                v-for="item in settingsMenuItems"
                :key="item.label"
                :class="[
                    item.active ? 'bg-surface-container-high text-on-surface' : 'text-on-surface-variant hover:bg-surface-container-low',
                    'flex w-full items-center gap-3 rounded-full px-3 py-2.5 text-left text-sm font-black transition'
                ]"
                type="button"
                @click="activeSettingsSection = item.section"
            >
              <span :class="[item.bg, 'grid h-9 w-9 shrink-0 place-items-center rounded-xl']">
                <component :is="item.icon" :class="[item.color, 'h-4 w-4']"/>
              </span>
              <span class="leading-tight">{{ item.label }}</span>
            </button>
          </aside>

          <section v-if="activeSettingsSection === 'personal'" class="mx-auto min-w-39/40 max-w-2xl">
            <h2 class="mb-4 text-center font-display text-xl font-black tracking-[-0.04em] text-on-surface sm:text-2xl">
              Personal info
            </h2>

            <p v-if="profileLoadError" class="mb-3 rounded-2xl bg-red-500/10 px-4 py-3 text-xs font-bold text-red-300">
              {{ profileLoadError }}
            </p>

            <div class="overflow-hidden rounded-[1.25rem] bg-surface-container-low ring-1 ring-white/5">
              <article
                  v-for="(row, index) in personalInfoRows"
                  :key="row.label"
                  :class="[
                      index === 0 ? 'rounded-t-[1.25rem]' : '',
                      index === personalInfoRows.length - 1 ? 'rounded-b-[1.25rem]' : '',
                      'flex cursor-pointer items-center gap-3 border-b border-surface last:border-b-0 bg-surface-container-low px-3 py-3 transition hover:bg-surface-container-high sm:px-4'
                  ]"
                  role="button"
                  tabindex="0"
                  @click="openPersonalInfoEditor(row)"
                  @keydown.enter.prevent="openPersonalInfoEditor(row)"
                  @keydown.space.prevent="openPersonalInfoEditor(row)"
              >
                <component :is="row.icon" class="h-4 w-4 shrink-0 text-on-surface-variant"/>
                <div class="min-w-0 flex-1">
                  <h3 class="text-base font-black tracking-[-0.03em] text-on-surface">{{ row.label }}</h3>
                  <p
                      v-for="value in row.values"
                      :key="value"
                      class="mt-0.5 truncate text-xs font-bold text-on-surface-variant"
                  >
                    {{ value }}
                  </p>
                </div>
                <img
                    v-if="row.avatar"
                    :alt="row.label"
                    class="h-10 w-10 rounded-full object-cover ring-2 ring-surface-container-low"
                    :src="row.avatar"
                />
                <span class="text-lg font-black text-on-surface-variant/70">›</span>
              </article>
            </div>
          </section>

          <section v-else-if="activeSettingsSection === 'security'" class="mx-auto min-w-39/40 max-w-2xl">
            <h2 class="mb-4 text-center font-display text-xl font-black tracking-[-0.04em] text-on-surface sm:text-2xl">
              Security & sign-in
            </h2>

            <div class="overflow-hidden rounded-[1.25rem] bg-surface-container-low ring-1 ring-white/5">
              <article
                  v-for="(row, index) in securityRows"
                  :key="row.label"
                  :class="[
                      index === 0 ? 'rounded-t-[1.25rem]' : '',
                      index === securityRows.length - 1 ? 'rounded-b-[1.25rem]' : '',
                      'flex cursor-pointer items-center gap-3 border-b border-surface last:border-b-0 bg-surface-container-low px-3 py-3 transition hover:bg-surface-container-high sm:px-4'
                  ]"
                  role="button"
                  tabindex="0"
                  @click="row.action"
                  @keydown.enter.prevent="row.action"
                  @keydown.space.prevent="row.action"
              >
                <component :is="row.icon" class="h-4 w-4 shrink-0 text-on-surface-variant"/>
                <div class="min-w-0 flex-1">
                  <h3 class="text-base font-black tracking-[-0.03em] text-on-surface">{{ row.label }}</h3>
                  <p
                      v-for="value in row.values"
                      :key="value"
                      class="mt-0.5 truncate text-xs font-bold text-on-surface-variant"
                  >
                    {{ value }}
                  </p>
                </div>
                <button
                    v-if="row.buttonLabel"
                    class="rounded-full bg-primary px-4 py-2 text-xs font-black text-on-primary transition hover:opacity-90 disabled:opacity-60"
                    :disabled="passkeyLoading"
                    type="button"
                    @click.stop="row.action"
                >
                  {{ row.buttonLabel }}
                </button>
                <span v-else class="text-lg font-black text-on-surface-variant/70">›</span>
              </article>
            </div>

            <div class="mt-3 space-y-2">
              <p v-if="passkeyMessage" class="rounded-2xl bg-[#8fd99b]/10 px-4 py-3 text-xs font-bold text-[#8fd99b]">
                {{ passkeyMessage }}</p>
              <p v-if="passkeyError" class="rounded-2xl bg-red-500/10 px-4 py-3 text-xs font-bold text-red-300">
                {{ passkeyError }}</p>
              <p v-if="passwordError" class="rounded-2xl bg-red-500/10 px-4 py-3 text-xs font-bold text-red-300">
                {{ passwordError }}</p>
              <p v-if="passwordMessage" class="rounded-2xl bg-[#8fd99b]/10 px-4 py-3 text-xs font-bold text-[#8fd99b]">
                {{ passwordMessage }}</p>
            </div>
          </section>

          <section v-else-if="activeSettingsSection === 'privacy'" class="mx-auto min-w-39/40 max-w-2xl">
            <h2 class="mb-4 text-center font-display text-xl font-black tracking-[-0.04em] text-on-surface sm:text-2xl">
              Data & privacy
            </h2>
            <div
                class="rounded-[1.25rem] bg-surface-container-low p-5 text-sm font-bold text-on-surface-variant ring-1 ring-white/5">
              Manage privacy and account data controls here when they are connected.
            </div>
          </section>

          <section v-else-if="activeSettingsSection === 'logout'" class="mx-auto min-w-39/40 max-w-2xl">
            <h2 class="mb-4 text-center font-display text-xl font-black tracking-[-0.04em] text-on-surface sm:text-2xl">
              Logout
            </h2>
            <div class="rounded-[1.25rem] bg-surface-container-low p-5 text-center ring-1 ring-white/5">
              <span class="mx-auto grid h-14 w-14 place-items-center rounded-2xl bg-red-500/15">
                <ArrowRightOnRectangleIcon class="h-7 w-7 text-red-300"/>
              </span>
              <h3 class="mt-4 font-display text-2xl font-black tracking-[-0.04em] text-on-surface">Ready to leave?</h3>
              <p class="mx-auto mt-2 max-w-sm text-sm font-bold text-on-surface-variant">
                Logout will end your current session and return you to the authentication page.
              </p>
              <p v-if="logoutError" class="mt-4 rounded-2xl bg-red-500/10 px-4 py-3 text-xs font-bold text-red-300">
                {{ logoutError }}</p>
              <button
                  class="mt-5 rounded-full bg-red-500 px-6 py-3 text-sm font-black text-white transition hover:bg-red-400 disabled:cursor-not-allowed disabled:opacity-60"
                  :disabled="auth.isLoading"
                  type="button"
                  @click="handleLogout"
              >
                {{ auth.isLoading ? 'Logging out...' : 'Logout' }}
              </button>
            </div>
          </section>
        </div>

        <section v-else-if="activePage === 'profile'" class="mx-auto w-full max-w-5xl space-y-4">
          <article class="overflow-hidden rounded-[1.5rem] bg-surface-container-low shadow-sm ring-1 ring-white/5">
            <div
                class="h-24 bg-[radial-gradient(circle_at_20%_20%,var(--fs-primary-container),transparent_32%),linear-gradient(135deg,var(--fs-surface-container-high),var(--fs-surface-container-low))] sm:h-32"></div>

            <div class="px-4 pb-5 sm:px-6 sm:pb-6">
              <div class="grid gap-4 lg:grid-cols-[12rem_minmax(0,1fr)]">
                <div class="flex justify-center lg:justify-start">
                  <div
                      class="-mt-14 grid h-28 w-28 place-items-center overflow-hidden rounded-full bg-surface p-1 shadow-xl ring-4 ring-surface-container-low sm:h-36 sm:w-36">
                    <img
                        v-if="profileForm.avatar"
                        :src="profileForm.avatar"
                        :alt="`${profileForm.name} profile photo`"
                        class="h-full w-full rounded-full object-cover"
                    />
                    <span v-else
                          class="grid h-full w-full place-items-center rounded-full bg-primary text-3xl font-black text-on-primary">
                      {{ initials }}
                    </span>
                  </div>
                </div>

                <div class="pt-2 sm:pt-4">
                  <div class="flex flex-col gap-3 sm:flex-row sm:items-start sm:justify-between">
                    <div>
                      <div class="flex flex-wrap items-center gap-2">
                        <h2 class="font-display text-2xl font-black tracking-[-0.05em] text-on-surface sm:text-3xl">
                          {{ profileHandle }}
                        </h2>
                        <span
                            class="grid h-6 w-6 place-items-center rounded-full bg-primary text-[0.625rem] font-black text-on-primary">✓</span>
                        <button
                            class="grid h-8 w-8 place-items-center rounded-full text-lg font-black text-on-surface-variant transition hover:bg-surface-container-high"
                            type="button">
                          ···
                        </button>
                      </div>
                      <p class="mt-1 text-base font-black text-on-surface">{{ profileForm.name }}</p>
                    </div>

                    <RouterLink
                        class="inline-flex items-center justify-center rounded-full bg-primary px-4 py-2 text-xs font-black text-on-primary transition hover:opacity-90"
                        to="/settings"
                    >
                      Edit profile
                    </RouterLink>
                  </div>

                  <dl class="mt-4 grid grid-cols-3 gap-2 text-center sm:max-w-lg sm:text-left">
                    <div v-for="stat in profileStats" :key="stat.label" class="rounded-2xl bg-surface px-3 py-2">
                      <dt class="font-display text-lg font-black tracking-[-0.04em] text-on-surface">{{
                          stat.value
                        }}
                      </dt>
                      <dd class="text-[0.625rem] font-black uppercase tracking-[0.12em] text-on-surface-variant">
                        {{ stat.label }}
                      </dd>
                    </div>
                  </dl>

                  <div class="mt-4 max-w-2xl space-y-1.5 text-xs font-bold leading-5 text-on-surface sm:text-sm">
                    <p class="text-on-surface-variant">{{ profileCategory }}</p>
                    <p>{{ profileBio }}</p>
                    <p class="text-on-surface-variant">{{ profileEducation }}</p>
                    <p v-if="profileForm.jobType" class="text-on-surface-variant">Looking for {{
                        profileForm.jobType
                      }}</p>
                    <a class="inline-flex items-center gap-2 font-black text-primary"
                       href="https://firststep.example/profile" rel="noopener noreferrer" target="_blank">
                      🔗 firststep.example/{{ profileHandle }}
                    </a>
                  </div>

                  <div class="mt-4 flex items-center gap-2">
                    <div class="flex -space-x-2">
                      <img
                          v-for="avatar in followedByAvatars"
                          :key="avatar"
                          :src="avatar"
                          alt="Connection avatar"
                          class="h-8 w-8 rounded-full border-2 border-surface-container-low object-cover"
                      />
                    </div>
                    <p class="text-xs font-black text-on-surface sm:text-sm">
                      Followed by campus recruiters, mentors + classmates
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </article>

          <nav class="flex gap-1 rounded-[1.75rem]  p-2  sm:inline-flex">
            <button
                v-for="tab in profileTabs"
                :key="tab.label"
                :class="[
                    tab.active ? 'bg-secondary text-on-primary shadow-sm' : 'bg-secondary/25 text-on-secondary-container hover:bg-secondary/35',
                    'flex flex-1 items-center justify-center gap-1.5 rounded-[1.25rem] px-3 py-3 text-xs font-black transition sm:flex-none sm:px-8 sm:text-sm'
                ]"
                type="button"
            >
              <span v-if="tab.active" aria-hidden="true" class="text-base leading-none">✓</span>
              <span>{{ tab.label }}</span>
            </button>
          </nav>

          <section class="grid gap-2 sm:grid-cols-2 lg:grid-cols-3">
            <article
                v-for="item in profileGallery"
                :key="item.post?.id || item.title"
                class="group relative aspect-square overflow-hidden rounded-[1.25rem] bg-surface-container-low ring-1 ring-white/5 transition hover:ring-primary/40 focus:outline-none focus:ring-2 focus:ring-primary"
                role="button"
                tabindex="0"
                @click="openProfilePost(item.post)"
                @keydown.enter.prevent="openProfilePost(item.post)"
                @keydown.space.prevent="openProfilePost(item.post)"
            >
              <img
                  v-if="item.image"
                  :src="item.image"
                  :alt="item.title"
                  class="h-full w-full object-cover transition duration-150 group-hover:scale-101"
              />
              <div v-else class="grid h-full w-full place-items-center p-5 text-center">
                <h3 class="font-display text-xl font-black tracking-[-0.04em] text-on-surface">{{ item.title }}</h3>
              </div>
            </article>
          </section>
        </section>

        <section v-else-if="activePage === 'create'" class="grid gap-6 xl:grid-cols-[minmax(0,1fr)_24rem]">
          <form class="space-y-5 rounded-[2rem] bg-surface-container-low p-5 shadow-sm ring-1 ring-white/5 sm:p-6"
                @submit.prevent="submitPost">
            <div class="flex flex-wrap items-center justify-between gap-3">
              <div>
                <p class="text-xs font-black uppercase tracking-[0.18em] text-primary">New post</p>
                <h2 class="mt-1 font-display text-2xl font-black tracking-[-0.04em] text-on-surface">Share with your
                  network</h2>
              </div>
              <button
                  class="rounded-full bg-primary px-5 py-3 text-sm font-black text-on-primary transition hover:opacity-90 disabled:cursor-not-allowed disabled:opacity-60"
                  :disabled="isPosting || !canSubmitPost"
                  type="submit"
              >
                {{ isPosting ? 'Publishing...' : 'Publish post' }}
              </button>
            </div>

            <label class="block space-y-2">
              <span class="text-sm font-black text-on-surface">Title</span>
              <input
                  v-model="postForm.title"
                  class="w-full rounded-2xl bg-surface px-4 py-3 text-sm font-bold text-on-surface outline-none ring-1 ring-outline/30 transition placeholder:text-on-surface-variant/70 focus:ring-2 focus:ring-primary"
                  maxlength="100"
                  placeholder="What do you want to share?"
                  type="text"
              />
            </label>

            <label class="block space-y-2">
              <span class="flex flex-wrap items-center justify-between gap-3">
                <span class="text-sm font-black text-on-surface">Markdown content</span>
                <label
                    class="inline-flex cursor-pointer items-center rounded-full bg-surface-container-high px-4 py-2 text-xs font-black text-on-surface transition hover:bg-surface-container-highest">
                  {{ isUploadingMarkdownImage ? 'Uploading images...' : 'Upload markdown images' }}
                  <input
                      class="sr-only"
                      accept="image/*"
                      type="file"
                      multiple
                      :disabled="isUploadingMarkdownImage || isPosting"
                      @change="handleMarkdownImageUpload"
                  />
                </label>
              </span>
              <textarea
                  v-model="postForm.content"
                  class="min-h-72 w-full resize-y rounded-[1.25rem] bg-surface px-4 py-3 text-sm font-bold leading-6 text-on-surface outline-none ring-1 ring-outline/30 transition placeholder:text-on-surface-variant/70 focus:ring-2 focus:ring-primary"
                  placeholder="Write with markdown: **bold**, _italic_, # headings, lists, links, and uploaded images."
              />
            </label>

            <div class="rounded-[1.25rem] border border-dashed border-outline/40 bg-surface/60 p-4">
              <label
                  class="flex cursor-pointer flex-col items-center justify-center gap-3 text-center sm:flex-row sm:text-left">
                <span class="grid h-12 w-12 shrink-0 place-items-center rounded-2xl bg-[#f8a9dc]">
                  <CameraIcon class="h-6 w-6 text-[#9b1f70]"/>
                </span>
                <span class="min-w-0 flex-1">
                  <span class="block text-sm font-black text-on-surface">Add a photo</span>
                  <span class="block text-xs font-bold text-on-surface-variant">Choose a JPG, PNG, GIF, or WebP image to include with your post.</span>
                </span>
                <span
                    class="rounded-full bg-surface-container-high px-4 py-2 text-xs font-black text-on-surface">Browse</span>
                <input class="sr-only" accept="image/*" type="file" @change="handlePostPhotoChange"/>
              </label>
              <div v-if="postPhotoPreview" class="mt-4 overflow-hidden rounded-[1.25rem] bg-surface">
                <img :src="postPhotoPreview" :alt="postPhotoName || 'Selected post photo'"
                     class="max-h-80 w-full object-cover"/>
                <div class="flex items-center justify-between gap-3 px-4 py-3">
                  <p class="truncate text-xs font-bold text-on-surface-variant">{{ postPhotoName }}</p>
                  <button class="text-xs font-black text-primary" type="button" @click="removePostPhoto">Remove</button>
                </div>
              </div>
            </div>

            <p v-if="postError" class="rounded-2xl bg-red-500/10 px-4 py-3 text-xs font-bold text-red-300">{{
                postError
              }}</p>
            <p v-if="postMessage" class="rounded-2xl bg-[#8fd99b]/10 px-4 py-3 text-xs font-bold text-[#8fd99b]">
              {{ postMessage }}</p>
          </form>

          <aside class="space-y-5 xl:sticky xl:top-28 xl:h-fit">
            <article class="rounded-[2rem] bg-surface-container-low p-5 shadow-sm ring-1 ring-white/5">
              <p class="text-xs font-black uppercase tracking-[0.18em] text-primary">Preview</p>
              <h2 class="mt-3 font-display text-2xl font-black tracking-[-0.04em] text-on-surface">
                {{ postForm.title || 'Your post title' }}</h2>
              <img v-if="postPhotoPreview" :src="postPhotoPreview" :alt="postPhotoName || 'Post photo preview'"
                   class="mt-4 max-h-64 w-full rounded-[1.25rem] object-cover"/>
              <div
                  class="mt-4 space-y-3 text-sm font-semibold leading-6 text-on-surface-variant [&_a]:font-black [&_a]:text-primary [&_a]:underline [&_h1]:font-display [&_h1]:text-2xl [&_h1]:font-black [&_h1]:text-on-surface [&_h2]:font-display [&_h2]:text-xl [&_h2]:font-black [&_h2]:text-on-surface [&_h3]:text-lg [&_h3]:font-black [&_h3]:text-on-surface [&_img]:max-h-72 [&_img]:w-full [&_img]:rounded-[1.25rem] [&_img]:object-cover [&_ol]:list-decimal [&_ol]:pl-5 [&_strong]:font-black [&_strong]:text-on-surface [&_ul]:list-disc [&_ul]:pl-5"
                  v-html="postPreviewHtml"
              ></div>
            </article>

            <article class="rounded-[2rem] bg-surface-container-low p-5 shadow-sm ring-1 ring-white/5">
              <h3 class="font-display text-xl font-black tracking-[-0.04em] text-on-surface">Markdown tips</h3>
              <ul class="mt-3 space-y-2 text-sm font-bold text-on-surface-variant">
                <li><span class="text-primary">#</span> Heading</li>
                <li><span class="text-primary">**bold**</span> and <span class="text-primary">_italic_</span></li>
                <li><span class="text-primary">-</span> Bullet list item</li>
                <li><span class="text-primary">[label](https://example.com)</span> Link</li>
              </ul>
            </article>
          </aside>
        </section>

        <section v-else class="grid gap-4 md:grid-cols-2 xl:grid-cols-3">
          <article
              v-for="card in pageContent.cards"
              :key="card.title"
              class="rounded-[2rem] bg-surface-container-low p-6 shadow-sm ring-1 ring-white/5"
          >
            <span :class="[card.bg, 'grid h-12 w-12 place-items-center rounded-2xl']">
              <component :is="card.icon" :class="[card.color, 'h-6 w-6']"/>
            </span>
            <h2 class="mt-5 font-display text-2xl font-black tracking-[-0.04em] text-on-surface">{{ card.title }}</h2>
            <p class="mt-2 text-sm font-semibold leading-6 text-on-surface-variant">{{ card.description }}</p>
          </article>
        </section>

        <Teleport to="body">
          <div
              v-if="editingField"
              class="fixed inset-0 z-50 grid place-items-center bg-black/60 px-4 py-6 backdrop-blur-sm"
              @click.self="closePersonalInfoEditor"
          >
            <form
                class="w-full max-w-md rounded-[1.5rem] bg-surface-container-low p-5 shadow-2xl ring-1 ring-white/10"
                @submit.prevent="savePersonalInfoEdit"
            >
              <div class="mb-5 flex items-start justify-between gap-4">
                <div>
                  <p class="text-xs font-black uppercase tracking-[0.18em] text-primary">Edit personal info</p>
                  <h2 class="mt-1 font-display text-2xl font-black tracking-[-0.04em] text-on-surface">
                    {{ editingField.label }}
                  </h2>
                </div>
                <button
                    class="grid h-9 w-9 place-items-center rounded-full bg-surface text-xl font-black text-on-surface-variant transition hover:text-on-surface"
                    type="button"
                    @click="closePersonalInfoEditor"
                >
                  ×
                </button>
              </div>

              <label class="space-y-2">
                <span class="text-sm font-black text-on-surface  ">Enter your {{ editingField.label }}</span>
                <input
                    v-model="editValue"
                    :placeholder="editingField.placeholder"
                    :type="editingField.inputType"
                    class="w-full mt-4 rounded-2xl bg-surface px-4 py-3 text-sm font-bold text-on-surface outline-none ring-1 ring-outline/30 transition placeholder:text-on-surface-variant/70 focus:ring-2 focus:ring-primary"
                />
              </label>

              <p v-if="profileSaveError" class="mt-3 text-xs font-bold text-red-300">{{ profileSaveError }}</p>

              <div class="mt-6 flex justify-end gap-3">
                <button
                    class="rounded-full px-5 py-3 text-sm font-black text-on-surface-variant transition hover:bg-surface"
                    type="button"
                    @click="closePersonalInfoEditor"
                >
                  Cancel
                </button>
                <button
                    class="rounded-full bg-primary px-5 py-3 text-sm font-black text-on-primary transition hover:opacity-90 disabled:cursor-not-allowed disabled:opacity-60"
                    :disabled="isSavingProfile"
                    type="submit"
                >
                  {{ isSavingProfile ? 'Saving...' : 'Save' }}
                </button>
              </div>
            </form>
          </div>
        </Teleport>

        <Teleport to="body">
          <div
              v-if="isPasswordEditorOpen"
              class="fixed inset-0 z-50 grid place-items-center bg-black/60 px-4 py-6 backdrop-blur-sm"
              @click.self="closePasswordEditor"
          >
            <form
                class="w-full max-w-md rounded-[1.5rem] bg-surface-container-low p-5 shadow-2xl ring-1 ring-white/10"
                @submit.prevent="updatePassword"
            >
              <div class="mb-5 flex items-start justify-between gap-4">
                <div>
                  <p class="text-xs font-black uppercase tracking-[0.18em] text-primary">Edit security</p>
                  <h2 class="mt-1 font-display text-2xl font-black tracking-[-0.04em] text-on-surface">
                    Password
                  </h2>
                </div>
                <button
                    class="grid h-9 w-9 place-items-center rounded-full bg-surface text-xl font-black text-on-surface-variant transition hover:text-on-surface"
                    type="button"
                    @click="closePasswordEditor"
                >
                  ×
                </button>
              </div>

              <div class="space-y-4">
                <label class="space-y-2">
                  <span class="text-sm font-black text-on-surface">Current password</span>
                  <input
                      v-model="passwordForm.current"
                      class="mt-3 mb-3 w-full mt-4 rounded-2xl bg-surface px-4 py-3 text-sm font-bold text-on-surface outline-none ring-1 ring-outline/30 transition placeholder:text-on-surface-variant/70 focus:ring-2 focus:ring-primary"
                      placeholder="Enter current password"
                      type="password"
                  />
                </label>

                <label class="space-y-2">
                  <span class="text-sm font-black text-on-surface">New password</span>
                  <input
                      v-model="passwordForm.next"
                      class="mt-3 mb-3 w-full rounded-2xl bg-surface px-4 py-3 text-sm font-bold text-on-surface outline-none ring-1 ring-outline/30 transition placeholder:text-on-surface-variant/70 focus:ring-2 focus:ring-primary"
                      placeholder="Create new password"
                      type="password"
                  />
                </label>

                <label class="space-y-2">
                  <span class="mt-3 mb-3 text-sm font-black text-on-surface">Confirm password</span>
                  <input
                      v-model="passwordForm.confirm"
                      class="w-full mt-4 rounded-2xl bg-surface px-4 py-3 text-sm font-bold text-on-surface outline-none ring-1 ring-outline/30 transition placeholder:text-on-surface-variant/70 focus:ring-2 focus:ring-primary"
                      placeholder="Repeat new password"
                      type="password"
                  />
                </label>
              </div>

              <p v-if="passwordError" class="mt-3 text-xs font-bold text-red-300">{{ passwordError }}</p>
              <p class="mt-3 text-xs font-bold text-on-surface-variant">
                Minimum 8 characters with a mix of letters, numbers, and symbols is recommended.
              </p>

              <div class="mt-6 flex justify-end gap-3">
                <button
                    class="rounded-full px-5 py-3 text-sm font-black text-on-surface-variant transition hover:bg-surface"
                    type="button"
                    @click="closePasswordEditor"
                >
                  Cancel
                </button>
                <button
                    class="rounded-full bg-primary px-5 py-3 text-sm font-black text-on-primary transition hover:opacity-90 disabled:cursor-not-allowed disabled:opacity-60"
                    :disabled="passwordLoading"
                    type="submit"
                >
                  {{ passwordLoading ? 'Updating...' : 'Save' }}
                </button>
              </div>
            </form>
          </div>
        </Teleport>

        <Teleport to="body">
          <div
              v-if="selectedProfilePost"
              class="fixed inset-0 z-50 overflow-y-auto bg-black/65 px-4 py-6 backdrop-blur-sm sm:py-10"
              @click.self="closeProfilePost"
          >
            <div class="mx-auto w-full max-w-3xl">
              <div class="mb-3 flex justify-end">
                <button
                    class="grid h-10 w-10 place-items-center rounded-full bg-surface-container-low text-2xl font-black text-on-surface-variant shadow-xl ring-1 ring-white/10 transition hover:text-on-surface"
                    type="button"
                    aria-label="Close post"
                    @click="closeProfilePost"
                >
                  ×
                </button>
              </div>
              <PostCard :post="selectedProfilePost"/>
            </div>
          </div>
        </Teleport>
      </main>
    </div>
  </div>
</template>

<script setup>
import {computed, onMounted, reactive, ref} from 'vue'
import {RouterLink, useRoute, useRouter} from 'vue-router'
import {isAxiosError} from 'axios'
import {marked} from 'marked'
import {startRegistration} from '@simplewebauthn/browser'

import api from '@/lib/api'
import ComposeCard from '@/components/placeholder/ComposeCard.vue'
import FocusPanel from '@/components/placeholder/FocusPanel.vue'
import PlaceholderSidebar from '@/components/placeholder/PlaceholderSidebar.vue'
import PostCard from '@/components/placeholder/PostCard.vue'
import StoryStrip from '@/components/placeholder/StoryStrip.vue'
import SuggestionsPanel from '@/components/placeholder/SuggestionsPanel.vue'
import {useThemeMode} from '@/composables/useThemeMode'
import {useAuthStore} from '@/stores/auth'
import {
  ArrowRightOnRectangleIcon,
  BellIcon,
  BriefcaseIcon,
  BuildingStorefrontIcon,
  CameraIcon,
  ChatBubbleOvalLeftEllipsisIcon,
  CreditCardIcon,
  EnvelopeIcon,
  HomeIcon,
  IdentificationIcon,
  KeyIcon,
  LockClosedIcon,
  MagnifyingGlassIcon,
  PhoneIcon,
  PlusCircleIcon,
  ShieldCheckIcon,
  SquaresPlusIcon,
  UserGroupIcon,
  UserCircleIcon,
  UserIcon,
} from '@heroicons/vue/24/outline'

const route = useRoute()
const router = useRouter()
const auth = useAuthStore()
const showSidebarLabels = ref(false)
const {appliedTheme, setThemePreference} = useThemeMode()

const activePage = computed(() => route.name?.toString() || 'home')

const defaultAvatar = 'https://images.unsplash.com/photo-1574158622682-e40e69881006?auto=format&fit=crop&w=160&q=80'

const profileForm = reactive({
  name: 'Student User',
  user_name: '',
  email: 'student@example.com',
  gender: '',
  phone: '',
  avatar: defaultAvatar,
  university: '',
  major: '',
  yearLevel: '',
  bio: '',
  jobType: '',
  expectedSalary: '',
  currency: 'USD',
  skills: [],
  availability: null,
})

const profileLoadError = ref('')
const profileSaveError = ref('')
const isSavingProfile = ref(false)
const editingField = ref(null)
const editValue = ref('')
const activeSettingsSection = ref('personal')

const passwordForm = reactive({
  current: '',
  next: '',
  confirm: '',
})
const passkeys = ref([])
const passkeyLoading = ref(false)
const passkeyMessage = ref('')
const passkeyError = ref('')
const passwordLoading = ref(false)
const passwordMessage = ref('')
const passwordError = ref('')
const isPasswordEditorOpen = ref(false)
const logoutError = ref('')

const postForm = reactive({
  title: '',
  content: '',
})
const postPhotoFile = ref(null)
const postPhotoPreview = ref('')
const postPhotoName = ref('')
const postMessage = ref('')
const postError = ref('')
const isPosting = ref(false)
const isUploadingMarkdownImage = ref(false)
const posts = ref([])
const postsLoading = ref(false)
const postsError = ref('')
const selectedProfilePost = ref(null)

const canSubmitPost = computed(() => postForm.title.trim() && postForm.content.trim())
const postPreviewHtml = computed(() => renderMarkdown(postForm.content || 'Start writing your post to see the preview here.'))

const initials = computed(() => {
  const letters = profileForm.name
      .split(' ')
      .filter(Boolean)
      .map((part) => part[0])
      .join('')
      .slice(0, 2)
      .toUpperCase()

  return letters || 'SU'
})

const profileHandle = computed(() => {
  const fallback = profileForm.name
      .toLowerCase()
      .replace(/[^a-z0-9]+/g, '.')
      .replace(/^\.|\.$/g, '')

  return profileForm.user_name || fallback || 'student.user'
})

const profileCategory = computed(() => profileForm.major || profileForm.jobType || 'Student profile')
const profileEducation = computed(() => {
  const details = [profileForm.university, profileForm.yearLevel].filter(Boolean)
  return details.length ? details.join(' • ') : 'Add your university and year level in settings.'
})
const profileBio = computed(() => profileForm.bio || 'Showcase your skills, availability, and career goals for employers on FirstStep.')

const profileStats = computed(() => [
  {label: 'posts', value: posts.value.length || 6},
  {label: 'followers', value: '1.2K'},
  {label: 'following', value: profileForm.skills.length || 9},
])

const followedByAvatars = [
  'https://images.unsplash.com/photo-1494790108377-be9c29b29330?auto=format&fit=crop&w=96&q=80',
  'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?auto=format&fit=crop&w=96&q=80',
  'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?auto=format&fit=crop&w=96&q=80',
]

const profileTabs = computed(() => [
  {label: 'Posts', icon: SquaresPlusIcon, active: true},
  {label: 'Media', icon: CameraIcon, active: false},
  {label: 'Reposts', icon: ArrowRightOnRectangleIcon, active: false},
  {label: 'Tagged', icon: UserCircleIcon, active: false},
])

function getFirstContentImage(value = '') {
  const markdownImage = value.match(/!\[[^\]]*]\(([^\s)]+)(?:\s+"[^"]*")?\)/)
  if (markdownImage?.[1]) return markdownImage[1]

  const htmlImage = value.match(/<img[^>]+src=["']([^"']+)["'][^>]*>/i)
  if (htmlImage?.[1]) return htmlImage[1]

  const imageUrl = value.match(/https?:\/\/\S+?\.(?:png|jpe?g|gif|webp|avif)(?:\?\S*)?/i)
  return imageUrl?.[0] || ''
}

const profileGallery = computed(() => posts.value.map((post) => ({
  title: post.title || 'Untitled post',
  type: 'Post',
  image: post.imageUrl || getFirstContentImage(post.desc),
  post,
})))

function openProfilePost(post) {
  if (!post) return
  selectedProfilePost.value = post
}

function closeProfilePost() {
  selectedProfilePost.value = null
}

const settingsMenuItems = computed(() => [
  {
    label: 'Personal info',
    section: 'personal',
    icon: IdentificationIcon,
    bg: 'bg-[#8fd99b]',
    color: 'text-[#1f6c3b]',
    active: activeSettingsSection.value === 'personal'
  },
  {
    label: 'Security & sign-in',
    section: 'security',
    icon: LockClosedIcon,
    bg: 'bg-[#8ccaff]',
    color: 'text-[#235d84]',
    active: activeSettingsSection.value === 'security'
  },
  {
    label: 'Data & privacy',
    section: 'privacy',
    icon: ShieldCheckIcon,
    bg: 'bg-[#d7b7ff]',
    color: 'text-[#5b36a8]',
    active: activeSettingsSection.value === 'privacy'
  },
  {
    label: 'Logout',
    section: 'logout',
    icon: ArrowRightOnRectangleIcon,
    bg: 'bg-red-500/15',
    color: 'text-red-300',
    active: activeSettingsSection.value === 'logout'
  },
  // {label: 'People & sharing', icon: UserGroupIcon, bg: 'bg-[#f8a9dc]', color: 'text-[#9b1f70]', to: '/settings'},
  // {label: 'Wallet & subscriptions', icon: CreditCardIcon, bg: 'bg-[#ffc28e]', color: 'text-[#83460e]', to: '/settings'},
])

const securityRows = computed(() => [
  {
    label: 'Passkey login',
    values: [
      passkeys.value.length
          ? `${passkeys.value.length} passkey${passkeys.value.length === 1 ? '' : 's'} added`
          : 'Sign in with Face ID, Touch ID, Windows Hello, or your device screen lock.',
    ],
    icon: KeyIcon,
    buttonLabel: passkeyLoading.value ? 'Adding...' : 'Add passkey',
    action: addPasskey,
  },
  {
    label: 'Password',
    values: [passwordMessage.value || 'Minimum 8 characters with a mix of letters, numbers, and symbols is recommended.'],
    icon: LockClosedIcon,
    action: openPasswordEditor,
  },
])

const personalInfoRows = computed(() => [
  {
    label: 'Profile picture',
    field: 'avatar',
    values: [],
    icon: CameraIcon,
    avatar: profileForm.avatar || defaultAvatar,
    placeholder: 'Paste profile image URL',
    inputType: 'url',
  },
  {
    label: 'Name',
    field: 'name',
    values: [profileForm.name || 'Your name'],
    icon: IdentificationIcon,
    placeholder: 'Enter your full name',
    inputType: 'text',
  },
  {
    label: 'Username',
    field: 'user_name',
    values: [profileForm.user_name || '<Blank>'],
    icon: UserCircleIcon,
    placeholder: 'Enter your username',
    inputType: 'text',
  },
  {
    label: 'Gender',
    field: 'gender',
    values: [profileForm.gender || 'Not set'],
    icon: UserIcon,
    placeholder: 'Enter your gender',
    inputType: 'text',
  },
  {
    label: 'Email',
    field: 'email',
    values: [profileForm.email || 'No email linked'],
    icon: EnvelopeIcon,
    placeholder: 'Enter your email address',
    inputType: 'email',
  },
  {
    label: 'Phone',
    field: 'phone',
    values: [profileForm.phone || 'No phone number'],
    icon: PhoneIcon,
    placeholder: 'Enter your phone number',
    inputType: 'tel',
  },
])

const pages = {
  home: {
    eyebrow: 'Home feed',
    title: 'Welcome back, student.',
  },
  search: {
    eyebrow: 'Search',
    title: 'Find jobs, people, and companies.',
    description: 'Use this area to discover opportunities without leaving the dashboard layout.',
    cards: [
      {
        title: 'Job search',
        description: 'Search part-time work, internships, and campus opportunities matched to your skills.',
        icon: MagnifyingGlassIcon,
        bg: 'bg-[#8fd99b]',
        color: 'text-[#1f6c3b]'
      },
      {
        title: 'Company discovery',
        description: 'Browse employers, saved companies, and new hiring teams in one place.',
        icon: BuildingStorefrontIcon,
        bg: 'bg-[#ffc28e]',
        color: 'text-[#83460e]'
      },
    ],
  },
  messages: {
    eyebrow: 'Message',
    title: 'Keep conversations organized.',
    description: 'Messages from recruiters, classmates, and mentors can live inside this shared dashboard shell.',
    cards: [
      {
        title: 'Recruiter inbox',
        description: 'Review employer follow-ups and interview requests as soon as messaging is connected.',
        icon: ChatBubbleOvalLeftEllipsisIcon,
        bg: 'bg-[#8ccaff]',
        color: 'text-[#235d84]'
      },
      {
        title: 'Saved contacts',
        description: 'Keep important contacts ready for future application updates.',
        icon: UserCircleIcon,
        bg: 'bg-[#ffc28e]',
        color: 'text-[#83460e]'
      },
    ],
  },
  notifications: {
    eyebrow: 'Notification',
    title: 'See important updates.',
    description: 'Application alerts, account reminders, and platform news are shown in the same dashboard experience.',
    cards: [
      {
        title: 'Application alerts',
        description: 'Track status changes, deadlines, and employer activity from one place.',
        icon: BellIcon,
        bg: 'bg-[#d7b7ff]',
        color: 'text-[#5b36a8]'
      },
      {
        title: 'Job reminders',
        description: 'Get notified when saved jobs are closing or matching roles are posted.',
        icon: BriefcaseIcon,
        bg: 'bg-[#8fd99b]',
        color: 'text-[#1f6c3b]'
      },
    ],
  },
  create: {
    eyebrow: 'Create',
    title: 'Create something new.',
    description: 'Start posts, job alerts, or profile updates from inside the placeholder layout.',
    cards: [
      {
        title: 'Create post',
        description: 'Share updates, questions, or availability with your student job network.',
        icon: PlusCircleIcon,
        bg: 'bg-[#f8a9dc]',
        color: 'text-[#9b1f70]'
      },
      {
        title: 'Job alert',
        description: 'Prepare saved alerts for roles that fit your schedule and interests.',
        icon: BriefcaseIcon,
        bg: 'bg-[#8fd99b]',
        color: 'text-[#1f6c3b]'
      },
    ],
  },
  profile: {
    eyebrow: 'Profile',
    title: 'Build your student profile.',
    description: 'Showcase your skills, availability, and application progress in the same navigation shell.',
    cards: [
      {
        title: 'Student summary',
        description: 'Add your headline, study program, experience, and preferred job types.',
        icon: UserCircleIcon,
        bg: 'bg-[#ffc28e]',
        color: 'text-[#83460e]'
      },
      {
        title: 'Profile strength',
        description: 'Complete key sections to improve employer matching and visibility.',
        icon: BriefcaseIcon,
        bg: 'bg-[#a8c0ff]',
        color: 'text-[#243c78]'
      },
    ],
  },
  settings: {
    eyebrow: 'Account settings',
    title: 'Manage your profile.',
    description: 'Update your name, email address, and password to keep your student account accurate and secure.',
  },
}

const pageContent = computed(() => pages[activePage.value] || pages.home)

function getErrorMessage(error, fallback) {
  if (isAxiosError(error)) {
    return error.response?.data?.message || error.message || fallback
  }

  if (error instanceof Error) {
    return error.message
  }

  return fallback
}

function escapeHtml(value) {
  return value
      .replace(/&/g, '&amp;')
      .replace(/</g, '&lt;')
      .replace(/>/g, '&gt;')
      .replace(/"/g, '&quot;')
      .replace(/'/g, '&#039;')
}

function renderMarkdown(value) {
  return marked
      .parse(escapeHtml(value), {async: false, breaks: true})
      .replace(/<a /g, '<a target="_blank" rel="noopener noreferrer" ')
}

async function uploadPostImage(file) {
  const formData = new FormData()
  formData.append('file', file)
  const {data} = await api.post('/upload/single', formData)
  return data.file?.url || data.file?.streamUrl || ''
}

function buildMarkdownImage(file, url) {
  const altText = file.name.replace(/\.[^.]+$/, '').trim() || 'uploaded image'
  return `![${altText}](${url})`
}

function insertMarkdownImage(markdownImage) {
  const currentContent = postForm.content.trimEnd()
  postForm.content = currentContent ? `${currentContent}\n\n${markdownImage}` : markdownImage
}

async function handleMarkdownImageUpload(event) {
  const files = Array.from(event.target.files || [])
  postError.value = ''
  postMessage.value = ''

  if (!files.length) return

  const invalidFile = files.find((file) => !file.type.startsWith('image/'))
  if (invalidFile) {
    postError.value = 'Please select only image files to upload into markdown.'
    event.target.value = ''
    return
  }

  isUploadingMarkdownImage.value = true
  try {
    const markdownImages = await Promise.all(
        files.map(async (file) => {
          const imageUrl = await uploadPostImage(file)
          if (!imageUrl) throw new Error(`Upload finished, but the file URL was missing for ${file.name}.`)
          return buildMarkdownImage(file, imageUrl)
        }),
    )
    insertMarkdownImage(markdownImages.join('\n\n'))
    postMessage.value = `${markdownImages.length} image(s) uploaded and inserted into your markdown.`
  } catch (error) {
    postError.value = getErrorMessage(error, 'Could not upload the markdown images. Please try again.')
  } finally {
    isUploadingMarkdownImage.value = false
    event.target.value = ''
  }
}

function handlePostPhotoChange(event) {
  const [file] = event.target.files || []
  postError.value = ''

  if (!file) return

  if (!file.type.startsWith('image/')) {
    postError.value = 'Please select an image file for your post photo.'
    event.target.value = ''
    return
  }

  if (postPhotoPreview.value) URL.revokeObjectURL(postPhotoPreview.value)
  postPhotoFile.value = file
  postPhotoName.value = file.name
  postPhotoPreview.value = URL.createObjectURL(file)
}

function removePostPhoto() {
  if (postPhotoPreview.value) URL.revokeObjectURL(postPhotoPreview.value)
  postPhotoFile.value = null
  postPhotoPreview.value = ''
  postPhotoName.value = ''
}

async function submitPost() {
  postError.value = ''
  postMessage.value = ''

  if (!canSubmitPost.value) {
    postError.value = 'Please add a title and markdown content before publishing.'
    return
  }

  isPosting.value = true
  try {
    let imageUrl = ''

    if (postPhotoFile.value) {
      imageUrl = await uploadPostImage(postPhotoFile.value)
    }

    const {data} = await api.post('/posts', {
      title: postForm.title.trim(),
      content: postForm.content.trim(),
      imageUrl,
    })

    posts.value = [mapPost(data.post), ...posts.value]
    postMessage.value = 'Post published and saved successfully.'
    postForm.title = ''
    postForm.content = ''
    removePostPhoto()
  } catch (error) {
    postError.value = getErrorMessage(error, 'Could not publish your post. Please try again.')
  } finally {
    isPosting.value = false
  }
}

function mapPost(post) {
  const authorName = post.author?.user_name || '<Blank>'
  const createdAt = post.createdAt ? new Date(post.createdAt) : null

  return {
    id: post.id,
    company: authorName,
    meta: createdAt ? createdAt.toLocaleString() : 'Just now',
    badge: 'Community post',
    title: post.title,
    desc: post.content,
    descHtml: renderMarkdown(post.content || ''),
    imageUrl: post.imageUrl,
    tags: [],
    logoBg: 'bg-[#aecbfa]',
    logoText: 'text-[#1a4fa3]',
    // heroBg: 'bg-[#aecbfa]/35',
  }
}

async function loadPosts() {
  postsLoading.value = true
  postsError.value = ''

  try {
    const {data} = await api.get('/posts')
    posts.value = Array.isArray(data.posts) ? data.posts.map(mapPost) : []
  } catch (error) {
    postsError.value = getErrorMessage(error, 'Failed to load posts from the backend.')
  } finally {
    postsLoading.value = false
  }
}

function applyProfileData(profile, user) {
  if (profile?.fullName) profileForm.name = profile.fullName
  if (profile?.gender) profileForm.gender = profile.gender
  if (profile?.phone || user?.phone) profileForm.phone = profile?.phone || user.phone
  if (profile?.profileImageUrl) profileForm.avatar = profile.profileImageUrl
  profileForm.user_name = user?.user_name || ''
  if (user?.email) profileForm.email = user.email
  if (profile?.university) profileForm.university = profile.university
  if (profile?.major) profileForm.major = profile.major
  if (profile?.yearLevel) profileForm.yearLevel = profile.yearLevel
  if (profile?.bio) profileForm.bio = profile.bio
  if (profile?.jobType) profileForm.jobType = profile.jobType
  if (profile?.expectedSalary) profileForm.expectedSalary = profile.expectedSalary
  if (profile?.currency) profileForm.currency = profile.currency
  if (Array.isArray(profile?.skills)) profileForm.skills = profile.skills
  if (profile?.availability) profileForm.availability = profile.availability
}

async function fetchPersonalInfo() {
  profileLoadError.value = ''

  try {
    const [{data: profileData}, {data: accountData}] = await Promise.all([
      api.get('/student-profile/me'),
      api.get('/auth/me'),
    ])

    applyProfileData(profileData.profile, accountData.user)
  } catch (error) {
    profileLoadError.value = getErrorMessage(error, 'Failed to load your personal info.')
  }
}

function openPersonalInfoEditor(row) {
  editingField.value = row
  editValue.value = profileForm[row.field] || ''
  profileSaveError.value = ''
}

function closePersonalInfoEditor() {
  editingField.value = null
  editValue.value = ''
  profileSaveError.value = ''
}

function buildProfileFormData() {
  const formData = new FormData()
  formData.append('fullName', profileForm.name || 'Student User')
  formData.append('user_name', profileForm.user_name || '')
  formData.append('email', profileForm.email || '')
  formData.append('gender', profileForm.gender || '')
  formData.append('phone', profileForm.phone || '')
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
  return formData
}

async function savePersonalInfoEdit() {
  if (!editingField.value) return

  const field = editingField.value.field
  profileSaveError.value = ''
  isSavingProfile.value = true

  try {
    profileForm[field] = editValue.value.trim()
    const {data} = await api.post('/student-profile', buildProfileFormData())
    applyProfileData(data.profile, null)
    closePersonalInfoEditor()
  } catch (error) {
    profileSaveError.value = getErrorMessage(error, 'Failed to save your personal info.')
  } finally {
    isSavingProfile.value = false
  }
}

onMounted(() => {
  if (activePage.value === 'home' || activePage.value === 'profile') {
    loadPosts()
  }

  if (activePage.value === 'settings' || activePage.value === 'profile') {
    fetchPersonalInfo()
  }

  if (activePage.value === 'settings') {
    loadPasskeys()
  }
})

function toggleThemeMode() {
  setThemePreference(appliedTheme.value === 'dark' ? 'light' : 'dark')
}

function saveProfile() {
  // TODO: Connect this form to the profile update API when the endpoint is ready.
}

function formatDate(value) {
  return new Date(value).toLocaleDateString()
}

async function loadPasskeys() {
  passkeyError.value = ''

  try {
    const {data} = await api.get('/auth/passkeys')
    passkeys.value = data.passkeys
  } catch (error) {
    passkeyError.value = getErrorMessage(error, 'Could not load passkeys.')
  }
}

function openPasswordEditor() {
  passwordError.value = ''
  isPasswordEditorOpen.value = true
}

function closePasswordEditor() {
  isPasswordEditorOpen.value = false
  passwordError.value = ''
  passwordForm.current = ''
  passwordForm.next = ''
  passwordForm.confirm = ''
}

async function addPasskey() {
  passkeyError.value = ''
  passkeyMessage.value = ''

  if (!window.PublicKeyCredential) {
    passkeyError.value = 'Passkeys are not supported in this browser.'
    return
  }

  passkeyLoading.value = true
  try {
    const {data: options} = await api.post('/auth/passkey/register/options')
    const response = await startRegistration({optionsJSON: options})
    const {data} = await api.post('/auth/passkey/register/verify', {response})
    passkeys.value = data.passkeys
    passkeyMessage.value = 'Passkey added successfully.'
  } catch (error) {
    passkeyError.value = getErrorMessage(error, 'Could not add passkey. Please try again.')
  } finally {
    passkeyLoading.value = false
  }
}

async function handleLogout() {
  logoutError.value = ''

  try {
    await auth.logout(router)
  } catch (error) {
    logoutError.value = getErrorMessage(error, 'Could not logout. Please try again.')
  }
}

async function updatePassword() {
  passwordError.value = ''
  passwordMessage.value = ''

  if (!passwordForm.current || !passwordForm.next || !passwordForm.confirm) {
    passwordError.value = 'Please fill in all password fields.'
    return
  }

  if (passwordForm.next.length < 8) {
    passwordError.value = 'New password must be at least 8 characters.'
    return
  }

  if (passwordForm.next !== passwordForm.confirm) {
    passwordError.value = 'New passwords do not match.'
    return
  }

  passwordLoading.value = true
  try {
    await api.post('/auth/password', {
      currentPassword: passwordForm.current,
      newPassword: passwordForm.next,
    })
    passwordMessage.value = 'Password updated successfully.'
    closePasswordEditor()
  } catch (error) {
    passwordError.value = getErrorMessage(error, 'Could not update password. Check your current password and try again.')
  } finally {
    passwordLoading.value = false
  }
}

const navigationItems = [
  {label: 'Home', page: 'home', icon: HomeIcon, bg: 'bg-[#a8c0ff]', color: 'text-[#243c78]', to: '/home'},
  {
    label: 'Search',
    page: 'search',
    icon: MagnifyingGlassIcon,
    bg: 'bg-[#8fd99b]',
    color: 'text-[#1f6c3b]',
    to: '/search'
  },
  {
    label: 'Message',
    page: 'messages',
    icon: ChatBubbleOvalLeftEllipsisIcon,
    bg: 'bg-[#8ccaff]',
    color: 'text-[#235d84]',
    to: '/messages'
  },
  {
    label: 'Notification',
    page: 'notifications',
    icon: BellIcon,
    bg: 'bg-[#d7b7ff]',
    color: 'text-[#5b36a8]',
    to: '/notifications'
  },
  {label: 'Create', page: 'create', icon: PlusCircleIcon, bg: 'bg-[#f8a9dc]', color: 'text-[#9b1f70]', to: '/create'},
  {
    label: 'Profile',
    page: 'profile',
    icon: UserCircleIcon,
    bg: 'bg-[#ffc28e]',
    color: 'text-[#83460e]',
    to: '/profile'
  },
]

const sidebarItems = computed(() => navigationItems.map((item) => ({
  ...item,
  active: item.page === activePage.value,
})))

const stories = [
  {name: 'Brown Coffee', ring: 'bg-[#aecbfa]'},
  {name: 'RUPP', ring: 'bg-[#d7b7ff]'},
  {name: 'Wing Bank', ring: 'bg-[#8fd99b]'},
  {name: 'Chip Mong', ring: 'bg-[#ffc28e]'},
  {name: 'Smart', ring: 'bg-[#8ccaff]'},
  {name: 'Pi Pay', ring: 'bg-[#f8a9dc]'},
]

const composeActions = [
  {label: 'Post', icon: PlusCircleIcon, color: 'text-[#1a4fa3]'},
  {label: 'Job alert', icon: BriefcaseIcon, color: 'text-[#246b36]'},
  {label: 'Company', icon: BuildingStorefrontIcon, color: 'text-[#8a4a11]'},
]

const focusCards = [
  {label: 'Saved jobs', value: '8', desc: 'Three saved roles close in the next 48 hours.'},
  {label: 'Applications', value: '5', desc: 'Two employers viewed your student profile today.'},
  {label: 'Profile strength', value: '86%', desc: 'Add availability to improve match ranking.'},
]

const suggestions = [
  {name: 'Sokha Recruiter', role: 'Hospitality roles near BKK1', bg: 'bg-[#8fd99b]', text: 'text-[#246b36]'},
  {name: 'Dara Mentor', role: 'RUPP alumni · Product design', bg: 'bg-[#d7b7ff]', text: 'text-[#6a39b8]'},
  {name: 'Smart Careers', role: 'Internships and campus events', bg: 'bg-[#8ccaff]', text: 'text-[#235d84]'},
]
</script>
