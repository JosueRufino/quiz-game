<template>
  <div class="p-3">
    <!-- Cabeçalho -->
    <div class="d-flex justify-content-between mb-0 align-items-end">
      <h3>Lista de Quizzes</h3>
      <div class="header-actions">
        <!-- Campo de pesquisa -->
        <input
          v-model="searchQuery"
          type="text"
          placeholder="Pesquisar quiz..."
          class="search-input"
        />
        <!-- Botão para criar novo quiz -->
        <NuxtLink to="/admin/quiz/create">
          <button class="btn text-white" style="background-color: #a2ed56">
            <i class="bi bi-plus-circle-fill"></i>
            Criar Novo Quiz
          </button>
        </NuxtLink>
      </div>
    </div>

    <!-- Lista de Quizzes -->
    <main class="mt-0">
      <!-- Mensagem quando não há quizzes disponíveis -->
      <p v-if="!quizes || quizes.length === 0" class="no-quizzes">
        Sem quizzes disponíveis.
      </p>

      <!-- Mensagem quando nenhum quiz é encontrado na pesquisa -->
      <p v-else-if="filteredQuizzes.length === 0" class="no-quizzes">
        Nenhum quiz encontrado.
      </p>

      <!-- Lista de quizzes filtrada e paginada -->
      <ol v-else>
        <QuizCard
          v-for="(quiz, index) in paginatedFilteredQuizzes"
          :key="quiz.id"
          :quiz="quiz"
          :index="startIndex + index + 1"
          :onDelete="deleteQuiz"
        />
      </ol>

      <!-- Paginação -->
      <div class="pagination">
        <button @click="prevPage" :disabled="currentPage === 1">
          Previous
        </button>
        <span>Page {{ currentPage }} of {{ totalPages }}</span>
        <button @click="nextPage" :disabled="currentPage === totalPages">
          Next
        </button>
      </div>
    </main>
  </div>
</template>

<script setup>
import { ref, computed } from "vue";
import Swal from "sweetalert2";

definePageMeta({
  layout: "admin",
});

// Estado das quizzes
const { data: quizes, refresh } = await useFetch(`http://localhost:4000/quiz`);

// Variáveis para a paginação e filtro
const itemsPerPage = ref(3);
const currentPage = ref(1);
const searchQuery = ref("");

// Filtrar os quizzes com base na pesquisa (sem considerar paginação)
const filteredQuizzes = computed(() => {
  if (!quizes.value) return [];
  return quizes.value.filter((quiz) =>
    quiz.name.toLowerCase().includes(searchQuery.value.toLowerCase())
  );
});

// Total de páginas considerando os quizzes filtrados
const totalPages = computed(() =>
  Math.ceil(filteredQuizzes.value.length / itemsPerPage.value)
);

// Calcular o índice inicial para cada página
const startIndex = computed(() => (currentPage.value - 1) * itemsPerPage.value);

// Itens da página atual após filtragem
const paginatedFilteredQuizzes = computed(() => {
  const start = startIndex.value;
  return filteredQuizzes.value.slice(start, start + itemsPerPage.value);
});

// Funções para navegação de página
const nextPage = () => {
  if (currentPage.value < totalPages.value) currentPage.value++;
};

const prevPage = () => {
  if (currentPage.value > 1) currentPage.value--;
};

// Função para deletar um quiz com confirmação
const deleteQuiz = async (quizId) => {
  const result = await Swal.fire({
    title: "Tem certeza?",
    text: "Você realmente deseja excluir este quiz? Esta ação não pode ser desfeita!",
    icon: "warning",
    showCancelButton: true,
    confirmButtonColor: "#a2ed56",
    cancelButtonColor: "#d33",
    confirmButtonText: "Sim, excluir",
    cancelButtonText: "Cancelar"
  });

  if (result.isConfirmed) {
    try {
      const response = await fetch(`http://localhost:4000/quiz/${quizId}`, {
        method: "DELETE",
      });
      if (response.ok) {
        await refresh();
        Swal.fire("Excluído!", "O quiz foi excluído com sucesso.", "success");
      } else {
        Swal.fire("Erro", "Erro ao deletar o quiz.", "error");
      }
    } catch (error) {
      console.error("Erro de conexão ao deletar o quiz.", error);
      Swal.fire("Erro", "Erro de conexão ao deletar o quiz.", "error");
    }
  }
};
</script>


<style scoped lang="scss">
@import url(https://fonts.googleapis.com/css?family=Montserrat:900|Raleway:400,400i,700,700i);

/*** VARIABLES ***/
$black: #1d1f20;
$blue: #83e4e2;
$green: #a2ed56;
$yellow: #fddc32;
$white: #fafafa;

/*** EXTEND ***/
%boxshadow {
  box-shadow: 0.25rem 0.25rem 0.6rem rgba(0, 0, 0, 0.05),
    0 0.5rem 1.125rem rgba(75, 0, 0, 0.05);
}

/*** STYLE ***/
body {
  background-color: $white;
  color: $black;
  font-family: "Raleway", sans-serif;
}

header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 1.5rem;
}

header h1 {
  font-size: 2rem;
  font-weight: 700;
}

.header-actions {
  display: flex;
  gap: 1rem;
  align-items: center;
}

.search-input {
  padding: 0.5rem;
  font-size: 1rem;
  border-radius: 0.25rem;
  border: 1px solid $green;
  outline: none;
}

button.btn-primary {
  background-color: $blue;
  color: white;
  padding: 0.5rem 1rem;
  border: none;
  border-radius: 0.25rem;
  font-weight: 700;
  cursor: pointer;

  &:hover {
    background-color: darken($blue, 10%);
  }
}

main {
  display: block;
  margin: 0 auto;
  padding: 1rem;
}

ol.gradient-list {
  list-style: none;
  margin: 1.75rem 0;
  padding-left: 1rem;

  > li {
    background: white;
    border-radius: 0 0.5rem 0.5rem 0.5rem;
    @extend %boxshadow;
    margin-top: 1rem;
    min-height: 3rem;
    padding: 1rem 1rem 1rem 3rem;
    position: relative;
    display: flex;
    justify-content: space-between;
    align-items: center;

    .card-index {
      background: linear-gradient(135deg, $blue 0%, $green 100%);
      border-radius: 1rem;
      color: $black;
      font: 900 1.5em/1 "Montserrat";
      height: 3rem;
      width: 3rem;
      display: flex;
      align-items: center;
      justify-content: center;
      position: absolute;
      left: -2.5rem;
      top: -0.5rem;
    }

    .button-container {
      display: flex;
      gap: 0.5rem;
    }

    + li {
      margin-top: 2rem;
    }
  }
}

.pagination {
  display: flex;
  justify-content: center;
  align-items: center;
  margin-top: 2rem;
  gap: 1rem;

  button {
    padding: 0.5rem 1rem;
    background-color: $green;
    border: none;
    border-radius: 0.25rem;
    color: $black;
    cursor: pointer;
    font-family: "Raleway", sans-serif;
    font-weight: 700;

    &:disabled {
      background-color: lighten($green, 20%);
      cursor: not-allowed;
    }
  }

  span {
    font-size: 1rem;
    font-weight: 700;
    color: $black;
  }
}

.no-quizzes {
  text-align: center;
  font-size: 1.2rem;
  color: $black;
  margin-top: 2rem;
}
</style>
