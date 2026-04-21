// Save authentication data
export const saveAuth = (authData) => {
  localStorage.setItem('token', authData.token);
  localStorage.setItem('user', JSON.stringify({
    email: authData.email,
    name: authData.name,
    role: authData.role
  }));
};

// Get current user
export const getUser = () => {
  const userStr = localStorage.getItem('user');
  if (!userStr) return null;
  
  try {
    return JSON.parse(userStr);
  } catch (e) {
    return null;
  }
};

// Get token
export const getToken = () => {
  return localStorage.getItem('token');
};

// Check if authenticated
export const isAuthenticated = () => {
  return !!getToken();
};

// Clear auth data
export const clearAuth = () => {
  localStorage.removeItem('token');
  localStorage.removeItem('user');
};

// Logout
export const logout = () => {
  clearAuth();
  window.location.href = '/login';
};

// Check role
export const hasRole = (role) => {
  const user = getUser();
  return user?.role === role;
};

// Get user role
export const getUserRole = () => {
  const user = getUser();
  return user?.role;
};