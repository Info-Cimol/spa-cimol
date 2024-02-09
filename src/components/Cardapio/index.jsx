import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { FaCalendarPlus } from 'react-icons/fa';
import ContainerTopo from '../../components/ContainerTopo';
import MenuHamburguer from "../../components/MenuHamburguer";
import BackArrow from '../BackArrow/index';
import axiosFecht from '../../axios/config';
import imagem1 from '../../imagens/image1.jpg';
import './cardapio.css'; 

function Cardapio() {
  const [cardapio, setCardapio] = useState([]);
  const token = localStorage.getItem('token');
  const [userRole] = useState(localStorage.getItem('userRole'));
  const img = imagem1;
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
  },);

  // Função para converter a data para o dia da semana
  const getDayOfWeek = (dateString) => {
    const days = ['Domingo', 'Segunda-feira', 'Terça-feira', 'Quarta-feira', 'Quinta-feira', 'Sexta-feira', 'Sábado'];
    const date = new Date(dateString);
    const dayOfWeek = date.getDay();
    return days[dayOfWeek];
  };

  return (
    <>
    <div>
      <ContainerTopo userType={userRole} />
      <MenuHamburguer userType={userRole} />
    </div>
      <BackArrow style={{ marginTop: '100px', marginLeft: '10px' }}/>
      
      <div className='containerCardapio'>
        <div className='header_cardapio'>
          <h1>Cardápio da semana</h1>
        </div>
        <motion.div className='cardapio-carousel'
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 1 }}
          style={{
            display: 'flex',
            justifyContent: 'space-between',
            overflowX: 'auto',
            width: '100%', 
          }}
          drag="x" 
          dragConstraints={{ left: 0, right: 0 }} 
        >
          {cardapio.map((item, index) => (
            <motion.div key={index} className='card__cardapio'
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              style={{ marginRight: '20px', flex: '0 0 auto' }}
            >
              <img src={img} alt='text alt' className='card__image' />
              <div className='card__content'>
                <h2 className='card__title'>{item.nome}</h2>
                <h2 className='card__title'>{getDayOfWeek(item.data)}</h2> 
                <p className='card__description'>{item.descricao}</p>
                <div style={{ display: 'flex', alignItems: 'center' }}>
                  <FaCalendarPlus size={20} style={{ marginRight: '5px' }} />
                  <span>Reservar</span>
                </div>
              </div>
            </motion.div>
          ))}
        </motion.div>
      </div>
    </>
  );
}

export default Cardapio;