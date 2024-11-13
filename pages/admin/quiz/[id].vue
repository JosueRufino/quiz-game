<template>
  <div class="p-3 content">
    <div
      class="card p-2 shadow-lg"
      style="
        width: 400px;
        border: none;
        border-left: 3px solid #000000;
        border-right: 3px solid #000000;
      "
    >
      <h3>{{ quiz.name }}</h3>
      <p class="mb-0">{{ quiz.description }}</p>
      <p>Total de perguntas: {{ quiz.questions.length }}</p>
      <div class="d-flex justify-content-end">
        <button class="btn btn-secondary text-white" @click="editQuiz">
          Editar
          <i class="bi bi-pencil-square"></i>
        </button>
        <button class="btn btn-danger ms-2" @click="deleteQuiz(quiz.id)">
          Eliminar
          <i class="bi bi-trash"></i>
        </button>
      </div>
    </div>
    <div>
      <QuizCardQuestion :quiz="quiz" />
    </div>
  </div>
</template>

<script setup>
import { useRoute, useFetch } from "#app";

definePageMeta({
  layout: "admin",
});

// Obtendo o parâmetro ID da URL
const route = useRoute();
const router = useRouter();
const quizId = route.params.id; // Supondo que o parâmetro na URL seja `id`

const { data: quiz, refresh } = await useFetch(
  `http://localhost:4000/quiz/${quizId}`
);

// Função para deletar um quiz
const deleteQuiz = async (quizId) => {
  try {
    const response = await fetch(`http://localhost:4000/quiz/${quizId}`, {
      method: "DELETE",
    });
    if (response.ok) {
      // Atualiza a lista de quizzes após a exclusão
      await refresh();
      alert("Quiz excluído com sucesso!");
      router.push("/admin/quiz");
    } else {
      console.error("Erro ao deletar o quiz.");
      alert("Erro ao deletar o quiz.");
    }
  } catch (error) {
    console.error("Erro de conexão ao deletar o quiz.", error);
    alert("Erro de conexão ao deletar o quiz.");
  }
};
</script>

<style scoped>
.content {
  overflow-y: auto; /* Permite o scroll */
  max-height: 90vh; /* Limita a altura da página */
}
</style>
