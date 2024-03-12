import { useEffect, useState } from "react";
import { useNavigate, useLocation } from "react-router-dom";

export function Private({ children, allowedRoles }) {
  const navigate = useNavigate();
  const location = useLocation();
  const userRole = localStorage.getItem('userRole');
  const userDataString = localStorage.getItem('userData');
  const userData = JSON.parse(userDataString);
  const isAuthenticated = useState('');
  
  useEffect(() => {
    const isAuthenticated = userRole && userData;

    if (!isAuthenticated || !allowedRoles.includes(userRole)) {
      if (location.pathname !== '/') {
        // Permanece na rota atual se não houver permissão
        navigate('/');
      }
    }
  }, [navigate, location.pathname, userRole, userData, allowedRoles]);
 
  return isAuthenticated ? children : null;
}