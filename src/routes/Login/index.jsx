import React from 'react'
import { Container } from './styled';
import { Link } from 'react-router-dom';

function Login(){
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
            <form action="">
                <label >Login</label>
                <input type="text" />
                <label>Senha</label>
                <input type="password" />
                <button>Entrar</button>
            </form>
            <p>Ainda não fez <Link>cadrasto?</Link></p>
        </div>
        
    </Container>
  )
}

export default Login;