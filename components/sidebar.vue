<script setup>
// Nenhuma funcionalidade reativa, somente a estrutura estática
</script>

<template>
  <div class="wrapper">
    <!-- Sidebar -->
    <nav class="sidebar" id="sidebar" style="color: #fff; background: #000">
      <div
        class="sidebar-header d-flex align-items-center"
        style="background: #1a1b1b; color: #ffffff"
      >
        <img src="/assets/logo1.png" style="width: 220px; height: 120px" />
      </div>
      <hr />
      <div class="user-profile" style="background: #1a1b1b; color: #ffffff">
        <img src="../public/assets/user.png" class="profile-pic" />
        <div class="user-info">
          <p class="mb-0 fw-bold">Josué Rufino</p>
          <small>Administrador</small>
          <span class="status ms-2">●</span>
        </div>
      </div>

      <ul class="list-unstyled components">
        <p>Suas opções</p>
        <li>
          <a href="#" id="none" style="color: #ffffff">
            <i class="bi bi-person-lines-fill"></i> Perfil
          </a>
        </li>
        <li>
          <a href="#" id="none" style="color: #ffffff">
            <i class="bi bi-table"></i> Quizzes
          </a>
        </li>
        <li>
          <a href="#" id="none" style="color: #ffffff">
            <i class="bi bi-globe"></i> Recordes do jogo
          </a>
        </li>
      </ul>
      <ul class="list-unstyled components">
        <li>
          <a href="#" id="none" style="color: #ffffff">
            <i class="bi bi-gear-fill"></i>Definições
          </a>
        </li>
        <li>
          <a href="#" id="none" style="color: #ffffff">
            <i class="bi bi-box-arrow-right"></i>Sair
          </a>
        </li>
      </ul>
    </nav>

    <!-- Page Content -->
    <div id="content">
      <nav
        class="navbar navbar-expand-lg"
        style="background: #1a1b1b; color: #ffffff"
      >
        <div class="container-fluid w-100">
          <div
            class="w-100 h-100 d-flex justify-content-between align-items-center"
          >
            <div class="d-flex">
              <button class="btn btn-outline-light btn-md" id="sidebarCollapse">
                <i class="bi bi-list"></i>
              </button>
            </div>
          </div>
        </div>
      </nav>
      <slot />
    </div>
  </div>
</template>

<style scoped>
@import url("https://fonts.googleapis.com/css?family=Poppins:300,400,500,600,700");

li {
  display: flex;
  align-items: center;
}

#none {
  text-decoration: none;
}

body {
  font-family: "Poppins", sans-serif;
  background: #1d1d1d;
  color: #fff;
  margin: 0;
  overflow: hidden;
}

.wrapper {
  display: flex;
  width: 100%;

  overflow: hidden;
  transition: background 0.3s, color 0.3s;
}

.sidebar {
  width: 300px;
  transition: all 0.3s;
  height: 100vh;
  overflow-y: auto;
  border-right: 1px solid #1d1d1d;
}

.sidebar-header {
  padding: 20px;
  font-weight: bold;
  text-transform: uppercase;
}

.user-profile {
  display: flex;
  align-items: center;
  padding: 20px;
}

.user-profile .profile-pic {
  width: 50px;
  height: 50px;
  margin-right: 10px;
}

.user-profile .user-info {
  font-size: 0.9em;
}

.user-profile .status {
  color: #28a745;
  font-size: 0.8em;
}

.components {
  padding: 20px 0;
  border-bottom: 1px solid #3d3d3d;
}

.components p {
  color: #a0a0a0;
  padding: 10px 20px;
}

.components li a {
  padding: 10px 20px;
  font-size: 1em;
  display: flex;
  align-items: center;
  color: #dcdcdc;
}

.components li a i {
  margin-right: 10px;
}

.components li a:hover {
  color: #fff;
  background: #343a40;
}

#content {
  width: 100%;
  padding: 20px;
  min-height: 100vh;
  overflow-y: auto;
  transition: all 0.3s;
}
</style>
