import React, { useState } from 'react';
import { Container } from './styled';
import { useNavigate } from 'react-router-dom';
import axiosFecht from '../../axios/config';
import { toast } from 'react-toastify';

function Login() {
  const [login, setLogin] = useState('');
  const [password, setPassword] = useState('');
  const [userType] = useState('aluno','professor');
  const navigate = useNavigate();
  const [firstLogin] = useState(false);
  const [senhaAlterada, setSenhaAlterada] = useState('');
  const [confirmacaoDeSenha, setConfirmacaoDeSenha] = useState('');
  const [iduser] = useState('');
  const [loading, setLoading] = useState(false);
  const [chooseOtherApp] = useState(false);

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
        if (response.data.user.perfil.includes('professor') || response.data.user.professor === 1) {
          handleProfessorLogin(response);
        } else if (response.data.user.perfil.includes('aluno') || response.data.user.professor === 0) {
          handleAlunoLogin(response);
        } else {
          setLoading(false);
          console.log('Tipo de usuário inválido');
          toast.error('Tipo de usuário inválido');
        }
      } else {
        setLoading(false);
        console.log('Credenciais inválidas');
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
    }
  };

  const handleProfessorLogin = (response) => {
    localStorage.setItem('userData', JSON.stringify(response.data));
   
    axiosFecht.defaults.headers.common['Authorization'] = `Bearer ${localStorage.getItem('token')}`;
    localStorage.setItem('token', response.data.token);
    localStorage.setItem('userType', userType);
    localStorage.setItem('userName', response.data.user.nome);
    localStorage.setItem('userEmail', response.data.user.email);
    localStorage.setItem('id', response.data.user.id);

    if (chooseOtherApp) {
      navigate('/Professor');
    
    } else {
      navigate('/Secretaria');
    }
    window.location.reload();
    setLoading(true);
  };

  const handleAlunoLogin = (response) => {
    localStorage.setItem('userData', JSON.stringify(response.data));

    axiosFecht.defaults.headers.common['Authorization'] = `Bearer ${localStorage.getItem('token')}`;
    localStorage.setItem('token', response.data.token);
    localStorage.setItem('userType', userType);
    localStorage.setItem('userName', response.data.user.nome);
    localStorage.setItem('userEmail', response.data.user.email);
    localStorage.setItem('id', response.data.user.id);

    if (chooseOtherApp) {
      navigate('/Aluno/Projeto');
    
    } else {
      navigate('/Aluno');
    }

    window.location.reload();
    setLoading(true);
  };

  const handleAlterarSenha = async (e) => {
    e.preventDefault();

    if (senhaAlterada === confirmacaoDeSenha) {
      try {
        const response = await axiosFecht.put('/user/alterarSenha/' + iduser, {
          senhaAlterada: senhaAlterada,
        });

        if (response.data.success === true) {
          if (userType === 'professor') {
            navigate('/Professor');
          } else if (userType === 'aluno') {
            navigate('/Aluno/Projeto');
          }

          toast.success('Senha alterada com sucesso!');
        } else {
          toast.error('Erro ao alterar senha!');
        }
      } catch (error) {
        console.log('Erro ao definir nova senha');
        toast.error('Erro ao definir nova senha');
      }
    } else {
      toast.error('As senhas não conferem!');
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
        <i className="bi bi-person" style={{fontSize:'50px'}}></i>
        <form onSubmit={handleFormSubmit}>
          <input value={login} onChange={(e) => setLogin(e.target.value)} placeholder='E-mail' PLtype='text' required />
          <input value={password} onChange={(e) => setPassword(e.target.value)} placeholder='Senha' type='password' required />

         <button>{loading ? 'Carregando...' : 'Entrar'}</button>

        </form>
      </div>

      {firstLogin && (
        <div className='containerAlterarSenha'>
          <div className='areaLogin'>
            <h2>Alterar senha</h2>
            <form onSubmit={handleAlterarSenha}>
              <label>Digite sua nova senha</label>
              <input type='password' value={senhaAlterada} onChange={(e) => setSenhaAlterada(e.target.value)} />
              <label>Confirme a senha novamente</label>
              <input type='password' value={confirmacaoDeSenha} onChange={(e) => setConfirmacaoDeSenha(e.target.value)} />
              <button>Alterar</button>
            </form>
          </div>
        </div>
      )}
    </Container>
  );
}

export default Login;