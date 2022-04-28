import { createRouter, createWebHistory } from 'vue-router'
import Home from '../views/HomeView.vue'
import Forum from '../views/ForumView.vue'
import Login from '../views/LoginView.vue'
import Register from '../views/RegisterView.vue'
import Account from '../views/AccountView.vue'
import Logout from '../views/LogoutView.vue'
import WatchList from '../views/WatchlistView.vue'
import Location from '../views/LocationView.vue'
import Cropyield from '../views/CropyieldView.vue'
import Notification from '../views/NotificationView.vue'
import Search from '../views/SearchView.vue'

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
  },
  {
    path: '/Account',
    name: 'Account',
    component: Account
  },
  {
    path: '/Logout',
    name: 'Logout',
    component: Logout
  },
  {
    path: '/Watch-List',
    name: 'WatchList',
    component: WatchList
  },
  {
    path: '/Location',
    name: 'Location',
    component: Location
  },
  {
    path: '/Cropyield',
    name: 'Cropyield',
    component: Cropyield
  },
  {
    path: '/Notification',
    name: 'Notification',
    component: Notification
  },
  {
    path: '/Search',
    name: 'Search',
    component: Search
  }
]

const router = createRouter({
  history: createWebHistory(process.env.BASE_URL),
  routes
})

export default router
