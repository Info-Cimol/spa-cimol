import React, { useState } from 'react';
import { Container } from './styled';
import { Link, useNavigate } from 'react-router-dom';
import axiosFecht from '../../axios/config';
import { toast } from 'react-toastify';

function Login() {
  const [login, setLogin] = useState('');
  const [password, setPassword] = useState('');
  const [userType, setUserType] = useState('aluno');
  const navigate = useNavigate();
  const [firstLogin] = useState(false);
  const [senhaAlterada, setSenhaAlterada] = useState('');
  const [confirmacaoDeSenha, setConfirmacaoDeSenha] = useState('');
  const [iduser] = useState('');
  const [loading, setLoading] = useState(false);
  const [chooseOtherApp, setChooseOtherApp] = useState(false);

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
        if (response.data.user.perfil.includes('professor') && !chooseOtherApp) {
          localStorage.setItem('userData', JSON.stringify(response.data));
          toast.success('Bem vindo(a)!');
          navigate('/Secretaria');
        } else if (response.data.user.perfil.includes('professor') && chooseOtherApp) {
          navigate('/Professor');
        } else if (userType === 'aluno') {
          // Aqui você pode verificar a localização da página antes de redirecionar
          if (window.location.pathname === '/primeiraPagina') {
            navigate('/Secretaria');
          } else {
            navigate('/Aluno');
          }
        }
  
        if (
          (userType === 'professor' && response.data.user.professor === 1) ||
          (userType === 'aluno' && response.data.user.professor === 0)
        ) {
          localStorage.setItem('userData', JSON.stringify(response.data));
          toast.success('Bem vindo(a)!');
          axiosFecht.defaults.headers.common['Authorization'] = `Bearer ${localStorage.getItem('token')}`;
          localStorage.setItem('token', response.data.token);
          localStorage.setItem('userType', userType);
          localStorage.setItem('userName', response.data.user.nome);
          localStorage.setItem('userEmail', response.data.user.email);
          localStorage.setItem('id', response.data.user.id);
  
          window.location.reload();
          setLoading(true);
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
            navigate('/Aluno');
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

  const switchApplication = () => {
    if (!chooseOtherApp) {
      setChooseOtherApp(true);
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
        <h1>LOGIN</h1>
        <form onSubmit={handleFormSubmit}>
          <label>Login</label>
          <input value={login} onChange={(e) => setLogin(e.target.value)} type='text' required />
          <label>Senha</label>
          <input value={password} onChange={(e) => setPassword(e.target.value)} type='password' required />
          {chooseOtherApp && (
            <div className='d-flex justify-content-between'>
              <div className='form-check col-sm-6 ms-5'>
                <input
                  type='radio'
                  id='professor'
                  name='userType'
                  value='professor'
                  checked={userType === 'professor'}
                  onChange={() => setUserType('professor')}
                />
                <label htmlFor='professor'>Professor</label>
              </div>
              <div className='form-check col-sm-6'>
                <input
                  type='radio'
                  id='aluno'
                  name='userType'
                  value='aluno'
                  checked={userType === 'aluno'}
                  onChange={() => setUserType('aluno')}
                />
                <label htmlFor='aluno'>Aluno</label>
              </div>
            </div>
          )}
          {chooseOtherApp ? (
            <button onClick={switchApplication}>Confirmar</button>
          ) : (
            <>
              <button onClick={switchApplication}>Trocar de Aplicação</button>
              <button>{loading ? 'Carregando...' : 'Entrar'}</button>
            </>
          )}
        </form>
        <p>
          Ainda não fez <Link>cadrasto?</Link>
        </p>
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