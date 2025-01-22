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
        <div class="table-container">
          <!-- Table Header -->
          <div class="table-header">
            <span>ID</span>
            <span>Name</span>
            <span>Email</span>
            <span>Phone Number</span>
            <span>Status</span>
            <span>Daily Goal</span>
          </div>
  
          <!-- Table Rows -->
          <div
            v-for="patient in patients"
            :key="patient.id"
            class="record-item"
            @click="fetchPatientDetails(patient.id)"
          >
            <span>{{ patient.id }}</span>
            <span>{{ patient.fullName }}</span>
            <span>{{ patient.email }}</span>
            <span>{{ patient.phoneNumber }}</span>
            <span>{{ patient.active ? 'Active' : 'Inactive' }}</span>
            <span>{{ patient.dailyGoal }} ml</span>
          </div>
        </div>
      </div>
  
      <!-- Modal for Patient Details -->
      <div v-if="selectedPatient" class="modal-overlay" @click="closeModal">
        <div class="modal-content" @click.stop>
          <h2>Patient Details</h2>
          <div class="patient-details">
            <p><strong>ID:</strong> {{ selectedPatient.id }}</p>
            <p><strong>Full Name:</strong> {{ selectedPatient.fullName }}</p>
            <p><strong>Email:</strong> {{ selectedPatient.email }}</p>
            <p><strong>Phone Number:</strong> {{ selectedPatient.phoneNumber }}</p>
            <p><strong>Status:</strong> {{ selectedPatient.active ? 'Active' : 'Inactive' }}</p>
            <p><strong>Daily Goal:</strong> {{ selectedPatient.dailyGoal }} ml</p>
          </div>
  
          <!-- Activate and Deactivate Buttons -->
          <div class="action-buttons">
            <button
              v-if="!selectedPatient.active"
              @click="updatePatientStatus(true)"
              class="activate-btn"
            >
              Activate Patient
            </button>
            <button
              v-if="selectedPatient.active"
              @click="updatePatientStatus(false)"
              class="deactivate-btn"
            >
              Deactivate Patient
            </button>
          </div>
  
          <!-- Close Modal Button -->
          <button @click="closeModal" class="close-btn">Close</button>
        </div>
      </div>
      <BacktoDashboardButton />
    </div>
  </template>
  
  <script>
  // Import the azureApi instance
  import azureApi from "@/api/axiosInstanceAzure"; // Adjust path if needed
  import BacktoDashboardButton from "@/components/BacktoDashboardButton.vue"; // Import the button
  azureApi.defaults.baseURL = "/api";
  
  export default {
    name: "PatientRecords",
    data() {
      return {
        patients: [], // Holds the fetched patient records
        selectedPatient: null, // Holds the details of the selected patient
        loading: false, // Loading state
        error: null, // Error message
      };
    },
    mounted() {
      this.fetchPatients(); // Fetch patients when component is mounted
    },
    components: {
      BacktoDashboardButton, // Register the button
    },
    methods: {
      async fetchPatients() {
        this.loading = true;
        this.error = null;
  
        try {
          // Use the azureApi instance for the GET request
          const response = await azureApi.get("/patients");
  
          // Process the response and format the patient data
          this.patients = response.data.map((patient) => ({
            id: patient.id,
            fullName: `${patient.firstName} ${patient.lastName}`,
            email: patient.email,
            phoneNumber: patient.phoneNumber,
            active: patient.active,
            dailyGoal: patient.dailyGoal, // Only include dailyGoal
          }));
        } catch (err) {
          this.error = err.response?.data?.detail || "Failed to fetch patients.";
        } finally {
          this.loading = false;
        }
      },
  
      async fetchPatientDetails(patientId) {
        this.loading = true;
        this.error = null;
  
        try {
          // Fetch details for the selected patient
          const response = await azureApi.get(`/patients/${patientId}`);
  
          // Format the selected patient data
          this.selectedPatient = {
            id: response.data.id,
            fullName: `${response.data.firstName} ${response.data.lastName}`,
            email: response.data.email,
            phoneNumber: response.data.phoneNumber,
            active: response.data.active,
            dailyGoal: response.data.dailyGoal, // Only include dailyGoal
          };
        } catch (err) {
          this.error = err.response?.data?.detail || "Failed to fetch patient details.";
        } finally {
          this.loading = false;
        }
      },
  
      async updatePatientStatus(newStatus) {
        if (!this.selectedPatient) return;
  
        this.loading = true;
        this.error = null;
  
        try {
          // Update the patient's status
          await azureApi.put(
            `/users/${this.selectedPatient.id}/deactivate?status=${newStatus}`
          );
  
          // Update the selected patient's status locally
          this.selectedPatient.active = newStatus;
  
          // Update the patient's status in the list
          const patientIndex = this.patients.findIndex(
            (p) => p.id === this.selectedPatient.id
          );
          if (patientIndex !== -1) {
            this.patients[patientIndex].active = newStatus;
          }
        } catch (err) {
          this.error = err.response?.data?.detail || "Failed to update patient status.";
        } finally {
          this.loading = false;
        }
      },
  
      closeModal() {
        this.selectedPatient = null; // Close the modal by clearing the selected patient
      },
    },
  };
  </script>
  
  <style scoped>
  .patient-records-form {
    max-width: 1200px;
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
  
  .table-container {
    display: flex;
    flex-direction: column;
    gap: 10px;
  }
  
  .table-header,
  .record-item {
    display: grid;
    grid-template-columns: repeat(6, 1fr); /* Adjusted to 6 columns */
    gap: 10px;
    padding: 10px;
    border-radius: 4px;
  }
  
  .table-header {
    background-color: #007bff;
    color: white;
    font-weight: bold;
  }
  
  .record-item {
    background-color: #f9f9f9;
    border: 1px solid #ddd;
    cursor: pointer;
  }
  
  .record-item:hover {
    background-color: #f1f1f1;
  }
  
  .record-item span {
    font-size: 16px;
    color: #333;
  }
  
  /* Modal Styles */
  .modal-overlay {
    position: fixed;
    top: 0;
    left: 0;
    width: 100%;
    height: 100%;
    background-color: rgba(0, 0, 0, 0.5);
    display: flex;
    justify-content: center;
    align-items: center;
  }
  
  .modal-content {
    background-color: white;
    padding: 20px;
    border-radius: 8px;
    max-width: 500px;
    width: 100%;
  }
  
  .patient-details p {
    margin: 10px 0;
  }
  
  .action-buttons {
    display: flex;
    gap: 10px;
    justify-content: center;
    margin-top: 20px;
  }
  
  .activate-btn {
    background-color: #28a745;
    color: white;
    padding: 10px 20px;
    border: none;
    border-radius: 4px;
    cursor: pointer;
  }
  
  .deactivate-btn {
    background-color: #dc3545;
    color: white;
    padding: 10px 20px;
    border: none;
    border-radius: 4px;
    cursor: pointer;
  }
  
  .close-btn {
    display: block;
    margin: 20px auto 0;
    padding: 10px 20px;
    background-color: #007bff;
    color: white;
    border: none;
    border-radius: 4px;
    cursor: pointer;
  }
  
  .close-btn:hover {
    background-color: #0056b3;
  }
  </style>