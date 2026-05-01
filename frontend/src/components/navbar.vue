<template>
  <header class="site-header">
    <nav class="navbar" aria-label="Main navigation">
      <RouterLink class="brand" to="/" aria-label="FirstJob home">
        <img src="/images/logo.png" alt="FirstJob Logo" />
        <span class="brand-text">FirstJob</span>
      </RouterLink>

      <button
        class="menu-toggle"
        type="button"
        :aria-expanded="isMenuOpen"
        aria-controls="primary-menu"
        aria-label="Toggle navigation menu"
        @click="isMenuOpen = !isMenuOpen"
      >
        <span></span>
        <span></span>
        <span></span>
      </button>

      <div id="primary-menu" class="nav-content" :class="{ open: isMenuOpen }">
        <ul class="menu">
          <li>
            <RouterLink to="/" @click="closeMenu">Browse Jobs</RouterLink>
          </li>
          <li>
            <RouterLink to="/about-us" @click="closeMenu">For Students</RouterLink>
          </li>
          <li>
            <RouterLink to="/contact" @click="closeMenu">For Employers</RouterLink>
          </li>
        </ul>

        <RouterLink class="login-button" to="/auth" @click="closeMenu">Log In</RouterLink>
      </div>
    </nav>
  </header>
</template>

<script setup>
import { ref } from 'vue'
import { RouterLink } from 'vue-router'

const isMenuOpen = ref(false)

const closeMenu = () => {
  isMenuOpen.value = false
}
</script>

<style scoped>
.site-header {
  position: sticky;
  top: 0;
  z-index: 50;
  background: rgba(255, 255, 255, 0.92);
  border-bottom: 1px solid rgba(226, 232, 240, 0.9);
  backdrop-filter: blur(18px);
}

.navbar {
  display: flex;
  align-items: center;
  justify-content: space-between;
  width: min(1180px, calc(100% - 32px));
  margin: 0 auto;
  padding: 14px 0;
}

.brand {
  display: inline-flex;
  align-items: center;
  gap: 10px;
  color: #0f172a;
  text-decoration: none;
  font-size: 1.15rem;
  font-weight: 800;
  letter-spacing: -0.03em;
}

.brand img {
  width: 58px;
  height: 58px;
  object-fit: contain;
}

.brand-text {
  line-height: 1;
}

.nav-content {
  display: flex;
  align-items: center;
  gap: 34px;
}

.menu {
  display: flex;
  align-items: center;
  gap: 8px;
  margin: 0;
  padding: 6px;
  list-style: none;
  background: #f8fafc;
  border: 1px solid #e2e8f0;
  border-radius: 999px;
}

.menu a {
  display: inline-flex;
  align-items: center;
  min-height: 40px;
  padding: 0 18px;
  color: #475569;
  border-radius: 999px;
  text-decoration: none;
  font-size: 0.95rem;
  font-weight: 700;
  transition:
    color 0.2s ease,
    background 0.2s ease,
    box-shadow 0.2s ease;
}

.menu a:hover,
.menu a.router-link-active {
  color: #1d4ed8;
  background: #ffffff;
  box-shadow: 0 8px 18px rgba(15, 23, 42, 0.08);
}

.login-button {
  display: inline-flex;
  align-items: center;
  justify-content: center;
  min-height: 46px;
  padding: 0 24px;
  color: #ffffff;
  background: #2563eb;
  border-radius: 999px;
  box-shadow: 0 14px 26px rgba(37, 99, 235, 0.26);
  text-decoration: none;
  font-weight: 800;
  transition:
    transform 0.2s ease,
    box-shadow 0.2s ease;
}

.login-button:hover {
  transform: translateY(-2px);
  box-shadow: 0 18px 32px rgba(37, 99, 235, 0.34);
}

.menu-toggle {
  display: none;
  width: 44px;
  height: 44px;
  padding: 0;
  background: #f8fafc;
  border: 1px solid #e2e8f0;
  border-radius: 14px;
  cursor: pointer;
}

.menu-toggle span {
  display: block;
  width: 18px;
  height: 2px;
  margin: 4px auto;
  background: #0f172a;
  border-radius: 999px;
  transition: transform 0.2s ease;
}

@media (max-width: 820px) {
  .navbar {
    position: relative;
  }

  .brand img {
    width: 52px;
    height: 52px;
  }

  .menu-toggle {
    display: block;
  }

  .nav-content {
    position: absolute;
    top: calc(100% + 12px);
    left: 0;
    right: 0;
    display: none;
    flex-direction: column;
    align-items: stretch;
    gap: 16px;
    padding: 18px;
    background: #ffffff;
    border: 1px solid #e2e8f0;
    border-radius: 22px;
    box-shadow: 0 24px 60px rgba(15, 23, 42, 0.14);
  }

  .nav-content.open {
    display: flex;
  }

  .menu {
    flex-direction: column;
    align-items: stretch;
    gap: 4px;
    padding: 0;
    background: transparent;
    border: none;
    border-radius: 0;
  }

  .menu a {
    justify-content: center;
    width: 100%;
    min-height: 46px;
  }

  .login-button {
    width: 100%;
  }
}

@media (max-width: 480px) {
  .navbar {
    width: min(100% - 24px, 1180px);
  }

  .brand-text {
    display: none;
  }
}
</style>
