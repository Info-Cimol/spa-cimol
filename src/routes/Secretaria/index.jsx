import React, { useCallback, useEffect, useState } from "react";
import { Container } from "./styled";
import ContainerTopo from "../../components/ContainerTopo";
import {IoAddCircleOutline, IoSearchOutline, IoClose} from "react-icons/io5"
import { Link } from "react-router-dom";
import createHeaders from "../../auth/utils";
import axiosFecht from "../../axios/config";

function Secretaria(){
    const [mostrarBotao, setMostrarBotao] = useState(true);
    const [inputValue, setInputValue] = useState('');
    const [newCardapio, setNewCardapio] = useState(false);
    const [turnoManha, setTurnoManha] = useState();
    const [turnoTarde, setTurnoTarde] = useState();
    const [turnoNoite, setTurnoNoite] = useState();
    const [descricao, setDescricao] = useState(false);
    const [cardapioSelecionado, setCardapioSelecionado] = useState();
    const [dataFiltrada, setDataFiltrada] = useState('')
    const [cardapio, setCardapio] = useState();
    const [data, setData] = useState();
    const [nomeCardapio, setNomeCardapio] = useState();
    const [descricaoCardapio, setDescricaoCardapio] = useState();

    const fetchData = useCallback(async (setCardapio) =>{
        try {
            const userData = JSON.parse(localStorage.getItem('userData'));
            const headers = createHeaders(userData);

            const response = await axiosFecht.get('/cardapio/',{}, {headers});
            setCardapio(parseData(response.data));
            console.log(response.data)
            
        } catch (error) {
            console.log("Erro ao listar cardapio "+ error)
        }
    },[]);

    useEffect(() =>{
       fetchData(setCardapio);
    },[fetchData])

    
    const parseData = (cardapio) => {
        if (!Array.isArray(cardapio)) {
          console.error(`Cardapio não é um array: ${cardapio}`);
          return [];
        }
    
        return cardapio.map((item) => {
          const dataCardapio = new Date(item.data);
          if (isNaN(dataCardapio.getTime())) {
            console.error(`Data inválida para reserva: ${item.data}`);
            return null;
          }
    
          return {
            ...item,
            data: dataCardapio,
          };
        });
      };

    const mostrarCardapio = () =>{
        setMostrarBotao(!mostrarBotao);
        fetchData(setCardapio)
    }

    const handleInputChange = (event) => {
        setInputValue(event.target.value);
    
        const filtrarPesquisa = cardapio.filter((item) => {
          const dataFormatada = `${item.data.getDate()}/${item.data.getMonth()}/${item.data.getFullYear()}`;
          return dataFormatada.includes(event.target.value);
        });

        setDataFiltrada(filtrarPesquisa);

    };

    const handleDelete = async(idCardapio) =>{
        const userData = JSON.parse(localStorage.getItem('userData'));
        const headers = createHeaders(userData);

        const response = await axiosFecht.delete('/cardapio/deletar/'+idCardapio, {}, {headers});
        console.log(response);

        fetchData(setCardapio);
        setDescricao(!descricao);
    }

    const handleCadastrar = async (e) =>{
        e.preventDefault();
        const userData = JSON.parse(localStorage.getItem('userData'));
        const headers = createHeaders(userData);

        const response = await axiosFecht.post('/cardapio/cadastrar', {
            data: data,
            nome: nomeCardapio,
            descricao: descricaoCardapio
        },{headers});
        console.log(response);
        fetchData(setCardapio);
        setNewCardapio(!newCardapio);
    }

    const handleNewCardapio = () =>{
        setNewCardapio(!newCardapio);
    }

    const boxDescricao = (item) =>{
        setDescricao(!descricao);
        setCardapioSelecionado(item);
        setTurnoManha(item.manha);
        setTurnoTarde(item.tarde);
        setTurnoNoite(item.noite);
    }

    return(
        <Container>
            <ContainerTopo/>
            {descricao &&(
                <div className="containerDescricao">
                    <IoClose size={20} onClick={() => setDescricao(false)}/>
                    <p>{cardapioSelecionado.nome}</p>
                    <div className="reservas">
                        <p>Manha: {turnoManha}</p>
                        <p>Tarde: {turnoTarde}</p>
                        <p>Noite: {turnoNoite}</p>
                    </div>
                    <div className="buttonDescricao">
                        <Link>Editar</Link><Link onClick={() => handleDelete(cardapioSelecionado.id_cardapio)}>Excluir</Link>
                    </div>
                </div>
            )}
            {newCardapio &&(
                <div className="containerNew">
                    <div className="new">
                        <h3>Novo Cardápio</h3>
                    </div>
                    <div className="formulario">
                        <form>
                            <label>Data</label>
                            <input onChange={(e) =>(setData(e.target.value))} type="date"  />
                            <label>Prato</label>
                            <input type="text" onChange={(e) =>(setNomeCardapio(e.target.value))}/>
                            <label>Descrição</label>
                            <textarea onChange={(e) =>(setDescricaoCardapio(e.target.value))}/>
                            <button className="btnCriar" onClick={handleCadastrar}>Criar</button>
                        </form>
                    </div>
                </div>
            )}
            {mostrarBotao ?(
                <div className='buttons'>
                <button onClick={mostrarCardapio}>Cardápio</button>
                </div>
            ) : (
                <div className="containerCardapio">
                    <div className="topoTabela">
                        <input type="text" onChange={handleInputChange} value={inputValue}/>
                        {!inputValue && <IoSearchOutline className="iconBusca" size={20}/>}
                        <IoAddCircleOutline size={40} color="#646464" className="iconAdd" onClick={handleNewCardapio}/>
                    </div>
                    <div className="tabelaCardapio">
                        <table className="tabela">
                            <thead>
                                <tr>
                                    <td>Data</td>
                                    <td>Cardápio</td>
                                    <td>Nº</td>
                                </tr>
                            </thead>
                            <tbody>
                                {dataFiltrada.length > 0? (
                                    cardapio.map((item) =>(
                                        <tr key={item.data} onClick={() => boxDescricao(item)}>
                                            <td>{`${item.data.getDate()}/${item.data.getMonth()}/${item.data.getFullYear()}`}</td>
                                            <td>{item.nome}</td>
                                            <td>{item.reservas}</td>
                                        </tr>
                                    ))
                                ) : (
                                    cardapio.map((item) =>(
                                        <tr key={item.data} onClick={() => boxDescricao(item)}>
                                            <td>{`${item.data.getDate()}/${item.data.getMonth()}/${item.data.getFullYear()}`}</td>
                                            <td>{item.nome}</td>
                                            <td>{item.reservas}</td>
                                        </tr>
                                    ))
                                )}
                                
                            </tbody>
                        </table>
                    </div>
                    
                </div>
            )}
        </Container>
    )
    
}

export default Secretaria ;