import React, { useState, useEffect } from 'react';
import ContainerTopo from '../ContainerTopo';
import MenuHamburguer from "../MenuHamburguer";
import BackArrow from '../BackArrow/index';
import CardapioCadastro from './cadastroCardapio';
import CloseIcon from '@mui/icons-material/Close';
import { IconButton,Button, Dialog, DialogActions, DialogContent, DialogContentText, DialogTitle } from '@mui/material';
import AddIcon from '@mui/icons-material/Add';
import { Edit as EditIcon, Delete as DeleteIcon } from '@mui/icons-material';
import { toast } from 'react-toastify';
import axiosFetch from '../../axios/config';
import './cardapio.css';

function CardapioMerendeira() {
  const [cardapio, setCardapio] = useState([]);
  const [openCadastro, setOpenCadastro] = useState(false);
  const [selectedReservation, setSelectedReservation] = useState(null);
  const [isDetailModalOpen, setIsDetailModalOpen] = useState(false);
  const [confirmationModalOpen, setConfirmationModalOpen] = useState(false);
  const [token] = useState(localStorage.getItem('token'));
  const [userRole] = useState(localStorage.getItem('userRole'));
  const [currentWeek, setCurrentWeek] = useState('');
  const [currentDate, setCurrentDate] = useState(new Date());

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await axiosFetch.get('/listar/cardapio', {
          headers: { 'x-access-token': token }
        });
        setCardapio(response.data);

        const today = new Date();
        setCurrentDate(today);

        const nextMonday = new Date(today.getFullYear(), today.getMonth(), today.getDate() + (1 + 7 - today.getDay()));
        const weekRange = `${today.toLocaleDateString('pt-BR', { day: 'numeric', month: 'numeric' })} - ${nextMonday.toLocaleDateString('pt-BR', { day: 'numeric', month: 'numeric' })}`;
        setCurrentWeek(weekRange);
      } catch (error) {
        console.log('Erro ao listar cardápio', error);
      }
    };

    fetchData();
  }, [token, openCadastro]);

  const handleToggleForm = () => {
    setOpenCadastro(!openCadastro);
  };

  const getDayOfWeek = (dateString) => {
    const days = ['Domingo', 'Segunda-feira', 'Terça-feira', 'Quarta-feira', 'Quinta-feira', 'Sexta-feira', 'Sábado'];
    const date = new Date(dateString);
    return days[date.getDay() + 1];
  };

  const handleReservationClick = (reservation) => {
    setSelectedReservation(reservation);
    setIsDetailModalOpen(true);
  };

  const handleCloseDetailModal = () => {
    setIsDetailModalOpen(false);
  };

  const handleUpdateCardapioList = async () => {
    try {
      const response = await axiosFetch.get('/listar/cardapio', {
        headers: { 'x-access-token': token }
      });
      setCardapio(response.data);
    } catch (error) {
      console.error('Erro ao atualizar lista de cardápios:', error);
    }
  };
  

  const handleNextWeek = () => {
    const nextWeekStart = new Date(currentDate);
    nextWeekStart.setDate(nextWeekStart.getDate() + 7);
  
    setCurrentDate(nextWeekStart);
  
    const nextWeekEnd = new Date(nextWeekStart);
    nextWeekEnd.setDate(nextWeekEnd.getDate() + 6);
  
    const weekRange = `${nextWeekStart.toLocaleDateString('pt-BR', { day: 'numeric', month: 'numeric' })} - ${nextWeekEnd.toLocaleDateString('pt-BR', { day: 'numeric', month: 'numeric' })}`;
    setCurrentWeek(weekRange);
  };  
  
  const handlePreviousWeek = () => {
    const previousWeekStart = new Date(currentDate);
    previousWeekStart.setDate(previousWeekStart.getDate() - 7);
    const today = new Date();
  
    if (previousWeekStart <= today) {
      setCurrentDate(previousWeekStart);
      const previousWeekEnd = new Date(previousWeekStart);
      previousWeekEnd.setDate(previousWeekEnd.getDate() + 6);
  
      const weekRange = `${previousWeekStart.toLocaleDateString('pt-BR', { day: 'numeric', month: 'numeric' })} - ${previousWeekEnd.toLocaleDateString('pt-BR', { day: 'numeric', month: 'numeric' })}`;
      setCurrentWeek(weekRange);
    } else {
      // Não retrocede além do dia atual
      console.error('Você não pode retroceder além do dia atual.');
    }
  };

  const handleOpenConfirmationModal = () => {
    setConfirmationModalOpen(true);
  };

  const handleCloseConfirmationModal = () => {
    setConfirmationModalOpen(false);
  };

  const handleConfirmDelete = async () => {
    try {
      const idCardapio = selectedReservation.id_cardapio;
      
      // Fazer uma requisição DELETE para a rota de exclusão correspondente
      await axiosFetch.delete(`/exclui/cardapio/${idCardapio}`, {
        headers: { 'x-access-token': token }
      });
  
      // Atualizar a lista de cardápios após a exclusão
      const response = await axiosFetch.get('/listar/cardapio', {
        headers: { 'x-access-token': token }
      });
      setCardapio(response.data);
  
      toast.success('Cardápio excluído com sucesso!');
  
      // Feche o modal de confirmação e o modal de detalhes
      setIsDetailModalOpen(false);
      setConfirmationModalOpen(false);
    } catch (error) {
      console.error('Erro ao excluir cardápio:', error);
    }
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
            <h2>Cardápio  {currentWeek}</h2>
            {userRole === 'admin' || userRole === 'secretaria' ? (
              <IconButton onClick={handleToggleForm} title="Formulário de cadastro" component="span">
                <AddIcon fontSize="large" />
              </IconButton>
            ) : null}
          </div>

                  {openCadastro && (
          <CardapioCadastro
            open={openCadastro}
            onClose={() => {
              setOpenCadastro(false);
              handleUpdateCardapioList(); 
            }}
            onUpdate={handleUpdateCardapioList} 
          />
        )}

          <table className="cardapio-table">
            <thead>
              <tr>
                <th>Dia</th>
                <th>Nome</th>
                <th>Reservas</th>
              </tr>
            </thead>
            <tbody>
              {cardapio.map((item, index) => {
                const itemDate = new Date(item.data);
                const startOfWeek = new Date(currentDate);
                startOfWeek.setDate(currentDate.getDate() - currentDate.getDay());
                const endOfWeek = new Date(startOfWeek);
                endOfWeek.setDate(startOfWeek.getDate() + 5);

                if (itemDate >= startOfWeek && itemDate <= endOfWeek) {
                  const dayOfWeek = getDayOfWeek(itemDate);
                  return (
                    <tr key={index} onClick={() => handleReservationClick(item)}>
                      <td>{dayOfWeek}</td>
                      <td>{item.nome}</td>
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
            {/* Botões de editar e deletar */}
            <div>
              <DeleteIcon style={{cursor : "pointer"}} onClick={handleOpenConfirmationModal}>Excluir</DeleteIcon>
            </div>
          </div>
        </div>
      )}

      {/* Modal de confirmação para exclusão */}
      <Dialog
        open={confirmationModalOpen}
        onClose={handleCloseConfirmationModal}
        aria-labelledby="alert-dialog-title"
        aria-describedby="alert-dialog-description"
      >
        <DialogTitle id="alert-dialog-title">{"Confirmar Exclusão"}</DialogTitle>
        <DialogContent>
          <DialogContentText id="alert-dialog-description">
            Tem certeza de que deseja excluir este cardápio?
          </DialogContentText>
        </DialogContent>
        <DialogActions>
          <Button onClick={handleCloseConfirmationModal} color="primary">
            Cancelar
          </Button>
          <Button onClick={handleConfirmDelete} color="primary" autoFocus>
            Confirmar
          </Button>
        </DialogActions>
      </Dialog>
    </>
  );
}

export default CardapioMerendeira;