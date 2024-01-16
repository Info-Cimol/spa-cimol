import React, { useCallback, useEffect, useState } from "react";
import { Container } from "./styled";
import ContainerTopo from "../../components/ContainerTopo";
import {IoAddCircleOutline, IoSearchOutline, IoClose} from "react-icons/io5"
import { Link } from "react-router-dom";
import createHeaders from "../../auth/utils";
import axiosFecht from "../../axios/config";
import { toast } from "react-toastify";
import Alunos from "./alunos";

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
    const [editCardapio, setEditCardapio] = useState(false);
    const [secaoAlunos, setSecaoAlunos] = useState(false);
    
    const userType = "secretaria";

    const fetchData = useCallback(async (setCardapio) =>{
        try {
            const userData = JSON.parse(localStorage.getItem('userData'));
            const headers = createHeaders(userData);

            const response = await axiosFecht.get('/cardapio/',{}, {headers});
            const cardapioData = parseData(response.data);

            const cardapioOrdenado =  [...cardapioData].sort((a, b) => b.data.getTime() - a.data.getTime());
            setCardapio(cardapioOrdenado);
            
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

    const handleAlunos = () =>{
        setSecaoAlunos(!secaoAlunos);
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
        setDescricao(!descricao);
        setCardapioSelecionado(item);
        setTurnoManha(item.manha_count);
        setTurnoTarde(item.tarde_count);
        setTurnoNoite(item.noite_count);
    }

    const handleBtnEdit = () =>{
        setEditCardapio(!editCardapio);
        setDescricao(!descricao)
    }

    const handleEditar = async (e) =>{
        e.preventDefault()
        
        const userData = JSON.parse(localStorage.getItem('userData'));
        const headers = createHeaders(userData);

        const response = await axiosFecht.put('/cardapio/editar/'+cardapioSelecionado.id_cardapio, {
            data: cardapioSelecionado.data,
            nome: cardapioSelecionado.nome,
            descricao: cardapioSelecionado.descricao
        }, {headers});

        if(response.data.success === true){
            fetchData(setCardapio);
            setEditCardapio(false);
            toast.success('Cardápio editado com sucesso!');
        }else{
            toast.error('Erro ao editar cardápio');
        }
    }

    return(
        <Container>
            <ContainerTopo userType={userType} 
                mostrarBotao={mostrarBotao} 
                setMostrarBotao={setMostrarBotao}
                secaoAlunos={secaoAlunos}
                setSecaoAlunos={setSecaoAlunos}
            />
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
                        <Link onClick={() => handleBtnEdit()}>Editar</Link>
                        <Link onClick={() => handleDelete(cardapioSelecionado.id_cardapio)}>Excluir</Link>
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
            {editCardapio &&(
                <div className="containerNew">
                    <IoClose size={25} color="#646464" onClick={() => setEditCardapio(false)}/>
                    <div className="new">
                        <h3>Editar Cardápio</h3>
                    </div>
                    <div className="formulario">
                        <form>
                            <label>Data</label>
                            <input value={cardapioSelecionado.data ? cardapioSelecionado.data.toISOString().split('T')[0] : ''} type="date" onChange={(e) => setCardapioSelecionado({ ...cardapioSelecionado, data: new Date(e.target.value) })} required />
                            <label>Prato</label>
                            <input value={cardapioSelecionado.nome || ''} type="text" onChange={(e) => setCardapioSelecionado({ ...cardapioSelecionado, nome: e.target.value })} required/>
                            <label>Descrição</label>
                            <textarea value={cardapioSelecionado.descricao || ''} onChange={(e) => setCardapioSelecionado({ ...cardapioSelecionado, descricao: e.target.value })} required/>
                            <button className="btnCriar" onClick={handleEditar}>Editar</button>
                        </form>
                    </div>
                </div>
            )}
            {secaoAlunos && <Alunos />}
            {mostrarBotao ?(
                <div className='buttons'>
                    <button onClick={mostrarCardapio}>Cardápio</button>
                    <button onClick={handleAlunos}>Alunos</button>
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