import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider } from './hooks/useAuth';
import ProtectedRoute from './components/auth/ProtectedRoute';
import LoginPage      from './pages/LoginPage';
import DashboardPage  from './pages/DashboardPage';
import ClientsPage    from './pages/ClientsPage';
import MembershipsPage from './pages/MembershipsPage';
import './index.css';

export default function App() {
  return (
    <AuthProvider>
      <BrowserRouter>
        <Routes>
          <Route path="/login" element={<LoginPage />} />

          <Route path="/dashboard" element={
            <ProtectedRoute><DashboardPage /></ProtectedRoute>
          } />
          <Route path="/clients" element={
            <ProtectedRoute><ClientsPage /></ProtectedRoute>
          } />
          <Route path="/memberships" element={
            <ProtectedRoute><MembershipsPage /></ProtectedRoute>
          } />

          {/* Default redirect */}
          <Route path="*" element={<Navigate to="/dashboard" replace />} />
        </Routes>
      </BrowserRouter>
    </AuthProvider>
  );
}
