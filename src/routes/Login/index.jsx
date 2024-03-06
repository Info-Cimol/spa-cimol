import React, { useState, useEffect } from 'react';
import { Container } from './styled';
import { TextField, Button, FormControlLabel, Radio, RadioGroup, FormLabel, CircularProgress, Typography } from '@mui/material';
import { Email, Lock, Visibility, VisibilityOff } from '@mui/icons-material';
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
    const userToken = localStorage.getItem('token');
    
    if (userData && userToken) {
      const tokenExpiration = JSON.parse(atob(userToken.split('.')[1])).exp;
      const expirationTime = tokenExpiration * 1000; 
      const currentTime = Date.now();
      const timeDifference = expirationTime - currentTime;
      
      if (timeDifference <= 0 || timeDifference > 8 * 60 * 60 * 1000) {
  
        localStorage.clear();
        window.location.reload();
      } else {
        setAuthenticated(true);
      }
    }
  }, []);
  
  const handleToggleTrocarSenhaVisibility = () => {
    setShowTrocarSenha(!showTrocarSenha);
  };

  const handleTogglePasswordVisibility = () => {
    setShowPassword(!showPassword);
  };
 
  const handleLogin = (response) => {
    const firstLogin = response.data.firstLogin; 
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
    if (response.data.auth === false) {
      if (response.data.message === "Usuário desativado. Entre em contato com o suporte.") {
        toast.error("Usuário desativado. Entre em contato com o suporte.");
      } else {
        toast.error("Credenciais inválidas");
      }
    } else {
      if (firstLogin === false) { 
        setShowTrocarSenha(true);
      } else {
        setUserTypes(response.data.user.perfil);
      }
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
          setUserAndNavigate(userType, response);
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
          console.error(error.response);
          toast.error('Erro ao realizar login');
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
        if (response.data.message) {
          toast.error(response.data.message);
        } else {
          console.log('Senha incorreta');
          toast.error('Credenciais inválidas');
        }
      }
    } catch (error) {
      console.error(error);
      toast.error('Erro ao realizar login');
      setLoading(false);
    }
  };

  const handleLogoClick = () => {
    window.open('https://www.cimol.g12.br/', '_blank');
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
          <img src="/cimol.png" alt="Cimol" onClick={handleLogoClick} style={{ cursor: 'pointer' }} />
        </div>
        {showTrocarSenha ? (
          <>
            <BackArrow style={{ marginTop: '120px', marginLeft: '10px' }} />
            <TrocarSenha />
          </>
        ) : (
          <div className="areaLogin">
            <form className="formulario-login" onSubmit={handleFormSubmit}>
            <i className="bi bi-person" style={{ fontSize: '50px' }}></i>
              <div className="input-group mb-3">
                <span className="input-group-text align-items-center">
                  <Email />
                </span>

                <TextField
                  value={login}
                  label="E-mail"
                  onChange={(e) => setLogin(e.target.value)}
                  type="text"
                  placeholder="E-mail"
                  required
                  className="form-control email-input"
                />
              </div>

              <div className="input-group mb-3">
                <span className="input-group-text">
                  <Lock />
                </span>
                <TextField
                  name="logpass"
                  id="logpass"
                  label="Senha"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  type={showPassword ? "text" : "password"}
                  placeholder="Senha"
                  required
                  className="form-control password-input"
                />
                <span className="input-group-text" onClick={handleTogglePasswordVisibility}>
                  {showPassword ? <VisibilityOff /> : <Visibility />}
                </span>
              </div>

              {userTypes.length > 1 && (
                <div className="profile-selector-container">
                  <FormLabel className="profile-label">Selecione um perfil</FormLabel>

                  <RadioGroup
                    aria-label="userType"
                    name="userType"
                    value={selectedUserType}
                    onChange={(e) => setSelectedUserType(e.target.value)}
                  >
                    {userTypes.map((type) => (
                      <FormControlLabel
                        key={type}
                        value={type}
                        control={<Radio />}
                        label={type}
                      />
                    ))}
                  </RadioGroup>

                  <Button variant="contained" onClick={handleProfileSelection}>
                    Selecionar Perfil
                  </Button>
                </div>
              )}
              <Typography variant="body1" className="forgot_password" style={{ cursor: "pointer", fontSize: '1.2rem', color: '#1b2f4a' }} onClick={handleToggleTrocarSenhaVisibility}>Esqueceu a senha? Trocar senha</Typography>
              <Button variant="contained" color="primary" type="submit" disabled={loading}>
                {loading ? <CircularProgress size={24} /> : 'Entrar'}
              </Button>
            </form>
          </div>
        )}
      </Container>
    );
  }
}

export default Login;