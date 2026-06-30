const mongoose = require('mongoose');

// A "Checkup" is a health checkup appointment booked by a patient
const checkupSchema = new mongoose.Schema(
  {
    patient: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
    checkupType: {
      type: String,
      required: true,
      enum: [
        'General Health Checkup',
        'Full Body Checkup',
        'Heart Checkup',
        'Diabetes Screening',
        'Blood Test Panel',
        'Eye Checkup',
        'Dental Checkup',
        "Women's Health Checkup",
      ],
    },
    preferredDate: { type: Date, required: true },
    preferredTime: { type: String, required: true },
    notes: { type: String, default: '' },
    status: {
      type: String,
      enum: ['Pending', 'Confirmed', 'Completed', 'Cancelled'],
      default: 'Pending',
    },
  },
  { timestamps: true }
);

module.exports = mongoose.model('Checkup', checkupSchema);
