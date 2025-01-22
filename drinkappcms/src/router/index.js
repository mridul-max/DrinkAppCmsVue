import { createRouter, createWebHistory } from 'vue-router'; // for Vue 3.x
import Login from '@/components/LoginForm.vue'; // Import the Login component
import NewRecord from '@/components/NewRecord.vue'; // Import other components
import Cookies from 'js-cookie'; // Import Cookies for token handling
import GetPatientRecords from '@/components/GetPatientRecords.vue'; 
import DailyGoalCheck from '@/components/DailyGoalCheck.vue';
import GetAllPatients from '@/components/GetAllPatients.vue';

const routes = [
  {
    path: '/', // Set the root path to login
    name: 'Login',
    component: Login,
  },
  {
    path: '/drinkrecord/newrecord',
    name: 'NewRecord',
    component: NewRecord,
    meta: { requiresAuth: true },
  },
  {
    path: '/drinkrecord/patientrecord',
    name: 'PatientRecord',
    component: GetPatientRecords,
    meta: { requiresAuth: true },
  },
  {
    path: '/patient/dailygoalcheck',
    name: 'DailyGoalCheck',
    component: DailyGoalCheck,
    meta: { requiresAuth: true },
  },
  {
    path: '/patients',
    name: 'GetAllPatients',
    component: GetAllPatients,
    meta: { requiresAuth: true },
  },
];

const router = createRouter({
  history: createWebHistory(),
  routes,
});

// Navigation guard to check for authentication
router.beforeEach((to, from, next) => {
  // If the route requires authentication
  if (to.matched.some((record) => record.meta.requiresAuth)) {
    const token = Cookies.get('jwtToken');
    if (!token) {
      // If no token, redirect to login page
      next('/login');
    } else {
      next(); // Allow access
    }
  } else {
    next(); // Allow access if no auth is required
  }
});

export default router;
