import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

export default function Navbar() {
  const { user, logout } = useAuth();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  return (
    <nav className="navbar">
      <Link to="/" className="brand">VitalCheck</Link>
      <div className="nav-links">
        {user ? (
          <>
            <Link to="/dashboard">Dashboard</Link>
            <Link to="/book">Book Checkup</Link>
            <Link to="/my-checkups">My Checkups</Link>
            <Link to="/reports">Reports</Link>
            {(user.role === 'admin' || user.role === 'doctor') && (
              <Link to="/admin">Admin Panel</Link>
            )}
            <span className="nav-user">Hi, {user.name}</span>
            <button className="btn-outline" onClick={handleLogout}>Logout</button>
          </>
        ) : (
          <>
            <Link to="/login">Login</Link>
            <Link to="/register" className="btn-solid-link">Register</Link>
          </>
        )}
      </div>
    </nav>
  );
}
