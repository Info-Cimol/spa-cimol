import React, { useState, useEffect } from 'react';
import axiosFetch from '../../axios/config';
import jsPDF from 'jspdf';
import 'jspdf-autotable';
//import imagem1 from '../../imagens/image1.jpg';

const RelatorioReservas = () => {
    const [relatorio, setRelatorio] = useState([]);

    useEffect(() => {
        const fetchRelatorio = async () => {
            try {
                const response = await axiosFetch.get('/relatorio/reservas');
                const relatorioOrdenado = response.data.map(item => ({
                    ...item,
                    pessoas: item.pessoas.sort((a, b) => a.nome_pessoa.localeCompare(b.nome_pessoa))
                }));
                setRelatorio(relatorioOrdenado);
            } catch (error) {
                console.error('Erro ao buscar relatório de reservas:', error);
            }
        };

        const interval = setInterval(fetchRelatorio, 60000);

        fetchRelatorio();

        return () => clearInterval(interval);
    }, []);

    const gerarPDF = () => {
        const doc = new jsPDF();

        const addContent = () => {
            let isFirstPage = true; 
    
            relatorio.forEach(item => {
                const data = [];
                for (let i = 0; i < item.pessoas.length; i++) {
                    const pessoa = item.pessoas[i];
                    data.push([
                        pessoa.nome_pessoa,
                        item.turno_reserva,
                        item.nome_cardapio,
                        item.data_cardapio,
                        item.quantidade_reservas_turno
                    ]);
                }
    
                if (isFirstPage) {
                    doc.setFontSize(16);
                    doc.text('Relatório de Reservas', 105, 20, null, null, 'center');
                    isFirstPage = false;
                }
    
                doc.autoTable({
                    head: [['Aluno', 'Turno', 'Cardápio', 'Data', 'Reservas no Turno']],
                    body: data,
                    theme: 'grid',
                    styles: {
                        cellPadding: 1,
                        fontSize: 10,
                        halign: 'left',
                        valign: 'middle'
                    },
                    columnStyles: {
                        0: { cellWidth: 80 },
                        1: { cellWidth: 20 },
                        2: { cellWidth: 20 },
                        3: { cellWidth: 20 },
                        4: { cellWidth: 30 }
                    },
                    margin: { top: 10 }
                });
    
                if (relatorio.indexOf(item) !== relatorio.length - 1) {
                    doc.addPage();
                }
            });
        };

        addContent();

        doc.save('relatorio_reservas.pdf');
    };
    
    return (
        <div>
            <h2>Relatório de Reservas</h2>
            <button onClick={gerarPDF}>Gerar PDF</button>

            <table>
                <thead>
                    <tr>
                        <th>Nome do Cardápio</th>
                        <th>Data do Cardápio</th>
                        <th>Quantidade Total de Reservas</th>
                        <th>Turno da Reserva</th>
                        <th>Quantidade de Reservas no Turno</th>
                        <th>Alunos</th>
                    </tr>
                </thead>
                <tbody>
                    {relatorio.map((item, index) => (
                        <React.Fragment key={index}>
                            {item.pessoas.map((pessoa, index) => (
                                <tr key={index}>
                                    <td>{item.nome_cardapio}</td>
                                    <td>{item.data_cardapio}</td>
                                    <td>{item.quantidade_total_reservas}</td>
                                    <td>{item.turno_reserva}</td>
                                    <td>{item.quantidade_reservas_turno}</td>
                                    <td>{pessoa.nome_pessoa}</td>
                                </tr>
                            ))}
                        </React.Fragment>
                    ))}
                </tbody>
            </table>
        </div>
    );
};

export default RelatorioReservas;