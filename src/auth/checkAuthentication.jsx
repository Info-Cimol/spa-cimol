import { useEffect } from "react";
import { useNavigate } from "react-router-dom";

export function Private({ children }) {
  const navigate = useNavigate();
  const userDataString = localStorage.getItem('userData');
  const userData = JSON.parse(userDataString);
  const perfil = userData?.user?.perfil[0];

  useEffect(() => {
    if (!userData || (perfil === 0 && perfil === 1)) {
      navigate('/');
    }
  }, [userData, perfil, navigate]);

  return userData ? children : null;
}