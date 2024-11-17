<template>
  <div
    class="d-flex justify-content-center align-items-center"
    style="height: 100vh"
  >
    <div
      class="card p-2"
      style="
        width: 400px;
        height: 48vh;
        background-color: transparent;
        opacity: 1;
      "
    >
      <div
        class="d-flex justify-content-center"
        style="border-bottom: 1px solid #ffffff"
      >
        <img src="/assets/logo1.png" style="max-height: 150px" />
      </div>
      <div class="d-flex justify-content-center align-items-center w-100 h-100">
        <div class="w-100 text-white">
          <input
            class="form-control"
            type="text"
            placeholder="Insira o um nome de usuário para entrar no jogo"
            style="height: 50px"
            v-model="username"
          />
        </div>
      </div>
      <div class="d-flex align-items-end h-100 w-100">
        <button
          @click="enterGame()"
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
      <NuxtLink to="/auth/" class="mt-2 text-end text-secondary"
        >Zona administrativa</NuxtLink
      >
    </div>
  </div>
</template>

<script setup>
import Swal from "sweetalert2";
import { ref } from "vue";
import { useRouter } from "vue-router";

const username = ref("");
const router = useRouter();

const enterGame = async () => {
  if (username.value.trim() === "") {
    Swal.fire({
      icon: "error",
      title: "Oops...",
      text: "Por favor, insira o seu nome de usuário.",
      confirmButtonText: "Entendido",
      customClass: {
        confirmButton: "btn btn-primary",
      },
      buttonsStyling: false,
    });
    return;
  }

  try {
    // Faz a requisição POST para cadastrar o usuário
    const response = await fetch("http://localhost:4000/players", {
      method: "POST", // Especifica o método como POST
      headers: {
        "Content-Type": "application/json", // Define que o corpo da requisição é JSON
      },
      body: JSON.stringify({
        username: username.value, // Dados enviados no corpo da requisição
      }),
    });

    if (response.ok) {
      Swal.fire({
        icon: "success",
        title: "Sucesso!",
        text: "Usuário cadastrado com sucesso.",
        confirmButtonText: "Continuar",
        showConfirmButton: false,
        customClass: {
          confirmButton: "btn btn-success",
        },
        buttonsStyling: false,
        timer: 1000,
      });

      // Salva o nome de usuário no localStorage
      localStorage.setItem("username", username.value);

      // Redireciona para a página do jogo
      router.push("/game");
    } else {
      throw new Error("Erro ao cadastrar o usuário.");
    }
  } catch (error) {
    Swal.fire({
      icon: "error",
      title: "Erro",
      text: "Ocorreu um problema ao cadastrar o usuário.",
      confirmButtonText: "Tentar novamente",
      customClass: {
        confirmButton: "btn btn-danger",
      },
      buttonsStyling: false,
    });
    console.error(error);
  }
};
</script>

<style scoped>
@import url(https://fonts.googleapis.com/css?family=Montserrat:900|Raleway:400,400i,700,700i);
</style>
