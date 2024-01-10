import React, { useEffect, useState } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import './style.css'
const Header = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isCoursesDropdownOpen, setIsCoursesDropdownOpen] = useState(false);
  const [userType, setUserType] = useState('default');
  const [userName, setUserName] = useState('default');
  const [userEmail, setUserEmail] = useState('default');
  const [courses] = useState([
    { id: 3, name: 'Informática' },
    { id: 4, name: 'Meio ambiente' },
    { id: 5, name: 'Eletrônica' },
    { id: 6, name: 'Mecânica' },
    { id: 7, name: 'Química' },
    { id: 8, name: 'Design de móveis' },
    { id: 9, name: 'Eletrotécnica' },
    { id: 10, name: 'Móveis' },
  ]);

  useEffect(() => {
    updateUserTypeFromCookies();
    window.addEventListener('resize', handleResize);
    return () => {
      window.removeEventListener('resize', handleResize);
    };
  }, []);

  const toggleMenu = () => {
    setIsMenuOpen(!isMenuOpen);
  };

  const toggleSidebar = () => {
    setIsMenuOpen(!isMenuOpen);
    setTimeout(() => {
      setIsMenuOpen(false);
    }, 300);
  };

  const toggleCoursesDropdown = () => {
    setIsCoursesDropdownOpen(!isCoursesDropdownOpen);
  };

  const updateUserTypeFromCookies = () => {
    const storedUserType = localStorage.getItem('userType');
    const storedUserName = localStorage.getItem('userName');
    const storedUserEmail = localStorage.getItem('userEmail');

    setUserType(storedUserType || 'default');
    setUserName(storedUserName || 'default');
    setUserEmail(storedUserEmail || 'default');
  };

  const logout = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('userType');
    localStorage.removeItem('userName');
    localStorage.removeItem('userEmail');
    navigate('/');
    window.location.reload();
  };

  const trocaSenha = () => {
    navigate('/enviar');
  };

  const login = () => {
    navigate('/');
  };

  const cursos = (courseId) => {
    navigate.push(`/Cursos/${courseId}`);
    toggleSidebar();
  };

  const home = () => {
    navigate('/');
  };

  const projetos = () => {
    navigate('/projetos');
    toggleSidebar();
  };

  const professor = () => {
    navigate('/Professor');
    toggleSidebar();
  };

  const handleResize = () => {
    const screenWidth = window.innerWidth;
    const navigationHeader = document.querySelector('.navigation_header');

    if (screenWidth > 675) {
      navigationHeader.classList.remove('menu-open');
    }
  };

  return (
    <div>
    {location.pathname !== '/login' && location.pathname !== '/cadastro' && location.pathname !== '/senha' && location.pathname !== '/enviar' && (
      <div>
        <div className="navigation_header" id="navigation_header">
        <div className="logo_header ">
  <img
    src="/Images/Logo.png"
    alt="Logo Cimol"
    className="img_logo_header img-fluid"
  />
</div>
          {userType === 'professor' && (
            <div className="ajustando">
              <button className="itens_header" onClick={professor}>
                INÍCIO
              </button>
              <div>
      <button className="itens_header col-md-2 col-sm-2" onClick={toggleMenu}>
        CURSOS
      </button>
      {isMenuOpen && (
        <ul className="lista">
          {courses.map((course) => (
            <li key={course.id} onClick={() => cursos(course.id)} className="itemDrop">
              {course.name}
            </li>
          ))}
        </ul>
      )}
    </div>
              <button className="button-item itens_header margin" onClick={projetos}>
                PROJETOS
              </button>
              <div>
              <button className="user-menu" onClick={toggleMenu}> 
              <i className="bi bi-person"></i>
               </button>
                {isMenuOpen && (
                  <div className="user-menu-content">
                    <div>
                      <h3>{userName}</h3>
                      <p className="email mt-1">{userEmail}</p>
                    </div>
                    <div>
                      <button onClick={logout}>Deslogar</button>
                      <button onClick={trocaSenha}>Troca de senha</button>
                    </div>
                  </div>
                )}
              </div>
            </div>
          )}
  
          {userType === 'aluno' && (
            <div className="ajustando">
              <button className="itens_header" onClick={professor}>
                INÍCIO
              </button>
              <div>
              <button className="itens_header col-md-2 col-sm-2" onClick={toggleCoursesDropdown}>
                CURSOS
              </button>
              {isCoursesDropdownOpen && (
                <ul className="lista">
                  {courses.map((course) => (
                    <li key={course.id} onClick={() => cursos(course.id)} className="itemDrop">
                      {course.name}
                    </li>
                  ))}
                </ul>
              )}
            </div>
              <button className="button-item itens_header margin" onClick={projetos}>
                PROJETOS
              </button>
              <div>
              <button className="user-menu" onClick={toggleMenu}> 
              <i className="bi bi-person"></i>
               </button>
                {isMenuOpen && (
                  <div className="user-menu-content">
                    <div>
                      <h3>{userName}</h3>
                      <p className="email mt-1">{userEmail}</p>
                    </div>
                    <div>
                      <button onClick={logout}>Deslogar</button>
                      <button onClick={trocaSenha}>Troca de senha</button>
                    </div>
                  </div>
                )}
              </div>
            </div>
          )}
  
          {userType !== 'professor' && userType !== 'aluno' && (
            <div className="ajustando">
              <button className="itens_header col-md-2 col-sm-2" onClick={home}>
                INÍCIO
              </button>
              <div>
              <button className="itens_header col-md-2 col-sm-2" onClick={toggleCoursesDropdown}>
                CURSOS
              </button>
              {isCoursesDropdownOpen && (
                <ul className="lista">
                  {courses.map((course) => (
                    <li key={course.id} onClick={() => cursos(course.id)} className="itemDrop">
                      {course.name}
                    </li>
                  ))}
                </ul>
              )}
            </div>
              <button className="itens_header" onClick={login}>
                ENTRAR
              </button>
            </div>
          )}
        </div>
      </div>
    )}
  </div>
  );
}

export default Header;