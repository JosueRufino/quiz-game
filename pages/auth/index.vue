<template>
  <div class="background-container">
    <div class="d-flex justify-content-center align-items-center vh-100">
      <div class="card p-4 shadow" style="width: 100%; max-width: 350px;">
        <h3 class="text-center mb-4">Login</h3>

        <form @submit.prevent="handleLogin">
          <div class="mb-3">
            <label for="username" class="form-label">Nome de Usuário</label>
            <input
              type="text"
              class="form-control"
              id="username"
              v-model="username"
              placeholder="Digite seu nome de usuário"
              required
            />
          </div>

          <div class="mb-3">
            <label for="password" class="form-label">Senha</label>
            <input
              type="password"
              class="form-control"
              id="password"
              v-model="password"
              placeholder="Digite sua senha"
              required
            />
          </div>

          <button type="submit" class="btn btn-primary w-100">Entrar</button>
        </form>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref } from 'vue'
import { useRouter } from 'vue-router'
import { useFetch } from '#app' // Para fazer requisições no Nuxt

definePageMeta({
  layout: "auth"
})

const router = useRouter()

// Variáveis de estado para nome de usuário e senha
const username = ref('')
const password = ref('')

// Função para lidar com o login diretamente na página
const handleLogin = async () => {
  try {
    // Faz a requisição para a API
    const { data, error } = await useFetch(`http://localhost:4000/admins?username=${username.value}`)

    if (error.value) {
      alert('Erro ao tentar fazer login')
      return
    }

    const user = data.value?.find((user) => user.username === username.value)

    if (user && user.password === password.value) {
      // Armazenar os dados do usuário e token localmente
      localStorage.setItem('user', JSON.stringify(user))
      localStorage.setItem('token', 'fake-jwt-token') // Token simulado

      // Redirecionar para o dashboard
      router.push('/admin')
    } else {
      alert('Nome de usuário ou senha incorretos!')
    }
  } catch (error) {
    console.error('Erro ao fazer login', error)
    alert('Erro ao tentar fazer login. Tente novamente mais tarde.')
  }
}
</script>

<style scoped>
.background-container {
  background-color: #000;
  background-image: url("/assets/background.jpg");
  background-size: cover;
  background-position: center;
  background-repeat: no-repeat;
  height: 100vh;
  width: 100%;
  position: relative;
}

.background-container::before {
  content: "";
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background-color: rgba(0, 0, 0, 0.6);
  z-index: 0;
}

.card {
  position: relative;
  z-index: 1;
  background-color: rgba(255, 255, 255, 0.75);
  border-radius: 8px;
  box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
  height: 50vh;
}
</style>
