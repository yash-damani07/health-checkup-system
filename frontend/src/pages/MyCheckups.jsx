import { useEffect, useState } from 'react';
import api from '../api/axios';

const statusClass = {
  Pending: 'badge badge-pending',
  Confirmed: 'badge badge-confirmed',
  Completed: 'badge badge-completed',
  Cancelled: 'badge badge-cancelled',
};

export default function MyCheckups() {
  const [checkups, setCheckups] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  const load = async () => {
    setLoading(true);
    try {
      const { data } = await api.get('/checkups/my');
      setCheckups(data);
    } catch (err) {
      setError('Failed to load checkups');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => { load(); }, []);

  const handleCancel = async (id) => {
    if (!window.confirm('Cancel this checkup?')) return;
    try {
      await api.delete(`/checkups/${id}`);
      load();
    } catch (err) {
      alert(err.response?.data?.message || 'Failed to cancel');
    }
  };

  return (
    <div className="page">
      <h1>My Checkups</h1>
      {error && <p className="error-msg">{error}</p>}

      {loading ? (
        <p>Loading...</p>
      ) : checkups.length === 0 ? (
        <p className="muted">You haven't booked any checkups yet.</p>
      ) : (
        <table className="data-table">
          <thead>
            <tr>
              <th>Type</th>
              <th>Date</th>
              <th>Time</th>
              <th>Status</th>
              <th>Notes</th>
              <th>Action</th>
            </tr>
          </thead>
          <tbody>
            {checkups.map((c) => (
              <tr key={c._id}>
                <td>{c.checkupType}</td>
                <td>{new Date(c.preferredDate).toLocaleDateString()}</td>
                <td>{c.preferredTime}</td>
                <td><span className={statusClass[c.status]}>{c.status}</span></td>
                <td>{c.notes || '-'}</td>
                <td>
                  {(c.status === 'Pending' || c.status === 'Confirmed') && (
                    <button className="btn-link-danger" onClick={() => handleCancel(c._id)}>Cancel</button>
                  )}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      )}
    </div>
  );
}
