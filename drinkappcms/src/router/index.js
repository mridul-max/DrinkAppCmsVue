import { createRouter, createWebHistory } from 'vue-router'; // for Vue 3.x
import Login from '@/components/LoginForm.vue';
import NewRecord from '@/components/NewRecord.vue';
import Cookies from 'js-cookie';

const routes = [
  {
    path: "/login",
    name: "Login",
    component: Login,
  },
  {
    path: "/drinkrecord/newrecord",
    name: "NewRecord",
    component: NewRecord,
    meta: { requiresAuth: true },
  },
];

const router = createRouter({
  history: createWebHistory(),
  routes,
});

// Navigation guard to check for authentication
router.beforeEach((to, from, next) => {
  if (to.matched.some((record) => record.meta.requiresAuth)) {
    const token = Cookies.get("jwtToken");
    if (!token) {
      next("/login");
    } else {
      next();
    }
  } else {
    next();
  }
});

export default router;
