import { createRouter, createWebHistory } from 'vue-router'


const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes: [
    {
      path: '/',
      name: 'dashboard',
      component: () => import('../views/HomeView.vue'),
    },
    {
      path: '/login',
      name: 'login',
      component: () => import('../views/LoginUser.vue'),
    },
  ],

  scrollBehavior(to, from, savedPosition) {
    if(to.hash) {
      return {
        el: to.hash,
        behavior: 'smooth',
      }
    } else if(savedPosition) {
      return savedPosition
    } else {
      return { top: 0 }
    }
  },
})

export default router
