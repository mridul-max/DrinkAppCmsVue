<template>
  <div class="login-container">
    <h1>Login</h1>
    <form @submit.prevent="handleLogin">
      <div>
        <label for="phoneNumber">Phone Number:</label>
        <input type="text" v-model="phoneNumber" required />
      </div>
      <div>
        <label for="password">Password:</label>
        <input type="password" v-model="password" required />
      </div>
      <button type="submit">Login</button>
    </form>
    <p v-if="errorMessage" style="color: red;">{{ errorMessage }}</p>
  </div>
</template>

<script>
import axios from "axios";
import Cookies from "js-cookie";
axios.defaults.baseURL = '/api';
export default {
  data() {
    return {
      phoneNumber: "",
      password: "",
      errorMessage: "",
    };
  },
  methods: {
    async handleLogin() {
try {
  const response = await axios.post("/Login", {
    phoneNumber: this.phoneNumber,
    password: this.password,
  });

  const token = response.data.accessToken;
  Cookies.set("jwtToken", token, { expires: 1, secure: true });
  alert("Login successful! Token stored in cookies.");

  // Optionally set a success message instead of redirecting
  this.successMessage = "Logged in successfully!";
  this.errorMessage = "";

  // No redirect here; user stays on the login page or wherever they are
} catch (error) {
  this.errorMessage =
    error.response?.data?.message || "Login failed. Please try again.";
  this.successMessage = "";
      }
    },
  },
};
</script>

<style scoped>
.login-container {
  margin: 50px;
}
</style>
