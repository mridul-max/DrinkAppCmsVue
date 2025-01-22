<template>
    <div class="container">
      <h2>Daily Goal Checker for Patient</h2>
  
      <!-- Patient ID Form -->
      <form @submit.prevent="getDailyGoal">
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
        <button type="submit" class="btn btn-primary">Check Goal</button>
      </form>
  
      <!-- Loading Indicator -->
      <div v-if="loading" class="loading-indicator">
        <p>Loading...</p>
      </div>
  
      <!-- Error Message -->
      <div v-if="error" class="error-message">
        <p>Error: {{ error }}</p>
      </div>
  
      <!-- Display Daily Goal -->
      <div v-if="dailyGoal !== null && !loading">
        <h3>Patient's Daily Goal:</h3>
        <p><strong>Goal Value:</strong> {{ dailyGoal }}</p>
      </div>
    </div>
  </template>
  
  <script>
  import pythonApi from "@/api/axiosInstancefastapi"; // Path to your axios instance
  
  export default {
    data() {
      return {
        patientId: "",
        dailyGoal: null, // To store the returned daily goal value
        loading: false,
        error: null,
      };
    },
    methods: {
      async getDailyGoal() {
        if (!this.patientId) {
          this.error = "Patient ID is required.";
          return;
        }
  
        this.loading = true;
        this.error = null;
        try {
          // Call the FastAPI endpoint with the provided patient_id
          const response = await pythonApi.get("/patients/dailygoalcheck", {
            params: {
              patient_id: this.patientId,
            },
          });
  
          // Store the returned daily goal value
          this.dailyGoal = response.data; // Assuming the response is a float (the daily goal value)
        } catch (err) {
          // Handle any error
          this.error = err.response ? err.response.data.detail : "An error occurred.";
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
  
  ul {
    list-style-type: none;
    padding-left: 0;
  }
  
  li {
    background-color: #f1f1f1;
    margin-bottom: 8px;
    padding: 10px;
    border-radius: 4px;
  }
  </style>
  