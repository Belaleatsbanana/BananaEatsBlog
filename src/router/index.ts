import { createRouter, createWebHistory } from 'vue-router'
import TestEgypt from '@/views/TestEgypt.vue'
import { ROUTES } from '@/util/constants'

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes: [
    {
      path: '/test',
      name: 'test',
      component: TestEgypt,
      meta: {
        requiresAuth: false,
        showNavbar: true,
        showMainHeader: true
      }
    },
    {
      path: ROUTES.LANDING.path,
      name: ROUTES.LANDING.name,
      component: ROUTES.LANDING.component,
      meta: {
        requiresAuth: false,
        showNavbar: false,
        showMainHeader: false
      }
    },
    {
      path: ROUTES.REGISTER.path,
      name: ROUTES.REGISTER.name,
      component: ROUTES.REGISTER.component,
      meta: {
        requiresAuth: false,
        showNavbar: false,
        showMainHeader: false
      }
    },
    {
      path: ROUTES.LOGIN.path,
      name: ROUTES.LOGIN.name,
      component: ROUTES.LOGIN.component,
      meta: {
        requiresAuth: false,
        showNavbar: false,
        showMainHeader: false
      }
    },
    {
      path: ROUTES.HOME.path,
      name: ROUTES.HOME.name,
      component: ROUTES.HOME.component,
      meta: {
        requiresAuth: true,
        showNavbar: true,
        showMainHeader: true
      }
    },
    {
      path: `${ROUTES.POST.path}/:slug`,
      name: ROUTES.POST.name,
      component: ROUTES.POST.component,
      meta: {
        requiresAuth: true,
        showNavbar: true,
        showMainHeader: true
      }
    },
    {
      path: ROUTES.SEARCH_RESULTS.path,
      name: ROUTES.SEARCH_RESULTS.name,
      component: ROUTES.SEARCH_RESULTS.component,
      meta: {
        requiresAuth: true,
        showNavbar: true,
        showMainHeader: true
      }
    },
    {
      path: ROUTES.CREATE_POST.path,
      name: ROUTES.CREATE_POST.name,
      component: ROUTES.CREATE_POST.component,
      meta: {
        requiresAuth: true,
        showNavbar: true,
        showMainHeader: true
      }
    },
    {
      path: `${ROUTES.EDIT_POST.path}/:slug`,
      name: ROUTES.EDIT_POST.name,
      component: ROUTES.EDIT_POST.component,
      meta: {
        requiresAuth: true,
        showNavbar: true,
        showMainHeader: true
      }
    }
  ],
  scrollBehavior() {
    return { top: 0 }
  }
})

router.beforeEach((to, from, next) => {
  const isAuthenticated = localStorage.getItem('BananaBlogToken')

  if (to.meta.requiresAuth && !isAuthenticated) {
    localStorage.setItem('BananaBlogLastRoute', to.path)
    next({ name: ROUTES.LOGIN.name })
  } else if (!to.meta.requiresAuth && isAuthenticated) {
    next({ name: ROUTES.HOME.name })
  } else {
    next()
  }
})


export default router
