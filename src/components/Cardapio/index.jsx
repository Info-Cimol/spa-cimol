import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { FaCalendarPlus, FaBan } from 'react-icons/fa';
import { toast } from 'react-toastify';
import ContainerTopo from '../../components/ContainerTopo';
import MenuHamburguer from "../../components/MenuHamburguer";
import BackArrow from '../BackArrow/index';
import axiosFetch from '../../axios/config';
import imagem1 from '../../imagens/image1.jpg';
import './cardapio.css';

function Cardapio() {
  const [cardapio, setCardapio] = useState([]);
  const [reservado, setReservado] = useState({});
  const [reservas, setReservas] = useState([]);
  const [selectedTurno, setSelectedTurno] = useState({});
  const [userRole] = useState(localStorage.getItem('userRole'));
  const [currentWeek, setCurrentWeek] = useState('');
  const img = imagem1;
  const id = localStorage.getItem('id');
  const token = localStorage.getItem('token');
  const headers = {
    'x-access-token': token,
  };
 
  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await axiosFetch.get('/listar/cardapio', { headers });
        const cardapioOrdenado = response.data.sort((a, b) => new Date(b.data) - new Date(a.data));
        setCardapio(cardapioOrdenado.filter(item => isWithinCurrentWeek(item.data))); 

        // Define a semana atual
        const today = new Date();
        const nextMonday = new Date(today.getFullYear(), today.getMonth(), today.getDate() + (1 + 7 - today.getDay()) % 7);
        const currentDate = `${today.getDate()}/${today.getMonth() + 1}`;
        const nextWeekDate = `${nextMonday.getDate()}/${nextMonday.getMonth() + 1}`;
        setCurrentWeek(`${currentDate} - ${nextWeekDate}`);
      } catch (error) {
        console.log('Erro ao listar cardápio', error);
      }
    };

    fetchData();
  });

  useEffect(() => {
    const fetchData = async () => {
      try {
    
        const response = await axiosFetch.get(`/lista/reservas/${id}`, { headers });
        const reservasOrdenadas = response.data.sort((a, b) => new Date(b.data) - new Date(a.data));
        setReservas(reservasOrdenadas);
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

  const reservarCardapio = async (idCardapio) => {
    try {
      const id = localStorage.getItem('id');
      const turno = selectedTurno[idCardapio];

      if (!turno) {
        toast.error('Por favor, selecione um turno antes de reservar.');
        return;
      }

      if (reservado[idCardapio] && reservado[idCardapio] === turno) {
        toast.error('Você já tem uma reserva para este turno.');
        return;
      }

      const response = await axiosFetch.post(`/reserva/${id}/cardapio/${idCardapio}`, { turno }, { headers });
      if (response.data.deletado === true) {
        console.log('Reserva removida');
        toast.error('Não foi possível realizar sua reserva!');
      } else {
        toast.success('Sua reserva foi cadastrada!');
        const newReservado = { ...reservado, [idCardapio]: turno };
        setReservado(newReservado);
        salvarReservasLocalStorage(newReservado);
      }
    } catch (error) {
      console.log("Erro ao reservar cardápio ", error);
      toast.error(error);
    }
  };

  const getDayOfWeek = (dateString) => {
    const days = ['Domingo', 'Segunda-feira', 'Terça-feira', 'Quarta-feira', 'Quinta-feira', 'Sexta-feira', 'Sábado'];
    const date = new Date(dateString);
    return days[date.getDay()];
  };

  const isReservaDisabled = (data) => {
    const dataCardapio = new Date(data);
    const today = new Date();
    const diferencaEmMilissegundos = dataCardapio.getTime() - today.getTime();
    const diferencaEmDias = diferencaEmMilissegundos / (1000 * 60 * 60 * 24);
    const podeReservar = diferencaEmDias >= 2; 
    return !podeReservar;
  };

  const handleTurnoChange = (idCardapio, selectedValue) => {
    setSelectedTurno({ ...selectedTurno, [idCardapio]: selectedValue });
  };

  const isWithinCurrentWeek = (dateString) => {
    const date = new Date(dateString);
    const today = new Date();
    const firstDayOfWeek = new Date(today.getFullYear(), today.getMonth(), today.getDate() - today.getDay() + 1); // Calcula o primeiro dia da semana (domingo)
    const lastDayOfWeek = new Date(firstDayOfWeek.getFullYear(), firstDayOfWeek.getMonth(), firstDayOfWeek.getDate() + 6); // Calcula o último dia da semana (sábado)
    return date >= firstDayOfWeek && date <= lastDayOfWeek;
  };

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
            <h2 className="title">Cardápio da semana ({currentWeek})</h2>
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

            {cardapio.map((item, index) => (
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
                    {isReservaDisabled(item.data) ? (
                      <FaBan size={20} style={{ marginRight: '5px', color: 'red' }} />
                    ) : (
                      <FaCalendarPlus size={20} style={{ marginRight: '5px', cursor: 'pointer' }} onClick={() => reservarCardapio(item.id_cardapio)} />
                    )}
                    <select className="select-turno" onChange={(e) => handleTurnoChange(item.id_cardapio, e.target.value)} disabled={isReservaDisabled(item.data)}>
                      <option value="">Selecione um turno</option>
                      <option value="manhã">Manhã</option>
                      <option value="tarde">Tarde</option>
                      <option value="noite">Noite</option>
                    </select>
                  </div>
                </div>
              </motion.div>
            ))}
          </motion.div>

      <div className="reservas-container">
          <h2 className="title">Minhas reservas</h2>
    
          {reservas.map((reserva) => (
            <motion.div key={reserva.id} className="reserva-card">
              <div className="reserva-content">
                <h2 className="reserva-title">{reserva.nome_cardapio}</h2>
                <p className="reserva-info">Data do cardápio: {reserva.data_cardapio}</p>
                <p className="reserva-info">Turno da reserva: {reserva.turno}</p>
              </div>
            </motion.div>
          ))}
        </div>
        </div>
      </div>
    </>
  );
}

export default Cardapio;