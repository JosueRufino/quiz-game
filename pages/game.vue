<template>
  <div class="w-100 h-100">
    <div class="d-flex justify-content-center align-items-center h-100 w-100">
      <div class="card p-2" style="width: 600px" v-if="!quizSelected">
        <div>
          <div class="d-flex justify-content-between">
            <h3>Escolha um Quiz</h3>
            <NuxtLink to="/" style="text-decoration: none; color: black">
              <div class="d-flex align-items-center">
                <i class="bi bi-arrow-left-circle fs-3 me-2"></i>
                <span>Inicio</span>
              </div>
            </NuxtLink>
          </div>
          <div
            v-for="quiz in quizzes"
            :key="quiz.id"
            class="quiz-card"
            @click="selectQuiz(quiz)"
          >
            <h3>{{ quiz.name }}</h3>
            <p>{{ quiz.description }}</p>
          </div>
        </div>
      </div>
      <div v-else>
        <div
          class="card p-2"
          style="
            width: 600px;
            height: 45vh;
            background-color: black;
            opacity: 0.9;
          "
          v-if="currentQuestion < quizData.questions.length"
        >
          <div>
            <h2 class="text-white">
              Pergunta {{ currentQuestion + 1 }} de
              {{ quizData.questions.length }}
            </h2>
            <p class="text-white">
              {{ quizData.questions[currentQuestion].question }}
            </p>

            <div
              v-for="(option, index) in quizData.questions[currentQuestion]
                .options"
              :key="index"
              :class="['option-card', optionClass(option)]"
              @click="selectOption(option)"
            >
              {{ option.response }}
            </div>

            <button
              v-if="selectedAnswer"
              @click="submitAnswer"
              class="btn btn-success"
              :disabled="answerSubmitted"
            >
              Submeter Resposta
            </button>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted } from "vue";
import Swal from "sweetalert2";
import winSoundUrl from "/assets/music/good.mp3";
import loseSoundUrl from "/assets/music/error.mp3";

// Estado inicial do quiz
const quizzes = ref([]);
const quizData = ref(null);
const quizSelected = ref(false);
const quizStarted = ref(false);
const currentQuestion = ref(0);
const selectedAnswer = ref(null);
const answerSubmitted = ref(false);
const isCorrectAnswer = ref(false);
const score = ref(0);

let winSound;
let loseSound;
onMounted(() => {
  if (typeof window !== "undefined") {
    winSound = new Audio(winSoundUrl);
    loseSound = new Audio(loseSoundUrl);
  }
});

const playWinSound = () => {
  if (winSound) {
    winSound.play();
  }
};

const playLoseSound = () => {
  if (loseSound) {
    loseSound.play();
  }
};

// Função para embaralhar um array (algoritmo de Fisher-Yates)
const shuffleArray = (array) => {
  for (let i = array.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [array[i], array[j]] = [array[j], array[i]]; // Troca os elementos
  }
};

// Carregar todos os quizzes disponíveis
const loadQuizzes = async () => {
  try {
    const response = await fetch("http://localhost:4000/quiz");
    const data = await response.json();
    quizzes.value = data;
  } catch (error) {
    console.error("Erro ao carregar os quizzes:", error);
  }
};

// Selecionar um quiz
const selectQuiz = (quiz) => {
  quizData.value = quiz;
  // Embaralhar as perguntas e as opções
  shuffleArray(quizData.value.questions);
  quizData.value.questions.forEach((question) => {
    shuffleArray(question.options); // Embaralha as opções de cada pergunta
  });
  quizSelected.value = true;
};

// Escolher uma opção
const selectOption = (option) => {
  if (!answerSubmitted.value) {
    selectedAnswer.value = option;
  }
};

