import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import {FaBan, FaCheck } from 'react-icons/fa';
import { Button, Modal, FormControlLabel, Checkbox, Box } from '@mui/material';
import { toast } from 'react-toastify';
import ContainerTopo from '../../components/ContainerTopo';
import MenuHamburguer from "../../components/MenuHamburguer";
import BackArrow from '../BackArrow/index';
import IconButton from '@mui/material/IconButton';
import CloseIcon from '@mui/icons-material/Close';
import axiosFetch from '../../axios/config';
import imagem1 from '../../imagens/image1.jpg';
import './cardapio.css';

function Cardapio() {
  const [cardapio, setCardapio] = useState([]);
  const [reservado, setReservado] = useState({});
  const [reservas, setReservas] = useState([]);
  const [currentWeekIndex, setCurrentWeekIndex] = useState(0);
  const [sundays, setSundays] = useState([]);
  const [userRole] = useState(localStorage.getItem('userRole'));
  const [img] = useState(imagem1);
  const id = localStorage.getItem('id');
  const [selectedTurno, setSelectedTurno] = useState({});
  const [showModal, setShowModal] = useState(false);
  const [selectedCardapioId, setSelectedCardapioId] = useState(null);
  const [showConfirmationModal, setShowConfirmationModal] = useState(false);
  const [idReservaToDelete, setIdReservaToDelete] = useState(null);

  // Função para abrir o modal de confirmação
  const openConfirmationModal = (idReserva) => {
    setIdReservaToDelete(idReserva);
    setShowConfirmationModal(true);
  };

  // Função para fechar o modal de confirmação
  const closeConfirmationModal = () => {
    setShowConfirmationModal(false);
  };

  const handleTurnoChange = (idCardapio, turno, isChecked) => {
    setSelectedTurno(prevState => ({
      ...prevState,
      [idCardapio]: {
        ...prevState[idCardapio],
        [turno]: isChecked
      }
    }));
  };  
  
  const excluirReserva = async (idCardapio) => {
    try {
        // Filtra as reservas que não correspondem ao idCardapio a ser excluído
        const updatedReservas = reservas.filter(reserva => reserva.cardapio_id_cardapio !== idCardapio);
      
        await axiosFetch.delete(`/reserva/${id}/cardapio/${idCardapio}`);
        closeConfirmationModal()
        setReservas(updatedReservas);
        toast.success('Reserva excluída com sucesso!');
    } catch (error) {
        console.error('Erro ao excluir reserva:', error);
        toast.error('Erro ao excluir reserva. Por favor, tente novamente.');
    }
};

  // Função para abrir o modal
  const openModal = () => {
    setShowModal(true);
  };

  // Função para fechar o modal
  const closeModal = () => {
    setShowModal(false);
  };
 
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
}, []);

const handleNextWeek = () => {
if (currentWeekIndex < sundays.length - 2) {
  setCurrentWeekIndex(currentWeekIndex + 1);
}
};

