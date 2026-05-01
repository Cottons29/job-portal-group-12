<template>
  <main class="page-shell">
    <section class="page-card">
      <p class="eyebrow">About FirstStep</p>
      <h1>About Us</h1>
      <p>
        FirstStep connects Cambodian students with flexible work, internships, and early-career
        opportunities that help them build confidence while continuing their education.
      </p>
      <p>
        Our platform supports students, universities, and employers by making it easier to discover
        trusted roles, highlight local talent, and create meaningful first professional experiences.
      </p>
      <div class="content-grid">
        <article>
          <h2>Our mission</h2>
          <p>
            We want every student to find a practical first step into the workforce through fair,
            accessible, and skills-focused opportunities.
          </p>
        </article>
        <article>
          <h2>What we value</h2>
          <p>
            We value trust, growth, inclusion, and partnerships that strengthen Cambodia's next
            generation of professionals.
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

.content-grid {
  display: grid;
  grid-template-columns: repeat(2, minmax(0, 1fr));
  gap: 24px;
  margin-top: 32px;
}

.content-grid article {
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

  .content-grid {
    grid-template-columns: 1fr;
  }
}
</style>
