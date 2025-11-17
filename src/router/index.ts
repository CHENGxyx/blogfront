import { createRouter, createWebHistory } from 'vue-router'
import Login from '../views/Login.vue'

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes: [
    {
      path: '/',
      name: 'login',
      component: () => import('../views/Login.vue'),
    },
    {
      path: '/register',
      name: 'register',
      component: () => import('../views/Register.vue'),
    },
    {
      path:'/home/:username',
      name:'home',
      meta: {  requiresAuth: true},
      props: true,
      component: () => import('../views/Home.vue'),
    },
    {
      path:'/article/:id',
      name:'article',
      component: () => import('../views/Article.vue'),
      props: true,
      meta: { requiresAuth: true }
    },
    {
      path: '/edit/:id', 
      name: 'edit',
      component: () => import('../views/Edit.vue'),
      props: true,
      meta: { requiresAuth: true }
    },
    {
      path:'/write',
      name:'write',
      meta: { requiresAuth: true },
      component: () => import('../views/Write.vue'),
    }
  ],
})
export default router
