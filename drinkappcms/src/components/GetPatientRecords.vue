<template>
  <div class="drink-records-form">
    <h1>Drink Records</h1>

    <form @submit.prevent="fetchDrinkRecords" class="form">
      <div class="form-group">
        <label for="patient-id">Patient ID:</label>
        <input
          type="text"
          id="patient-id"
          v-model="patientId"
          placeholder="Enter Patient ID"
          required
        />
      </div>

      <button type="submit" class="submit-btn">Fetch Records</button>
    </form>

    <!-- Loading Indicator -->
    <div v-if="loading" class="loading">Loading...</div>
    
    <!-- Error Message -->
    <div v-if="error" class="error">{{ error }}</div>

    <!-- Drink Records Display -->
    <div v-if="drinkRecords && Object.keys(drinkRecords).length" class="records">
      <h2>Drink Amounts by Date:</h2>
      <div v-for="(records, date) in drinkRecords" :key="date" class="date-group">
        <h3>{{ formatDate(date) }}</h3>
        <ul>
          <li v-for="record in records" :key="record.id" class="record-item">
            <span>{{ record.amount_ml }} ml</span>
            <button @click="editRecord(record)" class="edit-btn">Edit</button>
          </li>
        </ul>
      </div>
    </div>
  </div>
</template>

<script>
import pythonApi from "@/api/axiosInstancefastapi"; // Adjust path if necessary

export default {
  name: "DrinkRecordsForm",
  data() {
    return {
      patientId: "", // Bound to the input field
      drinkRecords: null, // Holds the fetched records grouped by date
      loading: false, // Loading state
      error: null, // Error message
    };
  },
  methods: {
    async fetchDrinkRecords() {
      if (!this.patientId) {
        this.error = "Patient ID is required.";
        return;
      }

      this.loading = true;
      this.error = null;
      this.drinkRecords = null;

      try {
        const response = await pythonApi.get("/drinkrecords/patient", {
          params: { patient_id: this.patientId },
        });

        // Extract and sort the records by date
        const sortedRecords = response.data.map((record) => ({
          ...record,
          date: new Date(record.date), // Ensure the date is a Date object for sorting
        }));

        // Group records by date
        const groupedByDate = sortedRecords.reduce((acc, record) => {
          const dateString = record.date.toISOString().split("T")[0]; // Use date in 'YYYY-MM-DD' format
          if (!acc[dateString]) acc[dateString] = [];
          acc[dateString].push(record);
          return acc;
        }, {});

        // Sort dates in descending order
        this.drinkRecords = Object.keys(groupedByDate)
          .sort((a, b) => new Date(b) - new Date(a))
          .reduce((acc, date) => {
            acc[date] = groupedByDate[date];
            return acc;
          }, {});
      } catch (err) {
        this.error = err.response?.data?.detail || "Failed to fetch records.";
      } finally {
        this.loading = false;
      }
    },
    
    formatDate(date) {
      const d = new Date(date);
      return `${d.getDate().toString().padStart(2, '0')}-${(d.getMonth() + 1).toString().padStart(2, '0')}-${d.getFullYear()}`;
    },

    editRecord(record) {
      const newAmount = prompt("Enter new amount in ml:", record.amount_ml);
      if (newAmount && !isNaN(newAmount) && newAmount >= 0) {
        this.updateRecord(record.id, newAmount);
      } else {
        alert("Invalid input. Please enter a valid number.");
      }
    },

    async updateRecord(recordId, newAmount) {
      try {
        // Send the record_id as a query parameter and the amount_ml as part of the request body
        const response = await pythonApi.put("/drinkrecord/drinkrecord", {
          amount_ml: newAmount, // The amount_ml will be in the body as part of the update_request
        }, {
          params: {
            record_id: recordId, // The record_id will be sent as a query parameter
          },
        });

        // If the update is successful, find the record and update it locally
        const updatedRecord = response.data;

        // Update the local drinkRecords state with the updated amount
        for (let date in this.drinkRecords) {
          this.drinkRecords[date] = this.drinkRecords[date].map(record =>
            record.id === updatedRecord.id ? updatedRecord : record
          );
        }
      } catch (err) {
        this.error = err.response?.data?.detail || "Failed to update record.";
      }
    },
  },
};
</script>

<style scoped>
.drink-records-form {
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

input {
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
}

.error {
  text-align: center;
  color: red;
  margin-top: 10px;
}

.records {
  margin-top: 20px;
}

.records .date-group {
  margin-bottom: 20px;
}

.records .date-group h3 {
  font-size: 18px;
  color: #333;
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
  font-size: 18px;
  color: #333;
}

.records .edit-btn {
  background-color: #007bff;
  color: white;
  border: none;
  border-radius: 4px;
  cursor: pointer;
  padding: 5px 10px;
}

.records .edit-btn:hover {
  background-color: #0056b3;
}
</style>
