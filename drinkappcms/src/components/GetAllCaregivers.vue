<template>
    <div class="caregiver-records-form">
      <h1>Caregiver Records</h1>
  
      <!-- Loading Indicator -->
      <div v-if="loading" class="loading">Loading...</div>
  
      <!-- Error Message -->
      <div v-if="error" class="error">{{ error }}</div>
  
      <!-- Caregiver Records Display -->
      <div v-if="caregivers && caregivers.length" class="records">
        <h2>Caregiver List</h2>
        <div class="table-container">
          <!-- Table Header -->
          <div class="table-header">
            <span>ID</span>
            <span>Name</span>
            <span>Email</span>
            <span>Phone Number</span>
          </div>
  
          <!-- Table Rows -->
          <div
            v-for="caregiver in caregivers"
            :key="caregiver.id"
            class="record-item"
            @click="fetchCaregiverDetails(caregiver.id)"
          >
            <span>{{ caregiver.id }}</span>
            <span>{{ caregiver.fullName }}</span>
            <span>{{ caregiver.email }}</span>
            <span>{{ caregiver.phoneNumber }}</span>
          </div>
        </div>
      </div>
  
      <!-- Modal for Caregiver Details -->
      <div v-if="selectedCaregiver" class="modal-overlay" @click="closeModal">
        <div class="modal-content" @click.stop>
          <h2>Caregiver Details</h2>
          <div class="caregiver-details">
            <p><strong>ID:</strong> {{ selectedCaregiver.id }}</p>
            <p><strong>Full Name:</strong> {{ selectedCaregiver.fullName }}</p>
            <p><strong>Email:</strong> {{ selectedCaregiver.email }}</p>
            <p><strong>Phone Number:</strong> {{ selectedCaregiver.phoneNumber }}</p>
          </div>
  
          <!-- Assign Patient Button -->
          <button @click="openAssignPatientModal" class="assign-btn">Assign Patient</button>
  
          <!-- Close Modal Button -->
          <button @click="closeModal" class="close-btn">Close</button>
        </div>
      </div>
  
      <!-- Modal for Assigning a Patient -->
      <div v-if="showAssignPatientModal" class="modal-overlay" @click="closeAssignPatientModal">
        <div class="modal-content" @click.stop>
          <h2>Assign Patient to Caregiver</h2>
          <div class="assign-patient-form">
            <label for="patientId">Patient ID:</label>
            <input
              type="text"
              id="patientId"
              v-model="patientId"
              placeholder="Enter patient ID"
              class="form-input"
            />
          </div>
  
          <!-- Assign Button -->
          <button @click="assignPatient" class="assign-btn">Assign</button>
  
          <!-- Close Modal Button -->
          <button @click="closeAssignPatientModal" class="close-btn">Close</button>
        </div>
      </div>
      <BacktoDashboardButton />
    </div>
  </template>
  
  <script>
  // Import the azureApi instance
  import azureApi from "@/api/axiosInstanceAzure"; // Adjust path if needed
  azureApi.defaults.baseURL = "/api";
  import BacktoDashboardButton from "@/components/BacktoDashboardButton.vue"; // Import the button
  
  export default {
    name: "CaregiverRecords",
    data() {
      return {
        caregivers: [], // Holds the fetched caregiver records
        selectedCaregiver: null, // Holds the details of the selected caregiver
        loading: false, // Loading state
        error: null, // Error message
        showAssignPatientModal: false, // Controls the visibility of the assign patient modal
        patientId: "", // Holds the patient ID for assignment
      };
    },
    mounted() {
      this.fetchCaregivers(); // Fetch caregivers when component is mounted
    },
    components: {
      BacktoDashboardButton, // Register the button
    },
    methods: {
      async fetchCaregivers() {
        this.loading = true;
        this.error = null;
  
        try {
          // Use the azureApi instance for the GET request
          const response = await azureApi.get("/caregivers");
  
          // Process the response and format the caregiver data
          this.caregivers = response.data.map((caregiver) => ({
            id: caregiver.id,
            fullName: `${caregiver.firstName} ${caregiver.lastName}`,
            email: caregiver.email,
            phoneNumber: caregiver.phoneNumber,
          }));
        } catch (err) {
          this.error = err.response?.data?.detail || "Failed to fetch caregivers.";
        } finally {
          this.loading = false;
        }
      },
  
      async fetchCaregiverDetails(caregiverId) {
        this.loading = true;
        this.error = null;
  
        try {
          // Fetch details for the selected caregiver
          const response = await azureApi.get(`/caregivers/${caregiverId}`);
  
          // Format the selected caregiver data
          this.selectedCaregiver = {
            id: response.data.id,
            fullName: `${response.data.firstName} ${response.data.lastName}`,
            email: response.data.email,
            phoneNumber: response.data.phoneNumber,
          };
        } catch (err) {
          this.error = err.response?.data?.detail || "Failed to fetch caregiver details.";
        } finally {
          this.loading = false;
        }
      },
  
      openAssignPatientModal() {
        this.showAssignPatientModal = true; // Open the assign patient modal
      },
  
      closeAssignPatientModal() {
        this.showAssignPatientModal = false; // Close the assign patient modal
        this.patientId = ""; // Clear the patient ID input
      },
  
      async assignPatient() {
        if (!this.selectedCaregiver || !this.patientId) {
          this.error = "Please enter a valid patient ID.";
          return;
        }
  
        this.loading = true;
        this.error = null;
  
        try {
          // Assign the patient to the caregiver
          await azureApi.put(
            `/caregivers/${this.selectedCaregiver.id}/patients/${this.patientId}/assign`
          );
  
          // Show success message
          alert("Patient assigned successfully!");
  
          // Close the assign patient modal
          this.closeAssignPatientModal();
        } catch (err) {
          this.error = err.response?.data?.detail || "Failed to assign patient.";
        } finally {
          this.loading = false;
        }
      },
  
      closeModal() {
        this.selectedCaregiver = null; // Close the modal by clearing the selected caregiver
      },
    },
  };
  </script>
  
  <style scoped>
  .caregiver-records-form {
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
    grid-template-columns: repeat(4, 1fr); /* 4 columns for ID, Name, Email, Phone Number */
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
  
  .caregiver-details p {
    margin: 10px 0;
  }
  
  .assign-btn {
    display: block;
    margin: 20px auto 10px;
    padding: 10px 20px;
    background-color: #28a745;
    color: white;
    border: none;
    border-radius: 4px;
    cursor: pointer;
  }
  
  .close-btn {
    display: block;
    margin: 10px auto 0;
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
  
  .assign-patient-form {
    margin-bottom: 20px;
  }
  
  .form-input {
    width: 100%;
    padding: 10px;
    border: 1px solid #ccc;
    border-radius: 4px;
    font-size: 16px;
  }
  </style>