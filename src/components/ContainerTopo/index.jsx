import React from 'react';
import MenuHamburguer from '../MenuHamburguer';
import { Container } from "./styled.jsx";

function ContainerTopo({ userType, setMostrarBotao, setSecaoAlunos }) {
  const handleLogoClick = () => {
    window.open('https://www.cimol.g12.br/', '_blank');
  };

  return (
    <Container>
      <div className='topo'>
        <div className='containerTopo'>
          <img id="cici" src="/cimol.png" alt='Cimol' onClick={handleLogoClick} style={{ cursor: 'pointer' }} />
          <MenuHamburguer setMostrarBotao={setMostrarBotao} setSecaoAlunos={setSecaoAlunos} userType={userType} pageWrapId={'page-wrap'} outerContainerId={'outer-container'} />
        </div>
        <div className='linhaAmarela'></div>
      </div>
    </Container>
  );
}

export default ContainerTopo;