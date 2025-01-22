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
      <div v-if="goError" class="error-message">
        <p>Error fetching total daily goal: {{ goError }}</p>
      </div>
      <div v-if="pythonError" class="error-message">
        <p>Error fetching remaining daily goal: {{ pythonError }}</p>
      </div>
  
      <!-- Display Daily Goals -->
      <div v-if="(totalDailyGoal !== null || remainingDailyGoal !== null) && !loading">
        <h3>Patient's Daily Goals:</h3>
        <p v-if="totalDailyGoal !== null">
          <strong>Total Daily Goal:</strong> {{ totalDailyGoal }} ml
        </p>
        <p v-if="remainingDailyGoal !== null">
          <strong>Remaining Daily Goal:</strong> {{ remainingDailyGoal }} ml
        </p>
      </div>
  
      <!-- Back to Dashboard Button -->
      <BacktoDashboardButton />
    </div>
  </template>
  
  <script>
  import pythonApi from "@/api/axiosInstancefastapi"; // Axios instance for Python backend
  import goApi from "@/api/axiosInstanceGo"; // Axios instance for Go backend
  import BacktoDashboardButton from "@/components/BacktoDashboardButton.vue"; // Import the button
  
  export default {
    data() {
      return {
        patientId: "",
        totalDailyGoal: null, // To store the total daily goal from Go backend
        remainingDailyGoal: null, // To store the remaining daily goal from Python backend
        loading: false,
        goError: null, // Error for Go backend
        pythonError: null, // Error for Python backend
      };
    },
    components: {
      BacktoDashboardButton, // Register the button
    },
    methods: {
      async getDailyGoals() {
        if (!this.patientId) {
          this.goError = "Patient ID is required.";
          this.pythonError = "Patient ID is required.";
          return;
        }
  
        this.loading = true;
        this.goError = null;
        this.pythonError = null;
        this.totalDailyGoal = null;
        this.remainingDailyGoal = null;
  
        try {
          // Call the Go backend for total daily goal
          try {
            const goResponse = await goApi.get(`/patients/dailygoal?Id=${this.patientId}`);
            this.totalDailyGoal = goResponse.data; // Store the total daily goal
          } catch (goErr) {
            this.goError = goErr.response
              ? goErr.response.data.detail || "Failed to fetch total daily goal."
              : "Failed to fetch total daily goal.";
          }
  
          // Call the Python backend for remaining daily goal
          try {
            const pythonResponse = await pythonApi.get("/patients/dailygoalcheck", {
              params: {
                patient_id: this.patientId,
              },
            });
            this.remainingDailyGoal = pythonResponse.data; // Store the remaining daily goal
          } catch (pythonErr) {
            this.pythonError = pythonErr.response
              ? pythonErr.response.data.detail || "Failed to fetch remaining daily goal."
              : "Failed to fetch remaining daily goal.";
          }
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