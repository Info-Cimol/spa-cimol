import React, { useState } from 'react';
import { Container } from './styled';
import { useNavigate } from 'react-router-dom';
import axiosFecht from '../../axios/config';
import { toast } from 'react-toastify';

function Login() {
  const [login, setLogin] = useState('');
  const [password, setPassword] = useState('');
  const [userTypes, setUserTypes] = useState([]);
  const [selectedUserType, setSelectedUserType] = useState('');
  const [loading, setLoading] = useState(false);

  const navigate = useNavigate();

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
            // Se o usuário tem apenas um perfil, usar esse perfil
            const userRole = userRoles[0];
            setUserAndNavigate(userRole, response);
          } else if (userRoles.length > 1 && userType) {
            // Se o usuário tem mais de um perfil e userType foi especificado, usar userType
            setUserAndNavigate(userType, response);
          } else if (userRoles.length > 1) {
            // Se o usuário tem mais de um perfil, mas userType não foi especificado, mostrar opções
            setUserTypes(userRoles);
          } else {
            // Caso incomum: usuário sem perfil atribuído
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
  
    switch (userType) {
      case "professor":
        navigate('/Professor');
        break;
      case "aluno":
        navigate('/Aluno');
        break;
      case "secretaria":
        navigate('/Secretaria');
        break;
      case "merendeira":
        navigate('/Merendeira');
        break;
      case "admin":
        navigate('/Coodernador/Admin');
        break;
      default:
        console.log('Tipo de usuário inválido');
        toast.error('Tipo de usuário inválido');
    }
  };
  
  const handleFormSubmit = async (e) => {
    e.preventDefault();
    setLoading(!loading);

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
        console.log('Falha na autenticação');
        toast.error('Falha na autenticação');
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
    }
  };

  return (
    <Container>
      <div className='topo'>
        <div className='topo2'></div>
      </div>
      <div className='imgCentral'>
        <img src="/cimol.png" alt='Cimol' />
      </div>
      <div className='areaLogin'>
        <i className="bi bi-person" style={{ fontSize: '50px' }}></i>
        <form onSubmit={handleFormSubmit}>
          <input value={login} onChange={(e) => setLogin(e.target.value)} placeholder='E-mail' PLtype='text' required />
          <input value={password} onChange={(e) => setPassword(e.target.value)} placeholder='Senha' type='password' required />

          {userTypes.length > 1 && (
            <div style={{ marginTop: '15px', padding: '10px', border: '1px solid #ccc', borderRadius: '5px' }}>
              <label style={{ fontWeight: 'bold' }}>Escolha um perfil:</label>
              <div>
                {userTypes.map((type) => (
                  <label key={type} style={{ display: 'block', margin: '5px 0' }}>
                    <input
                      type="radio"
                      value={type}
                      checked={selectedUserType === type}
                      onChange={() => setSelectedUserType(type)}
                    />
                    {type}
                  </label>
                ))}
              </div>
              <button
                style={{ marginTop: '10px', padding: '5px 10px', background: '#007BFF', color: '#fff', border: 'none', borderRadius: '3px', cursor: 'pointer' }}
                onClick={handleProfileSelection}
              >
                Selecionar Perfil
              </button>
            </div>
          )}

          <button>{loading ? 'Carregando...' : 'Entrar'}</button>
        </form>
      </div>
    </Container>
  );
}

export default Login;