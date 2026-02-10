import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import Login from './pages/Login';
import Register from './pages/Register';
import ApplicantDashboard from './pages/ApplicationDashboard';
import CompanyDashboard from './pages/CompanyDashboard';
import JobSearch from './pages/JobSearch';
import MyApplications from './pages/MyApplications';
import PostJob from './pages/PostJob';
import ManageJobs from './pages/ManageJobs';
import { isAuthenticated, getUser } from './utils/auth';

function ProtectedRoute({ children, allowedRoles }) {
  if (!isAuthenticated()) {
    return <Navigate to="/login" replace />;
  }

  const user = getUser();
  if (allowedRoles && !allowedRoles.includes(user.role)) {
    return <Navigate to="/dashboard" replace />;
  }

  return children;
}

function App() {
  const user = getUser();

  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Navigate to="/login" replace />} />
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />
        
        <Route 
          path="/dashboard" 
          element={
            <ProtectedRoute>
              {user?.role === 'COMPANY' ? <CompanyDashboard /> : <ApplicantDashboard />}
            </ProtectedRoute>
          } 
        />

        <Route 
          path="/jobs" 
          element={
            <ProtectedRoute allowedRoles={['APPLICANT']}>
              <JobSearch />
            </ProtectedRoute>
          } 
        />

        <Route 
          path="/applications" 
          element={
            <ProtectedRoute allowedRoles={['APPLICANT']}>
              <MyApplications />
            </ProtectedRoute>
          } 
        />

        <Route 
          path="/post-job" 
          element={
            <ProtectedRoute allowedRoles={['COMPANY']}>
              <PostJob />
            </ProtectedRoute>
          } 
        />

        <Route 
          path="/manage-jobs" 
          element={
            <ProtectedRoute allowedRoles={['COMPANY']}>
              <ManageJobs />
            </ProtectedRoute>
          } 
        />
      </Routes>
    </BrowserRouter>
  );
}

export default App;