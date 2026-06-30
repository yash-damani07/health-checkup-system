const express = require('express');
const router = express.Router();
const { protect, authorize } = require('../middleware/auth');
const {
  bookCheckup,
  getMyCheckups,
  getAllCheckups,
  updateCheckupStatus,
  cancelCheckup,
  addTestResult,
  getMyResults,
} = require('../controllers/checkupController');

router.post('/', protect, bookCheckup);
router.get('/my', protect, getMyCheckups);
router.get('/results/my', protect, getMyResults);
router.get('/', protect, authorize('admin', 'doctor'), getAllCheckups);
router.put('/:id/status', protect, authorize('admin', 'doctor'), updateCheckupStatus);
router.delete('/:id', protect, cancelCheckup);
router.post('/:id/result', protect, authorize('admin', 'doctor'), addTestResult);

module.exports = router;
