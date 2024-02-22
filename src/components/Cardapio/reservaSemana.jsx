import React, { useState, useEffect } from 'react';
import ContainerTopo from '../ContainerTopo';
import MenuHamburguer from "../MenuHamburguer";
import BackArrow from '../BackArrow/index';
import CardapioCadastro from './cadastroCardapio';
import CloseIcon from '@mui/icons-material/Close';
import { IconButton, Button, Dialog, DialogActions, DialogContent, DialogContentText, DialogTitle, TextField  } from '@mui/material';
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
  const [userRole] = useState(localStorage.getItem('userRole'));
  const [currentWeekIndex, setCurrentWeekIndex] = useState(0);
  const [sundays, setSundays] = useState([]);
  const [newNome, setNewNome] = useState(''); 
  const [newDescricao, setNewDescricao] = useState(''); 
  const [newImagem, setNewImagem] = useState(''); 
  const [newData, setNewData] = useState(''); 
  const [, setSelectedCardapioId] = useState(null);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await axiosFetch.get('/cardapio');
        setCardapio(response.data);
  
        const today = new Date();
        const currentDayOfWeek = today.getDay();
        const diffStart = today.getDate() - currentDayOfWeek;
  
        const sunday = new Date(today);
        sunday.setDate(diffStart);
  
        const endOfWeek = new Date(sunday);
        endOfWeek.setDate(sunday.getDate() + 6);
  
        const sundays = [];
        let current = new Date(sunday);
        while (sundays.length < 3) {
          sundays.push(new Date(current));
          current.setDate(current.getDate() + 7);
        }
        setSundays(sundays);
      } catch (error) {
        console.log('Erro ao listar cardápio', error);
      }
    };
  
    fetchData();
  });

const handleNextWeek = () => {
  if (currentWeekIndex < sundays.length - 2) {
    setCurrentWeekIndex(currentWeekIndex + 1);
  }
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
      const response = await axiosFetch.get('/cardapio');
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

      await axiosFetch.delete(`/cardapio/${idCardapio}`);

      const response = await axiosFetch.get('/cardapio');
      setCardapio(response.data);

      toast.success('Cardápio excluído com sucesso!');

      setIsDetailModalOpen(false);
      setConfirmationModalOpen(false);
    } catch (error) {
      console.error('Erro ao excluir cardápio:', error);
    }
  };

  const handleEditeCardapio = async () => {
    try {
      const idCardapio = selectedReservation.id_cardapio;

      await axiosFetch.put(`/cardapio/${idCardapio}`, {
        nome: newNome, 
        descricao: newDescricao, 
        data: newData, 
        imagem: newImagem, 
      });
     
      toast.success('Cardápio editado com sucesso!');

      setIsDetailModalOpen(false);
      setIsEditModalOpen(false);
    } catch (error) {
      console.error('Erro ao editar cardápio:', error);
      toast.error('Não foi possível editar o seu cardápio!');
    }
  };

  const handleOpenEditModal = (cardapioId) => {
    const selectedCardapio = cardapio.find(item => item.id_cardapio === cardapioId);
    setNewNome(selectedCardapio.nome);
    setNewDescricao(selectedCardapio.descricao);
    setNewImagem(selectedCardapio.imagem);
    setNewData(selectedCardapio.data);

    setSelectedCardapioId(cardapioId);
    setIsEditModalOpen(true);
  };

  const currentSunday = sundays[currentWeekIndex];
  const currentSaturday = new Date(currentSunday); 
  currentSaturday.setDate(currentSaturday.getDate() + 5);

  const weekRange = currentSunday && currentSaturday ?
    `${currentSunday.toLocaleDateString('pt-BR', { day: 'numeric', month: 'numeric' })} - ${currentSaturday.toLocaleDateString('pt-BR', { day: 'numeric', month: 'numeric' })}` :
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
              {cardapio.length > 0 ? (
                cardapio.map((item, index) => {
                  const itemDate = new Date(item.data);

                  const sundayOfCurrentWeek = sundays[currentWeekIndex];
                  const saturdayOfCurrentWeek = new Date(sundayOfCurrentWeek);
                  saturdayOfCurrentWeek.setDate(saturdayOfCurrentWeek.getDate() + 7);

                  const isWithinCurrentWeek = itemDate >= sundayOfCurrentWeek && itemDate <= saturdayOfCurrentWeek;

                  if (isWithinCurrentWeek) {
                    return (
                      <tr key={index} onClick={() => handleReservationClick(item)}>
                        <td>{getDayOfWeek(itemDate)}</td>
                        <td>{item.nome}</td>
                        <td>{item.reservas}</td>
                      </tr>
                    );
                  }
                  return null;
                })
              ) : (
                <tr>
                  <td colSpan="3">Nenhum cardápio cadastrado para esta semana</td>
                </tr>
              )}
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
            {userRole === 'admin' || userRole === 'secretaria' ? (
              <DeleteIcon style={{ cursor: "pointer" }} onClick={handleOpenConfirmationModal}>Excluir</DeleteIcon>
            ) : null}
            {userRole === 'admin' || userRole === 'secretaria' ? (
              <EditIcon style={{ cursor: "pointer" }} onClick={() => handleOpenEditModal(selectedReservation.id_cardapio)}>Editar</EditIcon>
            ) : null}
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

      {isEditModalOpen && (
  <Dialog open={isEditModalOpen} onClose={() => setIsEditModalOpen(false)}>
    <div className="header">
          <h2 className="title">Editar Cardápio</h2>
          <div className="close-button">
            <IconButton onClick={() => setIsEditModalOpen(false)}>
              <CloseIcon />
            </IconButton>
          </div>
        </div>
    <DialogContent>
      <TextField
        autoFocus
        margin="dense"
        id="nome"
        label="Nome"
        type="text"
        fullWidth
        value={newNome}
        onChange={(e) => setNewNome(e.target.value)}
      />
      <TextField
        margin="dense"
        id="descricao"
        label="Descrição"
        type="text"
        fullWidth
        value={newDescricao}
        onChange={(e) => setNewDescricao(e.target.value)}
      />
      <TextField
        margin="dense"
        id="imagem"
        label="Imagem URL"
        type="text"
        fullWidth
        value={newImagem}
        onChange={(e) => setNewImagem(e.target.value)}
      />
      <TextField
        margin="dense"
        id="data"
        label="Data"
        type="date"
        fullWidth
        value={newData}
        onChange={(e) => setNewData(e.target.value)}
        InputLabelProps={{
          shrink: true,
        }}
      />
    </DialogContent>
    <DialogActions>
      <Button onClick={handleEditeCardapio} color="primary">
        Salvar
      </Button>
    </DialogActions>
  </Dialog>
)}
    </>
  );
}

export default CardapioMerendeira;