// Submeter resposta e exibir feedback
const submitAnswer = () => {
  if (selectedAnswer.value) {
    isCorrectAnswer.value =
      selectedAnswer.value.id ===
      quizData.value.questions[currentQuestion.value].answerId;

    if (isCorrectAnswer.value) {
      score.value++;
      winSound.play(); // Toca o som de vitória
    } else {
      loseSound.play(); // Toca o som de derrota
    }

    answerSubmitted.value = true;

    // Verifica se é a última pergunta
    if (currentQuestion.value === quizData.value.questions.length - 1) {
      // Mostrar modal de feedback e depois o resultado final
      Swal.fire({
        title: isCorrectAnswer.value
          ? "Resposta Correta!"
          : "Resposta Incorreta!",
        text: isCorrectAnswer.value
          ? `Você acertou a questão: "${
              quizData.value.questions[currentQuestion.value].question
            }"`
          : `A resposta correta era: "${
              quizData.value.questions[currentQuestion.value].options.find(
                (option) =>
                  option.id ===
                  quizData.value.questions[currentQuestion.value].answerId
              ).response
            }"`,
        icon: isCorrectAnswer.value ? "success" : "error",
        confirmButtonText: "Ver Resultado",
      }).then(showFinalResult);
    } else {
      // Se não for a última, mostrar modal de feedback e avançar para próxima pergunta
      Swal.fire({
        title: isCorrectAnswer.value
          ? "Resposta Correta!"
          : "Resposta Incorreta!",
        text: isCorrectAnswer.value
          ? `Você acertou a questão: "${
              quizData.value.questions[currentQuestion.value].question
            }"`
          : `A resposta correta era: "${
              quizData.value.questions[currentQuestion.value].options.find(
                (option) =>
                  option.id ===
                  quizData.value.questions[currentQuestion.value].answerId
              ).response
            }"`,
        icon: isCorrectAnswer.value ? "success" : "error",
        confirmButtonText: "Próxima Pergunta",
      }).then(nextQuestion);
    }
  }
};

// Ir para a próxima pergunta
const nextQuestion = () => {
  answerSubmitted.value = false;
  selectedAnswer.value = null;
  currentQuestion.value++;
};

// Função para mostrar o resultado final com SweetAlert
const showFinalResult = () => {
  const totalQuestions = quizData.value.questions.length;
  const correctAnswers = score.value;
  const percentage = (correctAnswers / totalQuestions) * 100;

  const resultMessage =
    percentage >= 50
      ? `Parabéns! Você acertou ${correctAnswers} de ${totalQuestions} perguntas e venceu!`
      : `Você acertou ${correctAnswers} de ${totalQuestions} perguntas. Infelizmente, você perdeu.`;

  Swal.fire({
    title: "Resultado Final",
    text: resultMessage,
    icon: percentage >= 50 ? "success" : "error",
    confirmButtonText: "Jogar Novamente",
  }).then(() => {
    restartQuiz();
  });
};

// Reiniciar o quiz
const restartQuiz = () => {
  quizSelected.value = false;
  quizStarted.value = false;
  currentQuestion.value = 0;
  score.value = 0;
  selectedAnswer.value = null;
  answerSubmitted.value = false;
};

// Carregar os quizzes ao montar o componente
onMounted(() => {
  loadQuizzes();
});

// Retornar a classe CSS para destacar as opções corretas e incorretas
const optionClass = (option) => {
  if (!answerSubmitted.value) return "";
  if (option.id === quizData.value.questions[currentQuestion.value].answerId)
    return "correct";
  if (
    option === selectedAnswer.value &&
    option.id !== quizData.value.questions[currentQuestion.value].answerId
  )
    return "incorrect";
  return "";
};
</script>

<style scoped>
.game-container {
  max-width: 600px;
  margin: 0 auto;
  padding: 1rem;
  background-color: #f8f9fa;
  border-radius: 8px;
}

.quiz-card {
  padding: 1rem;
  margin: 1rem 0;
  background-color: #e0e0e0;
  border-radius: 8px;
  cursor: pointer;
  transition: 0.3s;
}
.quiz-card:hover {
  background-color: #d0d0d0;
}

.option-card {
  padding: 1rem;
  margin-top: 0.5rem;
  background-color: #ffffff;
  border: 1px solid #ddd;
  border-radius: 8px;
  cursor: pointer;
  transition: background-color 0.3s ease;
}

.option-card:hover {
  background-color: #f5f5f5;
}

.option-card.correct {
  background-color: #c8e6c9; /* Verde claro para resposta correta */
}

.option-card.incorrect {
  background-color: #ffcdd2; /* Vermelho claro para resposta incorreta */
}

.feedback {
  margin-top: 1rem;
  font-weight: bold;
}

.feedback.correct {
  color: green;
}

.feedback.incorrect {
  color: red;
}

button {
  margin-top: 1.5rem;
}
</style>
