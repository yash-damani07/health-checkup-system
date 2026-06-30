import { Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

export default function Home() {
  const { user } = useAuth();

  return (
    <div className="hero">
      <div className="hero-text">
        <h1>Your Health, Tracked &amp; Understood</h1>
        <p>
          VitalCheck helps you book full health checkups, track vitals like blood
          pressure and sugar levels, and review your reports over time, all in one
          simple dashboard.
        </p>
        <div className="hero-actions">
          {user ? (
            <Link to="/book" className="btn-solid">Book a Checkup</Link>
          ) : (
            <>
              <Link to="/register" className="btn-solid">Get Started</Link>
              <Link to="/login" className="btn-outline">Login</Link>
            </>
          )}
        </div>
      </div>
      <div className="hero-cards">
        <div className="info-card">
          <h3>8+</h3>
          <p>Checkup types available</p>
        </div>
        <div className="info-card">
          <h3>24/7</h3>
          <p>Book checkups anytime</p>
        </div>
        <div className="info-card">
          <h3>Secure</h3>
          <p>Your reports, private to you</p>
        </div>
      </div>
    </div>
  );
}
