<template>
  <audio ref="backgroundAudio" loop>
    <source src="/assets/music/background-music.mp3" type="audio/mpeg" />
  </audio>

  <!-- Botão para iniciar o áudio -->
  <button v-if="!audioPlayed" @click="playAudio">Iniciar Música</button>
</template>

<script setup>
import { ref, onMounted } from "vue";

// Referência para o áudio
const backgroundAudio = ref(null);
const audioPlayed = ref(false);

// Função para iniciar o áudio
const playAudio = () => {
  if (backgroundAudio.value) {
    backgroundAudio.value.play().catch((error) => {
      console.error("Erro ao tentar tocar o áudio: ", error);
    });
    audioPlayed.value = true; // Marcar que o áudio foi tocado
  }
};

// Tenta tocar o áudio assim que o componente for montado (mas pode ser bloqueado)
onMounted(() => {
  // Evitar tentar tocar automaticamente, aguardar a interação do usuário
});
</script>
