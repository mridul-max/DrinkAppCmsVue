<template>
    <div class="create-caregiver-form">
      <h1>Create Caregiver</h1>
  
      <!-- Form for Creating a Caregiver -->
      <form @submit.prevent="createCaregiver">
        <div class="form-group">
          <label for="firstName">First Name:</label>
          <input
            type="text"
            id="firstName"
            v-model="firstName"
            placeholder="Enter first name"
            required
          />
        </div>
  
        <div class="form-group">
          <label for="lastName">Last Name:</label>
          <input
            type="text"
            id="lastName"
            v-model="lastName"
            placeholder="Enter last name"
            required
          />
        </div>
  
        <div class="form-group">
          <label for="email">Email:</label>
          <input
            type="email"
            id="email"
            v-model="email"
            placeholder="Enter email"
            required
          />
        </div>
  
        <div class="form-group">
          <label for="phoneNumber">Phone Number:</label>
          <input
            type="text"
            id="phoneNumber"
            v-model="phoneNumber"
            placeholder="Enter phone number"
            required
          />
        </div>
  
        <div class="form-group">
          <label for="password">Password:</label>
          <input
            type="password"
            id="password"
            v-model="password"
            placeholder="Enter password"
            required
          />
        </div>
  
        <div class="form-group">
          <label for="role">Role:</label>
          <select id="role" v-model="role" required>
            <option value="carE_GIVER">Caregiver</option>
            <option value="admin">Admin</option>
          </select>
        </div>
  
        <div class="form-group">
          <label for="status">Status:</label>
          <select id="status" v-model="status" required>
            <option value="true">Active</option>
            <option value="false">Inactive</option>
          </select>
        </div>
  
        <!-- Submit Button -->
        <button type="submit" class="submit-btn">Create Caregiver</button>
      </form>
  
      <!-- Loading Indicator -->
      <div v-if="loading" class="loading">Creating caregiver...</div>
  
      <!-- Success Message -->
      <div v-if="successMessage" class="success">{{ successMessage }}</div>
  
      <!-- Error Message -->
      <div v-if="error" class="error">{{ error }}</div>
    </div>
    <BacktoDashboardButton />
  </template>
  
  <script>
  import azureApi from "@/api/axiosInstanceAzure"; // Import your Axios instance
  import BacktoDashboardButton from "@/components/BacktoDashboardButton.vue"; // Import the button
  azureApi.defaults.baseURL = "/api";
  
  export default {
    name: "CreateCaregiver",
    data() {
      return {
        firstName: "", // First name of the caregiver
        lastName: "", // Last name of the caregiver
        email: "", // Email of the caregiver
        phoneNumber: "", // Phone number of the caregiver
        password: "", // Password for the caregiver
        role: "carE_GIVER", // Default role is caregiver
        status: "true", // Default status is active
        loading: false, // Loading state
        successMessage: null, // Success message
        error: null, // Error message
      };
    },
    components: {
      BacktoDashboardButton, // Register the button
    },
    methods: {
      async createCaregiver() {
        if (
          !this.firstName ||
          !this.lastName ||
          !this.email ||
          !this.phoneNumber ||
          !this.password
        ) {
          this.error = "Please fill in all required fields.";
          return;
        }
  
        this.loading = true;
        this.error = null;
        this.successMessage = null;
  
        try {
          // Prepare the request body
          const requestBody = {
            firstName: this.firstName,
            lastName: this.lastName,
            email: this.email,
            phoneNumber: this.phoneNumber,
            password: this.password,
          };
  
          // Prepare the query parameters
          const queryParams = {
            role: this.role,
            status: this.status,
          };
  
          // Send the POST request (remove the unused `response` variable)
          await azureApi.post("/caregivers/register", requestBody, {
            params: queryParams,
          });
  
          // Show success message
          this.successMessage = "Caregiver created successfully!";
  
          // Clear the form
          this.firstName = "";
          this.lastName = "";
          this.email = "";
          this.phoneNumber = "";
          this.password = "";
          this.role = "carE_GIVER";
          this.status = "true";
        } catch (err) {
          // Handle errors
          this.error = err.response?.data?.detail || "Failed to create caregiver.";
        } finally {
          this.loading = false;
        }
      },
    },
  };
  </script>
  
  <style scoped>
  .create-caregiver-form {
    max-width: 600px;
    margin: 0 auto;
    padding: 20px;
    border: 1px solid #ccc;
    border-radius: 8px;
    box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
  }
  
  h1 {
    text-align: center;
    margin-bottom: 20px;
  }
  
  .form-group {
    margin-bottom: 15px;
  }
  
  label {
    font-weight: bold;
    display: block;
    margin-bottom: 5px;
  }
  
  input,
  select {
    width: 100%;
    padding: 10px;
    border: 1px solid #ccc;
    border-radius: 4px;
    font-size: 16px;
  }
  
  .submit-btn {
    width: 100%;
    padding: 10px;
    background-color: #007bff;
    color: white;
    border: none;
    border-radius: 4px;
    font-size: 16px;
    cursor: pointer;
  }
  
  .submit-btn:hover {
    background-color: #0056b3;
  }
  
  .loading {
    text-align: center;
    color: #007bff;
  }
  
  .success {
    text-align: center;
    color: green;
  }
  
  .error {
    text-align: center;
    color: red;
  }
  </style>