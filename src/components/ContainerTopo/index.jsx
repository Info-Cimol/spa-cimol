import React from 'react'
import { Container } from './styled';
import MenuHamburguer from '../MenuHamburguer';


function ContainerTopo() {
  return (
    <Container>
        <div className='topo'>
          <div className='container1'>
            <img src="../cimol2.png" alt='Cimol'/>
            <MenuHamburguer pageWrapId={'page-wrap'} outerContainerId={'outer-container'} />
          </div>
          <div className='container2'></div>
        </div>
    </Container>
    
  )
}

export default ContainerTopo;