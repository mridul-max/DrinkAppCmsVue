<template>
    <div class="new-record-container">
      <h1>Create a New Drink Record</h1>
      <form @submit.prevent="handleSubmit">
        <div>
          <label for="patient_id">Patient ID:</label>
          <input type="text" v-model="formData.patient_id" required />
        </div>
        <div>
          <label for="amount_ml">Amount (ml):</label>
          <input type="number" v-model="formData.amount_ml" required />
        </div>
        <div>
          <label for="date">Date:</label>
          <input type="date" v-model="formData.date" required />
        </div>
        <button type="submit">Create Record</button>
      </form>
      <p v-if="successMessage" style="color: green;">{{ successMessage }}</p>
      <p v-if="errorMessage" style="color: red;">{{ errorMessage }}</p>
    </div>
  </template>
  
  <script>
import pythonApi from "@/api/axiosInstanceAzure";


export default {
  data() {
    return {
      formData: {
        patient_id: "",
        amount_ml: 0,
        date: "",
      },
      successMessage: "",
      errorMessage: "",
    };
  },
  methods: {
    async handleSubmit() {
      try {
        const response = await pythonApi.post(
          "/drinkrecord/newrecord", // Proxy handles base URL
          this.formData
        );
        this.successMessage = "Record created successfully!";
        this.errorMessage = "";
        console.log("Response:", response.data);
      } catch (error) {
        this.errorMessage =
          error.response?.data?.message || "Failed to create record.";
        this.successMessage = "";
        console.error("Error:", error);
      }
    },
  },
};

  </script>
  
  <style scoped>
  .new-record-container {
    margin: 50px;
  }
  form div {
    margin-bottom: 15px;
  }
  </style>
  