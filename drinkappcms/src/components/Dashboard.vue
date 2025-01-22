<template>
    <div class="dashboard">
      <h1>Welcome to the Drink App CMS</h1>
      <div class="dashboard-links">
        <router-link to="/drinkrecord/newrecord" class="dashboard-link">
          Create New Drink Record
        </router-link>
        <router-link to="/drinkrecord/patientrecord" class="dashboard-link">
          View/Edit Patient Records
        </router-link>
        <router-link to="/patient/dailygoalcheck" class="dashboard-link">
          Daily Goal Check
        </router-link>
        <router-link to="/patients" class="dashboard-link">
          View/Edit All Patients
        </router-link>
        <router-link to="/patient/phoneNumber" class="dashboard-link">
          View Patient Phone Number
        </router-link>
        <router-link to="/caregiver" class="dashboard-link">
          View/Assign Caregiver
        </router-link>
        <router-link to="/caregiver/register" class="dashboard-link">
          Register Caregiver
        </router-link>
      </div>
    </div>
  </template>
  
  <script>
  export default {
    name: 'DashboardPage',
  };
  </script>
  
  <style scoped>
  .dashboard {
    max-width: 800px;
    margin: 0 auto;
    padding: 20px;
    text-align: center;
  }
  
  .dashboard-links {
    display: flex;
    flex-direction: column;
    gap: 15px;
    margin-top: 30px;
  }
  
  .dashboard-link {
    padding: 15px;
    background-color: #007bff;
    color: white;
    text-decoration: none;
    border-radius: 5px;
    font-size: 18px;
    transition: background-color 0.3s ease;
  }
  
  .dashboard-link:hover {
    background-color: #0056b3;
  }
  </style>