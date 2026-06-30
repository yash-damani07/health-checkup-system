import { Routes, Route } from 'react-router-dom';
import Navbar from './components/Navbar';
import PrivateRoute from './components/PrivateRoute';
import Home from './pages/Home';
import Login from './pages/Login';
import Register from './pages/Register';
import Dashboard from './pages/Dashboard';
import BookCheckup from './pages/BookCheckup';
import MyCheckups from './pages/MyCheckups';
import Reports from './pages/Reports';
import AdminPanel from './pages/AdminPanel';

export default function App() {
  return (
    <div className="app-shell">
      <Navbar />
      <main>
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/login" element={<Login />} />
          <Route path="/register" element={<Register />} />
          <Route path="/dashboard" element={<PrivateRoute><Dashboard /></PrivateRoute>} />
          <Route path="/book" element={<PrivateRoute><BookCheckup /></PrivateRoute>} />
          <Route path="/my-checkups" element={<PrivateRoute><MyCheckups /></PrivateRoute>} />
          <Route path="/reports" element={<PrivateRoute><Reports /></PrivateRoute>} />
          <Route
            path="/admin"
            element={
              <PrivateRoute roles={['admin', 'doctor']}>
                <AdminPanel />
              </PrivateRoute>
            }
          />
        </Routes>
      </main>
    </div>
  );
}
