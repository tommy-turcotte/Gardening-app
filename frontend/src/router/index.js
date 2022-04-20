import { createRouter, createWebHistory } from 'vue-router'
import Home from '../views/HomeView.vue'
import Forum from '../views/ForumView.vue'
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
  }
]

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes
})

export default router
