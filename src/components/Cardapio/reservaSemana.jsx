import React, { useState, useEffect } from 'react';
import ContainerTopo from '../ContainerTopo';
import MenuHamburguer from "../MenuHamburguer";
import BackArrow from '../BackArrow/index';
import CardapioCadastro from './cadastroCardapio';
import CloseIcon from '@mui/icons-material/Close';
import { Grid } from '@mui/material';
import { IconButton, Button, Dialog, DialogActions, DialogContent, DialogContentText, DialogTitle, TextField, Table, TableHead, TableBody, TableCell, TableRow } from '@mui/material';
import AddIcon from '@mui/icons-material/Add';
import TableChartIcon from '@mui/icons-material/TableChart';
import RelatorioReservas from './relatorioReservas';
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
  const [fetchData, setFetchData] = useState(true);
  const [exibirRelatorio, setExibirRelatorio] = useState('');
  
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
  
    if (fetchData) {
      fetchData();
      setFetchData(false);
    }
  
    const interval = setInterval(() => {
      setFetchData(true);
    }, 60000); 
  
    return () => clearInterval(interval);
  }, [fetchData]);
  
  const handleNextWeek = () => {
    if (currentWeekIndex < sundays.length - 2) {
      setCurrentWeekIndex(currentWeekIndex + 1);
    }
  };
  
  const handlePreviousWeek = () => {
    setCurrentWeekIndex(currentWeekIndex - 1);
  };

  const handleAbrirRelatorio = () =>{
    setExibirRelatorio(true);
  }
  
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
  
      const updatedCardapio = cardapio.filter(item => item.id_cardapio !== idCardapio);
      setCardapio(updatedCardapio);
  
      toast.success('Cardápio excluído com sucesso!');
  
      setIsDetailModalOpen(false);
      setConfirmationModalOpen(false);
    } catch (error) {
      console.error('Erro ao excluir cardápio:', error);
      toast.error('Ocorreu um erro ao excluir o cardápio.');
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
  
      const updatedCardapio = cardapio.map(item => {
        if (item.id_cardapio === idCardapio) {
          return { ...item, nome: newNome, descricao: newDescricao, data: newData, imagem: newImagem };
        }
        return item;
      });
      setCardapio(updatedCardapio);
  
      toast.success('Cardápio editado com sucesso!');
  
      setIsDetailModalOpen(false);
      setIsEditModalOpen(false);
    } catch (error) {
      console.error('Erro ao editar cardápio:', error);
      toast.error('Ocorreu um erro ao editar o cardápio.');
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
      {exibirRelatorio ? (
        <RelatorioReservas />
      ) : (
        <div>
          <ContainerTopo userType={userRole} />
          <MenuHamburguer userType={userRole} />
        </div>
      )}
 {!exibirRelatorio && (
         <div className='container-fluid'>
        <BackArrow style={{ marginTop: '2000px', marginLeft: '10px' }} />
        <div className='containerCardapio'>
          <h2>Cardápio {weekRange}</h2>

          <Grid container justifyContent="right-end">
            <Grid item>
              <div className="add-button-container">
                {userRole === 'admin' || userRole === 'secretaria' ? (
                  <>
                    <IconButton onClick={handleToggleForm} title="Formulário de cadastro" component="span">
                      <AddIcon fontSize="large" />
                    </IconButton>
                    <IconButton onClick={handleAbrirRelatorio} title="Gerar Formulário" component="span">
                    <TableChartIcon fontSize="large" />
                    </IconButton>
                  </>
                ) : null}
              </div>
            </Grid>
          </Grid>

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

          <Table>
            <TableHead>
              <TableRow>
                <TableCell>Dia</TableCell>
                <TableCell>Cardápio</TableCell>
                <TableCell>Reservas</TableCell>
                {userRole === 'admin' || userRole === 'secretaria' ? (
                  <TableCell>Ações</TableCell>      
                ) : null}
              </TableRow>
            </TableHead>
            <TableBody>
              {cardapio.length > 0 ? (
                cardapio.map((item, index) => {
                  const itemDate = new Date(item.data);

                  const sundayOfCurrentWeek = sundays[currentWeekIndex];
                  const saturdayOfCurrentWeek = new Date(sundayOfCurrentWeek);
                  saturdayOfCurrentWeek.setDate(saturdayOfCurrentWeek.getDate() + 7);

                  const isWithinCurrentWeek = itemDate >= sundayOfCurrentWeek && itemDate <= saturdayOfCurrentWeek;

                  if (isWithinCurrentWeek) {
                    return (
                      <TableRow key={index} onClick={() => handleReservationClick(item)}>
                        <TableCell>{getDayOfWeek(itemDate)}</TableCell>
                        <TableCell>{item.nome}</TableCell>
                        <TableCell>{item.reservas}</TableCell>
                        {userRole === 'admin' || userRole === 'secretaria' ? (
                          <TableCell>                                   
                            <IconButton onClick={() => handleOpenConfirmationModal(item.id_cardapio)} title="Excluir" color="error">
                              <DeleteIcon />
                            </IconButton>
                            <IconButton onClick={() => handleOpenEditModal(item.id_cardapio)} title="Editar" color="primary">
                              <EditIcon />
                            </IconButton>
                          </TableCell>
                        ) : null}
                      </TableRow>                    
                    );
                  }
                  return null;
                })
              ) : (
                <TableRow>
                  <TableCell colSpan="4">Nenhum cardápio cadastrado para esta semana</TableCell>
                </TableRow>
              )}
            </TableBody>
          </Table>
          <div className="week-navigation">
            <Button onClick={handlePreviousWeek} disabled={currentWeekIndex === 0}>Semana Anterior</Button>
            <Button onClick={handleNextWeek}>Próxima Semana</Button>
          </div>
        </div>
      </div>
        )}

      {isDetailModalOpen && (
        <div className="modal-container">
          <div className="header">
            <h2 className="title">Detalhes da Reserva</h2>
            <IconButton className="close-button" onClick={handleCloseDetailModal} title="Fechar">
              <CloseIcon />
            </IconButton>
          </div>
          <div className="modal-content">
            <p><strong>Data:</strong> {getDayOfWeek(selectedReservation.data)}</p>
            <p><strong>Nome:</strong> {selectedReservation.nome}</p>
            <p><strong>Descrição:</strong> {selectedReservation.descricao}</p>
            <p><strong>Reservas do dia:</strong> {selectedReservation.reservas}</p>
            <p><strong>Manhã:</strong> {selectedReservation.manha_count}</p>
            <p><strong>Tarde:</strong> {selectedReservation.tarde_count}</p>
            <p><strong>Noite:</strong> {selectedReservation.noite_count}</p>
          </div>
        </div>
      )}

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
          <Button onClick={handleConfirmDelete} color="error" autoFocus>
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