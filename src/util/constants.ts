export const STATUS_CODES = {
  OK: 200,
  CREATED: 201,
  NO_CONTENT: 204,
  BAD_REQUEST: 400,
  UNAUTHORIZED: 401,
  FORBIDDEN: 403,
  NOT_FOUND: 404,
  CONFLICT: 409,
  UNPROCESSABLE: 422,
  INTERNAL_SERVER_ERROR: 500
}

export const API_URL = import.meta.env.VITE_API_URL

export const ROUTES = {
  LANDING: {
    path: '/',
    name: 'LandingPage',
    component: () => import('@/views/LandingPage.vue')
  },
  REGISTER: {
    path: '/register',
    name: 'RegisterPage',
    component: () => import('@/views/RegisterPage.vue')
  },
  LOGIN: {
    path: '/login',
    name: 'LoginPage',
    component: () => import('@/views/LoginPage.vue')
  },
  HOME: {
    path: '/home',
    name: 'HomePage',
    component: () => import('@/views/HomePage.vue')
  },
  POST: {
    path: '/post',
    name: 'PostDetailPage',
    component: () => import('@/views/PostDetailPage.vue')
  },
  SEARCH_RESULTS: {
    path: '/search-results',
    name: 'SearchResultsPage',
    component: () => import('@/views/SearchResultsPage.vue')
  },
  CREATE_POST: {
    path: '/create-post',
    name: 'CreatePostPage',
    component: () => import('@/views/CreatePostPage.vue')
  },
  EDIT_POST: {
    path: '/edit-post',
    name: 'EditPostPage',
    component: () => import('@/views/EditPostPage.vue')
  },
  MY_POSTS: {
    path: '/my-posts',
    name: 'MyPostsPage',
    component: () => import('@/views/MyPostPage.vue')
  },
  MY_COMMENTS: {
    path: '/my-comments',
    name: 'MyCommentsPage',
    component: () => import('@/views/MyCommentPage.vue')
  }
}
