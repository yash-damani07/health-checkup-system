import { useEffect, useState } from 'react';
import api from '../api/axios';

const STATUS_OPTIONS = ['Pending', 'Confirmed', 'Completed', 'Cancelled'];

export default function AdminPanel() {
  const [checkups, setCheckups] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [activeCheckup, setActiveCheckup] = useState(null);
  const [resultForm, setResultForm] = useState({
    bloodPressure: '', heartRate: '', bloodSugar: '', cholesterol: '',
    bmi: '', temperature: '', oxygenLevel: '', summary: '', doctorRemarks: '',
  });

  const load = async () => {
    setLoading(true);
    try {
      const { data } = await api.get('/checkups');
      setCheckups(data);
    } catch (err) {
      setError('Failed to load checkups (admin/doctor access required)');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => { load(); }, []);

  const handleStatusChange = async (id, status) => {
    try {
      await api.put(`/checkups/${id}/status`, { status });
      load();
    } catch (err) {
      alert(err.response?.data?.message || 'Failed to update status');
    }
  };

  const openResultForm = (checkup) => {
    setActiveCheckup(checkup);
    setResultForm({
      bloodPressure: '', heartRate: '', bloodSugar: '', cholesterol: '',
      bmi: '', temperature: '', oxygenLevel: '', summary: '', doctorRemarks: '',
    });
  };

  const handleResultChange = (e) => setResultForm({ ...resultForm, [e.target.name]: e.target.value });

  const submitResult = async (e) => {
    e.preventDefault();
    try {
      await api.post(`/checkups/${activeCheckup._id}/result`, resultForm);
      setActiveCheckup(null);
      load();
    } catch (err) {
      alert(err.response?.data?.message || 'Failed to save result');
    }
  };

  return (
    <div className="page">
      <h1>Admin / Doctor Panel</h1>
      <p className="muted">Manage all booked checkups and publish results.</p>
      {error && <p className="error-msg">{error}</p>}

      {loading ? (
        <p>Loading...</p>
      ) : (
        <table className="data-table">
          <thead>
            <tr>
              <th>Patient</th>
              <th>Type</th>
              <th>Date</th>
              <th>Time</th>
              <th>Status</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            {checkups.map((c) => (
              <tr key={c._id}>
                <td>{c.patient?.name}<br /><span className="muted small">{c.patient?.email}</span></td>
                <td>{c.checkupType}</td>
                <td>{new Date(c.preferredDate).toLocaleDateString()}</td>
                <td>{c.preferredTime}</td>
                <td>
                  <select value={c.status} onChange={(e) => handleStatusChange(c._id, e.target.value)}>
                    {STATUS_OPTIONS.map((s) => <option key={s} value={s}>{s}</option>)}
                  </select>
                </td>
                <td>
                  <button className="btn-outline small" onClick={() => openResultForm(c)}>Add Result</button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      )}

      {activeCheckup && (
        <div className="modal-overlay" onClick={() => setActiveCheckup(null)}>
          <div className="modal" onClick={(e) => e.stopPropagation()}>
            <h2>Add Result — {activeCheckup.patient?.name}</h2>
            <form onSubmit={submitResult} className="card-form">
              <div className="form-row">
                <div>
                  <label>Blood Pressure</label>
                  <input name="bloodPressure" placeholder="120/80" value={resultForm.bloodPressure} onChange={handleResultChange} />
                </div>
                <div>
                  <label>Heart Rate (bpm)</label>
                  <input type="number" name="heartRate" value={resultForm.heartRate} onChange={handleResultChange} />
                </div>
              </div>
              <div className="form-row">
                <div>
                  <label>Blood Sugar (mg/dL)</label>
                  <input type="number" name="bloodSugar" value={resultForm.bloodSugar} onChange={handleResultChange} />
                </div>
                <div>
                  <label>Cholesterol (mg/dL)</label>
                  <input type="number" name="cholesterol" value={resultForm.cholesterol} onChange={handleResultChange} />
                </div>
              </div>
              <div className="form-row">
                <div>
                  <label>BMI</label>
                  <input type="number" step="0.1" name="bmi" value={resultForm.bmi} onChange={handleResultChange} />
                </div>
                <div>
                  <label>Temperature (°F)</label>
                  <input type="number" step="0.1" name="temperature" value={resultForm.temperature} onChange={handleResultChange} />
                </div>
              </div>
              <label>Oxygen Level (%)</label>
              <input type="number" name="oxygenLevel" value={resultForm.oxygenLevel} onChange={handleResultChange} />

              <label>Summary</label>
              <textarea name="summary" rows="2" value={resultForm.summary} onChange={handleResultChange} />

              <label>Doctor's Remarks</label>
              <textarea name="doctorRemarks" rows="2" value={resultForm.doctorRemarks} onChange={handleResultChange} />

              <div className="modal-actions">
                <button type="button" className="btn-outline" onClick={() => setActiveCheckup(null)}>Cancel</button>
                <button type="submit" className="btn-solid">Save Result</button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
