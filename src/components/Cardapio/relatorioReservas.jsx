import React, { useState, useEffect } from 'react';
import axiosFetch from '../../axios/config';
import jsPDF from 'jspdf';
import 'jspdf-autotable';
import { IconButton, Snackbar } from '@mui/material';
import { SaveAlt as SaveAltIcon } from '@mui/icons-material';
import ContainerTopo from '../../components/ContainerTopo';
import MenuHamburguer from "../../components/MenuHamburguer";
import BackArrow from '../BackArrow/index';
import { Table, TableBody, TableCell, TablePagination, Grid, TableContainer, TableHead, TableRow, Paper, Select, MenuItem, InputLabel } from '@mui/material';
import imagem1 from '../../imagens/Capa_merenda.jpg';

const RelatorioReservas = () => {
    const [relatorio, setRelatorio] = useState([]);
    const [modalOpen, setModalOpen] = useState(false);
    const [, setSelectedCardapio] = useState(null);
    const [selectedTurnos] = useState(['manhã', 'tarde', 'noite']); 
    const [selectedTurno, setSelectedTurno] = useState('');
    const [selectedCurso, setSelectedCurso] = useState('');
    const [cursos, setCursos] = useState([]);
    const [page, setPage] = useState(0);
    const [rowsPerPage, setRowsPerPage] = useState(5);
    const [userRole] = useState(localStorage.getItem('userRole'));
    const [turnos] = useState(['manhã', 'tarde', 'noite']);
    const [open, setOpen] = React.useState(false);
    
    const handleChangePage = (event, newPage) => {
        setPage(newPage);
    };
    
    const handleChangeRowsPerPage = (event) => {
        setRowsPerPage(parseInt(event.target.value, 10));
        setPage(0);
    };

    useEffect(() => {
        const fetchRelatorio = async () => {
            try {
                const response = await axiosFetch.get('/relatorio/reservas');
                setRelatorio(response.data);
                // Extrair cursos únicos do relatório
                const uniqueCursos = [...new Set(response.data.map(item => item.pessoa.nome_curso))];
                setCursos(uniqueCursos);
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
    
        const addContent = (relatorioFiltrado) => {
            let isFirstPage = true;
            let imgDataAdded = false;
    
            // Agrupar relatórios por nome do cardápio e turno
            const cardapiosPorTurno = {};
            relatorioFiltrado.forEach(item => {
                const chave = `${item.nome_cardapio}-${item.turno_reserva}`;
                if (!cardapiosPorTurno[chave]) {
                    cardapiosPorTurno[chave] = [];
                }
                cardapiosPorTurno[chave].push(item);
            });
    
            // Iterar sobre os relatórios agrupados
            Object.entries(cardapiosPorTurno).forEach(([chave, alunos]) => {
    
                if (!isFirstPage) {
                    doc.addPage();
                }
                isFirstPage = false;
    
                const [nomeCardapio, turnoReserva] = chave.split('-');
    
                const imgData = imagem1;
                doc.addImage(imgData, 'JPEG', 10, 10, 180, 100);
                imgDataAdded = true;
    
                doc.setFontSize(12);
                doc.text(`Data: ${alunos[0].data_cardapio}`, 15, 130);
                doc.text(`Turno: ${turnoReserva}`, 180, 130, null, null, 'right');
    
                doc.setFontSize(16);
                doc.text(`Cardápio: ${nomeCardapio}`, 105, 140, null, null, 'center');
    
                const data = alunos.map(aluno => [
                    aluno.pessoa.nome_pessoa || '',
                    aluno.pessoa.matricula_aluno || '',
                    aluno.pessoa.nome_curso || ''
                ]);
    
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
                        0: { cellWidth: 80 },
                        1: { cellWidth: 30 },
                        2: { cellWidth: 60 }
                    },
                    startY: 150
                });
            });
    
            if (!imgDataAdded) {
                const imgData = imagem1;
                doc.addImage(imgData, 'JPEG', 10, 10, 180, 120);
            }
        };
    
        const relatorioFiltrado = relatorio.filter(item =>
            (selectedTurnos.includes(item.turno_reserva) || selectedTurno === '') &&
            (selectedCurso === '' || item.pessoa.nome_curso === selectedCurso)
        );        
    
        if (selectedTurno !== '' || selectedCurso !== '') { // Verifica se algum filtro foi aplicado
            if (selectedTurno !== '') {
                const relatorioFiltradoPorTurno = relatorioFiltrado.filter(item =>
                    item.turno_reserva === selectedTurno
                );
                addContent(relatorioFiltradoPorTurno);
            } else {
                addContent(relatorioFiltrado);
            }
            doc.save('relatorio_reservas.pdf');
        } else { // Se nenhum filtro foi aplicado, gere o relatório completo
            addContent(relatorio);
            doc.save('relatorio_reservas_completo.pdf');
        }
    };
    

const handleClick = () => {
    gerarPDF();
    setOpen(true);
};

const handleClose = (event, reason) => {
    if (reason === 'clickaway') {
        return;
    }
    setOpen(false);
};

    const toggleModal = (cardapio) => {
        setSelectedCardapio(cardapio);
        setModalOpen(!modalOpen);
    };

    const handleTurnoChange = (event) => {
        setSelectedTurno(event.target.value); 
    };

    const handleCursoChange = (event) => {
        setSelectedCurso(event.target.value);
    };
    
    const relatorioFiltrado = selectedTurno !== '' || selectedCurso !== '' 
    ? relatorio.filter(item =>
        (selectedTurno === '' || item.turno_reserva === selectedTurno) &&
        (selectedCurso === '' || item.pessoa.nome_curso === selectedCurso)
    )
    : relatorio;

    return (
        <>
         <ContainerTopo userType={userRole} />
        <MenuHamburguer userType={userRole} />
        <BackArrow style={{ marginTop: '2000px', marginLeft: '10px' }} />
        
            <h2  style={{ marginTop: '3rem', marginLeft: '10px' }}>Relatório de Reservas</h2>

            <div>
                <Grid container spacing={2}>
                <Grid item xs={4} style={{ marginLeft: '10px' }}>
                    <InputLabel id="turno-label">Turno</InputLabel>
                    <Select
                        labelId="turno-label"
                        value={selectedTurno}
                        onChange={handleTurnoChange}
                        fullWidth
                    >
                        <MenuItem value="">Selecione o turno</MenuItem>
                        {turnos.map((turno, index) => (
                            <MenuItem key={index} value={turno}>{turno}</MenuItem>
                        ))}
                    </Select>
                </Grid>

                    <Grid item xs={4}>
                    <InputLabel id="curso-label">Curso</InputLabel>
                        <Select
                            labelId="curso-label"
                            value={selectedCurso}
                            onChange={handleCursoChange}
                            fullWidth
                        >
                            <MenuItem value="">Selecione o curso</MenuItem>
                            {cursos.map((curso, index) => (
                                <MenuItem key={index} value={curso}>{curso}</MenuItem>
                            ))}
                        </Select>
                    </Grid>
                    <Grid item xs={2}>
                    <IconButton onClick={handleClick} style={{marginTop:'30px'}} color="primary">
                        <SaveAltIcon />
                    </IconButton>
                    <Snackbar
                        anchorOrigin={{
                            vertical: 'bottom',
                            horizontal: 'left',
                        }}
                        open={open}
                        autoHideDuration={6000}
                        onClose={handleClose}
                        message="Relatório gerado com sucesso!"
                    />
                    </Grid>
                </Grid>
            </div>

            <TableContainer component={Paper}>
                <Table>
                    <TableHead>
                        <TableRow>
                            <TableCell>Cardápio</TableCell>
                            <TableCell>Data</TableCell>
                            <TableCell>Turno</TableCell>
                            <TableCell>Alunos</TableCell>
                            <TableCell>Matrícula</TableCell>
                            <TableCell>Curso</TableCell>
                        </TableRow>
                    </TableHead>
                    <TableBody>
                        {relatorioFiltrado.map((item, index) => (
                            <TableRow key={index} onClick={() => toggleModal(item.nome_cardapio)}>
                                <TableCell>{item.nome_cardapio}</TableCell>
                                <TableCell>{item.data_cardapio}</TableCell>
                                <TableCell>{item.turno_reserva}</TableCell>
                                <TableCell>
                                    {item.pessoa.nome_pessoa && (
                                        <div>{item.pessoa.nome_pessoa}</div>
                                    )}
                                </TableCell>

                                <TableCell>
                                    {item.pessoa.matricula_aluno && (
                                        <div>{item.pessoa.matricula_aluno}</div>
                                    )}
                                </TableCell>

                                <TableCell>
                                    {item.pessoa.nome_curso && (
                                        <div>{item.pessoa.nome_curso}</div>
                                    )}
                                </TableCell>
                            </TableRow>
                        ))}
                    </TableBody>
                </Table>
            </TableContainer>
            
            <TablePagination
                rowsPerPageOptions={[5, 10, 25]}
                component="div"
                count={relatorioFiltrado.length}
                rowsPerPage={rowsPerPage}
                page={page}
                onPageChange={handleChangePage}
                onRowsPerPageChange={handleChangeRowsPerPage}
            />
        </>
    );
};

export default RelatorioReservas;