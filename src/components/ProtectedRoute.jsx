import { Navigate } from 'react-router-dom';
import { isAuthenticated, getUser } from '../utils/auth';

export default function ProtectedRoute({ children, allowedRoles = [] }) {
  const user = getUser();
  
  if (!isAuthenticated()) {
    return <Navigate to="/login" replace />;
  }
  
  if (allowedRoles.length > 0 && !allowedRoles.includes(user?.role)) {
    return <Navigate to="/dashboard" replace />;
  }
  
  return children;
}