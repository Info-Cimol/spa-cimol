import React, { useState, useEffect, useRef } from 'react'
import ContainerTopo from '../../components/ContainerTopo';
import {Container} from './styled';
import { motion } from 'framer-motion';
import { ImBlocked } from 'react-icons/im'
import imagem1 from '../../imagens/image1.jpg'

function AlunoLogado(){
  const [mostrarBotao, setMostrarBotao] = useState(true);
  const carousel = useRef();
  const [width, setWidth] = useState(0);
  const hoje = new Date();

  const [cardapio] = useState([
    {
      img : imagem1,
      data: new Date(2023, 8, 26),
      prato: "Arroz, feijao, batata doce"
    },
    {
      img : imagem1,
      data: new Date(2023, 8, 27),
      prato: "Galinhada"
    },
    {
      img : imagem1,
      data: new Date(2023, 8, 28),
      prato: "Arroz, lentilha, batata dore"
    },
    {
      img : imagem1,
      data: new Date(2023, 8, 29),
      prato: "Arroz, feijao, frango assado"
    },
    {
      img : imagem1,
      data: new Date(2023, 8, 30),
      prato: "Arroz, feijao, batata doce"
    },
  ]);

  useEffect(() =>{
    if(mostrarBotao === false){
      setWidth(carousel.current?.scrollWidth - carousel.current?.offsetWidth)
    }
    

  }, [mostrarBotao]);

  const getNomeDiaDaSemana = (data) =>{
    const diaDaSemana = ['Domingo', 'Segunda-feira', 'Terça-feira', 'Quarta-feira', 'Quinta-feira', 'Sexta-feira', 'Sabado'];
    return diaDaSemana[data.getDay()];
  }

  const mostrarCardapio = () =>{
    setMostrarBotao(!mostrarBotao);
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
               {cardapio.map((cardapio,index) =>{
                  const diferencaEmMilissegundos = cardapio.data - hoje;
                  const diferencaEmDias = diferencaEmMilissegundos / (1000 * 60 * 60 * 24)
                  const podeReservar = diferencaEmDias >= 2;
                
                  return(
                    <motion.div className='item' key={index}>
                      <p>{`${getNomeDiaDaSemana(cardapio.data)} ${cardapio.data.getDate()}/${cardapio.data.getMonth() +1}/${cardapio.data.getFullYear()}`}</p>
                      <div className='containerCarrossel'>
                        <div>
                          <img src={cardapio.img} alt='text alt' />
                          <p>{cardapio.prato}</p>
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
            <motion.div ref={carousel} className='carrossel' whileTap={{cursor: "grabbing"}}>
              <motion.div className='inner'
              drag="x"
              dragConstraints={{ right: 0, left: -width}}
              >
                {cardapio.map((cardapio,index) =>(
                    <motion.div className='item' key={index}>
                      <p>{`${getNomeDiaDaSemana(cardapio.data)} ${cardapio.data.getDate()}/${cardapio.data.getMonth() +1}/${cardapio.data.getFullYear()}`}</p>
                      <div className='containerCarrossel'>
                        <div>
                          <img src={cardapio.img} alt='text alt' />
                          <p>{cardapio.prato}</p>
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