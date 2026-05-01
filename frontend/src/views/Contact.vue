<template>
  <main class="page-shell">
    <section class="page-card">
      <p class="eyebrow">Get in touch</p>
      <h1>Contact</h1>
      <p>
        Have questions about FirstStep, need support, or want to partner with us? We would love to
        hear from you.
      </p>

      <div class="contact-grid">
        <article>
          <h2>Email</h2>
          <a href="mailto:support@firststep.com">support@firststep.com</a>
          <p>Send us your questions and we will respond as soon as possible.</p>
        </article>
        <article>
          <h2>Location</h2>
          <p>Phnom Penh, Cambodia</p>
          <p>Supporting students and employers across Cambodia.</p>
        </article>
        <article>
          <h2>Support hours</h2>
          <p>Monday - Friday</p>
          <p>9:00 AM - 5:00 PM</p>
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

a {
  color: #2563eb;
  font-weight: 700;
  text-decoration: none;
}

a:hover {
  text-decoration: underline;
}

.contact-grid {
  display: grid;
  grid-template-columns: repeat(3, minmax(0, 1fr));
  gap: 20px;
  margin-top: 32px;
}

.contact-grid article {
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

  .contact-grid {
    grid-template-columns: 1fr;
  }
}
</style>
