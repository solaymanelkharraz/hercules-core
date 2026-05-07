import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider, useAuth } from './api/AuthContext';
import Layout from './components/Layout';
import Dashboard from './pages/Dashboard';
import Users from './pages/Users';
import Zones from './pages/Zones';
import Equipment from './pages/Equipment';
import EquipmentAssignments from './pages/EquipmentAssignments';
import IncidentReports from './pages/IncidentReports';
import Login from './pages/Login';

import { Toaster } from 'react-hot-toast';

const ProtectedRoute = ({ children }) => {
  const { user, isLoading } = useAuth();

  if (isLoading) return <div className="min-h-screen flex items-center justify-center bg-slate-50 text-forest font-bold">Loading Hercules...</div>;
  if (!user) return <Navigate to="/login" replace />;

  return children;
};

function App() {
  return (
    <AuthProvider>
      <BrowserRouter>
        <Toaster position="top-right" />
        <Routes>
          <Route path="/login" element={<Login />} />
          <Route path="/" element={
            <ProtectedRoute>
              <Layout />
            </ProtectedRoute>
          }>
            <Route index element={<Dashboard />} />
            <Route path="users" element={<Users />} />
            <Route path="zones" element={<Zones />} />
            <Route path="equipment" element={<Equipment />} />
            <Route path="assignments" element={<EquipmentAssignments />} />
            <Route path="incidents" element={<IncidentReports />} />
          </Route>
        </Routes>
      </BrowserRouter>
    </AuthProvider>
  );
}

export default App;
