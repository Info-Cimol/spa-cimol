import React, { useState, useEffect } from 'react';
import ContainerTopo from '../ContainerTopo';
import MenuHamburguer from "../MenuHamburguer";
import BackArrow from '../BackArrow/index';
import CardapioCadastro from './cadastroCardapio';
import CloseIcon from '@mui/icons-material/Close';
import { IconButton, Button, Dialog, DialogActions, DialogContent, DialogContentText, DialogTitle } from '@mui/material';
import AddIcon from '@mui/icons-material/Add';
import { Delete as DeleteIcon } from '@mui/icons-material';
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
  const [currentWeekIndex, setCurrentWeekIndex] = useState(0);
  const [mondays, setMondays] = useState([]);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await axiosFetch.get('/listar/cardapio', {
          headers: { 'x-access-token': token }
        });
        setCardapio(response.data);
  
        const today = new Date();
        const currentDayOfWeek = today.getDay(); // 0 para Domingo, 1 para Segunda-feira, ..., 6 para Sábado
        const diffStart = today.getDate() - currentDayOfWeek + (currentDayOfWeek === 0 ? -6 : 1); // Ajuste para obter segunda-feira
        
        const monday = new Date(today);
        monday.setDate(diffStart);
        
        // Adicionamos 4 dias para obter a sexta-feira
        const endOfWeek = new Date(monday);
        endOfWeek.setDate(monday.getDate() + 7);
        
        const mondays = getMondays(monday, endOfWeek);
        setMondays(mondays);
      } catch (error) {
        console.log('Erro ao listar cardápio', error);
      }
    };
  
    fetchData();
  }, [token]);  

  const getMondays = (startOfWeek, endOfWeek) => {
    const days = [];
    let current = new Date(startOfWeek);
  
    while (current <= endOfWeek) {
      days.push(new Date(current));
      current.setDate(current.getDate() + 7);
    }
  
    if (!days.some(day => day.getTime() === startOfWeek.getTime())) {
      days.unshift(new Date(startOfWeek));
    }
  
    return days;
  };  

  const handleNextWeek = () => {
    setCurrentWeekIndex(currentWeekIndex + 1);
  };

  const handlePreviousWeek = () => {
    setCurrentWeekIndex(currentWeekIndex - 1);
  };

  const handleToggleForm = () => {
    setOpenCadastro(!openCadastro);
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

  const handleOpenConfirmationModal = () => {
    setConfirmationModalOpen(true);
  };

  const handleCloseConfirmationModal = () => {
    setConfirmationModalOpen(false);
  };

  const handleConfirmDelete = async () => {
    try {
      const idCardapio = selectedReservation.id_cardapio;

      await axiosFetch.delete(`/exclui/cardapio/${idCardapio}`, {
        headers: { 'x-access-token': token }
      });

      const response = await axiosFetch.get('/listar/cardapio', {
        headers: { 'x-access-token': token }
      });
      setCardapio(response.data);

      toast.success('Cardápio excluído com sucesso!');

      setIsDetailModalOpen(false);
      setConfirmationModalOpen(false);
    } catch (error) {
      console.error('Erro ao excluir cardápio:', error);
    }
  };

  const currentMonday = mondays[currentWeekIndex];
  const currentFriday = new Date(currentMonday); 
  currentFriday.setDate(currentFriday.getDate() + 4);

  const weekRange = currentMonday && currentFriday ?
    `${currentMonday.toLocaleDateString('pt-BR', { day: 'numeric', month: 'numeric' })} - ${currentFriday.toLocaleDateString('pt-BR', { day: 'numeric', month: 'numeric' })}` :
    "";

  const getDayOfWeek = (dateString) => {
    const days = ['Domingo', 'Segunda-feira', 'Terça-feira', 'Quarta-feira', 'Quinta-feira', 'Sexta-feira', 'Sábado'];
    const date = new Date(dateString);
    return days[date.getDay() + 1]; 
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
            <h2>Cardápio {weekRange}</h2>
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
                <th>Cardápio</th>
                <th>Reservas</th>
              </tr>
            </thead>
            <tbody>
            {cardapio.map((item, index) => {
    const itemDate = new Date(item.data);

    if (itemDate <= currentFriday) {
        return (
            <tr key={index} onClick={() => handleReservationClick(item)}>
                <td>{getDayOfWeek(itemDate)}</td>
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
            <Button onClick={handlePreviousWeek} disabled={currentWeekIndex === 0}>Semana Anterior</Button>
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
            <p><strong>Manhã:</strong> {selectedReservation.manha_count}</p>
            <p><strong>Tarde:</strong> {selectedReservation.tarde_count}</p>
            <p><strong>Noite:</strong> {selectedReservation.noite_count}</p>
            {/* Botões de editar e deletar */}
            <div>
              <DeleteIcon style={{ cursor: "pointer" }} onClick={handleOpenConfirmationModal}>Excluir</DeleteIcon>
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