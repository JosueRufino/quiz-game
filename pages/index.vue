<template>
  <div class="d-flex justify-content-center align-items-center" style="height: 100vh">
    <div class="card p-2" style="width: 400px; height: 48vh; background-color: black; opacity: 1">
      <div class="d-flex justify-content-center" style="border-bottom: 1px solid #ffffff">
        <img src="/assets/logo1.png" style="max-height: 150px" />
      </div>
      <div class="d-flex justify-content-center align-items-center w-100 h-100">
        <div class="w-100 text-white">
          <input
            class="form-control"
            type="text"
            placeholder="Insira o seu nome de usuário"
            style="height: 50px"
            v-model="username"
          />
        </div>
      </div>
      <div class="d-flex align-items-end h-100 w-100">
        <button
          @click="enterGame"
          class="w-100 fw-bold"
          style="
            height: 50px;
            border-radius: 10px;
            background-color: #ffffff;
            border: none;
          "
        >
          Entrar no jogo
        </button>
      </div>
      <NuxtLink to="/auth/" class="mt-2 text-end text-secondary">Zona administrativa</NuxtLink>
    </div>
  </div>
</template>

<script setup>
import { ref } from "vue";
import { useRouter } from "vue-router"; // Importa o roteador

const username = ref("");
const router = useRouter();

const enterGame = () => {
  if (username.value.trim() === "") {
    alert("Por favor, insira o seu nome de usuário.");
    return;
  }

  // Salva o nome de usuário no localStorage
  localStorage.setItem("username", username.value);

  // Redireciona para a página desejada
  router.push("/game");
};
</script>

<style scoped>
@import url(https://fonts.googleapis.com/css?family=Montserrat:900|Raleway:400,400i,700,700i);
</style>
