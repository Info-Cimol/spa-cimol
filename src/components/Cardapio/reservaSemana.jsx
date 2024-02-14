import React, { useState, useEffect } from 'react';
import ContainerTopo from '../ContainerTopo';
import MenuHamburguer from "../MenuHamburguer";
import BackArrow from '../BackArrow/index';
import CardapioCadastro from './cadastroCardapio';
import CloseIcon from '@mui/icons-material/Close';
import { IconButton } from '@mui/material';
import AddIcon from '@mui/icons-material/Add';
import axiosFetch from '../../axios/config';
import './cardapio.css';

function CardapioMerendeira() {
  const [cardapio, setCardapio] = useState([]);
  const [openCadastro, setOpenCadastro] = useState(false);
  const [selectedReservation, setSelectedReservation] = useState(null);
  const [isDetailModalOpen, setIsDetailModalOpen] = useState(false); 
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
    
    const today = new Date();
    const nextMonday = new Date(today.getFullYear(), today.getMonth(), today.getDate() + (1 + 7 - today.getDay()) % 7);
    const weekRange = `${today.toLocaleDateString('pt-BR', { day: 'numeric', month: 'numeric' })} - ${nextMonday.toLocaleDateString('pt-BR', { day: 'numeric', month: 'numeric' })}`;
    setCurrentWeek(weekRange);
  }, [token, openCadastro]);

  const getDayOfWeek = (dateString) => {
    const days = ['Domingo', 'Segunda-feira', 'Terça-feira', 'Quarta-feira', 'Quinta-feira', 'Sexta-feira', 'Sábado'];
    const date = new Date(dateString);
    const dayOfWeek = date.getDay();
    if (dayOfWeek === 0 || dayOfWeek === 6) {
      return null; 
    }
    return days[dayOfWeek];
  };

  // Filtra os cardápios da semana atual
  const cardapioDaSemanaAtual = cardapio.filter(item => {
    const data = new Date(item.data);
    const today = new Date();
    const nextMonday = new Date(today.getFullYear(), today.getMonth(), today.getDate() + (1 + 7 - today.getDay()) % 7);
    return data >= today && data < nextMonday;
  });

  // Função para abrir a ficha detalhada ao clicar em uma reserva na tabela
  const handleReservationClick = (reservation) => {
    setSelectedReservation(reservation);
    setIsDetailModalOpen(true);
  };

  // Função para fechar a ficha detalhada
  const handleCloseDetailModal = () => {
    setIsDetailModalOpen(false);
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
              {cardapioDaSemanaAtual.map((item, index) => {
                const dayOfWeek = getDayOfWeek(item.data);
                if (dayOfWeek) {
                  return (
                    <tr key={index} onClick={() => handleReservationClick(item)}>
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
      {isDetailModalOpen && (
        <div className="modal-container">
          <div className="header">
            <h2 className="title">Detalhes da Reserva</h2>
            <IconButton className="close-button" onClick={handleCloseDetailModal} title="Fechar">
              <CloseIcon />
            </IconButton>
          </div>
          <div className="modal-content">
            <p>Data: {getDayOfWeek(selectedReservation.data)}</p>
            <p>Nome: {selectedReservation.nome}</p>
            <p>Descrição: {selectedReservation.descricao}</p>
            <p>Reservas: {selectedReservation.reservas}</p>
            <p>Manhã: {selectedReservation.manha_count}</p>
            <p>Tarde: {selectedReservation.tarde_count}</p>
            <p>Noite: {selectedReservation.noite_count}</p>
            
          </div>
        </div>
      )}
    </>
  );  
}

export default CardapioMerendeira;