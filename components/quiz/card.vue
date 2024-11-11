<template>
  <li class="gradient-list-item">
    <div class="card-index">{{ index }}</div>
    <div>
      <h5 class="fw-bold">{{ quiz.name }}</h5>
      <p>{{ quiz.description }}</p>
    </div>
    <div class="button-container">
      <button class="btn btn-info text-white" @click="viewQuiz">
        <i class="bi bi-eye-fill"></i>
      </button>
      <button class="btn btn-secondary text-white" @click="editQuiz">
        <i class="bi bi-pencil-square"></i>
      </button>
      <button class="btn btn-danger" @click="deleteQuiz(quiz.id)">
        <i class="bi bi-trash"></i>
      </button>
    </div>
  </li>
</template>
<script setup>
import { useRouter } from "vue-router";
import { defineProps, defineEmits } from "vue";

const router = useRouter();
const props = defineProps({
  quiz: Object,
  index: Number,
});
const emits = defineEmits(["delete"]);

const viewQuiz = () => {
  router.push(`/admin/quiz/${props.quiz.id}`);
};

const editQuiz = () => {
  router.push(`/admin/quiz/edit/${props.quiz.id}`);
};

const deleteQuiz = () => {
  emits("delete", props.quiz.id);
};
</script>

<style scoped>
.gradient-list-item {
  background: white;
  border-radius: 0 0.5rem 0.5rem 0.5rem;
  box-shadow: 0.25rem 0.25rem 0.6rem rgba(0, 0, 0, 0.05),
    0 0.5rem 1.125rem rgba(75, 0, 0, 0.05);
  margin-top: 1rem;
  min-height: 3rem;
  padding: 1rem 1rem 1rem 3rem;
  position: relative;
  display: flex;
  justify-content: space-between;
  align-items: center;
}

.card-index {
  background: linear-gradient(135deg, #83e4e2 0%, #a2ed56 100%);
  border-radius: 1rem;
  color: #1d1f20;
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
</style>
