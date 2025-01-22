<template>
    <button @click="goToDashboard" class="back-to-dashboard-btn">
      Back to Dashboard
    </button>
  </template>
  
  <script>
  export default {
    name: "BackToDashboardButton",
    methods: {
      goToDashboard() {
        this.$router.push("/dashboard"); // Navigate to the dashboard
      },
    },
  };
  </script>
  
  <style scoped>
  .back-to-dashboard-btn {
    position: fixed;
    bottom: 20px;
    right: 20px;
    padding: 10px 20px;
    background-color: #007bff;
    color: white;
    border: none;
    border-radius: 4px;
    cursor: pointer;
    font-size: 16px;
    z-index: 1000; /* Ensure it's above other content */
  }
  
  .back-to-dashboard-btn:hover {
    background-color: #0056b3;
  }
  </style>