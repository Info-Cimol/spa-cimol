import React, { useState } from 'react'
import { Container } from './styled';
import { Link, useNavigate } from 'react-router-dom';
import axiosFecht from '../../axios/config';
import { toast } from 'react-toastify';

function Login(){
    const[login, setLogin] = useState('');
    const[password, setPassword] = useState('')
    const navigate = useNavigate();
    const[firstLogin, setFirstLogin] = useState(false);
    const[senhaAlterada, setSenhaAlterada] = useState('');
    const[confirmacaoDeSenha, setConfirmacaoDeSenha] = useState('');
    const[iduser, setIduser] = useState();
    const[loading, setLoading] =  useState(false);
    

    const handleFormSubmit = async (e) =>{
        e.preventDefault();
        setLoading(!loading);
        try{

            const response =  await axiosFecht.post('/user/login',{
                email: login,
                senha: password,
            });

            if(response.data.auth === true){
                if(response.data.user.perfil[0] === "professor"){
                    localStorage.setItem('userData', JSON.stringify(response.data));
                    toast.success('Bem vindo(a)!')
                    navigate("/Secretaria")
                    console.log(response.data);
                }else{
                    if(response.data.primeiroLogin === true){
                        localStorage.setItem('userData', JSON.stringify(response.data));
                        toast.success('Bem vindo(a)');
                        setIduser(response.data.user.id);
                        console.log(response.data);
                        setFirstLogin(!firstLogin);
                    }else{
                        console.log(response.data);
                        localStorage.setItem('userData', JSON.stringify(response.data));
                        toast.success('Bem vindo(a)');
                        navigate("/Aluno")
                    } 
                }   
            }

        } catch(error){
            toast.error('usuario ou senha incorretos!')
            console.error('usuario ou senha incorretos', error);
        }
    }

    const handleAlterarSenha = async (e) =>{
        e.preventDefault();
        if(senhaAlterada === confirmacaoDeSenha){
            try {

                const response = await axiosFecht.put('/user/alterarSenha/'+iduser, {
                    senhaAlterada : senhaAlterada
                });

                if(response.data.succsses === true){
                    navigate("/Aluno");
                }else{
                    toast.error('Erro ao alterar senha!');
                }
                
            } catch (error) {
                console.log('Erro ao definir nova senha');
            }
        }else{
            toast.error('As senhas não conferem!')
        }
    }

  return (
    <Container>
        <div className='topo'>
            <div className='topo2'></div>
        </div>
        <div className='imgCentral'>
            <img src="/cimol.png" alt='Cimol'/>
        </div>
        <div className='areaLogin'>
            <h1>LOGIN</h1>
            <form onSubmit={handleFormSubmit}>
                <label>Login</label>
                <input value={login} onChange={(e) =>(setLogin(e.target.value))}type="text" required />
                <label>Senha</label>
                <input value={password} onChange={(e) =>(setPassword(e.target.value))} type="password" required/>
                <button>{loading ?('Carregando...'):('Entrar')}</button>
            </form>
            <p>Ainda não fez <Link>cadrasto?</Link></p>
        </div>
        {firstLogin && (
            <div className='containerAlterarSenha'>
                <div className='areaLogin'>
                    <h2>Alterar senha</h2>
                    <form onSubmit={handleAlterarSenha}>
                        <label>digite sua nova senha</label>
                        <input type="password" value={senhaAlterada} onChange={(e) =>(setSenhaAlterada(e.target.value))}/>
                        <label>confirme a senha novamente</label>
                        <input type="password" value={confirmacaoDeSenha} onChange={(e) =>(setConfirmacaoDeSenha(e.target.value))}/>
                        <button>Alterar</button>
                    </form>
                </div>  
            </div>
        )}
    </Container>
  )
}

export default Login;