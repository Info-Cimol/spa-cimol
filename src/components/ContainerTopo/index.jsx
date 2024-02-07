import React from 'react'
import MenuHamburguer from '../MenuHamburguer';
import { Container} from "./styled.jsx";

function ContainerTopo({userType, setMostrarBotao, setSecaoAlunos}) {
  return (
   <Container>
        <div className='topo'>
          <div className='containerTopo'>
            <a href='https://www.cimol.g12.br/' target='_blank' rel='noopener noreferrer'>
              <img id="cici" src="/cimol.png" alt='Cimol'/>
            </a>
            <MenuHamburguer setMostrarBotao={setMostrarBotao} setSecaoAlunos={setSecaoAlunos} userType={userType} pageWrapId={'page-wrap'} outerContainerId={'outer-container'} />
          </div>
          <div className='linhaAmarela'></div>
        </div>
 </Container>
  )
}

export default ContainerTopo;