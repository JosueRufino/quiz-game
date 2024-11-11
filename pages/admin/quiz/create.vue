<template>
  <div class="container">
    <div class="quiz-card">
      <h1>Criar um Novo Quiz</h1>
      <form @submit.prevent="addQuiz">
        <div class="form-group">
          <label for="quizName">Nome do Quiz</label>
          <input
            type="text"
            id="quizName"
            v-model="newQuiz.name"
            class="form-control"
            required
          />
        </div>

        <div class="form-group">
          <label for="quizDescription">Descrição do Quiz</label>
          <textarea
            id="quizDescription"
            v-model="newQuiz.description"
            class="form-control"
            required
          ></textarea>
        </div>
      </form>
      <div class="d-flex justify-content-end">
        <button @click="addQuiz" type="submit" class="btn btn-success mt-3 me-3">
          Salvar Quiz
        </button>
        <button type="button" @click="addQuestion" class="btn btn-primary mt-3">
          Adicionar Pergunta
        </button>
      </div>
    </div>

    <div class="questions-container">
      <div
        v-for="(question, index) in newQuiz.questions"
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
          <label for="option{{ optionIndex + 1 }}"
            >Opção {{ optionIndex + 1 }}</label
          >
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
          class="btn btn-danger mt-3"
        >
          Deletar Pergunta
        </button>
      </div>
      <button
        type="button"
        @click="addQuestion"
        class="btn btn-primary mt-3"
        style="height: 50px; width: 50px;"
      >
        <i class="bi bi-plus-circle-fill"></i>
      </button>
    </div>
  </div>
</template>

<script setup>
import { ref } from "vue";

definePageMeta({
  layout: "admin",
});

// Definir o objeto de quiz
const newQuiz = ref({
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

// Função para adicionar uma nova pergunta ao quiz
const addQuestion = () => {
  newQuiz.value.questions.push({
    question: "",
    options: [
      { id: 1, response: "" },
      { id: 2, response: "" },
      { id: 3, response: "" },
      { id: 4, response: "" },
    ],
    answerId: null,
  });
};

// Função para remover uma pergunta do quiz
const removeQuestion = (index) => {
  newQuiz.value.questions.splice(index, 1);
};

// Função para salvar o quiz e fazer a requisição para o JSON Server
const addQuiz = async () => {
  try {
    // Enviar o novo quiz para o JSON Server
    const response = await fetch("http://localhost:4000/quiz", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(newQuiz.value),
    });

    if (!response.ok) {
      throw new Error("Falha ao salvar o quiz!");
    }

    // Resposta da API
    const data = await response.json();
    console.log("Quiz Criado com sucesso:", data);

    // Limpar o formulário após sucesso
    newQuiz.value = {
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
    };

    // Mostrar um alerta ou notificação de sucesso
    alert("Quiz criado com sucesso!");
  } catch (error) {
    console.error("Erro ao criar o quiz:", error);
    alert("Erro ao criar o quiz, tente novamente.");
  }
};
</script>

<style scoped>
.container {
  margin: 0 auto;
  padding: 2rem;
  overflow-y: auto; /* Permite o scroll */
  max-height: 80vh; /* Limita a altura da página */
}

.quiz-card,
.question-card {
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

h2 {
  font-size: 1.5rem;
  margin-bottom: 1rem;
}

.form-group {
  margin-bottom: 1rem;
}

button {
  margin-top: 1rem;
}

.questions-container {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(300px, 1fr));
  gap: 1rem;
}

.question-card {
  border-radius: 10px;
  padding: 1.2rem;
  background-color: #f5f5f5;
}

button.btn-danger {
  margin-top: 1rem;
}
</style>
