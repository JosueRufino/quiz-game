<template>
  <div class="container">
    <div class="quiz-card">
      <h1>Editar Quiz: {{ quizData.name }}</h1>
      <div class="form-group">
        <label for="quizName">Nome do Quiz</label>
        <input
          type="text"
          id="quizName"
          v-model="quizData.name"
          class="form-control"
          required
        />
      </div>

      <div class="form-group">
        <label for="quizDescription">Descrição do Quiz</label>
        <textarea
          id="quizDescription"
          v-model="quizData.description"
          class="form-control"
          required
        ></textarea>
      </div>
      <div class="d-flex justify-content-end">
        <button type="button" @click="addQuestion" class="btn btn-primary">
          Adicionar Pergunta
        </button>
        <button @click="updateQuiz" type="submit" class="btn btn-success mt-3 ms-2">
          Atualizar Quiz
        </button>
      </div>
    </div>

    <form @submit.prevent="updateQuiz" class="questions-container">
      <div
        v-for="(question, index) in quizData.questions"
        :key="index"
        class="question-card"
      >
        <h4>Questão {{ index + 1 }}</h4>

        <div class="form-group">
          <label for="questionText">Pergunta</label>
          <input
            type="text"
            v-model="question.question"
            class="form-control"
            placeholder="Digite a pergunta"
            required
          />
        </div>

        <div
          class="form-group"
          v-for="(option, optionIndex) in question.options"
          :key="optionIndex"
        >
          <label for="option{{ optionIndex + 1 }}">{{
            `Opção ${optionIndex + 1}`
          }}</label>
          <input
            type="text"
            v-model="option.response"
            class="form-control"
            :id="'option' + (optionIndex + 1)"
            placeholder="Digite a opção"
            required
          />
        </div>

        <div class="form-group">
          <label for="answerId">Resposta Correta</label>
          <select v-model="question.answerId" class="form-control" required>
            <option
              v-for="(option, optionIndex) in question.options"
              :key="optionIndex"
              :value="option.id"
            >
              Opção {{ optionIndex + 1 }}
            </option>
          </select>
        </div>

        <button
          type="button"
          @click="removeQuestion(index)"
          class="btn btn-danger"
        >
          Remover Pergunta
        </button>
      </div>
    </form>
  </div>
</template>

<script setup>
import { ref, onMounted } from "vue";
import { useRoute, useRouter } from "vue-router";

definePageMeta({
  layout: "admin",
});

const quizData = ref({
  id: "",
  name: "",
  description: "",
  questions: [
    {
      question: "",
      options: [
        { id: 1, response: "" },
        { id: 2, response: "" },
        { id: 3, response: "" },
        { id: 4, response: "" },
      ],
      answerId: null,
    },
  ],
});

const route = useRoute();
const router = useRouter();
const quizId = route.params.id;

const loadQuizData = async () => {
  try {
    const response = await fetch(`http://localhost:4000/quiz/${quizId}`);
    const data = await response.json();
    quizData.value = data;
  } catch (error) {
    console.error("Erro ao carregar os dados do quiz:", error);
    alert("Erro ao carregar os dados do quiz.");
  }
};

const addQuestion = () => {
  const newQuestion = {
    question: "",
    options: [
      { id: 1, response: "" },
      { id: 2, response: "" },
      { id: 3, response: "" },
      { id: 4, response: "" },
    ],
    answerId: null,
  };
  quizData.value.questions.push(newQuestion);
};

const removeQuestion = (index) => {
  quizData.value.questions.splice(index, 1);
};

const updateQuiz = async () => {
  try {
    const response = await fetch(`http://localhost:4000/quiz/${quizId}`, {
      method: "PUT",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(quizData.value),
    });

    if (!response.ok) {
      throw new Error("Falha ao atualizar o quiz!");
    }

    const data = await response.json();
    console.log("Quiz atualizado com sucesso:", data);
    alert("Quiz atualizado com sucesso!");
    router.push("/admin/quiz");
  } catch (error) {
    console.error("Erro ao atualizar o quiz:", error);
    alert("Erro ao atualizar o quiz, tente novamente.");
  }
};

onMounted(() => {
  loadQuizData();
});
</script>

<style scoped>
.container {
  max-width: 1200px;
  margin: 0 auto;
  padding: 2rem;
  overflow-y: auto;
  max-height: 80vh;
}

.quiz-card {
  background-color: #f8f9fa;
  border: 1px solid #ddd;
  border-radius: 8px;
  padding: 1.5rem;
  margin-bottom: 1.5rem;
}

h1 {
  font-size: 2rem;
  margin-bottom: 1rem;
}

.form-group {
  margin-bottom: 1.5rem;
}

.questions-container {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(300px, 1fr));
  gap: 1rem;
}

.question-card {
  background-color: #f5f5f5;
  border: 1px solid #ddd;
  border-radius: 8px;
  padding: 1.5rem;
}

button {
  margin-top: 1rem;
}
</style>
