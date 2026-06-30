import { useEffect, useState } from 'react';
import api from '../api/axios';

export default function Reports() {
  const [results, setResults] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const load = async () => {
      try {
        const { data } = await api.get('/checkups/results/my');
        setResults(data);
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    };
    load();
  }, []);

  return (
    <div className="page">
      <h1>My Health Reports</h1>
      <p className="muted">Full results from your completed checkups.</p>

      {loading ? (
        <p>Loading...</p>
      ) : results.length === 0 ? (
        <p className="muted">No reports available yet.</p>
      ) : (
        <div className="report-grid">
          {results.map((r) => (
            <div className="report-card" key={r._id}>
              <h3>{r.checkup?.checkupType}</h3>
              <p className="muted">{new Date(r.createdAt).toLocaleDateString()}</p>
              <ul className="vitals-list">
                <li><span>Blood Pressure</span><strong>{r.bloodPressure || '-'}</strong></li>
                <li><span>Heart Rate</span><strong>{r.heartRate ? `${r.heartRate} bpm` : '-'}</strong></li>
                <li><span>Blood Sugar</span><strong>{r.bloodSugar ? `${r.bloodSugar} mg/dL` : '-'}</strong></li>
                <li><span>Cholesterol</span><strong>{r.cholesterol ? `${r.cholesterol} mg/dL` : '-'}</strong></li>
                <li><span>BMI</span><strong>{r.bmi || '-'}</strong></li>
                <li><span>Temperature</span><strong>{r.temperature ? `${r.temperature} °F` : '-'}</strong></li>
                <li><span>Oxygen Level</span><strong>{r.oxygenLevel ? `${r.oxygenLevel}%` : '-'}</strong></li>
              </ul>
              {r.summary && <p><strong>Summary:</strong> {r.summary}</p>}
              {r.doctorRemarks && <p><strong>Doctor's Remarks:</strong> {r.doctorRemarks}</p>}
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
