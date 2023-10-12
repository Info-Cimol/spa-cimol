import React, { useState } from "react";
import { Container } from "./styled";
import ContainerTopo from "../../components/ContainerTopo";
import {IoAddCircleOutline, IoSearchOutline, IoClose} from "react-icons/io5"
import { Link } from "react-router-dom";

function Secretaria(){
    const [dados] = useState([
        {data: new Date(2023, 10, 12 ), cardapio: "Arroz com ovo",  manha: 100, tarde: 50, noite: 40},
        {data: new Date(2023, 10, 13 ), cardapio: "Arroz com feijão", manha: 80, tarde: 70, noite: 50},
        {data: new Date(2023, 10, 14 ), cardapio: "Omelete com batata", manha: 95, tarde: 60, noite: 38},
        {data: new Date(2023, 10, 15 ), cardapio: "Carreteiro", manha: 110, tarde: 48, noite: 70}, 
        {data: new Date(2023, 10, 16 ), cardapio: "Omelete com batata", manha: 93, tarde: 75, noite: 60}, 
    ])

    const [mostrarBotao, setMostrarBotao] = useState(true);
    const [inputValue, setInputValue] = useState('');
    const [newCardapio, setNewCardapio] = useState(false);
    const [turnoManha, setTurnoManha] = useState();
    const [turnoTarde, setTurnoTarde] = useState();
    const [turnoNoite, setTurnoNoite] = useState();
    const [descricao, setDescricao] = useState(false);
    const [descricaoText, setDescricaoText] = useState();
    const [dataFiltrada, setDataFiltrada] = useState('')

    const mostrarCardapio = () =>{
        setMostrarBotao(!mostrarBotao);
    }

    const handleInputChange = (event) =>{
        setInputValue(event.target.value);

        const filtrarPesquisa = dados.filter((item) =>{
            const dataFormatada = `${item.data.getDate()}/${item.data.getMonth()}/${item.data.getFullYear()}`;
            return dataFormatada.includes(event.target.value);
        })
        setDataFiltrada(filtrarPesquisa);
    }

    const handleNewCardapio = () =>{
        setNewCardapio(!newCardapio);
    }

    const boxDescricao = (item) =>{
        setDescricao(!descricao);
        setDescricaoText(item.cardapio);
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
                    <p>{descricaoText}</p>
                    <div className="reservas">
                        <p>Manha: {turnoManha}</p>
                        <p>Tarde: {turnoTarde}</p>
                        <p>Noite: {turnoNoite}</p>
                    </div>
                    <div className="buttonDescricao">
                        <Link>Editar</Link><a href="teste">Excluir</a>
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
                            <input type="date" />
                            <label>Prato</label>
                            <input type="text" />
                            <label>Descrição</label>
                            <textarea></textarea>
                            <button className="btnCriar">Criar</button>
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
                                    dataFiltrada.map((item) =>(
                                        <tr key={item.data} onClick={() => boxDescricao(item)}>
                                            <td>{`${item.data.getDate()}/${item.data.getMonth()}/${item.data.getFullYear()}`}</td>
                                            <td>{item.cardapio}</td>
                                            <td>{item.manha + item.tarde + item.noite}</td>
                                        </tr>
                                    ))
                                ) : (
                                    dados.map((item) =>(
                                        <tr key={item.data} onClick={() => boxDescricao(item)}>
                                            <td>{`${item.data.getDate()}/${item.data.getMonth()}/${item.data.getFullYear()}`}</td>
                                            <td>{item.cardapio}</td>
                                            <td>{item.manha + item.tarde + item.noite}</td>
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

export default Secretaria;