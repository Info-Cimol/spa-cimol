import React from 'react'
import { Container } from './styled';
import MenuHamburguer from '../MenuHamburguer';


function ContainerTopo({userType, setMostrarBotao, setSecaoAlunos}) {
  return (
    <Container>
        <div className='topo'>
          <div className='container1'>
            <img src="../cimol.png" alt='Cimol'/>
            <MenuHamburguer setMostrarBotao={setMostrarBotao} setSecaoAlunos={setSecaoAlunos} userType={userType} pageWrapId={'page-wrap'} outerContainerId={'outer-container'} />
          </div>
          <div className='container2'></div>
        </div>
    </Container>
    
  )
}

export default ContainerTopo;