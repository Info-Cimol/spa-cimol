import React, { useState, useEffect } from 'react';
import ContainerTopo from '../../components/ContainerTopo';
import MenuHamburguer from "../../components/MenuHamburguer";
import BackArrow from '../BackArrow/index';
import axiosFecht from '../../axios/config';
import './cardapio.css'; 

function Cardapio() {
  const [cardapio, setCardapio] = useState([]);
  const token = localStorage.getItem('token');
  const [userRole] = useState(localStorage.getItem('userRole'));
  const headers = {
    'x-access-token': token,
  };

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await axiosFecht.get('/cardapio/listar/cardapio', {headers});
        setCardapio(response.data);
      } catch (error) {
        console.log('Erro ao listar cardápio', error);
      }
    };

    fetchData();
  }, );

  return (
    <>
    <ContainerTopo userType={userRole} />
    <MenuHamburguer userType={userRole} />
    <BackArrow style={{ marginTop: '100px', marginLeft: '10px' }} />
    <>
      <div className='containerCardapio'>
        <div className='boxCardapio'>
          <div className='header'>
            <h1>Cardápio da semana</h1>
          </div>
          <div className='card__wrapper'>
            {cardapio.map((item, index) => (
              <div className='card__cardapio' key={index}>
                <h2 className='card__title'>{item.nome}</h2>
                <p className='card__description'>{item.descricao}</p>
              </div>
            ))}
          </div>
        </div>
      </div>
    </>
  </>
  )
}

export default Cardapio;