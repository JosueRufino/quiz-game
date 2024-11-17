<template>
  <div class="container-fluid vh-100">
    <div class="d-flex justify-content-center align-items-center h-100">
      <!-- Quiz Selection View -->
      <div class="card p-4 quiz-container" v-if="!quizSelected">
        <div>
          <div class="d-flex justify-content-between align-items-center mb-4">
            <h3 class="mb-0 text-white">Escolha um Quiz</h3>
            <NuxtLink to="/" class="text-decoration-none text-dark">
              <div class="d-flex align-items-center text-white">
                <i class="bi bi-arrow-left-circle fs-3 me-2"></i>
                <span>Inicio</span>
              </div>
            </NuxtLink>
          </div>

          <div class="quiz-list">
            <div
              v-for="quiz in quizzes"
              :key="quiz.id"
              class="quiz-card"
              @click="selectQuiz(quiz)"
            >
              <h3>{{ quiz.name }}</h3>
              <p class="mb-0">{{ quiz.description }}</p>
            </div>
          </div>
        </div>
      </div>

      <!-- Difficulty Selection -->
      <div class="card p-4 quiz-container" v-else-if="!difficultySelected">
        <h3 class="mb-4 text-white">Escolha a Dificuldade</h3>
        <div class="difficulty-list">
          <div
            class="difficulty-card"
            v-for="difficulty in difficulties"
            :key="difficulty.id"
            @click="selectDifficulty(difficulty.id)"
          >
            <h4>{{ difficulty.name }}</h4>
            <p class="mb-0">{{ difficulty.description }}</p>
          </div>
        </div>
      </div>

      <!-- Quiz Questions View -->
      <div class="quiz-container" v-else>
        <div
          class="card p-4 question-card"
          v-if="currentQuestion < quizData.questions.length"
        >
          <div class="d-flex flex-column h-100">
            <!-- Timer Display -->
            <div v-if="selectedDifficulty === 'timed'" class="text-center mb-3">
              <div class="timer-circle">
                <span class="text-white fs-2">{{ timeLeft }}</span>
              </div>
            </div>
            <div
              v-if="selectedDifficulty !== 'hardcore'"
              class="text-center mb-3"
            >
              <h4 class="text-white">Pontuação: {{ score }}</h4>
            </div>
            <h2 class="text-white mb-3">
              Pergunta {{ currentQuestion + 1 }} de
              {{ quizData.questions.length }}
            </h2>
            <p class="text-white mb-4">
              {{ quizData.questions[currentQuestion].question }}
            </p>

            <div class="options-container">
              <div
                v-for="(option, index) in quizData.questions[currentQuestion]
                  .options"
                :key="index"
                :class="[
                  'option-card',
                  optionClass(option),
                  {
                    'selected-option':
                      !answerSubmitted && selectedAnswer === option,
                  },
                ]"
                @click="selectOption(option)"
              >
                {{ option.response }}
              </div>
            </div>

            <button
              v-if="selectedAnswer"
              @click="submitAnswer"
              class="btn btn-success mt-auto w-100"
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
import { ref, onMounted, watch } from "vue";
import Swal from "sweetalert2";

const quizzes = ref([]);
const quizData = ref(null);
const quizSelected = ref(false);
const difficultySelected = ref(false);
const selectedDifficulty = ref(null);
const currentQuestion = ref(0);
const selectedAnswer = ref(null);
const answerSubmitted = ref(false);
const isCorrectAnswer = ref(false);
const score = ref(0);
const timeLeft = ref(10);
const timer = ref(null);
const router = useRouter();

const difficulties = [
  {
    id: "normal",
    name: "Normal",
    description:
      "Modo clássico: Responda todas as questões e veja seu resultado no final.",
  },
  {
    id: "hardcore",
    name: "Hardcore",
    description: "Modo desafiador: Erre uma questão e o jogo termina!",
  },
  {
    id: "timed",
    name: "Contra o Tempo",
    description: "10 segundos para responder cada questão. O tempo não para!",
  },
];

let winSound, loseSound;

onMounted(() => {
  if (typeof window !== "undefined") {
    winSound = new Audio("/assets/music/good.mp3");
    loseSound = new Audio("/assets/music/error.mp3");
  }

  loadQuizzes();
});

const startTimer = () => {
  timeLeft.value = 10;
  clearInterval(timer.value);

  timer.value = setInterval(() => {
    timeLeft.value--;

    if (timeLeft.value === 0) {
      clearInterval(timer.value);
      handleTimeUp();
    }
  }, 1000);
};

const handleTimeUp = () => {
  if (!selectedAnswer.value) {
    playSound(false);
    showTimeUpMessage();
  }
  nextQuestion();
};

