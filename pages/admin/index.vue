<template>
  <div class="p-3">
    <h1>Bem vindo ao seu painel administrativo</h1>
    <Card />
  </div>
</template>

<script setup>
definePageMeta({
  layout: "admin",
});


</script>

<style scoped>
.content {
  flex-grow: 1;
}
</style>
