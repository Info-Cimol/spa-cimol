import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { FaCalendarPlus, FaBan } from 'react-icons/fa';
import { toast } from 'react-toastify';
import ContainerTopo from '../../components/ContainerTopo';
import MenuHamburguer from "../../components/MenuHamburguer";
import BackArrow from '../BackArrow/index';
import CardapioCadastro from '../Cardapio/cadastroCardapio'
import AddIcon from '@mui/icons-material/Add';
import axiosFecht from '../../axios/config';
import imagem1 from '../../imagens/image1.jpg';
import { IconButton } from '@mui/material';
import './cardapio.css';

function Cardapio() {
  const [cardapio, setCardapio] = useState([]);
  const [reservado, setReservado] = useState({});
  const [openCadastro, setOpenCadastro] = useState(false);
  const [selectedTurno, setSelectedTurno] = useState({});
  const token = localStorage.getItem('token');
  const [userRole] = useState(localStorage.getItem('userRole'));
  const img = imagem1;
  const headers = {
    'x-access-token': token,
  }; 

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await axiosFecht.get('/listar/cardapio', { headers });
        const cardapioOrdenado = response.data.sort((a, b) => new Date(b.data) - new Date(a.data));
        setCardapio(cardapioOrdenado);
      } catch (error) {
        console.log('Erro ao listar cardápio', error);
      }
    };

    fetchData();
});

  const reservarCardapio = async (idCardapio) => {
    try {
      const token = localStorage.getItem('token');
      const id = localStorage.getItem('id');
      const turno = selectedTurno[idCardapio];
      const headers = {
        'x-access-token': token,
      };

      if (!turno) {
        toast.error('Por favor, selecione um turno antes de reservar.');
        return;
      }

      const response = await axiosFecht.post(`/reserva/${id}/cardapio/${idCardapio}`, { turno }, { headers });
      if (response.data.deletado === true) {
        console.log('Reserva removida');
        toast.error('Não foi possível realizar sua reserva!');
      } else {
        toast.success('Sua reserva foi cadastrada!');
        setReservado({ ...reservado, [idCardapio]: true });
      }
    } catch (error) {
      console.log("Erro ao reservar cardápio ", error);
      toast.error(error);
    }
  };

  const getDayOfWeek = (dateString) => {
    const days = ['Domingo', 'Segunda-feira', 'Terça-feira', 'Quarta-feira', 'Quinta-feira', 'Sexta-feira', 'Sábado'];
    const date = new Date(dateString);
    let dayOfWeek = date.getDay();
    return days[dayOfWeek];
  };

  const isReservaDisabled = (data) => {
    const dataCardapio = new Date(data);
    const hoje = new Date();
    const diferencaMilissegundos = dataCardapio.getTime() - hoje.getTime();
    const diferencaDias = Math.floor(diferencaMilissegundos / (1000 * 60 * 60 * 24));
    return diferencaDias < 3;
  };

  const handleTurnoChange = (idCardapio, selectedValue) => {
    setSelectedTurno({ ...selectedTurno, [idCardapio]: selectedValue });
  };

  const handleToggleForm = () => {
    setOpenCadastro(!openCadastro); 
  };

  return (
    <>
      <div>
        <ContainerTopo userType={userRole} />
        <MenuHamburguer userType={userRole} />
      </div>
  
      {openCadastro && <CardapioCadastro open={openCadastro} onClose={() => setOpenCadastro(false)} />}
  
      <div className='container-fluid'>
        <BackArrow style={{ marginTop: '120px', marginLeft: '10px' }} />
        <div className='containerCardapio'>
  
        <div className="header">
        <h2 className="title">Cardápio da semana</h2>
        
        {/* Botão de adicionar (+) */}
        {userRole === 'admin' || userRole === 'secretaria' ? (
          <div className="add-button-container">
            <IconButton onClick={handleToggleForm} title="Formulário de cadastro" component="span">
              <AddIcon fontSize="large" />
            </IconButton>
          </div>
        ) : null}
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
        </div>
      </div>
    </>
  );  
}

export default Cardapio;