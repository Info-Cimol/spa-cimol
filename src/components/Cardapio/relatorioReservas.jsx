import React, { useState, useEffect } from 'react';
import axiosFetch from '../../axios/config';

const RelatorioReservas = () => {
    const [relatorio, setRelatorio] = useState([]);

    useEffect(() => {
        const fetchRelatorio = async () => {
            try {
                const response = await axiosFetch.get('/relatorio/reservas');
                setRelatorio(response.data);
            } catch (error) {
                console.error('Erro ao buscar relatório de reservas:', error);
            }
        };

        fetchRelatorio();
    }, []);

    return (
        <div>
            <h2>Relatório de Reservas</h2>
            <table>
                <thead>
                    <tr>
                        <th>Nome do Cardápio</th>
                        <th>Data do Cardápio</th>
                        <th>Quantidade Total de Reservas</th>
                        <th>Turno da Reserva</th>
                        <th>Quantidade de Reservas no Turno</th>
                        <th>Pessoas</th>
                    </tr>
                </thead>
                <tbody>
                    {relatorio.map((item, index) => (
                        <tr key={index}>
                            <td>{item.nome_cardapio}</td>
                            <td>{item.data_cardapio}</td>
                            <td>{item.quantidade_total_reservas}</td>
                            <td>{item.turno_reserva}</td>
                            <td>{item.quantidade_reservas_turno}</td>
                            <td>
                                <ul>
                                    {item.pessoas && item.pessoas.map((pessoa, idx) => (
                                        <li key={idx}>
                                            {pessoa.nome_pessoa}
                                        </li>
                                    ))}
                                </ul>
                            </td>
                        </tr>
                    ))}
                </tbody>
            </table>
        </div>
    );
};

export default RelatorioReservas;