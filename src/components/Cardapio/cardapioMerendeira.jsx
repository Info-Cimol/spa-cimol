import React, { useState, useEffect } from 'react';
import ContainerTopo from '../../components/ContainerTopo';
import MenuHamburguer from "../../components/MenuHamburguer";
import BackArrow from '../BackArrow/index';
import axiosFetch from '../../axios/config';
import './cardapio.css';

function CardapioMerendeira() {
  const [cardapio, setCardapio] = useState([]);
  const token = localStorage.getItem('token');
  const [userRole] = useState(localStorage.getItem('userRole'));

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await axiosFetch.get('/listar/cardapio', {
          headers: { 'x-access-token': token }
        });
        setCardapio(response.data);
      } catch (error) {
        console.log('Erro ao listar cardápio', error);
      }
    };

    fetchData();
  },);

  const getDayOfWeek = (dateString) => {
    const days = ['Domingo', 'Segunda-feira', 'Terça-feira', 'Quarta-feira', 'Quinta-feira', 'Sexta-feira', 'Sábado'];
    const date = new Date(dateString);
    let dayOfWeek = date.getDay();
    return days[dayOfWeek];
  };

  return (
    <>
      <div>
        <ContainerTopo userType={userRole} />
        <MenuHamburguer userType={userRole} />
      </div>

      <div className='container-fluid'>
        <BackArrow style={{ marginTop: '2000px', marginLeft: '10px' }} />
        <div className='containerCardapio'>
          
          <table className="cardapio-table">
            <thead>
              <tr>
                <th>Dia</th>
                <th>Nome</th>
                <th>Descrição</th>
                <th>Reservas</th>
              </tr>
            </thead>
            <tbody>
              {cardapio.map((item, index) => (
                <tr key={index}>
                  <td>{getDayOfWeek(item.data)}</td>
                  <td>{item.nome}</td>
                  <td>{item.descricao}</td>
                  <td>{item.reservas}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </>
  );  
}

export default CardapioMerendeira;