export const saveAuth = (user) => {
    localStorage.setItem('user', JSON.stringify(user));
  };
  
  export const getUser = () => {
    const userStr = localStorage.getItem('user');
    if (userStr) {
      try {
        return JSON.parse(userStr);
      } catch (e) {
        return null;
      }
    }
    return null;
  };
  
  export const clearAuth = () => {
    localStorage.removeItem('user');
  };
  
  export const isAuthenticated = () => {
    return getUser() !== null;
  };