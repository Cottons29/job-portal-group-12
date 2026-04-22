<template>
  <footer class="footer">
    <div class="footer-container">

      <!-- Brand -->
      <div class="footer-brand">
        <h2>FirstStep</h2>
        <p>
          Empowering the next generation of Cambodian talent with opportunities,
          skills, and innovation.
        </p>

        <!-- Social Icons -->
        <div class="socials">
          <i class="fab fa-facebook"></i>
          <i class="fab fa-telegram"></i>
          <i class="fab fa-linkedin"></i>
        </div>
      </div>

      <!-- Links -->
      <div class="footer-links">
        <h3>Explore</h3>
        <a href="#">Browse Jobs</a>
        <a href="#">For Students</a>
        <a href="#">For Employers</a>
      </div>

      <!-- Support -->
      <div class="footer-links">
        <h3>Support</h3>
        <a href="#">About Us</a>
        <a href="#">Privacy Policy</a>
        <a href="#">Terms of Service</a>
        <a href="#">Contact</a>
      </div>

    </div>

    <!-- Bottom -->
    <div class="footer-bottom">
      © 2024 FirstStep Editorial. All rights reserved.
    </div>
  </footer>
</template>

<script>
export default {
  name: "Footer",
};
</script>

<style scoped>
.footer {
  background: linear-gradient(135deg, #0f172a, #1e3a8a);
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
</style>