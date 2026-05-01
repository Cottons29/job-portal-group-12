<template>
  <main class="page-shell">
    <section class="page-card">
      <p class="eyebrow">Platform rules</p>
      <h1>Terms of Service</h1>
      <p>
        These terms describe the basic rules for using FirstStep. By using the platform, you agree
        to use it responsibly and provide accurate information.
      </p>

      <div class="terms-list">
        <article>
          <h2>Accounts</h2>
          <p>
            You are responsible for keeping your account information accurate and protecting your
            login credentials.
          </p>
        </article>
        <article>
          <h2>Acceptable use</h2>
          <p>
            Users must not post misleading content, misuse applicant data, interfere with the
            platform, or use FirstStep for unlawful activity.
          </p>
        </article>
        <article>
          <h2>Opportunities</h2>
          <p>
            Employers should provide clear, fair, and truthful role information. Students should
            apply honestly and communicate professionally.
          </p>
        </article>
        <article>
          <h2>Changes</h2>
          <p>
            We may update these terms as the service grows. Continued use of FirstStep means you
            accept the latest version.
          </p>
        </article>
      </div>
    </section>
  </main>
</template>

<script setup>
</script>

<style scoped>
.page-shell {
  min-height: 70vh;
  padding: 96px 24px;
  background: #f8fafc;
}

.page-card {
  max-width: 960px;
  margin: 0 auto;
  padding: 48px;
  border-radius: 28px;
  background: #fff;
  color: #0f172a;
  box-shadow: 0 20px 60px rgba(15, 23, 42, 0.08);
}

.eyebrow {
  margin: 0 0 12px;
  color: #2563eb;
  font-size: 13px;
  font-weight: 700;
  letter-spacing: 0.08em;
  text-transform: uppercase;
}

h1 {
  margin: 0 0 20px;
  font-size: 42px;
  line-height: 1.1;
}

h2 {
  margin: 0 0 10px;
  font-size: 20px;
}

p {
  color: #475569;
  font-size: 16px;
  line-height: 1.7;
}

.terms-list {
  display: grid;
  gap: 20px;
  margin-top: 32px;
}

.terms-list article {
  padding: 24px;
  border: 1px solid #e2e8f0;
  border-radius: 20px;
  background: #f8fafc;
}

@media (max-width: 768px) {
  .page-shell {
    padding: 64px 16px;
  }

  .page-card {
    padding: 32px 24px;
  }

  h1 {
    font-size: 34px;
  }
}
</style>
