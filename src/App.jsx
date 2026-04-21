import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { isAuthenticated, getUserRole } from './utils/auth';

// Import pages
import Login from './pages/Login';
import Register from './pages/Register';
import ApplicantDashboard from './pages/ApplicationDashboard';
import CompanyDashboard from './pages/CompanyDashboard';
import JobSearch from './pages/JobSearch';
import MyApplications from './pages/MyApplications';
import PostJob from './pages/PostJob';
import ViewJobApplications from './pages/ViewJobApplications';
import Profile from './pages/Profile';
import ManageJobs from './pages/ManageJobs';
import AIResumeAnalyzer from './pages/AIResumeAnalyzer';  // NEW
import AIChatbot from './pages/AIChatbot';  // NEW

// Import protected route
import ProtectedRoute from './components/ProtectedRoute';

function App() {
  return (
    <BrowserRouter>
      <Routes>
        {/* Public routes */}
        <Route 
          path="/login" 
          element={
            isAuthenticated() ? (
              <Navigate to={getUserRole() === 'COMPANY' ? '/company/dashboard' : '/dashboard'} replace />
            ) : (
              <Login />
            )
          } 
        />
        <Route 
          path="/register" 
          element={
            isAuthenticated() ? (
              <Navigate to={getUserRole() === 'COMPANY' ? '/company/dashboard' : '/dashboard'} replace />
            ) : (
              <Register />
            )
          } 
        />

        {/* Protected routes - Applicant */}
        <Route 
          path="/dashboard" 
          element={
            <ProtectedRoute allowedRoles={['APPLICANT']}>
              <ApplicantDashboard />
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
        
        {/* AI Features - Applicant Only */}
        <Route 
          path="/ai-resume" 
          element={
            <ProtectedRoute allowedRoles={['APPLICANT']}>
              <AIResumeAnalyzer />
            </ProtectedRoute>
          } 
        />
        <Route 
          path="/ai-chat" 
          element={
            <ProtectedRoute allowedRoles={['APPLICANT']}>
              <AIChatbot />
            </ProtectedRoute>
          } 
        />

        {/* Protected routes - Company */}
        <Route 
          path="/company/dashboard" 
          element={
            <ProtectedRoute allowedRoles={['COMPANY']}>
              <CompanyDashboard />
            </ProtectedRoute>
          } 
        />
        <Route 
          path="/company/post-job" 
          element={
            <ProtectedRoute allowedRoles={['COMPANY']}>
              <PostJob />
            </ProtectedRoute>
          } 
        />
        <Route 
          path="/company/jobs" 
          element={
            <ProtectedRoute allowedRoles={['COMPANY']}>
              <ManageJobs />
            </ProtectedRoute>
          } 
        />
        <Route 
  path="/profile" 
  element={
    <ProtectedRoute allowedRoles={['APPLICANT', 'COMPANY']}>
      <Profile />
    </ProtectedRoute>
  } 
/>
<Route path="/company/jobs/:jobId" element={
  <ProtectedRoute requiredRole="COMPANY">
    <ViewJobApplications />
  </ProtectedRoute>
} />

        {/* Default redirect */}
        <Route 
          path="/" 
          element={
            isAuthenticated() ? (
              getUserRole() === 'COMPANY' ? 
                <Navigate to="/company/dashboard" replace /> : 
                <Navigate to="/dashboard" replace />
            ) : (
              <Navigate to="/login" replace />
            )
          } 
        />

        {/* 404 */}
        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;