const handlePreviousWeek = () => {
  setCurrentWeekIndex(currentWeekIndex - 1);
};

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await axiosFetch.get(`/reservas/${id}`);
        setReservas(response.data);
      } catch (error) {
        console.log('Erro ao listar reservas', error);
      }
    };
    fetchData();
  });

  useEffect(() => {
    const storedReservas = JSON.parse(localStorage.getItem('reservado')) || {};
    setReservado(storedReservas);
  }, []);

  const salvarReservasLocalStorage = (reservas) => {
    localStorage.setItem('reservado', JSON.stringify(reservas));
  };

  const reservarCardapio = async (idCardapio, maisDeUmTurno) => {
    try {
      const id = localStorage.getItem('id');
      let turno;
      if (maisDeUmTurno) {
        turno = ['manha', 'tarde', 'noite'];
      } else {
        // Aqui, converta o objeto para um array de turnos
        turno = Object.keys(selectedTurno[idCardapio]).filter(turno => selectedTurno[idCardapio][turno]);
      }
  
      const response = await axiosFetch.post(`/reserva/${id}/cardapio/${idCardapio}`, { turno });
      if (response.data.deletado === true) {
        console.log('Reserva removida');
        toast.error('Não foi possível realizar sua reserva!');
      } else {
        toast.success('Sua reserva foi cadastrada!');
        const newReservado = { ...reservado, [idCardapio]: turno };
        setReservado(newReservado);
        salvarReservasLocalStorage(newReservado);
        closeModal();
      }
    } catch (error) {
      console.log("Erro ao reservar cardápio ", error);
      toast.error(error);
    }
  };  

  const getDayOfWeek = (dateString) => {
    const days = ['Domingo', 'Segunda-feira', 'Terça-feira', 'Quarta-feira', 'Quinta-feira', 'Sexta-feira', 'Sábado'];
    const date = new Date(dateString);
    return days[date.getDay() + 1];
  };

  const isReservaDisabled = (data, idCardapio) => {
    const isReservado = reservas.some(reserva => reserva.id_cardapio === idCardapio);
    const isJaReservado = idCardapio in reservado;
    const dataCardapio = new Date(data);
    const today = new Date();

    const tomorrow = new Date(today);
    tomorrow.setDate(tomorrow.getDate() + 1);
  
    const isFutureDate = dataCardapio >= tomorrow;
  
    return isReservado || (isJaReservado && !isFutureDate);
  };

  const currentSunday = sundays[currentWeekIndex];
  const currentSaturday = new Date(currentSunday); 
  currentSaturday.setDate(currentSaturday.getDate() + 5);

  const weekRange = currentSunday && currentSaturday ?
    `${currentSunday.toLocaleDateString('pt-BR', { day: 'numeric', month: 'numeric' })} - ${currentSaturday.toLocaleDateString('pt-BR', { day: 'numeric', month: 'numeric' })}` :
    "";

  return (
    <>
      <div>
        <ContainerTopo userType={userRole} />
        <MenuHamburguer userType={userRole} />
      </div>
  
      <div className='container-fluid'>
        <BackArrow style={{ marginTop: '120px', marginLeft: '10px' }} />
        <div className='containerCardapio'>
  
          <div className="header">
          <h2>Cardápio {weekRange}</h2>
          </div>
  
          <motion.div
            className='cardapio-carousel'
            style={{
              display: 'flex',
              justifyContent: 'space-between',
              overflowX: 'auto',
              width: '100%',
              cursor: 'pointer',
              height: 'auto',
            }}>

          {cardapio.length > 0 ? (
            cardapio.map((item, index) => {
              const itemDate = new Date(item.data);
              const sundayOfCurrentWeek = sundays[currentWeekIndex];
              const saturdayOfCurrentWeek = new Date(sundayOfCurrentWeek);
              saturdayOfCurrentWeek.setDate(saturdayOfCurrentWeek.getDate() + 7);
              const isAlreadyReserved = reservas.some(reserva => reserva.id_cardapio === item.id_cardapio);
              const isDisabled = isReservaDisabled(item.data, item.id_cardapio);
              const isWithinCurrentWeek = itemDate >= sundayOfCurrentWeek && itemDate <= saturdayOfCurrentWeek;
              const hasReservedIcon = reservas.some(reserva => reserva.id_cardapio === item.id_cardapio && reserva.id_usuario === id);

              if (isWithinCurrentWeek) {
                return (
                  <motion.div
                    key={index}
                    className='card__cardapio'
                    style={{ marginRight: '20px', flex: '0 0 auto' }}
                  >
                    <img src={item.imagem ? item.imagem : img} alt='text alt' className='card__image' />
                    <div className='card__content'>
                      <h2 className='card__title'>{getDayOfWeek(item.data)}</h2>
                      <h2 className='card__title'>{item.nome}</h2>
                      <p className='card__description'>{item.descricao}</p>

                      {userRole === 'admin' || userRole === 'secretaria' ? (
                        <p className=''>Reservas: {item.reservas}</p>
                      ) : null}

                      <div style={{ display: 'flex', alignItems: 'center' }}>
                        {hasReservedIcon ? (
                          <FaCheck size={20} style={{ marginRight: '5px', color: 'green' }} />
                        ) : (
                          isAlreadyReserved ? (
                            <FaBan size={20} style={{ marginRight: '5px', color: 'red' }} />
                          ) : (
                            <Button onClick={() => {
                              setSelectedCardapioId(item.id_cardapio);
                              openModal();
                          }} disabled={isDisabled}>Selecionar turno</Button>
                          )
                        )}
                      </div>

                    </div>
                    <Modal open={showModal} onClose={closeModal}>
                  <div className="modal-container">
                    <div className="header">
                      <h2 className="title">Reserva de Cardápio</h2>
                      <div className="close-button">
                        <IconButton onClick={closeModal}>
                          <CloseIcon />
                        </IconButton>
                      </div>
                    </div>
                    <Box sx={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
                      <FormControlLabel
                        control={<Checkbox onChange={(e) => handleTurnoChange(selectedCardapioId, 'manha', e.target.checked)} />}
                        label="Manhã"
                      />
                      <FormControlLabel
                        control={<Checkbox onChange={(e) => handleTurnoChange(selectedCardapioId, 'tarde', e.target.checked)} />}
                        label="Tarde"
                      />
                      <FormControlLabel
                        control={<Checkbox onChange={(e) => handleTurnoChange(selectedCardapioId, 'noite', e.target.checked)} />}
                        label="Noite"
                      />  
                    </Box>
                    <Button
                      variant="contained"
                      color="primary"
                      style={{ marginRight: '30px' }}
                    onClick={() => reservarCardapio(selectedCardapioId)}>
                      Confirmar
                      </Button>
                  </div>
                </Modal>

                  </motion.div>
                );
              }
              return null;
            })
          ) : (
            <div>
              <p>Nenhum cardápio cadastrado para esta semana</p>
            </div>
          )}

          </motion.div>
          
          <div className="week-navigation">
            <Button onClick={handlePreviousWeek} disabled={currentWeekIndex === 0}>Semana Anterior</Button>
            <Button onClick={handleNextWeek}>Próxima Semana</Button>
          </div>

            <div className='header'>
              <h2 className="title">Minhas reservas</h2>
            </div>
  
            <motion.div
              className='cardapio-carousel'
              style={{
                display: 'flex',
                justifyContent: 'space-between',
                overflowX: 'auto',
                width: '100%',
                cursor: 'pointer',
                height: 'auto'}}
                >
  
              {reservas.map((reserva) => (
                <motion.div
                    key={reserva.id_reserva}
                    className='card__cardapio'
                    style={{ marginRight: '20px', flex: '0 0 auto' }}
                >
                    <img src={reserva.imagem ? reserva.imagem : img} alt='text alt' className='card__image' />
                    <div className="card__content">
                        <h2 className="card__title"><strong>{reserva.nome_cardapio}</strong></h2>
                        <p className="card__info"><strong>Dia da reserva:</strong> {getDayOfWeek(reserva.data_cardapio)}</p>
                        <p className="card__info"><strong>Turno da reserva:</strong> {reserva.turnos}</p>
                        <Button color="error" onClick={() => openConfirmationModal(reserva.cardapio_id_cardapio)} className="btn-excluir-reserva">Excluir Reserva</Button>
                    </div>
                </motion.div>
            ))}
              {/* Modal de confirmação para excluir reserva */}
              <Modal open={showConfirmationModal} onClose={closeConfirmationModal} sx={{ display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                <Box sx={{ width: '400px', bgcolor: 'background.paper', boxShadow: 24, p: 4, borderRadius: 2 }}>
                  <div className="header" style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '20px' }}>
                    <h2 className="title">Confirmar Exclusão</h2>
                    <div className="close-button">
                      <IconButton onClick={closeConfirmationModal}>
                        <CloseIcon />
                      </IconButton>
                    </div>
                  </div>
                  <div className="modal-content" style={{ textAlign: 'center' }}>
                    <h6>Deseja realmente excluir esta reserva?</h6>
                    <Button onClick={() => excluirReserva(idReservaToDelete)} color="error">Excluir</Button>
                  </div>
                </Box>
              </Modal>
            </motion.div>
          </div>
        </div>
    </>
  );  
};

export default Cardapio;