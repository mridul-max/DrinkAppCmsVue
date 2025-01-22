<template>
  <div class="dashboard">
    <!-- Logo -->
    <div class="logo-container">
      <img src="@/assets/logo.webp" alt="Drink App Logo" class="logo" />
    </div>

    <!-- User Info -->
    <div class="user-info" v-if="userRole && userPhoneNumber">
      <p class="user-role">{{ userRole }}</p>
      <p class="user-phone">{{ userPhoneNumber }}</p>
    </div>

    <!-- Heading -->
    <h1>Welcome to the Drink App CMS</h1>

    <!-- Dashboard Links -->
    <div class="dashboard-links">
      <router-link to="/drinkrecord/newrecord" class="dashboard-link">
        Create New Drink Record
      </router-link>
      <router-link to="/drinkrecord/patientrecord" class="dashboard-link">
        View/Edit Patient Records
      </router-link>
      <router-link to="/patient/dailygoalcheck" class="dashboard-link">
        Daily Goal Check
      </router-link>
      <router-link to="/patients" class="dashboard-link">
        View/Edit All Patients
      </router-link>
      <router-link to="/caregiver" class="dashboard-link">
        View/Assign Caregiver
      </router-link>
      <router-link to="/caregiver/register" class="dashboard-link">
        Register Caregiver
      </router-link>
    </div>
  </div>
</template>

<script>
import Cookies from "js-cookie";
import jwt_decode from "jwt-decode"; // Ensure this library is installed

export default {
  name: 'DashboardPage',
  data() {
    return {
      userRole: null, // To store the user's role
      userPhoneNumber: null, // To store the user's phone number
    };
  },
  mounted() {
    this.fetchUserInfo(); // Fetch user info when the component is mounted
  },
  methods: {
    fetchUserInfo() {
      const token = Cookies.get("jwtToken"); // Get the JWT token from cookies
      if (token) {
        try {
          const decodedToken = jwt_decode(token); // Decode the token
          this.userRole = decodedToken.userRole; // Extract the role
          this.userPhoneNumber = decodedToken.userPhoneNumber; // Extract the phone number
        } catch (error) {
          console.error("Error decoding token:", error);
        }
      }
    },
  },
};
</script>

<style scoped>
.dashboard {
  max-width: 800px;
  margin: 0 auto;
  padding: 20px;
  text-align: center;
}

.logo-container {
  margin-bottom: 20px;
}

.logo {
  max-width: 150px; /* Adjust the size of the logo as needed */
  height: auto;
  border-radius: 50%; /* Optional: Makes the logo circular */
  box-shadow: 0 4px 8px rgba(0, 0, 0, 0.1); /* Optional: Adds a subtle shadow */
}

.user-info {
  margin-bottom: 20px;
}

.user-role,
.user-phone {
  margin: 5px 0;
  font-size: 16px;
  color: #555;
}

h1 {
  margin-bottom: 30px;
  font-size: 28px;
  color: #333;
}

.dashboard-links {
  display: flex;
  flex-direction: column;
  gap: 15px;
  margin-top: 20px;
}

.dashboard-link {
  padding: 15px;
  background-color: #007bff;
  color: white;
  text-decoration: none;
  border-radius: 5px;
  font-size: 18px;
  transition: background-color 0.3s ease;
}

.dashboard-link:hover {
  background-color: #0056b3;
}
</style>