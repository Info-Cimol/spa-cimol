import React, { useState, useEffect } from 'react';
import { Container } from './styled';
import axiosFecht from '../../axios/config';
import { toast } from 'react-toastify'; 
import BackArrow from '../../components/BackArrow/index';
import TrocarSenha from '../../components/TrocarSenha/index';
import Home from '../../components/Home/index'; 

function Login() {
  const [login, setLogin] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [userTypes, setUserTypes] = useState([]);
  const [selectedUserType, setSelectedUserType] = useState('');
  const [loading, setLoading] = useState(false);
  const [showTrocarSenha, setShowTrocarSenha] = useState(false); 
  const [authenticated, setAuthenticated] = useState(false); 

  useEffect(() => {
    const userData = localStorage.getItem('userData');
    if (userData) {
      setAuthenticated(true);
    }
  }, []);
  
  const handleToggleTrocarSenhaVisibility = () => {
    setShowTrocarSenha(!showTrocarSenha);
  };

  const handleTogglePasswordVisibility = () => {
    setShowPassword(!showPassword);
  };
 
  const handleLogin = (response) => {
    const userRoles = response.data.user.perfil;
    if (userRoles.length === 1) {
      const userRole = userRoles[0];
      saveUserData(response, userRole);
    } else if (userRoles.length > 1) {
      setUserTypes(userRoles);
    } else {
      console.log('Usuário sem perfil atribuído');
      toast.error('Usuário sem perfil atribuído');
    }
  };

  const handleProfileSelection = () => {
    if (selectedUserType) {
      saveUserData(selectedUserType);
    }
  };
  
  const saveUserData = (userType) => {
    axiosFecht.defaults.headers.common['Authorization'] = ''; 
    localStorage.removeItem('token');
  
    try {
      const loginData = {
        email: login,
        senha: password,
      };
  
      axiosFecht.post('/user/login', loginData)
        .then((response) => {
          const userRoles = response.data.user.perfil;
  
          if (userRoles.length === 1) {
            const userRole = userRoles[0];
            setUserAndNavigate(userRole, response);
          } else if (userRoles.length > 1 && userType) {
            setUserAndNavigate(userType, response);
          } else if (userRoles.length > 1) {
            setUserTypes(userRoles);
          } else {
            console.log('Usuário sem perfil atribuído');
            toast.error('Usuário sem perfil atribuído');
          }
        })
        .catch((error) => {
          if (error.response) {
            if (error.response.status === 404) {
              console.log('Email não cadastrado');
              toast.error('Email não cadastrado');
            } else {
              console.error(error.response.data);
              toast.error('Erro de resposta do servidor');
            }
          } else {
            console.error(error);
            toast.error('Erro de requisição');
          }
        })
        .finally(() => {
          setLoading(false);
        });
    } catch (error) {
      console.error(error);
      toast.error('Erro inesperado');
      setLoading(false);
    }
  };
  
  const setUserAndNavigate = (userType, response) => {
    localStorage.setItem('userRole', userType);
    localStorage.setItem('userData', JSON.stringify(response.data));
    localStorage.setItem('token', response.data.token);
    localStorage.setItem('userType', userType);
    localStorage.setItem('userName', response.data.user.nome);
    localStorage.setItem('userEmail', response.data.user.email);
    localStorage.setItem('id', response.data.user.id);
    setAuthenticated(true);
  };
  
  const handleFormSubmit = async (e) => {
    e.preventDefault();
    setLoading(true); 
  
    try {
      const loginData = {
        email: login,
        senha: password,
      };
  
      const response = await axiosFecht.post('/user/login', loginData);
  
      if (response.data.auth === true) {
        handleLogin(response);
      } else {
        setLoading(false);
        console.log('Senha incorreta');
        toast.error('Credenciais inválidas');
      }
    } catch (error) {
      if (error.response) {
        if (error.response.status === 404) {
          console.log('Email não cadastrado');
          toast.error('Email não cadastrado');
        } else {
          console.error(error.response.data);
          toast.error('Erro de resposta do servidor');
        }
      } else {
        console.error(error);
        toast.error('Erro de requisição');
      }
      setLoading(false);
    }
  };
  
  if (authenticated) {
    return <Home />;
  } else {
    return (
      <Container>
        <div className="topo">
          <div className="topo2"></div>
        </div>
      
        <div className="imgCentral">
          <img src="/cimol.png" alt="Cimol" />
        </div>
        {showTrocarSenha ? ( 
        <BackArrow style={{ marginTop: '120px', marginLeft: '10px' }} /> ,
        <TrocarSenha />
        ) : (
        <div className="areaLogin">
          <i className="bi bi-person" style={{ fontSize: '50px' }}></i>
          <form className="formulario-login" onSubmit={handleFormSubmit}>
            <div className="input-group mb-3">
              <span className="input-group-text align-items-center">
                <i className="input-icon uil uil-at"></i>
              </span>

              <input
                value={login}
                onChange={(e) => setLogin(e.target.value)}
                type="text"
                placeholder="E-mail"
                required
                className="form-control email-input"
              />
            </div>

            <div className="input-group mb-3">
              <span className="input-group-text">
                <i className="input-icon uil uil-lock-alt"></i>
              </span>
              <input
                name="logpass"
                id="logpass"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                type={showPassword ? "text" : "password"} 
                placeholder="Senha"
                required
                className="form-control password-input"
              />
              <span className="input-group-text" onClick={handleTogglePasswordVisibility}> 
                <i className={`bi bi-eye${showPassword ? "-slash" : ""}`} style={{ cursor: 'pointer' }}></i>
              </span>
            </div>

            {userTypes.length > 1 && (
              <div className="profile-selector-container">
                <label className="profile-label">Selecione um perfil</label>

                {userTypes.map((type) => (
                  <label className="valor-label" key={type}>
                    <input
                      className="checkbox-input"
                      type="radio"
                      value={type}
                      checked={selectedUserType.includes(type)}
                      onChange={() => setSelectedUserType(type)}
                    />
                    <label className="checkbox-text">{type}</label>
                  </label>
                ))}

                <button className="select-button" onClick={handleProfileSelection}>
                  Selecionar Perfil
                </button>
              </div>
            )}

            <button className="btn btn-primary">
              {loading ? 'Carregando...' : 'Entrar'}
            </button>
          </form>
          <div className="forgot_password" style={{cursor: "pointer"}} onClick={handleToggleTrocarSenhaVisibility}>Esqueceu a senha? Trocar senha</div>
        </div>
        )}
      </Container>
    );
  }
}

export default Login;