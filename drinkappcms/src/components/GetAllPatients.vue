<template>
    <div class="patient-records-form">
      <h1>Patient Records</h1>
  
      <!-- Loading Indicator -->
      <div v-if="loading" class="loading">Loading...</div>
      
      <!-- Error Message -->
      <div v-if="error" class="error">{{ error }}</div>
  
      <!-- Patient Records Display -->
      <div v-if="patients && patients.length" class="records">
        <h2>Patient List</h2>
        <ul>
          <li v-for="patient in patients" :key="patient.id" class="record-item">
            <span>{{ patient.fullName }}</span>
            <span>{{ patient.email }}</span>
            <span>{{ patient.phoneNumber }}</span>
            <span>{{ patient.active ? 'Active' : 'Inactive' }}</span>
            <span>Daily Limit: {{ patient.dailyLimit }} ml</span>
            <span>Daily Goal: {{ patient.dailyGoal }} ml</span>
          </li>
        </ul>
      </div>
    </div>
  </template>
  
  <script>
  // Import the azureApi instance
  import azureApi from "@/api/axiosInstanceAzure"; // Adjust path if needed
  
  export default {
    name: "PatientRecords",
    data() {
      return {
        patients: [], // Holds the fetched patient records
        loading: false, // Loading state
        error: null, // Error message
      };
    },
    mounted() {
      this.fetchPatients(); // Fetch patients when component is mounted
    },
    methods: {
      async fetchPatients() {
        this.loading = true;
        this.error = null;
        
        try {
          // Use the azureApi instance for the GET request
          const response = await azureApi.get("/patients");
          
          // Process the response and format the patient data
          this.patients = response.data.map(patient => ({
            id: patient.id,
            fullName: `${patient.firstName} ${patient.lastName}`,
            email: patient.email,
            phoneNumber: patient.phoneNumber,
            active: patient.active,
            dailyLimit: patient.dailyLimit,
            dailyGoal: patient.dailyGoal,
          }));
          
        } catch (err) {
          this.error = err.response?.data?.detail || "Failed to fetch patients.";
        } finally {
          this.loading = false;
        }
      },
    },
  };
  </script>
  
  <style scoped>
  .patient-records-form {
    max-width: 800px;
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
  
  .loading {
    text-align: center;
    color: #007bff;
  }
  
  .error {
    text-align: center;
    color: red;
    margin-top: 10px;
  }
  
  .records {
    margin-top: 20px;
  }
  
  .records ul {
    list-style: none;
    padding: 0;
  }
  
  .records .record-item {
    background-color: #f9f9f9;
    padding: 10px;
    margin-bottom: 10px;
    border: 1px solid #ddd;
    border-radius: 4px;
    display: flex;
    justify-content: space-between;
  }
  
  .records .record-item span {
    font-size: 16px;
    color: #333;
  }
  </style>
  