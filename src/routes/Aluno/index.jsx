import React, { useState, useEffect, useRef, useCallback, useMemo } from 'react'
import ContainerTopo from '../../components/ContainerTopo';
import {Container} from './styled';
import { motion } from 'framer-motion';
import { ImBlocked } from 'react-icons/im'
import imagem1 from '../../imagens/image1.jpg'
import axiosFecht from '../../axios/config';
import createHeaders from '../../auth/utils';

function Aluno(){
  const [mostrarBotao, setMostrarBotao] = useState(true);
  const carousel = useRef();
  const carousel2 = useRef();
  const [width, setWidth] = useState(0);
  const [width2, setWidth2] = useState(0);
  const [cardapio, setCardapio] = useState();
  const [reservas, setReservas] = useState();
  const [reservaChecked, setReservaChecked] = useState(false);
  const [idCardapio, setIdCardapio] = useState();
  const [turnosReservados, setTurnosReservados] = useState({
    manha: false,
    tarde: false,
    noite: false,
  });
  const hoje = useMemo(() => new Date(), []);
  const img = imagem1;

  const fetchData = useCallback(async (setCardapio, setReservas) => {
    try {
      const userData = JSON.parse(localStorage.getItem('userData'));
      const headers = createHeaders(userData);

      const response = await axiosFecht.get('/cardapio/',{}, { headers });
      const cardapioData = parseData(response.data);
      const cardapioFiltrado = cardapioData.filter((item) => item.data.getTime() >= hoje.getTime()).sort((a, b) => a.data.getTime() - b.data.getTime())
      setCardapio(cardapioFiltrado);

      const responseReservas = await axiosFecht.get('/cardapio/reservas', { headers });
      const reservasData = parseData(responseReservas.data);
      const reservaFiltrada = reservasData.sort((a, b) => a.data.getTime() - b.data.getTime())
      setReservas(reservaFiltrada);

      const turnosReservados = {
        manha: false,
        tarde: false,
        noite: false,
      };
  
      reservasData.forEach((reserva) => {
        if (reserva.id_cardapio === idCardapio) {
          turnosReservados[reserva.turno] = true;
        }
      });
  
      setTurnosReservados(turnosReservados);
      
    } catch (error) {
      console.log('Erro ao listar cardapio', error);
    }
  },[hoje, idCardapio]);

  useEffect(() =>{

    if (!mostrarBotao) {
      setWidth(carousel.current?.scrollWidth - carousel.current?.offsetWidth);
      width2Observer.current.observe(carousel2.current);
    }

    fetchData(setCardapio, setReservas);
    
  }, [mostrarBotao, fetchData]);

  const width2Observer = useRef(
    new ResizeObserver((entries) =>{
      for( let entry of entries){
        setWidth2(entry.target.scrollWidth - entry.target.offsetWidth);
      }
    })
  );

  const getNomeDiaDaSemana = (dataDoCardapio) =>{
      if (!(dataDoCardapio instanceof Date)) {
        console.error(`Valor inválido para data: ${dataDoCardapio}`);
        return ''; // ou outra ação adequada
  }

    const diaDaSemana = ['Domingo', 'Segunda-feira', 'Terça-feira', 'Quarta-feira', 'Quinta-feira', 'Sexta-feira', 'Sabado'];
    return diaDaSemana[dataDoCardapio.getDay()+1];
  }

  const mostrarCardapio = () =>{
      setMostrarBotao(!mostrarBotao);
  }

  const parseData = (reservas) =>{
    if (!Array.isArray(reservas)) {
      console.error(`Reservas não é um array: ${reservas}`);
      return [];
    }
    return reservas.map((reserva)=>{
      const dataReserva = new Date(reserva.data);
      if (isNaN(dataReserva.getTime())) {
        console.error(`Data inválida para reserva: ${reserva.data}`);
        return null; 
      }
      return {
        ...reserva,
        data: dataReserva,
      };
    })
  }

  const reservarCardapio = async (id_cardapio, turno )=>{
    setReservaChecked(!reservaChecked);
    try {
      const userData = JSON.parse(localStorage.getItem('userData'));
      const headers = createHeaders(userData);
      
      const response = await axiosFecht.post('/cardapio/reservar/'+id_cardapio, {
        turno: turno
      }, {headers});
      console.log(response);
      fetchData(setCardapio, setReservas);
      setIdCardapio();
      
    } catch (error) {
      console.log("erro ao reservar cardapio "+ error);
    }
  }

  return(
    <Container>
      <ContainerTopo/>
      {mostrarBotao ?(
        <div className='buttons'>
          <button onClick={mostrarCardapio}>Cardápio</button>
        </div>
      ) : (
        <div className='containerCardapio'>
          <div className='boxCardapio'>
            <h1>Cardápio da semana</h1>
            {cardapio && reservas ?(
            <>
              <motion.div ref={carousel} className='carrossel' whileTap={{cursor: "grabbing"}}>
                <motion.div className='inner'
                  drag="x"
                  dragConstraints={{ right: 0, left: -width}}
                >
                  {cardapio.slice(-5).map((cardapio, index) => {
                    const dataDoCardapio = new Date(cardapio.data);
                    if (isNaN(dataDoCardapio.getTime())) {
                      console.error(`Data inválida: ${cardapio.data}`);
                      return null; // ou faça algo para lidar com datas inválidas
                    }

                    const diferencaEmMilissegundos = dataDoCardapio - hoje;
                    const diferencaEmDias = diferencaEmMilissegundos / (1000 * 60 * 60 * 24);
                    const podeReservar = diferencaEmDias >= 1;

                    const reservado = reservas.some(reserva => reserva.id_cardapio === cardapio.id_cardapio);
                    return (
                      <motion.div className='item' key={index}>
                        <p>{`${getNomeDiaDaSemana(dataDoCardapio)} ${String(dataDoCardapio.getDate()+1).padStart(2, '0')}/${dataDoCardapio.getMonth() + 1}/${dataDoCardapio.getFullYear()}`}</p>
                        <div className='containerCarrossel'>
                          <div>
                            <img src={img} alt='text alt' />
                            <p>{cardapio.nome}:</p>
                            <p>{cardapio.descricao}</p>
                          </div>
                          {podeReservar?(
                            <div className='checkboxContainer'>
                              <input 
                                type="checkbox" 
                                checked={reservado} 
                                onChange={() =>{ 
                                    setIdCardapio(cardapio.id_cardapio)
                                    setReservaChecked((prevReservaChecked) => !prevReservaChecked);
                                }}
                              />
                              <label>Reservar</label>
                            </div>
                          ):(
                            <div className={width !== 0 ? 'checkboxContainer' : 'teste'}>
                              <input type="checkbox" disabled/>
                              <ImBlocked color='red' size={28}/>
                              <label className='reservarBloqueado'>Reservar</label>
                            </div>
                          )} 
                        </div>
                      </motion.div>
                  )})}
                </motion.div>
              </motion.div>
              {reservaChecked && (
                <div className='boxTurno'>
                  <div className='checkboxTuno'>
                    <p>Em qual turno deseja fazer a reservar:</p>
                    <div className='turno'>
                      <input 
                      checked={turnosReservados.manha}
                        type="checkbox"
                        onChange={() => reservarCardapio(idCardapio, 'manha')}
                      />
                      <label>Manha</label>
                    </div>
                    <div className='turno'>
                      <input 
                      checked={turnosReservados.tarde}
                        type="checkbox"
                        onChange={() => reservarCardapio(idCardapio, 'tarde')}
                      />
                        <label>Tarde</label>
                    </div>
                    <div className='turno'> 
                      <input 
                      checked={turnosReservados.noite}
                        type="checkbox"
                        onChange={() => reservarCardapio(idCardapio, 'noite')}
                      />
                      <label>Noite</label>
                    </div>
                  </div>
                </div>
              )}
            </>
            ):(
              <p>Carregando cardápio...</p>
            )}
          </div>
          <div className='boxCardapio'>
            <h1>Reservas</h1>
            {cardapio && reservas ?(
            <>
            <motion.div ref={carousel2} className='carousel2' whileTap={{cursor: "grabbing"}}>
              <motion.div className='inner'
              drag="x"
              dragConstraints={{ right: 0, left: -width2}}
              >
                {reservas.slice(-5).map((reservas,index) =>(
                    <motion.div className='item' key={index}>
                      <p>{`${getNomeDiaDaSemana(reservas.data)} ${String(reservas.data.getDate()+1).padStart(2, '0')}/${reservas.data.getMonth() +1}/${reservas.data.getFullYear()}`}</p>
                      <div className='containerCarrossel'>
                        <div>
                          <img src={img} alt='text alt' />
                          <p>{reservas.nome}</p>
                        </div>
                        <div className='checkboxContainer'>
                          <input type="checkbox" defaultChecked/>
                          <label className='reservado'>Reservado: {reservas.turno}</label>
                        </div>
                      </div>
                    </motion.div>
                ))}
              </motion.div>
            </motion.div>
          </>
           ):(
            <p>Carregando reservas...</p>
          )}
          </div>
        </div>
      )}  
    </Container>
  )   
}

export default Aluno;