import React, { useState, useEffect } from 'react';
import ContainerTopo from '../ContainerTopo';
import MenuHamburguer from "../MenuHamburguer";
import BackArrow from '../BackArrow/index';
import CardapioCadastro from './cadastroCardapio';
import CloseIcon from '@mui/icons-material/Close';
import { IconButton, Button } from '@mui/material';
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
  const [weekStart, setWeekStart] = useState('');
  const [weekEnd, setWeekEnd] = useState('');

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

        // Define a semana atual
        const today = new Date();
        const nextMonday = new Date(today.getFullYear(), today.getMonth(), today.getDate() + (1 + 7 - today.getDay()) % 7);
        const weekRange = `${today.toLocaleDateString('pt-BR', { day: 'numeric', month: 'numeric' })} - ${nextMonday.toLocaleDateString('pt-BR', { day: 'numeric', month: 'numeric' })}`;
        setCurrentWeek(weekRange);
        setWeekStart(today);
        setWeekEnd(nextMonday);
      } catch (error) {
        console.log('Erro ao listar cardápio', error);
      }
    };

    fetchData();
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

  const cardapioDaSemanaAtual = cardapio.filter(item => {
    const data = new Date(item.data);
    const dayOfWeek = data.getDay();

    // Verifica se o dia da semana não é sábado (6) ou domingo (0)
    if (dayOfWeek !== 6 && dayOfWeek !== 0) {
      // Retorna true se o dia estiver dentro da semana atual
      return data >= weekStart && data < weekEnd;
    }

    return false;
  });

  const handleReservationClick = (reservation) => {
    setSelectedReservation(reservation);
    setIsDetailModalOpen(true);
  };

  const handleCloseDetailModal = () => {
    setIsDetailModalOpen(false);
  };

  const handleNextWeek = () => {
    const nextWeekStart = new Date(weekEnd);
    nextWeekStart.setDate(nextWeekStart.getDate() + 1);
    const nextWeekEnd = new Date(nextWeekStart);
    nextWeekEnd.setDate(nextWeekEnd.getDate() + 7);

    const weekRange = `${nextWeekStart.toLocaleDateString('pt-BR', { day: 'numeric', month: 'numeric' })} - ${nextWeekEnd.toLocaleDateString('pt-BR', { day: 'numeric', month: 'numeric' })}`;
    setCurrentWeek(weekRange);
    setWeekStart(nextWeekStart);
    setWeekEnd(nextWeekEnd);
  };

  const handlePreviousWeek = () => {
    const today = new Date();
    const previousWeekStart = new Date(weekStart);
    previousWeekStart.setDate(previousWeekStart.getDate() - 1);

    // Se a data retroceder até a data atual, não permite mais retroceder
    if (previousWeekStart < today) {
      return;
    }
    const previousWeekEnd = new Date(previousWeekStart);
    previousWeekEnd.setDate(previousWeekEnd.getDate() + 7);
  
    const weekRange = `${previousWeekStart.toLocaleDateString('pt-BR', { day: 'numeric', month: 'numeric' })} - ${previousWeekEnd.toLocaleDateString('pt-BR', { day: 'numeric', month: 'numeric' })}`;
    setCurrentWeek(weekRange);
    setWeekStart(previousWeekStart);
    setWeekEnd(previousWeekEnd);
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
          <div className="add-button-container">
            <h2>Reservas da semana  {currentWeek}</h2>
            {userRole === 'admin' || userRole === 'secretaria' ? (
              <IconButton onClick={handleToggleForm} title="Formulário de cadastro" component="span">
                <AddIcon fontSize="large" />
              </IconButton>
            ) : null}
          </div>

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

          <div className="week-navigation">
            <Button onClick={handlePreviousWeek}>Semana Anterior</Button>
            <Button onClick={handleNextWeek}>Próxima Semana</Button>
          </div>
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
            <p><strong>Data do Prato:</strong> {getDayOfWeek(selectedReservation.data)}</p>
            <p><strong>Nome do Prato:</strong> {selectedReservation.nome}</p>
            <p><strong>Descrição do Prato:</strong> {selectedReservation.descricao}</p>
            <p><strong>Reservas do dia:</strong> {selectedReservation.reservas}</p>
            <p><strong>Parte da Manhã:</strong> {selectedReservation.manha_count}</p>
            <p><strong>Parte da Tarde:</strong> {selectedReservation.tarde_count}</p>
            <p><strong>Parte da Noite:</strong> {selectedReservation.noite_count}</p>
          </div>
        </div>
      )}
    </>
  );
}

export default CardapioMerendeira;