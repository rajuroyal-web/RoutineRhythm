const mongoose = require('mongoose');

const DailyDataSchema = new mongoose.Schema({
  date: {
    type: String,
    required: true,
    unique: true
  },
  mood: String,
  energyLevel: Number,
  weather: String,
  wakeTime: String,
  sleepTime: String,
  todos: [{
    text: String,
    completed: Boolean
  }],
  motivation: String,
  goals: [{
    text: String,
    completed: Boolean
  }],
  transactions: [{
    type: String,
    category: String,
    amount: Number,
    description: String
  }],
  habits: [Boolean],
  waterIntake: [Boolean],
  notes: String,
  meals: {
    breakfast: [{ text: String }],
    lunch: [{ text: String }],
    dinner: [{ text: String }],
    snacks: [{ text: String }]
  }
});

module.exports = mongoose.model('DailyData', DailyDataSchema);