import React, { useState, useEffect } from 'react';
import axiosFetch from '../../axios/config';
import jsPDF from 'jspdf';
import 'jspdf-autotable';
import { IconButton, Snackbar, Typography } from '@mui/material';
import UploadFileIcon from '@mui/icons-material/UploadFile';
import ContainerTopo from '../../components/ContainerTopo';
import MenuHamburguer from "../../components/MenuHamburguer";
import BackArrow from '../BackArrow/index';
import { Clear as ClearIcon } from '@mui/icons-material';
import { Table, FormControl, TableBody, TableCell, TablePagination, Grid, TableContainer, TableHead, TableRow, Paper, Select, MenuItem, InputLabel } from '@mui/material';
import imagem1 from '../../imagens/Capa_merenda.jpg';

const RelatorioReservas = () => {
    const [relatorio, setRelatorio] = useState([]);
    const [modalOpen, setModalOpen] = useState(false);
    const [, setSelectedCardapio] = useState(null);
    const [selectedTurnos] = useState(['manhã', 'tarde', 'noite']); 
    const [selectedTurno, setSelectedTurno] = useState('');
    const [selectedCurso, setSelectedCurso] = useState('');
    const [selectedDate, setSelectedDate] = useState('');
    const [cursos, setCursos] = useState([]);
    const [dates, setDates] = useState([]);
    const [page, setPage] = useState(0);
    const [rowsPerPage, setRowsPerPage] = useState(15);
    const [userRole] = useState(localStorage.getItem('userRole'));
    const [turnos] = useState(['manhã', 'tarde', 'noite']);
    const [open, setOpen] = React.useState(false);
    const [emptyTable, setEmptyTable] = useState(false);
    const [emptyPDF, setEmptyPDF] = useState(false);
    
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
    
                // Extrair datas únicas do relatório
                const uniqueDates = [...new Set(response.data.map(item => item.data_cardapio))];
                setDates(uniqueDates);

                // Verificar se a tabela está vazia
                if (response.data.length === 0) {
                    setEmptyTable(true);
                } else {
                    setEmptyTable(false);
                }
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

            const cardapiosPorTurno = {};
            relatorioFiltrado.forEach(item => {
                const chave = `${item.nome_cardapio}-${item.turno_reserva}`;
                if (!cardapiosPorTurno[chave]) {
                    cardapiosPorTurno[chave] = [];
                }
                cardapiosPorTurno[chave].push(item);
            });

            Object.entries(cardapiosPorTurno).forEach(([chave, alunos]) => {
                if (!isFirstPage) {
                    doc.addPage();
                }
                isFirstPage = false;

                const [nomeCardapio, turnoReserva] = chave.split('-');

                const imgData = imagem1;
                doc.addImage(imgData, 'JPEG', 10, 10, 180, 60);
                imgDataAdded = true;

                doc.setFontSize(12);
                doc.text(`Data: ${alunos[0].data_cardapio}`, 15, 80);
                doc.text(`Turno: ${turnoReserva}`, 180, 80, null, null, 'right');

                doc.setFontSize(16);
                doc.text(`Cardápio: ${nomeCardapio}`, 105, 100, null, null, 'center');

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
                        cellPadding: 2,
                        fontSize: 12,
                        halign: 'left',
                        valign: 'middle',
                        fillColor: [255, 255, 255],
                        textColor: [0, 0, 0], 
                        lineWidth: 0.1, 
                    },
                    columnStyles: {
                        0: { cellWidth: 80 },
                        1: { cellWidth: 40 },
                        2: { cellWidth: 60 }
                    },
                    startY: 110
                });
            });

            if (!imgDataAdded) {
                const imgData = imagem1;
                doc.addImage(imgData, 'JPEG', 10, 120, 120, 120);
            }
        };

        let relatorioFiltrado = relatorio.filter(item =>
            (selectedTurnos.includes(item.turno_reserva) || selectedTurno === '') &&
            (selectedCurso === '' || item.pessoa.nome_curso === selectedCurso) &&
            (selectedDate === '' || item.data_cardapio === selectedDate)
        );        
    
        if (selectedTurno !== '' || selectedCurso !== '' || selectedDate !== '') { 
            
            if (selectedTurno !== '') {
                relatorioFiltrado = relatorioFiltrado.filter(item => item.turno_reserva === selectedTurno);
            }
            if (relatorioFiltrado.length === 0) {
                setEmptyPDF(true);
            } else {
                setEmptyPDF(false);
                addContent(relatorioFiltrado);
                doc.save('relatorio_reservas.pdf');
            }
        } else { 
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

    const handleDateChange = (event) => {
        setSelectedDate(event.target.value);
    };
    
    const relatorioFiltrado = selectedTurno !== '' || selectedCurso !== '' || selectedDate !== ''
    ? relatorio.filter(item =>
        (selectedTurno === '' || item.turno_reserva === selectedTurno) &&
        (selectedCurso === '' || item.pessoa.nome_curso === selectedCurso) &&
        (selectedDate === '' || item.data_cardapio === selectedDate)
    )
    : relatorio;

    return (
        <>
            <ContainerTopo userType={userRole} />
            <MenuHamburguer userType={userRole} />
            <BackArrow style={{ marginTop: '2000px', marginLeft: '10px' }} />
        
           <div className='container-fluid'>
             <h2  className='titulo-home fade-up' style={{ marginTop: '4rem', marginLeft: '10px' }}>
                Relatório de Reservas
            </h2>

            <div className='container-fluid'>
            <Grid container spacing={2}>
                
                <Grid item xs={12} md={4}>
                    <FormControl fullWidth>
                        <InputLabel id="date-label">Data</InputLabel>
                        <Select
                            labelId="date-label"
                            label="Data"
                            value={selectedDate}
                            onChange={handleDateChange}
                            endAdornment={
                                selectedDate && (
                                    <IconButton onClick={() => setSelectedDate('')}>
                                        <ClearIcon />
                                    </IconButton>
                                )
                            }
                        >
                            {dates.map((date, index) => (
                                <MenuItem key={index} value={date}>{date}</MenuItem>
                            ))}
                        </Select>
                    </FormControl>
                </Grid>

                <Grid item xs={12} md={4}>
                    <FormControl fullWidth>
                        <InputLabel id="turno-label">Turno</InputLabel>
                        <Select
                            labelId="turno-label"
                            label="Turno"
                            value={selectedTurno}
                            onChange={handleTurnoChange}
                            endAdornment={
                                selectedTurno && (
                                    <IconButton onClick={() => setSelectedTurno('')}>
                                        <ClearIcon />
                                    </IconButton>
                                )
                            }
                        >
                            {turnos.map((turno, index) => (
                                <MenuItem key={index} value={turno}>{turno}</MenuItem>
                            ))}
                        </Select>
                    </FormControl>
                </Grid>

                <Grid item xs={12} md={4}>
                    <FormControl fullWidth>
                        <InputLabel id="curso-label">Curso</InputLabel>
                        <Select
                            labelId="curso-label"
                            label="Curso"
                            value={selectedCurso}
                            onChange={handleCursoChange}
                            endAdornment={
                                selectedCurso && (
                                    <IconButton onClick={() => setSelectedCurso('')}>
                                        <ClearIcon />
                                    </IconButton>
                                )
                            }
                        >
                            {cursos.map((curso, index) => (
                                <MenuItem key={index} value={curso}>{curso}</MenuItem>
                            ))}
                        </Select>
                    </FormControl>
                </Grid>

                <Grid item xs={12}>
                    <IconButton onClick={handleClick} style={{ marginTop:'30px', marginLeft: '10px', marginRight: '10px' }} color="primary">
                        <UploadFileIcon fontSize="large"/>
                    </IconButton>
                    <Snackbar
                        anchorOrigin={{
                            vertical: 'bottom',
                            horizontal: 'left',
                        }}
                        open={open}
                        autoHideDuration={2000}
                        onClose={handleClose}
                        message="Relatório gerado com sucesso!"
                    />
                </Grid>
            </Grid>

            </div>

            {emptyTable ? (
                <Typography variant="body1" style={{ marginTop: '20px', marginLeft: '10px' }}>Nenhuma reserva cadastrada</Typography>
            ) : (
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
                            {relatorioFiltrado
                                .slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage)
                                .map((item, index) => (
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
            )}
            
            {emptyPDF && (
                <Typography variant="body1" style={{ marginTop: '20px', marginLeft: '10px' }}>O PDF não pode ser gerado, pois não há reservas</Typography>
            )}

            <TablePagination
                rowsPerPageOptions={[5, 10, 15, 25]}
                component="div"
                count={relatorioFiltrado.length}
                rowsPerPage={rowsPerPage}
                page={page}
                onPageChange={handleChangePage}
                onRowsPerPageChange={handleChangeRowsPerPage}
            />
        </div>

           
        </>
    );
};

export default RelatorioReservas;