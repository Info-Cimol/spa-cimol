import React, { useState, useEffect } from 'react';
import axiosFetch from '../../axios/config';
import jsPDF from 'jspdf';
import 'jspdf-autotable';
import imagem1 from '../../imagens/Capa_merenda.jpg';

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

        const interval = setInterval(fetchRelatorio, 60000);

        fetchRelatorio();

        return () => clearInterval(interval);
    }, []);

    const gerarPDF = () => {
        const doc = new jsPDF();
    
        const addContent = () => {
            let isFirstPage = true;
            let imgDataAdded = false;
    
            // Ordenar o relatório pela data do cardápio
            relatorio.sort((a, b) => {
                const dateA = new Date(a.data_cardapio);
                const dateB = new Date(b.data_cardapio);
                return dateA - dateB;
            });
    
            // Mapeia os dados agrupados por cardápio e turno
            const cardapiosPorTurno = {};
            relatorio.forEach(item => {
                const chave = `${item.nome_cardapio}-${item.turno_reserva}`;
                if (!cardapiosPorTurno[chave]) {
                    cardapiosPorTurno[chave] = [];
                }
                cardapiosPorTurno[chave].push(item);
            });
    
            // Loop sobre cada cardápio e turno
            Object.entries(cardapiosPorTurno).forEach(([chave, alunos]) => {
                // Verifica se o cardápio mudou
                if (!isFirstPage) {
                    doc.addPage(); // Adiciona uma nova página entre os cardápios
                }
                isFirstPage = false;
    
                // Separar o nome do cardápio e o turno
                const [nomeCardapio, turnoReserva] = chave.split('-');
    
                // Adiciona a imagem como cabeçalho em todas as páginas
                const imgData = imagem1;
                doc.addImage(imgData, 'JPEG', 10, 10, 180, 100);
                imgDataAdded = true;
    
                // Adiciona a data e o turno no canto superior esquerdo e direito
                doc.setFontSize(12);
                doc.text(`Data: ${alunos[0].data_cardapio}`, 15, 130);
                doc.text(`Turno: ${turnoReserva}`, 180, 130, null, null, 'right');
    
                doc.setFontSize(16);
                doc.text(`Cardápio: ${nomeCardapio}`, 105, 140, null, null, 'center');
    
                // Mapeia os dados dos alunos para a tabela
                const data = alunos.map(aluno => [
                    aluno.pessoa.nome_pessoa || '', // Corrigido para acessar diretamente aluno.pessoa
                    aluno.pessoa.matricula_aluno || '', // Corrigido para acessar diretamente aluno.pessoa
                    aluno.pessoa.nome_curso || '' // Corrigido para acessar diretamente aluno.pessoa
                ]);
    
                // Adiciona a tabela de reservas
                doc.autoTable({
                    head: [['Nome do Aluno', 'Matrícula', 'Curso']],
                    body: data,
                    theme: 'grid',
                    styles: {
                        cellPadding: 1,
                        fontSize: 10,
                        halign: 'left',
                        valign: 'middle'
                    },
                    columnStyles: {
                        0: { cellWidth: 80 }, // Ajuste a largura para o nome do aluno
                        1: { cellWidth: 30 }, // Ajuste a largura para a matrícula
                        2: { cellWidth: 60 }  // Ajuste a largura para o curso
                    },
                    startY: 150 // Define a posição inicial da tabela
                });
            });
    
            // Caso a imagem não tenha sido adicionada na primeira página, adicione-a agora
            if (!imgDataAdded) {
                const imgData = imagem1;
                doc.addImage(imgData, 'JPEG', 10, 10, 180, 120);
            }
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
                        <th style={{ borderRight: '1px solid black', borderBottom: '1px solid black' }}>Nome do Cardápio</th>
                        <th style={{ borderRight: '1px solid black', borderBottom: '1px solid black' }}>Data do Cardápio</th>
                        <th style={{ borderRight: '1px solid black', borderBottom: '1px solid black' }}>Turno da Reserva</th>
                        <th>Alunos</th>
                    </tr>
                </thead>
                <tbody>
                {relatorio.map((item, index) => (
                    <React.Fragment key={index}>
                        <tr>
                            <td>{item.nome_cardapio}</td>
                            <td>{item.data_cardapio}</td>
                            <td>{item.turno_reserva}</td>
                            <td>
                                {item.pessoa.nome_pessoa && (
                                    <div style={{ borderRight: '1px solid black', borderBottom: '1px solid black', padding: '5px' }}>{item.pessoa.nome_pessoa}</div>
                                )}
                                {item.pessoa.matricula_aluno && (
                                    <div style={{ borderRight: '1px solid black', borderBottom: '1px solid black', padding: '5px' }}>{item.pessoa.matricula_aluno}</div>
                                )}
                                {item.pessoa.nome_curso && (
                                    <div style={{ borderBottom: '1px solid black', padding: '5px' }}>{item.pessoa.nome_curso}</div>
                                )}
                            </td>
                        </tr>
                    </React.Fragment>
                ))}
                </tbody>
            </table>
        </div>
    );
};

export default RelatorioReservas;