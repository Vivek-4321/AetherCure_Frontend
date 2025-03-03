// src/router/index.js
import { createRouter, createWebHistory } from 'vue-router'
import { isAuthenticated } from '../components/SessionHandler.js'
import { toast } from 'vue3-toastify'
import 'vue3-toastify/dist/index.css'

import Home from '../components/Home.vue'
import Login from '../components/Login.vue'
import Signup from '../components/Signup.vue'
import VideoCall from '../components/VideoCall.vue'
import OTP from '../components/Otp.vue'
import ForgotPassword from '../components/ForgotPassword.vue'
import RequestPasswordReset from '../components/RequestPasswordReset.vue'
import NewPassword from '../components/NewPassword.vue'
import SharedFileView from '../components/SharedFileView.vue'
import FileViewer from '../components/FileViewer.vue'

const routes = [
  {
    path: '/',
    name: 'Home',
    component: Home,
    meta: { requiresAuth: true } // Add auth requirement
  },
  {
    path: '/login',
    name: 'Login',
    component: Login,
    meta: { guest: true } // Guest route
  },
  {
    path: '/signup',
    name: 'Signup',
    component: Signup,
    meta: { guest: true } // Guest route
  },
  {
    path: '/videocall/:roomId?',
    name: 'VideoCall',
    component: VideoCall,
    meta: { requiresAuth: true } // Add auth requirement
  },
  {
    path: '/otp/:id',
    name: 'OTP',
    component: OTP,
    meta: { guest: true } // Guest route
  },
  {
    path: '/forgot-password',
    name: 'ForgotPassword',
    component: ForgotPassword,
    meta: { guest: true } // Guest route
  },
  {
    path: '/request-password-reset',
    name: 'RequestPasswordReset',
    component: RequestPasswordReset,
    meta: { guest: true } // Guest route
  },
  {
    path: '/new-password/:id',
    name: 'NewPassword',
    component: NewPassword,
    meta: { guest: true } // Guest route
  },
  {
    path: '/shared/:shareId',
    name: 'SharedFileView',
    component: SharedFileView,
  },
  {
    path: '/view/:ipfsHash/:fileType?/:fileName?',
    name: 'FileViewer',
    component: FileViewer,
    props: true
  }
]

const router = createRouter({
  history: createWebHistory(),
  routes
})

// Global navigation guard
router.beforeEach((to, from, next) => {
  const authenticated = isAuthenticated()

  // Redirect authenticated users away from login/signup pages
  if (to.matched.some(record => record.meta.guest) && authenticated) {
    next({ name: 'Home' })
    return
  }

  // Protect authenticated routes
  if (to.matched.some(record => record.meta.requiresAuth) && !authenticated) {
    // Clear any stale tokens
    localStorage.removeItem('authToken')
    localStorage.removeItem('userId')

    // Show message if coming from a protected page (not initial load)
    if (from.name) {
      toast.info('Your session has expired. Please log in again.', {
        position: toast.POSITION.TOP_CENTER,
        autoClose: 3000,
        theme: 'colored'
      })
    }

    next({
      name: 'Login',
      query: { redirect: to.fullPath } // Store the path user was trying to visit
    })
    return
  }

  next()
})

export default router