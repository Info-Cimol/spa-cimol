import { useEffect } from "react";
import { useNavigate } from "react-router-dom";

export function Private({ children }) {
  const navigate = useNavigate();
  const userRole = localStorage.getItem('userRole');
  const userDataString = localStorage.getItem('userData');
  const userData = JSON.parse(userDataString);

  useEffect(() => {
    const isAuthenticated = userRole && userData;

    if (!isAuthenticated) {
      navigate('/'); // Redireciona para a página de login se não estiver autenticado
    }
  }, [userRole, userData, navigate]);

  return userRole ? children : null;
}