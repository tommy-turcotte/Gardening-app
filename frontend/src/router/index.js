import { createRouter, createWebHistory } from 'vue-router'
import Home from '../views/HomeView.vue'
import Forum from '../views/ForumView.vue'
import Login from '../views/LoginView.vue'
import Register from '../views/RegisterView.vue'

const routes = [
  {
    path: '/',
    name: 'home',
    component: Home
  },
  {
    path: '/forum',
    name: 'forum',
    component: Forum
  },
  {
    path: '/Login',
    name: 'login',
    component: Login
  },
  {
    path: '/Register',
    name: 'Register',
    component: Register
  }
]

const router = createRouter({
  history: createWebHistory(process.env.BASE_URL),
  routes
})

export default router
