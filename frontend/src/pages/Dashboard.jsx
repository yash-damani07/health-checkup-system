import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import api from '../api/axios';
import { useAuth } from '../context/AuthContext';

export default function Dashboard() {
  const { user } = useAuth();
  const [checkups, setCheckups] = useState([]);
  const [results, setResults] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const load = async () => {
      try {
        const [cRes, rRes] = await Promise.all([
          api.get('/checkups/my'),
          api.get('/checkups/results/my'),
        ]);
        setCheckups(cRes.data);
        setResults(rRes.data);
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    };
    load();
  }, []);

  const pending = checkups.filter((c) => c.status === 'Pending').length;
  const confirmed = checkups.filter((c) => c.status === 'Confirmed').length;
  const completed = checkups.filter((c) => c.status === 'Completed').length;

  return (
    <div className="page">
      <h1>Welcome, {user.name}</h1>
      <p className="muted">Here's a summary of your health checkup activity.</p>

      <div className="stat-grid">
        <div className="stat-card">
          <h3>{checkups.length}</h3>
          <p>Total Checkups Booked</p>
        </div>
        <div className="stat-card">
          <h3>{pending}</h3>
          <p>Pending</p>
        </div>
        <div className="stat-card">
          <h3>{confirmed}</h3>
          <p>Confirmed</p>
        </div>
        <div className="stat-card">
          <h3>{completed}</h3>
          <p>Completed</p>
        </div>
      </div>

      <div className="dashboard-actions">
        <Link to="/book" className="btn-solid">Book a New Checkup</Link>
        <Link to="/my-checkups" className="btn-outline">View My Checkups</Link>
        <Link to="/reports" className="btn-outline">View My Reports</Link>
      </div>

      {loading ? (
        <p>Loading...</p>
      ) : (
        <div className="recent-section">
          <h2>Recent Reports</h2>
          {results.length === 0 ? (
            <p className="muted">No reports yet. Once a checkup is completed, results will appear here.</p>
          ) : (
            <table className="data-table">
              <thead>
                <tr>
                  <th>Checkup Type</th>
                  <th>Date</th>
                  <th>Blood Pressure</th>
                  <th>Heart Rate</th>
                  <th>Summary</th>
                </tr>
              </thead>
              <tbody>
                {results.slice(0, 5).map((r) => (
                  <tr key={r._id}>
                    <td>{r.checkup?.checkupType}</td>
                    <td>{new Date(r.createdAt).toLocaleDateString()}</td>
                    <td>{r.bloodPressure || '-'}</td>
                    <td>{r.heartRate || '-'}</td>
                    <td>{r.summary || '-'}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          )}
        </div>
      )}
    </div>
  );
}
