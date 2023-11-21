import React, { useState, useEffect, useRef } from 'react'
import ContainerTopo from '../../components/ContainerTopo';
import {Container} from './styled';
import { motion } from 'framer-motion';
import { ImBlocked } from 'react-icons/im'
import imagem1 from '../../imagens/image1.jpg'
import axiosFecht from '../../axios/config';
import createHeaders from '../../auth/utils';

function AlunoLogado(){
  const [mostrarBotao, setMostrarBotao] = useState(true);
  const carousel = useRef();
  const carousel2 = useRef();
  const [width, setWidth] = useState(0);
  const hoje = new Date();
  const [cardapio, setCardapio] = useState();
  const [reservas, setReservas] = useState();

  const img = imagem1;

  useEffect(() =>{

    if (!mostrarBotao) {
      setWidth(carousel.current?.scrollWidth - carousel.current?.offsetWidth);
    }

    const fetchData = async () => {
      try {
        const userData = JSON.parse(localStorage.getItem('userData'));
        const headers = createHeaders(userData);
  
        const response = await axiosFecht.get('/cardapio/', { headers });
        setCardapio(response.data);

        const responseReservas = await axiosFecht.get('/cardapio/reservas', { headers });
        const reservasComDataConvertida = parseData(responseReservas.data);

        setReservas(reservasComDataConvertida);
      } catch (error) {
        console.log('Erro ao listar cardapio', error);
      }
    };
  
    fetchData();
    
  }, [mostrarBotao]);

  const getNomeDiaDaSemana = (dataDoCardapio) =>{
      if (!(dataDoCardapio instanceof Date)) {
    // Trate o caso em que dataDoCardapio não é uma instância válida de Date
    console.error(`Valor inválido para data: ${dataDoCardapio}`);
    return ''; // ou outra ação adequada
  }

    const diaDaSemana = ['Domingo', 'Segunda-feira', 'Terça-feira', 'Quarta-feira', 'Quinta-feira', 'Sexta-feira', 'Sabado'];
    return diaDaSemana[dataDoCardapio.getDay()];
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
            <motion.div ref={carousel} className='carrossel' whileTap={{cursor: "grabbing"}}>
              <motion.div className='inner'
              drag="x"
              dragConstraints={{ right: 0, left: -width}}
              >
                {console.log("teste final", cardapio)}
                {cardapio.map((cardapio, index) => {
                  const dataDoCardapio = new Date(cardapio.data);

                  if (isNaN(dataDoCardapio.getTime())) {
                    console.error(`Data inválida: ${cardapio.data}`);
                    return null; // ou faça algo para lidar com datas inválidas
                  }

                  const diferencaEmMilissegundos = dataDoCardapio - hoje;
                  const diferencaEmDias = diferencaEmMilissegundos / (1000 * 60 * 60 * 24);
                  const podeReservar = diferencaEmDias >= 2;

                  return (
                    <motion.div className='item' key={index}>
                      <p>{`${getNomeDiaDaSemana(dataDoCardapio)} ${dataDoCardapio.getDate()}/${dataDoCardapio.getMonth() + 1}/${dataDoCardapio.getFullYear()}`}</p>
                      <div className='containerCarrossel'>
                        <div>
                          <img src={img} alt='text alt' />
                          <p>{cardapio.nome}</p>
                        </div>
                        {podeReservar?(
                          <div className='checkboxContainer'>
                            <input type="checkbox"/>
                            <label>Reservar</label>
                          </div>
                        ):(
                          <div className='checkboxContainer'>
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
          </div>
          <div className='boxCardapio'>
            <h1>Reservas</h1>
            <motion.div ref={carousel2} className='carrossel' whileTap={{cursor: "grabbing"}}>
              <motion.div className='inner'
              drag="x"
              dragConstraints={{ right: 0, left: -width}}
              >
                {reservas.map((reservas,index) =>(
                    <motion.div className='item' key={index}>
                      <p>{`${getNomeDiaDaSemana(reservas.data)} ${reservas.data.getDate()}/${reservas.data.getMonth() +1}/${reservas.data.getFullYear()}`}</p>
                      <div className='containerCarrossel'>
                        <div>
                          <img src={img} alt='text alt' />
                          <p>{reservas.nome}</p>
                        </div>
                        <div className='checkboxContainer'>
                          <input type="checkbox" defaultChecked/>
                          <label className='reservado'>Reservado</label>
                        </div>
                      </div>
                    </motion.div>
                ))}
              </motion.div>
            </motion.div>
          </div>
        </div>
      )}  
    </Container>
  )   
}

export default AlunoLogado;