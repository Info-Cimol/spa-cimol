import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { FaCalendarPlus, FaBan, FaCheck } from 'react-icons/fa';
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
  const [userRole] = useState(localStorage.getItem('userRole'));
  const img = imagem1;
  const id = localStorage.getItem('id');
  const token = localStorage.getItem('token');
  const headers = {
    'x-access-token': token,
  };
  const [selectedTurno, setSelectedTurno] = useState({});

const handleTurnoChange = (idCardapio, selectedValue) => {
  setSelectedTurno(prevState => ({
    ...prevState,
    [idCardapio]: selectedValue
  }));
};
 
  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await axiosFetch.get('/listar/cardapio', { headers });
        setCardapio(response.data);
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
        turno = ['manhã', 'tarde', 'noite']; 
      } else {
        turno = selectedTurno[idCardapio];
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

  const isReservaDisabled = (data, idCardapio) => {
    // Verifica se o cardápio já está na lista de reservas do usuário
    const isReservado = reservas.some(reserva => reserva.id_cardapio === idCardapio);
    
    // Verifica se o cardápio já foi reservado anteriormente pelo usuário
    const isJaReservado = idCardapio in reservado;
    
    // Restante da lógica permanece a mesma
    const dataCardapio = new Date(data);
    const today = new Date();
    const diferencaEmMilissegundos = dataCardapio.getTime() - today.getTime();
    const diferencaEmDias = diferencaEmMilissegundos / (1000 * 60 * 60 * 24);
    
    // Verifica se já passou da data de reserva
    const passouDaDataReserva = diferencaEmDias < 1;
    
    // Se o usuário já tiver uma reserva para este cardápio ou se já passou da data de reserva, desabilita a reserva
    return isReservado || isJaReservado || passouDaDataReserva;
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
            <h2 className="title">Cardápio da Semana</h2>
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
                    {isReservaDisabled(item.data, item.id_cardapio) ? (
  <FaCheck size={20} style={{ marginRight: '5px', color: 'green' }} />
) : (
  isReservaDisabled(item.data) ? (
    <FaBan size={20} style={{ marginRight: '5px', color: 'red' }} />
  ) : (
    <FaCalendarPlus size={20} style={{ marginRight: '5px', cursor: 'pointer' }} onClick={() => reservarCardapio(item.id_cardapio)} />
  )
)}

                    <select className="select-turno" onChange={(e) => handleTurnoChange(item.id_cardapio, Array.from(e.target.selectedOptions, option => option.value))} disabled={isReservaDisabled(item.data)} multiple>
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
                  key={reserva.id}
                  className='card__cardapio'
                  style={{ marginRight: '20px', flex: '0 0 auto' }}
                >
                  <img src={reserva.imagem ? reserva.imagem : img} alt='text alt' className='card__image' />
                  <div className="card__content">
                    <h2 className="card__title">{reserva.nome_cardapio}</h2>
                    <p className="card__info">Dia da semana: {getDayOfWeek(reserva.data_cardapio)}</p>
                    <p className="card__info">Turno da reserva: {reserva.turno}</p>
                  </div>
                </motion.div>
              ))}
            </motion.div>
          </div>
        </div>
    </>
  );  
};

export default Cardapio;