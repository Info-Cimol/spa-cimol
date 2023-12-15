import React, { useState } from "react";
import { ContainerAluno } from "./styled";
import {IoSearchOutline, IoAddCircleOutline} from "react-icons/io5"

function Alunos (){
    const[inputValue, setInputValue] = useState('');
    const[nomeFiltrado, setNomefiltrado] = useState();

    const alunos = [
        {
            nome: 'João Silva', matricula: '12345', email: 'joao@gmail.com', cpf: '123.456.789-01', telefone: '(11) 98765-4321',
        },
        {
            nome: 'Maria da Silva', matricula: '125345', email: 'maria@gmail.com', cpf: '223.456.789-01', telefone: '(51) 97765-4321',
        },
        {
            nome: 'Jorge da Silva', matricula: '325345', email: 'jorge@gmail.com', cpf: '023.456.789-01', telefone: '(51) 99765-4321',
        },
        {
            nome: 'Vitoria da Silva', matricula: '425345', email: 'vitoria@gmail.com', cpf: '123.456.789-01', telefone: '(51) 93765-4321',
        },
        {
            nome: 'Gustavo da Silva', matricula: '225345', email: 'gustavo@gmail.com', cpf: '033.456.789-01', telefone: '(51) 92765-4321',
        },
        {
            nome: 'Amelia da Silva', matricula: '525345', email: 'amelia@gmail.com', cpf: '053.456.789-01', telefone: '(51) 8765-4321',
        },
    ];

    const handleInputChange = (event) => {
        setInputValue(event.target.value);
    
        const filtrarPesquisa = alunos.filter((item) => {
          const filtrarPorNome = item.nome;
          return filtrarPorNome.includes(event.target.value);
        });
        setNomefiltrado(filtrarPesquisa);
    };


    return(
        <ContainerAluno>
            <div className="container">
                <div className="topoTabela">
                <input type="text" onChange={handleInputChange} value={inputValue}/>
                        {!inputValue && <IoSearchOutline className="iconBusca" size={20}/>}
                        <IoAddCircleOutline size={40} color="#646464" className="iconAdd"/>
                </div>
                <div className="tabelaAlunos">
                    <table className="tabela">
                        <thead>
                            <tr>
                                <th>Nome</th>
                                <th>Matrícula</th>
                            </tr>
                        </thead>
                        <tbody>
                            {nomeFiltrado ?(
                                nomeFiltrado.slice(-5).map((aluno, index) =>(
                                    <tr key={index}>
                                        <td>{aluno.nome}</td>
                                        <td>{aluno.matricula}</td>
                                    </tr>
                                ))
                            ):(
                                alunos.slice(-5).map((aluno, index) => (
                                    <tr key={index}>
                                        <td>{aluno.nome}</td>
                                        <td>{aluno.matricula}</td>
                                    </tr>
                                ))
                            )}  
                        </tbody>
                    </table>
                </div>
            </div>
        </ContainerAluno>
    );
}

export default Alunos