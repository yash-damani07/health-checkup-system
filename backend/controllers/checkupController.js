const Checkup = require('../models/Checkup');
const TestResult = require('../models/TestResult');

// @route POST /api/checkups   (patient books a checkup)
const bookCheckup = async (req, res) => {
  try {
    const { checkupType, preferredDate, preferredTime, notes } = req.body;

    if (!checkupType || !preferredDate || !preferredTime) {
      return res.status(400).json({ message: 'Please fill all required fields' });
    }

    const checkup = await Checkup.create({
      patient: req.user._id,
      checkupType,
      preferredDate,
      preferredTime,
      notes,
    });

    res.status(201).json(checkup);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

// @route GET /api/checkups/my  (logged-in patient's own checkups)
const getMyCheckups = async (req, res) => {
  try {
    const checkups = await Checkup.find({ patient: req.user._id }).sort({ createdAt: -1 });
    res.json(checkups);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

// @route GET /api/checkups  (admin/doctor: all checkups)
const getAllCheckups = async (req, res) => {
  try {
    const checkups = await Checkup.find().populate('patient', 'name email age gender phone').sort({ createdAt: -1 });
    res.json(checkups);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

// @route PUT /api/checkups/:id/status (admin/doctor updates status)
const updateCheckupStatus = async (req, res) => {
  try {
    const { status } = req.body;
    const checkup = await Checkup.findById(req.params.id);
    if (!checkup) return res.status(404).json({ message: 'Checkup not found' });

    checkup.status = status || checkup.status;
    await checkup.save();
    res.json(checkup);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

// @route DELETE /api/checkups/:id (patient cancels own pending checkup)
const cancelCheckup = async (req, res) => {
  try {
    const checkup = await Checkup.findById(req.params.id);
    if (!checkup) return res.status(404).json({ message: 'Checkup not found' });

    if (checkup.patient.toString() !== req.user._id.toString() && req.user.role === 'patient') {
      return res.status(403).json({ message: 'Not authorized to cancel this checkup' });
    }

    checkup.status = 'Cancelled';
    await checkup.save();
    res.json({ message: 'Checkup cancelled' });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

// @route POST /api/checkups/:id/result (doctor/admin adds test result for a checkup)
const addTestResult = async (req, res) => {
  try {
    const checkup = await Checkup.findById(req.params.id);
    if (!checkup) return res.status(404).json({ message: 'Checkup not found' });

    const {
      bloodPressure, heartRate, bloodSugar, cholesterol,
      bmi, temperature, oxygenLevel, summary, doctorRemarks,
    } = req.body;

    const result = await TestResult.create({
      checkup: checkup._id,
      patient: checkup.patient,
      bloodPressure, heartRate, bloodSugar, cholesterol,
      bmi, temperature, oxygenLevel, summary, doctorRemarks,
    });

    checkup.status = 'Completed';
    await checkup.save();

    res.status(201).json(result);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

// @route GET /api/checkups/results/my (patient: all own results)
const getMyResults = async (req, res) => {
  try {
    const results = await TestResult.find({ patient: req.user._id })
      .populate('checkup', 'checkupType preferredDate status')
      .sort({ createdAt: -1 });
    res.json(results);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

module.exports = {
  bookCheckup,
  getMyCheckups,
  getAllCheckups,
  updateCheckupStatus,
  cancelCheckup,
  addTestResult,
  getMyResults,
};