const showTimeUpMessage = () => {
  Swal.fire({
    title: "Tempo Esgotado!",
    text: "Você não respondeu a tempo.",
    icon: "warning",
    timer: 1500,
    showConfirmButton: false,
  });
};

const selectDifficulty = (difficulty) => {
  selectedDifficulty.value = difficulty;
  difficultySelected.value = true;

  if (difficulty === "timed") {
    startTimer();
  }
};

const loadQuizzes = async () => {
  try {
    const response = await fetch("http://localhost:4000/quiz");
    if (!response.ok) throw new Error("Erro ao carregar os quizzes");
    quizzes.value = await response.json();
  } catch (error) {
    console.error("Erro ao carregar os quizzes:", error);
    Swal.fire({
      title: "Erro",
      text: "Não foi possível carregar os quizzes. Tente novamente mais tarde.",
      icon: "error",
      confirmButtonText: "OK",
    });
  }
};

const selectQuiz = (quiz) => {
  quizData.value = JSON.parse(JSON.stringify(quiz)); // Clona o objeto
  shuffleArray(quizData.value.questions);
  quizData.value.questions.forEach((question) =>
    shuffleArray(question.options)
  );
  quizSelected.value = true;
};

const selectOption = (option) => {
  if (!answerSubmitted.value) {
    selectedAnswer.value = option;
  }
};

const submitAnswer = () => {
  if (!selectedAnswer.value) return;

  isCorrectAnswer.value =
    selectedAnswer.value.id ===
    quizData.value.questions[currentQuestion.value].answerId;

  if (isCorrectAnswer.value) {
    score.value++;
  }

  playSound(isCorrectAnswer.value);
  answerSubmitted.value = true;

  const correctResponse = quizData.value.questions[
    currentQuestion.value
  ].options.find(
    (option) =>
      option.id === quizData.value.questions[currentQuestion.value].answerId
  ).response;

  // Tratamento específico para modo Hardcore
  if (selectedDifficulty.value === "hardcore" && !isCorrectAnswer.value) {
    Swal.fire({
      position: "top-end",
      title: "Game Over!",
      text: `Resposta incorreta! A resposta correta era: "${correctResponse}"`,
      icon: "error",
      confirmButtonText: "Ver Resultado",
    }).then(showFinalResult);
    return;
  }

  // Tratamento para modo Contra o Tempo
  if (selectedDifficulty.value === "timed") {
    clearInterval(timer.value);
    // Mostra feedback rápido
    Swal.fire({
      position: "top-end",
      title: isCorrectAnswer.value ? "Correto!" : "Incorreto!",
      text: isCorrectAnswer.value
        ? "Você acertou!"
        : `A resposta correta era: "${correctResponse}"`,
      icon: isCorrectAnswer.value ? "success" : "error",
      timer: 1500,
      showConfirmButton: false,
    }).then(() => {
      if (currentQuestion.value < quizData.value.questions.length - 1) {
        nextQuestion();
      } else {
        showFinalResult();
      }
    });
    return;
  }

  // Modo Normal
  const feedbackConfig = {
    title: isCorrectAnswer.value ? "Resposta Correta!" : "Resposta Incorreta!",
    text: isCorrectAnswer.value
      ? `Você acertou a questão!`
      : `A resposta correta era: "${correctResponse}"`,
    icon: isCorrectAnswer.value ? "success" : "error",
    position: "top-end",
    showCancelButton:
      currentQuestion.value < quizData.value.questions.length - 1,
    confirmButtonColor: isCorrectAnswer.value ? "#198754" : "#dc3545",
    confirmButtonText:
      currentQuestion.value === quizData.value.questions.length - 1
        ? "Ver Resultado"
        : "Próxima Pergunta",
    cancelButtonText: "Abandonar jogo",
    allowOutsideClick: false,
  };

  Swal.fire(feedbackConfig).then((result) => {
    if (result.isConfirmed) {
      if (currentQuestion.value === quizData.value.questions.length - 1) {
        showFinalResult();
      } else {
        nextQuestion();
      }
    } else {
      abandonQuiz();
    }
  });
};

const nextQuestion = () => {
  answerSubmitted.value = false;
  selectedAnswer.value = null;
  currentQuestion.value++;

  if (
    selectedDifficulty.value === "timed" &&
    currentQuestion.value < quizData.value.questions.length
  ) {
    setTimeout(() => startTimer(), 500); // Pequeno atraso antes do timer.
  }
};

