<template>
  <main>
    <h5>Perguntas do quiz</h5>
    <ol class="gradient-list">
      <li v-for="(q, i) in paginatedQuestions" :key="i">
        <div>
          <h3>{{ q.question }}?</h3>
          <div class="d-flex">
            <span class="fw-bold">R:</span>
            <div
              class="card ms-2 p-2 border-0"
              :class="{
                'bg-success text-white': o.id === q.answerId,
                'bg-danger text-white': o.id !== q.answerId,
              }"
              v-for="(o, j) in q.options"
              :key="j"
            >
              {{ o.response }}
            </div>
          </div>
        </div>
      </li>
    </ol>

    <div class="pagination">
        <button :disabled="currentPage === 1"
        @click="goToPage(currentPage - 1)">
          Previous
        </button>
        <span>Page {{ currentPage }} of {{ totalPages }}</span>
        <button  :disabled="currentPage === totalPages"
        @click="goToPage(currentPage + 1)">
          Next
        </button>
      </div>
  </main>
</template>

<script setup>
const props = defineProps({
  quiz: Object, // Alterado para Object, já que quiz é um objeto com perguntas
});

// Definir o número de perguntas por página
const questionsPerPage = 3;

// Computar as perguntas paginadas
const currentPage = ref(1);
const totalPages = computed(() => {
  return Math.ceil(props.quiz.questions.length / questionsPerPage);
});

const paginatedQuestions = computed(() => {
  const start = (currentPage.value - 1) * questionsPerPage;
  const end = start + questionsPerPage;
  return props.quiz.questions.slice(start, end);
});

// Função para mudar de página
const goToPage = (page) => {
  if (page >= 1 && page <= totalPages.value) {
    currentPage.value = page;
  }
};
</script>

<style scoped lang="scss">
/*** FONTS ***/
@import url(https://fonts.googleapis.com/css?family=Montserrat:900|Raleway:400,400i,700,700i);

/*** VARIABLES ***/
/* Colors */
$black: #1d1f20;
$blue: #83e4e2;
$green: #a2ed56;
$yellow: #fddc32;
$white: #fafafa;

/*** EXTEND ***/
/* box-shadow */
%boxshadow {
  box-shadow: 0.25rem 0.25rem 0.6rem rgba(0, 0, 0, 0.05),
    0 0.5rem 1.125rem rgba(75, 0, 0, 0.05);
}

/*** STYLE ***/
*,
*:before,
*:after {
  box-sizing: border-box;
}

html,
body {
  margin: 0;
  padding: 0;
}

body {
  background-color: $white;
  color: $black;
  font-family: "Raleway", sans-serif;
}

main {
  display: block;
  margin: 0 auto;
  padding: 1rem;
}

ol.gradient-list {
  counter-reset: gradient-counter;
  list-style: none;
  margin: 1.75rem 0;
  padding-left: 1rem;
  > li {
    background: white;
    border-radius: 0 0.5rem 0.5rem 0.5rem;
    @extend %boxshadow;
    counter-increment: gradient-counter;
    margin-top: 1rem;
    min-height: 3rem;
    padding: 1rem 1rem 1rem 3rem;
    position: relative;
    &::before,
    &::after {
      background: linear-gradient(135deg, $blue 0%, $green 100%);
      border-radius: 1rem 1rem 0 1rem;
      content: "";
      height: 3rem;
      left: -1rem;
      overflow: hidden;
      position: absolute;
      top: -1rem;
      width: 3rem;
    }
    &::before {
      align-items: flex-end;
      @extend %boxshadow;
      content: counter(gradient-counter);
      color: $black;
      display: flex;
      font: 900 1.5em/1 "Montserrat";
      justify-content: flex-end;
      padding: 0.125em 0.25em;
      z-index: 1;
    }
    @for $i from 1 through 5 {
      &:nth-child(10n + #{$i}):before {
        background: linear-gradient(
          135deg,
          rgba($green, $i * 0.2) 0%,
          rgba($yellow, $i * 0.2) 100%
        );
      }
    }
    @for $i from 6 through 10 {
      &:nth-child(10n + #{$i}):before {
        background: linear-gradient(
          135deg,
          rgba($green, 1 - (($i - 5) * 0.2)) 0%,
          rgba($yellow, 1 - (($i - 5) * 0.2)) 100%
        );
      }
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

</style>
