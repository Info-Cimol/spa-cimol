import { useEffect } from "react";
import { useNavigate, useLocation } from "react-router-dom";

export function Private({ children, allowedRoles }) {
  const navigate = useNavigate();
  const location = useLocation();
  const userRole = localStorage.getItem('userRole');
  const userDataString = localStorage.getItem('userData');
  const userData = JSON.parse(userDataString);

  useEffect(() => {
    const isAuthenticated = userRole && userData;
    
    // Verifica se allowedRoles é fornecido e é um array
    const isAllowedRolesValid = Array.isArray(allowedRoles) && allowedRoles.length > 0;

    const hasPermission = isAuthenticated && isAllowedRolesValid && allowedRoles.includes(userRole);

    if (!hasPermission) {
      
      if (location.pathname !== '/') {
        // Permanece na rota atual se não houver permissão
        navigate('/');
      }
    }
  }, [userRole, userData, allowedRoles, navigate, location]);
 
  return userRole ? children : null;
}