const abandonQuiz = () => {
  clearInterval(timer.value);
  Swal.fire({
    title: "Abandonar partida!",
    text: "Partida abandonada com sucesso.",
    icon: "success",
    showConfirmButton: false,
    timer: 1000,
  });
  router.push("/");
};

const showFinalResult = () => {
  clearInterval(timer.value);
  const totalQuestions = quizData.value.questions.length;
  const percentage = (score.value / totalQuestions) * 100;

  let message = "";
  if (selectedDifficulty.value === "hardcore") {
    message = `Você chegou até a questão ${
      currentQuestion.value + 1
    } de ${totalQuestions}!`;
  } else {
    message = `Você acertou ${score.value} de ${totalQuestions} perguntas!`;
  }

  Swal.fire({
    title: "Resultado Final",
    text:
      percentage >= 50
        ? `Parabéns! ${message}`
        : `Infelizmente você perdeu !  ${message}`,
    icon: percentage >= 50 ? "success" : "error",
    confirmButtonText: "Jogar Novamente",
  }).then(restartQuiz);
};

const restartQuiz = () => {
  clearInterval(timer.value);
  quizSelected.value = false;
  difficultySelected.value = false;
  selectedDifficulty.value = null;
  currentQuestion.value = 0;
  score.value = 0;
  selectedAnswer.value = null;
  answerSubmitted.value = false;
  timeLeft.value = 10;
};

const playSound = (isCorrect) => {
  if (isCorrect && winSound) winSound.play();
  if (!isCorrect && loseSound) loseSound.play();
};

const shuffleArray = (array) => {
  for (let i = array.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [array[i], array[j]] = [array[j], array[i]];
  }
};

const optionClass = (option) => {
  if (!answerSubmitted.value) {
    // Retorna apenas a classe de seleção, sem alterar o background
    return selectedAnswer.value === option ? "selected-option" : "bg-white";
  }

  const isCorrectAnswer =
    option.id === quizData.value.questions[currentQuestion.value].answerId;
  const isSelectedWrongAnswer =
    option === selectedAnswer.value && !isCorrectAnswer;

  if (isCorrectAnswer) return "bg-success text-white";
  if (isSelectedWrongAnswer) return "bg-danger text-white";
  return "bg-white";
};
</script>

<style scoped>
.quiz-container {
  width: 600px;
  max-height: 90vh;
  background-color: rgba(0, 0, 0, 0.9);
}

.quiz-list,
.difficulty-list {
  max-height: calc(90vh - 100px);
  overflow-y: auto;
  padding-right: 10px;
}

.quiz-card,
.difficulty-card {
  padding: 1rem;
  margin: 1rem 0;
  background-color: #e9ecef;
  border-radius: 0.5rem;
  cursor: pointer;
  transition: background-color 0.3s ease;
}

.quiz-card:hover,
.difficulty-card:hover {
  background-color: #dee2e6;
}

.question-card {
  height: 90vh;
  background-color: transparent;
  display: flex;
  flex-direction: column;
}

.options-container {
  flex: 1;
  overflow-y: auto;
  margin-bottom: 1rem;
  padding-right: 10px;
}

.option-card {
  padding: 1rem;
  margin-bottom: 0.5rem;
  border: 1px solid #dee2e6;
  border-radius: 0.5rem;
  cursor: pointer;
  transition: all 0.3s ease;
  background-color: white;
}

.option-card:hover:not(.bg-success):not(.bg-danger):not(.selected-option) {
  background-color: #f8f9fa !important;
}

.selected-option {
  background-color: #0d6efd !important;
  color: white !important;
  border-color: #0a58ca !important;
  transform: translateY(-2px);
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
}

.timer-circle {
  width: 80px;
  height: 80px;
  border-radius: 50%;
  border: 4px solid #fff;
  display: flex;
  justify-content: center;
  align-items: center;
  margin: 0 auto;
}

/* Estilização da scrollbar */
.quiz-list::-webkit-scrollbar,
.difficulty-list::-webkit-scrollbar,
.options-container::-webkit-scrollbar {
  width: 6px;
}

.quiz-list::-webkit-scrollbar-track,
.difficulty-list::-webkit-scrollbar-track,
.options-container::-webkit-scrollbar-track {
  background: #f1f1f1;
  border-radius: 3px;
}

.quiz-list::-webkit-scrollbar-thumb,
.difficulty-list::-webkit-scrollbar-thumb,
.options-container::-webkit-scrollbar-thumb {
  background: #888;
  border-radius: 3px;
}

.quiz-list::-webkit-scrollbar-thumb:hover,
.difficulty-list::-webkit-scrollbar-thumb:hover,
.options-container::-webkit-scrollbar-thumb:hover {
  background: #555;
}
</style>
