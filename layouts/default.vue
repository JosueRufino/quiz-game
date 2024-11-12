<template>
  <div class="background-container">
    <audio ref="backgroundAudio" loop>
    <source src="/assets/music/background-music.mp3" type="audio/mpeg" />
  </audio>

    <slot />
  </div>
</template>

<script setup>
import { ref } from "vue";

// Referência para o áudio
const backgroundAudio = ref(null);

// Função para iniciar o áudio
const playAudio = () => {
  if (backgroundAudio.value) {
    backgroundAudio.value.play().catch((error) => {
      console.error("Erro ao tentar tocar o áudio: ", error);
    });
  }
};

// Tenta tocar o áudio assim que o componente for montado (mas pode ser bloqueado)
onMounted(() => {
  playAudio(); // Pode ser bloqueado dependendo do navegador
});
</script>

<style scoped>
.background-container {
  background-color: #000;
  background-image: url("/assets/background.jpg");
  background-size: cover;
  background-position: center;
  background-repeat: no-repeat;
  height: 100vh;
  width: 100%;
  position: relative;
}

.background-container::before {
  content: "";
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background-color: rgba(0, 0, 0, 0.7);
  z-index: -1;
}
</style>
