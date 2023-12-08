import React, { useCallback, useEffect, useState } from "react";
import { Container } from "./styled";
import ContainerTopo from "../../components/ContainerTopo";
import {IoAddCircleOutline, IoSearchOutline, IoClose} from "react-icons/io5"
import { Link } from "react-router-dom";
import createHeaders from "../../auth/utils";
import axiosFecht from "../../axios/config";
import { toast } from "react-toastify";

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
            const cardapioData = parseData(response.data);

            const cardapioOrdenado =  [...cardapioData].sort((a, b) => b.data.getTime() - a.data.getTime());
            setCardapio(cardapioOrdenado);
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
          const dataFormatada = `${String(item.data.getDate()+1).padStart(2, '0')}/${item.data.getMonth()+1}/${item.data.getFullYear()}`;
          return dataFormatada.includes(event.target.value);
        });

        setDataFiltrada(filtrarPesquisa);

    };

    const handleDelete = async(idCardapio) =>{
        const userData = JSON.parse(localStorage.getItem('userData'));
        const headers = createHeaders(userData);

        const response = await axiosFecht.delete('/cardapio/deletar/'+idCardapio, {}, {headers});
        if(response.data.success === true){
            fetchData(setCardapio);
            setDescricao(!descricao);
            toast.success('Cardápio excluido com sucesso');
        }else{
            toast.error('erro ao excluir cardápio');
        }
    }

    const handleCadastrar = async (e) =>{
        e.preventDefault();
        if (!data || !nomeCardapio || !descricaoCardapio) {
            toast.error('Preencha todos os campos obrigatórios');
            return;
        }
        const userData = JSON.parse(localStorage.getItem('userData'));
        const headers = createHeaders(userData);

        const response = await axiosFecht.post('/cardapio/cadastrar', {
            data: data,
            nome: nomeCardapio,
            descricao: descricaoCardapio
        },{headers});

        if(response.data.success === true){
            fetchData(setCardapio);
            setNewCardapio(!newCardapio);
            setData('');
            setNomeCardapio('');
            setDescricaoCardapio('');
            toast.success('Cardápio registrado com sucesso');
        }else{
            toast.error('Erro ao registrar cardápio')
        }
    }

    const handleNewCardapio = () =>{
        setNewCardapio(!newCardapio);
    }

    const boxDescricao = (item) =>{
        console.log(item)
        setDescricao(!descricao);
        setCardapioSelecionado(item);
        setTurnoManha(item.manha_count);
        setTurnoTarde(item.tarde_count);
        setTurnoNoite(item.noite_count);
    }

    return(
        <Container>
            <ContainerTopo/>
            {descricao &&(
                <div className="containerDescricao">
                    <IoClose size={20} onClick={() => setDescricao(false)}/>
                    <p>{cardapioSelecionado.descricao}</p>
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
                    <IoClose size={25} color="#646464" onClick={() => setNewCardapio(false)}/>
                    <div className="new">
                        <h3>Novo Cardápio</h3>
                    </div>
                    <div className="formulario">
                        <form>
                            <label>Data</label>
                            <input onChange={(e) =>(setData(e.target.value))} type="date" required />
                            <label>Prato</label>
                            <input type="text" onChange={(e) =>(setNomeCardapio(e.target.value))} required/>
                            <label>Descrição</label>
                            <textarea onChange={(e) =>(setDescricaoCardapio(e.target.value))} required/>
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
                                    dataFiltrada.slice(0, 5).map((item) =>(
                                        <tr key={item.data} onClick={() => boxDescricao(item)}>
                                            <td>{`${String(item.data.getDate()+1).padStart(2, '0')}/${item.data.getMonth()+1}/${item.data.getFullYear()}`}</td>
                                            <td>{item.nome}</td>
                                            <td>{item.reservas}</td>
                                        </tr>
                                    ))
                                ) : (
                                    cardapio.slice(0, 5).map((item) =>(
                                        <tr key={item.data} onClick={() => boxDescricao(item)}>
                                            <td>{`${String(item.data.getDate()+1).padStart(2, '0')}/${item.data.getMonth()+1}/${item.data.getFullYear()}`}</td>
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