<template>
  <footer class="footer">
    <div class="footer-container">

      <!-- Brand -->
      <div class="footer-brand">
        <h2>FirstStep</h2>
        <p>{{ $t('footer.brandDescription') }}</p>

        <!-- Social Icons -->
        <div class="socials">
          <i class="fab fa-facebook"></i>
          <i class="fab fa-telegram"></i>
          <i class="fab fa-linkedin"></i>
        </div>
      </div>

      <!-- Links -->
      <div class="footer-links">
        <h3>{{ $t('footer.explore') }}</h3>
        <a href="#">{{ $t('navbar.browseJobs') }}</a>
        <a href="#">{{ $t('navbar.forStudents') }}</a>
        <a href="#">{{ $t('navbar.forEmployers') }}</a>
      </div>

      <!-- Support -->
      <div class="footer-links">
        <h3>{{ $t('footer.support') }}</h3>
        <RouterLink to="/about-us">{{ $t('footer.aboutUs') }}</RouterLink>
        <RouterLink to="/privacy-policy">{{ $t('auth.privacyPolicy') }}</RouterLink>
        <RouterLink to="/terms-of-service">{{ $t('auth.termsOfService') }}</RouterLink>
        <RouterLink to="/contact">{{ $t('footer.contact') }}</RouterLink>
      </div>

      <!-- Language Switcher -->
      <div class="footer-links">
        <h3>🌐 {{ locale === 'en' ? 'Language' : 'ភាសា' }}</h3>
        <button
          class="lang-btn"
          :class="{ active: locale === 'en' }"
          @click="locale = 'en'"
        >
          🇺🇸 English
        </button>
        <button
          class="lang-btn"
          :class="{ active: locale === 'km' }"
          @click="locale = 'km'"
        >
          🇰🇭 ខ្មែរ
        </button>
      </div>

    </div>

    <!-- Bottom -->
    <div class="footer-bottom">
      {{ $t('footer.copyright') }}
    </div>
  </footer>
</template>

<script setup>
import { RouterLink } from 'vue-router'
import { useI18n } from 'vue-i18n'

const { locale } = useI18n()
</script>

<style scoped>
.footer {
  background: #151515;
  color: #fff;
  padding: 50px 60px 20px;
}

/* Layout */
.footer-container {
  display: flex;
  justify-content: space-between;
  flex-wrap: wrap;
  gap: 40px;
}

/* Brand */
.footer-brand h2 {
  font-size: 22px;
  margin-bottom: 10px;
}

.footer-brand p {
  font-size: 14px;
  color: #cbd5e1;
  max-width: 300px;
}

/* Links */
.footer-links {
  display: flex;
  flex-direction: column;
}

.footer-links h3 {
  margin-bottom: 10px;
  font-size: 16px;
}

.footer-links a {
  text-decoration: none;
  color: #cbd5e1;
  margin-bottom: 6px;
  font-size: 14px;
  transition: 0.3s;
}

.footer-links a:hover {
  color: #38bdf8;
  transform: translateX(5px);
}

/* Social icons */
.socials {
  margin-top: 15px;
}

.socials i {
  margin-right: 10px;
  font-size: 18px;
  cursor: pointer;
  transition: 0.3s;
}

.socials i:hover {
  color: #38bdf8;
  transform: scale(1.2);
}

/* Bottom */
.footer-bottom {
  margin-top: 40px;
  text-align: center;
  font-size: 13px;
  color: #94a3b8;
  border-top: 1px solid rgba(255,255,255,0.1);
  padding-top: 15px;
}

/* Responsive */
@media (max-width: 768px) {
  .footer-container {
    flex-direction: column;
  }
}

/* Language toggle */
.lang-btn {
  background: transparent;
  border: 1px solid rgba(255, 255, 255, 0.15);
  color: #cbd5e1;
  padding: 6px 14px;
  border-radius: 999px;
  font-size: 14px;
  cursor: pointer;
  margin-bottom: 6px;
  text-align: left;
  transition: all 0.2s ease;
}

.lang-btn:hover {
  color: #38bdf8;
  border-color: #38bdf8;
}

.lang-btn.active {
  color: #fff;
  background: rgba(56, 189, 248, 0.15);
  border-color: #38bdf8;
}
</style>