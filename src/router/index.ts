import { createRouter, createWebHistory } from 'vue-router'
import HomeView from '../views/HomeView.vue'

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes: [
    {
      path: '/',
      name: 'home',
      component: HomeView,
    },
    {
      path: '/Register',
      name: 'Register',
      component: () => import('../views/AboutView.vue'),
    },
    {
      path:'/Home',
      name:'Home',
      component: () => import('../views/Home.vue'),
    },
    {
      path:'/Edit',
      name:'Edit',
      component: () => import('../views/Edit.vue'),
    },
    {
      path:'/Write',
      name:'Write',
      component: () => import('../views/Write.vue'),
    }
  ],
})

export default router
