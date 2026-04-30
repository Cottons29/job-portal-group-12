<template>
  <nav class="navbar">
    <!-- Left: Logo -->
    <div class="logo">
      <img src="/public/images/logo.png" alt="FirstJob Logo" />
    </div>

    <!-- Center: Menu -->
    <ul class="menu">
      <li class="active">Browse Jobs</li>
      <li> <a href="">For Students</a></li>
      <li>For Employers</li>
    </ul>

    <!-- Right: Login Button -->
    <div class="login">
      <button>Log In</button>
    </div>
  </nav>
</template>

<script>
export default {
  name: "Navbar",
};
</script>

<style scoped>
.navbar {
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 15px 40px;
  border-bottom: 1px solid #ddd;
  background: #fff;
}

/* Logo */
.logo img {
  height: 80px;
  width: 130px;
}

/* Menu */
.menu {
  display: flex;
  list-style: none;
  gap: 40px;
  margin: 0;
  padding: 0;
  font-weight: 500;
  color: #555;
}

.menu li {
  cursor: pointer;
  position: relative;
}

.menu li.active {
  color: #1a73e8;
}

.menu li.active::after {
  content: "";
  position: absolute;
  bottom: -10px;
  left: 0;
  width: 100%;
  height: 2px;
  background: #1a73e8;
}

/* Login button */
.login button {
  background: #1a73e8;
  color: #fff;
  border: none;
  padding: 10px 22px;
  border-radius: 20px;
  cursor: pointer;
  font-weight: 500;
}

.login button:hover {
  background: #1669c1;
}
</style>