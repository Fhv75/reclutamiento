import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import HomePage from './HomePage';
import AuthSkeleton from './AuthSkeleton';
import AdminDashboard from './AdminDashboard';
import RecruiterDashboard from './RecruiterDashboard';
import CandidateDashboard from './CandidateDashboard';
import PrivateRoute from './PrivateRoute';
import CreateProfile from './CreateProfile';
import ViewProfile from './ViewProfile';
import EditProfile from './EditProfile';

function App() {
  return (
    <Router>
      <Routes>
        {/* Rutas públicas */}
        <Route path="/" element={<HomePage />} />
        <Route path="/auth" element={<AuthSkeleton />} />

        {/* Rutas protegidas para Admin */}
        <Route element={<PrivateRoute roles={['admin']} />}>
          <Route path="/admin-dashboard" element={<AdminDashboard />} />
        </Route>

        {/* Rutas protegidas para Reclutador */}
        <Route element={<PrivateRoute roles={['recruiter']} />}>
          <Route path="/recruiter-dashboard" element={<RecruiterDashboard />} />
        </Route>

        {/* Rutas protegidas para Candidato */}
        <Route element={<PrivateRoute roles={['candidate']} />}>
          <Route path="/candidate-dashboard" element={<CandidateDashboard />} />
          <Route path="/candidate/create-profile" element={<CreateProfile />} />
          <Route path="/candidate/profile" element={<ViewProfile />} />
          <Route path="/candidate/edit-profile" element={<EditProfile />} />
        </Route>
      </Routes>
    </Router>
  );
}

export default App;
