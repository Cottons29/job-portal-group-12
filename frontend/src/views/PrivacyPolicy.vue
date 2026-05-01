<template>
  <main class="page-shell">
    <section class="page-card">
      <p class="eyebrow">Your data</p>
      <h1>Privacy Policy</h1>
      <p>
        FirstStep respects your privacy. This policy explains the types of information we collect
        and how we use it to provide a safer job discovery experience.
      </p>

      <div class="policy-list">
        <article>
          <h2>Information we collect</h2>
          <p>
            We may collect account details, profile information, application activity, and basic
            usage data when you use the platform.
          </p>
        </article>
        <article>
          <h2>How we use information</h2>
          <p>
            We use information to manage accounts, recommend opportunities, improve services,
            prevent misuse, and communicate important updates.
          </p>
        </article>
        <article>
          <h2>Sharing and security</h2>
          <p>
            We only share information when needed to deliver the service, comply with legal
            obligations, or protect users. We use reasonable safeguards to protect your data.
          </p>
        </article>
        <article>
          <h2>Your choices</h2>
          <p>
            You can review and update your account information, and you may contact us with privacy
            questions or data requests.
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

.policy-list {
  display: grid;
  gap: 20px;
  margin-top: 32px;
}

.policy-list article {
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
