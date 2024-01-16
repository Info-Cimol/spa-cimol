import { useEffect } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import { toast } from 'react-toastify';

export function Private({ children, allowedRoles }) {
  const navigate = useNavigate();
  const location = useLocation();
  const userRole = localStorage.getItem('userRole');
  const userDataString = localStorage.getItem('userData');
  const userData = JSON.parse(userDataString);

  useEffect(() => {
    const isAuthenticated = userRole && userData;

    if (!isAuthenticated || !allowedRoles.includes(userRole)) {
      // Verifica se o usuário estava tentando acessar a rota protegida
      if (location.pathname !== '/') {
        // Permanece na rota atual se não houver permissão
        toast.error('Você não possui permissão para acessar esta rota.');
        navigate('/');
      }

    }
  }, [userRole, userData, allowedRoles, navigate, location]);

  return userRole ? children : null;
}