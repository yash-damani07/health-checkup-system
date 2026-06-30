const mongoose = require('mongoose');

// Stores vitals / lab results tied to a completed checkup
const testResultSchema = new mongoose.Schema(
  {
    checkup: { type: mongoose.Schema.Types.ObjectId, ref: 'Checkup', required: true },
    patient: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
    bloodPressure: { type: String, default: '' }, // e.g. "120/80"
    heartRate: { type: Number },                  // bpm
    bloodSugar: { type: Number },                  // mg/dL
    cholesterol: { type: Number },                  // mg/dL
    bmi: { type: Number },
    temperature: { type: Number },                  // Fahrenheit
    oxygenLevel: { type: Number },                  // SpO2 %
    summary: { type: String, default: '' },
    doctorRemarks: { type: String, default: '' },
  },
  { timestamps: true }
);

module.exports = mongoose.model('TestResult', testResultSchema);
