import React, { useState, useEffect } from 'react';
import ContainerTopo from '../../components/ContainerTopo';
import MenuHamburguer from "../../components/MenuHamburguer";
import BackArrow from '../BackArrow/index';
import CardapioCadastro from '../Cardapio/cadastroCardapio';
import { IconButton } from '@mui/material';
import AddIcon from '@mui/icons-material/Add';
import axiosFetch from '../../axios/config';
import './cardapio.css';

function CardapioMerendeira() {
  const [cardapio, setCardapio] = useState([]);
  const [openCadastro, setOpenCadastro] = useState(false);
  const token = localStorage.getItem('token');
  const [userRole] = useState(localStorage.getItem('userRole'));
  const [currentWeek, setCurrentWeek] = useState('');

  const handleToggleForm = () => {
    setOpenCadastro(!openCadastro); 
  };

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
    
    // Calcular a semana atual e a seguinte
    const today = new Date();
    const nextWeekStart = new Date(today.getFullYear(), today.getMonth(), today.getDate() + 7);
    const weekRange = `${today.toLocaleDateString('pt-BR', { day: 'numeric', month: 'numeric' })} - ${nextWeekStart.toLocaleDateString('pt-BR', { day: 'numeric', month: 'numeric' })}`;
    setCurrentWeek(weekRange);
  }, [token]);

  const getDayOfWeek = (dateString) => {
    const days = ['Domingo', 'Segunda-feira', 'Terça-feira', 'Quarta-feira', 'Quinta-feira', 'Sexta-feira', 'Sábado'];
    const date = new Date(dateString);
    let dayOfWeek = date.getDay();
    if (dayOfWeek === 0 || dayOfWeek === 6) {
      return null; 
    }
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
          
        {userRole === 'admin' || userRole === 'secretaria' ? (
          <div className="add-button-container">
           <h2>Reservas da semana  {currentWeek}</h2>
            <IconButton onClick={handleToggleForm} title="Formulário de cadastro" component="span">
              <AddIcon fontSize="large" />
            </IconButton>
          </div>
        ) : null}

              {openCadastro && <CardapioCadastro open={openCadastro} onClose={() => setOpenCadastro(false)} />}
  
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
              {cardapio.map((item, index) => {
                const dayOfWeek = getDayOfWeek(item.data);
                if (dayOfWeek) {
                  return (
                    <tr key={index}>
                      <td>{dayOfWeek}</td>
                      <td>{item.nome}</td>
                      <td>{item.descricao}</td>
                      <td>{item.reservas}</td>
                    </tr>
                  );
                }
                return null;
              })}
            </tbody>
          </table>
        </div>
      </div>
    </>
  );  
}

export default CardapioMerendeira;