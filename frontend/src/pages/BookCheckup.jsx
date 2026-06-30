import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import api from '../api/axios';

const CHECKUP_TYPES = [
  'General Health Checkup',
  'Full Body Checkup',
  'Heart Checkup',
  'Diabetes Screening',
  'Blood Test Panel',
  'Eye Checkup',
  'Dental Checkup',
  "Women's Health Checkup",
];

export default function BookCheckup() {
  const navigate = useNavigate();
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [loading, setLoading] = useState(false);
  const [form, setForm] = useState({
    checkupType: CHECKUP_TYPES[0],
    preferredDate: '',
    preferredTime: '',
    notes: '',
  });

  const handleChange = (e) => setForm({ ...form, [e.target.name]: e.target.value });

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setSuccess('');
    setLoading(true);
    try {
      await api.post('/checkups', form);
      setSuccess('Checkup booked successfully!');
      setTimeout(() => navigate('/my-checkups'), 1200);
    } catch (err) {
      setError(err.response?.data?.message || 'Booking failed');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="page narrow">
      <h1>Book a Health Checkup</h1>
      <p className="muted">Choose a checkup type and your preferred slot.</p>

      <form className="card-form" onSubmit={handleSubmit}>
        {error && <p className="error-msg">{error}</p>}
        {success && <p className="success-msg">{success}</p>}

        <label>Checkup Type</label>
        <select name="checkupType" value={form.checkupType} onChange={handleChange}>
          {CHECKUP_TYPES.map((type) => (
            <option key={type} value={type}>{type}</option>
          ))}
        </select>

        <div className="form-row">
          <div>
            <label>Preferred Date</label>
            <input
              type="date"
              name="preferredDate"
              value={form.preferredDate}
              onChange={handleChange}
              min={new Date().toISOString().split('T')[0]}
              required
            />
          </div>
          <div>
            <label>Preferred Time</label>
            <input type="time" name="preferredTime" value={form.preferredTime} onChange={handleChange} required />
          </div>
        </div>

        <label>Notes (optional)</label>
        <textarea
          name="notes"
          rows="3"
          placeholder="Any symptoms or concerns you'd like to mention..."
          value={form.notes}
          onChange={handleChange}
        />

        <button type="submit" className="btn-solid full-width" disabled={loading}>
          {loading ? 'Booking...' : 'Confirm Booking'}
        </button>
      </form>
    </div>
  );
}
