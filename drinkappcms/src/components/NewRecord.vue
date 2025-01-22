<template>
  <div class="create-drink-record-form">
    <h1>Create a New Drink Record</h1>

    <!-- Form for creating a new drink record -->
    <form @submit.prevent="submitDrinkRecord" class="form">
      <div class="form-group">
        <label for="phone_number">Patient Phone Number:</label>
        <input
          type="text"
          id="phone_number"
          v-model="phone_number"
          placeholder="Enter patient phone number"
          required
        />
      </div>

      <div class="form-group">
        <label for="amount_ml">Amount (ml):</label>
        <input
          type="number"
          id="amount_ml"
          v-model="amount_ml"
          placeholder="Enter amount in ml"
          required
          min="1"
        />
      </div>

      <button type="submit" class="submit-btn">Create Record</button>
    </form>

    <!-- Loading Indicator -->
    <div v-if="loading" class="loading">Submitting...</div>

    <!-- Success Message -->
    <div v-if="successMessage" class="success">{{ successMessage }}</div>

    <!-- Error Message -->
    <div v-if="error" class="error">{{ error }}</div>
  </div>
  <BacktoDashboardButton />
</template>

<script>
// Importing the custom axios instance
import pythonApi from '@/api/axiosInstancefastapi'; // Adjust path as necessary
import BacktoDashboardButton from "@/components/BacktoDashboardButton.vue"; // Import the button

export default {
  name: 'CreateDrinkRecordForm',
  data() {
    return {
      phone_number: '', // Phone number of the patient
      amount_ml: '', // Amount of drink in milliliters
      loading: false, // Loading state
      successMessage: null, // Success message
      error: null, // Error message
    };
  },
  components: {
      BacktoDashboardButton, // Register the button
    },
  methods: {
    async submitDrinkRecord() {
      if (!this.phone_number || !this.amount_ml || this.amount_ml <= 0) {
        this.error = 'Please enter valid phone number and amount in ml.';
        return;
      }

      this.loading = true;
      this.error = null;
      this.successMessage = null;

      try {
        // Encode the phone number if it starts with a '+'
        const encodedPhoneNumber = this.phone_number.startsWith('+')
          ? encodeURIComponent(this.phone_number) // Encodes '+' to '%2B'
          : this.phone_number;

        // Send the POST request with the encoded phone number
        await pythonApi.post(
          `/drinkrecord/newrecordbycaregiver?patient_phone_number=${encodedPhoneNumber}`,
          {
            amount_ml: this.amount_ml,
          }
        );

        // Success - clear the form and show success message
        this.amount_ml = '';
        this.phone_number = '';
        this.successMessage = 'Drink record created successfully!';
      } catch (err) {
        // Error handling
        this.error = err.response?.data?.detail || 'Failed to create drink record.';
      } finally {
        this.loading = false;
      }
    },
  },
};
</script>

<style scoped>
.create-drink-record-form {
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

.success {
  text-align: center;
  color: green;
  margin-top: 10px;
}
</style>