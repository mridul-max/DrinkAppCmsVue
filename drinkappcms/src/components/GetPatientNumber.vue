<template>
    <div class="get-patient-phone-number">
      <h1>Retrieve Patient Phone Number</h1>
  
      <!-- Form to input patient ID -->
      <form @submit.prevent="fetchPhoneNumber" class="form">
        <div class="form-group">
          <label for="patientId">Patient ID:</label>
          <input
            type="text"
            id="patientId"
            v-model="patientId"
            placeholder="Enter patient ID"
            required
            class="form-input"
          />
        </div>
  
        <button type="submit" class="submit-btn">Get Phone Number</button>
      </form>
  
      <!-- Loading Indicator -->
      <div v-if="loading" class="loading">Fetching phone number...</div>
  
      <!-- Display the phone number -->
      <div v-if="phoneNumber" class="phone-number">
        <strong>Phone Number:</strong> {{ phoneNumber }}
      </div>
  
      <!-- Error Message -->
      <div v-if="error" class="error">{{ error }}</div>
      <BacktoDashboardButton />
    </div>
  </template>
  
  <script>
  import axios from '@/api/axiosInstanceGo'; // Import your Axios instance
  import BacktoDashboardButton from "@/components/BacktoDashboardButton.vue"; // Import the button
  axios.defaults.baseURL = "/go-api"
  
  export default {
    name: 'GetPatientPhoneNumber',
    data() {
      return {
        patientId: '', // Patient ID input
        phoneNumber: '', // Retrieved phone number
        loading: false, // Loading state
        error: '', // Error message
      };
    },
    components: {
      BacktoDashboardButton, // Register the button
    },
    methods: {
      async fetchPhoneNumber() {
        if (!this.patientId) {
          this.error = 'Please enter a valid patient ID.';
          return;
        }
  
        this.loading = true;
        this.error = '';
        this.phoneNumber = '';
  
        try {
          // Make the GET request to retrieve the phone number
          const response = await axios.get(`/patient/phoneNumber?Id=${this.patientId}`);
          
          // Set the phone number from the response
          this.phoneNumber = response.data;
        } catch (err) {
          // Handle errors
          this.error = err.response?.data?.message || 'Failed to fetch phone number.';
        } finally {
          this.loading = false;
        }
      },
    },
  };
  </script>
  
  <style scoped>
  .get-patient-phone-number {
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
  
  .form {
    display: flex;
    flex-direction: column;
  }
  
  .form-group {
    margin-bottom: 15px;
  }
  
  label {
    font-weight: bold;
    margin-bottom: 5px;
    display: block;
  }
  
  .form-input {
    width: 100%;
    padding: 10px;
    border: 1px solid #ccc;
    border-radius: 4px;
    font-size: 16px;
  }
  
  .submit-btn {
    background-color: #007bff;
    color: #fff;
    padding: 10px 15px;
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
    margin-top: 10px;
  }
  
  .phone-number {
    text-align: center;
    margin-top: 10px;
    font-size: 18px;
    color: green;
  }
  
  .error {
    text-align: center;
    color: red;
    margin-top: 10px;
  }
  </style>