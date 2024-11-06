// stores/auth.js
import { defineStore } from 'pinia'
import { useRouter } from 'vue-router'

export const useAuthStore = defineStore('auth', {
  state: () => ({
    user: null,
    token: null
  }),
  actions: {
    async login(username, password) {
      try {
        // Usando fetch do Nuxt para obter os dados
        const response = await useFetch(`http://localhost:4000/admins?username=${username}`);

        // Verifica se o usuário existe e a senha está correta
        const user = data.find((user) => user.username === username)

        if (user && user.password === password) {
          this.user = user
          this.token = 'fake-jwt-token' // Simulando um token JWT
          localStorage.setItem('user', JSON.stringify(this.user))
          localStorage.setItem('token', this.token)
        } else {
          alert('Username ou senha inválidos!')
        }
      } catch (error) {
        console.error("Erro de login", error)
        alert('Erro ao tentar fazer login')
      }
    },
    logout() {
      this.user = null
      this.token = null
      localStorage.removeItem('user')
      localStorage.removeItem('token')
    }
  }
})
