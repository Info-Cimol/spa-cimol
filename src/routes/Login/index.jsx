import React, { useState } from 'react'
import { Container } from './styled';
import { Link, useNavigate } from 'react-router-dom';
import axiosFecht from '../../axios/config';
import { toast } from 'react-toastify';

function Login(){
    const[login, setLogin] = useState('');
    const[password, setPassword] = useState('')
    const navigate = useNavigate();
    

    const handleFormSubmit = async (e) =>{
        e.preventDefault();

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
                    localStorage.setItem('userData', JSON.stringify(response.data));
                    toast.success('Bem vindo(a)');
                    navigate("/AlunoLogado")
                }   
            }

        } catch(error){
            toast.error('usuario ou senha incorretos!')
            console.error('usuario ou senha incorretos', error);
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
                <button>Entrar</button>
            </form>
            <p>Ainda não fez <Link>cadrasto?</Link></p>
        </div>
        
    </Container>
  )
}

export default Login;