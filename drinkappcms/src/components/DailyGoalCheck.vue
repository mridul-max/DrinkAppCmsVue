<template>
    <div class="container">
      <h2>Daily Goal Checker for Patient</h2>
  
      <!-- Patient ID Form -->
      <form @submit.prevent="getDailyGoals">
        <div class="form-group">
          <label for="patient_id">Patient ID:</label>
          <input
            type="text"
            id="patient_id"
            v-model="patientId"
            class="form-control"
            placeholder="Enter patient ID"
            required
          />
        </div>
  
        <!-- Submit Button -->
        <button type="submit" class="btn btn-primary">Check Goals</button>
      </form>
  
      <!-- Loading Indicator -->
      <div v-if="loading" class="loading-indicator">
        <p>Loading...</p>
      </div>
  
      <!-- Error Messages -->
      <div v-if="error" class="error-message">
        <p>Error fetching daily goal: {{ error }}</p>
      </div>
  
      <!-- Display Daily Goals -->
      <div v-if="dailyGoal !== null && !loading">
        <h3>Patient's Daily Goals:</h3>
        <p>
          <strong>Daily Goal:</strong> {{ dailyGoal }} ml
        </p>
      </div>
  
      <!-- Back to Dashboard Button -->
      <BacktoDashboardButton />
    </div>
  </template>
  
  <script>
  import pythonApi from "@/api/axiosInstancefastapi"; // Axios instance for Python backend
  import BacktoDashboardButton from "@/components/BacktoDashboardButton.vue"; // Import the button
  
  export default {
    data() {
      return {
        patientId: "",
        dailyGoal: null, // To store the daily goal from Python backend
        loading: false,
        error: null, // Error for Python backend
      };
    },
    components: {
      BacktoDashboardButton, // Register the button
    },
    methods: {
      async getDailyGoals() {
        if (!this.patientId) {
          this.error = "Patient ID is required.";
          return;
        }
  
        this.loading = true;
        this.error = null;
        this.dailyGoal = null;
  
        try {
          // Call the Python backend for daily goal
          const response = await pythonApi.get("/patients/dailygoalcheck", {
            params: {
              patient_id: this.patientId,
            },
          });
          this.dailyGoal = response.data; // Store the daily goal
        } catch (err) {
          this.error = err.response
            ? err.response.data.detail || "Failed to fetch daily goal."
            : "Failed to fetch daily goal.";
        } finally {
          this.loading = false;
        }
      },
    },
  };
  </script>
  
  <style scoped>
  .container {
    max-width: 600px;
    margin: 0 auto;
    padding: 20px;
    background-color: #f8f9fa;
    border-radius: 8px;
    box-shadow: 0 4px 8px rgba(0, 0, 0, 0.1);
    position: relative; /* Ensure the button is positioned correctly */
  }
  
  h2 {
    text-align: center;
    margin-bottom: 20px;
  }
  
  .form-group {
    margin-bottom: 15px;
  }
  
  label {
    font-weight: bold;
  }
  
  input {
    width: 100%;
    padding: 8px;
    font-size: 16px;
    border: 1px solid #ced4da;
    border-radius: 4px;
  }
  
  button {
    width: 100%;
    padding: 10px;
    font-size: 16px;
    background-color: #007bff;
    color: white;
    border: none;
    border-radius: 4px;
    cursor: pointer;
  }
  
  button:hover {
    background-color: #0056b3;
  }
  
  .loading-indicator {
    text-align: center;
    margin-top: 20px;
  }
  
  .error-message {
    color: red;
    text-align: center;
    margin-top: 20px;
  }
  </style>