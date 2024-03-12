import React, { useState, useEffect } from 'react';
import {Autocomplete, TextField, Button, IconButton, Switch, Modal, Table, TableBody, TableCell, TableContainer, TableHead, TableRow} from '@mui/material';
import CloseIcon from '@mui/icons-material/Close';
import Checkbox from '@mui/material/Checkbox';
import FormControlLabel from '@mui/material/FormControlLabel';
import UploadFileIcon from '@mui/icons-material/UploadFile';
import axiosFetch from '../../axios/config';
import AddIcon from '@mui/icons-material/Add';
import { Edit as EditIcon, Delete as DeleteIcon } from '@mui/icons-material';
import { toast } from 'react-toastify';
import ContainerTopo from '../../components/ContainerTopo';
import MenuHamburguer from '../../components/MenuHamburguer';
import BackArrow from '../BackArrow/index';
import '../../components/Aluno/alunoCadastro.css';

const CadastroProfessor = () => {
  const [professoresDisponiveis, setProfessoresDisponiveis] = useState([]);
  const [professorEditando] = useState(null);
  const [termoPesquisa, setTermoPesquisa] = useState('');
  const [, setIsSearchEmpty] = useState(true);
  const [currentPage, setCurrentPage] = useState(1);
  const [professorPorPagina] = useState(15);
  const [showConfirmationModal, setShowConfirmationModal] = useState(false);
  const [selectedProfessorId] = useState(null);
  const [exibirCadastroProfessorForm, setExibirCadastroProfessorForm] = useState(false);
  const [, setProfessorSelecionado] = useState(null);
  const [userRole] = useState(localStorage.getItem('userRole'));
  const [showAttachmentModal, setShowAttachmentModal] = useState(false);
  const [selectedOption, setSelectedOption] = useState(null);
  const [firstLoadComplete, setFirstLoadComplete] = useState(false);
  const [fetchData, setFetchData] = useState(true); 
  
  useEffect(() => {
    const carregarProfessores = async () => {
      try {
        const response = await axiosFetch.get('/listar/orientador');
        console.log('Resposta da API:', response.data);
        
        const professoresOrdenados = response.data
          .map((professor) => ({
            id: professor.pessoa_id_pessoa,
            nome: professor.nome_professor || 'Nome não fornecido',
            email: professor.email_professor || 'E-mail não fornecido',
            cpf: professor.cpf_professor || 'CPF não fornecido',
            endereco: professor.endereco_professor || 'Endereço não fornecido',
            observacao: professor.observacao_professor || 'Observação não fornecida',
            ativo: professor.ativo_professor || 'Status de professor não fornecido',
            numero_telefone: professor.numero_telefone || 'Número de telefone não fornecido',
            editando: false,
          }))        
          .sort((a, b) => a.nome.localeCompare(b.nome)); 
        
        setProfessoresDisponiveis(professoresOrdenados);
  
        if (!firstLoadComplete) {
          setFirstLoadComplete(true);
        }
      } catch (error) {
        console.error('Erro ao carregar professores:', error);
      }
    };
  
    if (fetchData) {
      carregarProfessores();
      setFetchData(false);
    }
  
    const interval = setInterval(() => {
      if (firstLoadComplete) {
        carregarProfessores();
      }
    }, 60000); 
    
    return () => clearInterval(interval);
  }, [fetchData, firstLoadComplete]);
  
  const handleOptionSelect = (option) => {
    setSelectedOption(option);
  };

  const handleToggleAttachmentModal = () => {
    setShowAttachmentModal(!showAttachmentModal);
    setSelectedOption(null);
  };

  const handleToggleForm = () => {
    setExibirCadastroProfessorForm(!exibirCadastroProfessorForm);
  };

  const [editingProfessor, setEditingProfessor] = useState({
    id: '',
    nome: '',
    email: '',
    cpf: '',
    endereco: '',
    numero: '',
    ativo: 0,
  });  
  
  const handleToggle = () => {
    setEditingProfessor((prevEditingProfessor) => ({
      ...prevEditingProfessor,
      ativo: prevEditingProfessor.ativo === 1 ? 0 : 1,
    }));
  };
  
  useEffect(() => {
    const handleResize = () => {};

    window.addEventListener('resize', handleResize);
    handleResize();

    return () => {
      window.removeEventListener('resize', handleResize);
    };
  }, []);

  useEffect(() => {
    carregarProfessores();
  });

  const carregarProfessores = async () => {
    try {
      const response = await axiosFetch.get('/professor');
      console.log('Resposta da API:', response.data);
      
      const professoresOrdenados = response.data
        .map((professor) => ({
          id: professor.pessoa_id_pessoa,
          nome: professor.nome_professor || 'Nome não fornecido',
          email: professor.email_professor || 'E-mail não fornecido',
          cpf: professor.cpf_professor || 'CPF não fornecido',
          endereco: professor.endereco_professor || 'Endereço não fornecido',
          observacao: professor.observacao_professor || 'Observação não fornecida',
          ativo: professor.ativo_professor || 'Status de professor não fornecido',
          numero_telefone: professor.numero_telefone || 'Número de telefone não fornecido',
          editando: false,
        }))
        .sort((a, b) => a.nome.localeCompare(b.nome)); 
      
      setProfessoresDisponiveis(professoresOrdenados);

      if (!firstLoadComplete) {
        setFirstLoadComplete(true);
      }
    } catch (error) {
      console.error('Erro ao carregar professores:', error);
    }
  };

  const handleCancelarDesativar = () => {
    setShowConfirmationModal(false);
  };

  const handleConfirmDesativar = async () => {
    try {
      await axiosFetch.put(`/desativa/aluno/${selectedProfessorId}`);
  
      carregarProfessores();
  
      toast.success('Professor desativado com sucesso!');
      setShowConfirmationModal(false);
    } catch (error) {
      console.error('Erro ao desativar professor:', error);
      toast.error('Erro ao desativar professor.');
    }
  };

  const startIndex = (currentPage - 1) * professorPorPagina;
  const endIndex = startIndex + professorPorPagina;

  const professoresFiltrados = professoresDisponiveis
  .filter((professor) => termoPesquisa ? professor.nome.toLowerCase().includes(termoPesquisa.toLowerCase()) : true)
  .sort((a, b) => a.nome.localeCompare(b.nome));

  const professoresPaginados = professoresFiltrados.slice(startIndex, endIndex);

return (
  <>
  <div>
      <ContainerTopo userType={userRole} />
      <MenuHamburguer userType={userRole} />
      </div>
        <div className="container-fluid">
          
        <BackArrow style={{ marginTop: '200px', marginLeft: '10px' }}/>
        <IconButton style={{ marginTop: '50px', marginLeft: '10px' }}></IconButton>

        <Autocomplete
          style={{ marginTop: '30px' }}
          options={professoresDisponiveis}
          getOptionLabel={(professor) => professor.nome}
          inputValue={termoPesquisa} 
          onInputChange={(event, newValue) => {
            setTermoPesquisa(newValue);
          }}
          onChange={(event, newValue) => {
            if (!newValue) {
              setIsSearchEmpty(true); 
            }
          }}
          renderInput={(params) => (
            <TextField
              {...params}
              label="Pesquisar Professor"
              variant="outlined"
              fullWidth
            />
          )}
        />
        </div>

        <div className='container-fluid'>
          <div className="botoesAcao">

          <div className="uploaders">
            <IconButton onClick={handleToggleForm} title="Formulário de cadastro Professor" component="span">
              <AddIcon fontSize="large" />
            </IconButton>

            <IconButton onClick={handleToggleAttachmentModal} title="Escolha o tipo de anexo" component="span">
              <UploadFileIcon fontSize="large" />
            </IconButton>

            <Modal
              open={showAttachmentModal}
              onClose={handleToggleAttachmentModal}
              aria-labelledby="attachment-options"
              aria-describedby="choose-attachment-type"
            >
              <div className="attachment-modal">
                <div className="anexo">
                  <h2>Selecione um Anexo</h2>
                  <div className="close-icon">
                    <IconButton onClick={handleToggleAttachmentModal}>
                      <CloseIcon style={{ color: 'cinza' }} />
                    </IconButton>
                  </div>
                </div>
                <div className="options">
                  <FormControlLabel
                    control={<Checkbox checked={selectedOption === 'Ficha Unitária'} onChange={() => handleOptionSelect('Ficha Unitária')} />}
                    label="Ficha única professor"
                  />
                    <FormControlLabel
                      control={<Checkbox checked={selectedOption === 'Ficha Geral'} onChange={() => handleOptionSelect('Ficha Geral')} />}
                      label="Lista Geral alunos"
                    />
                  </div>
                </div>
              </Modal>
            </div>
          </div>

        <TableContainer>
          <Table>
            <TableHead>
              <TableRow>
                <TableCell>Nome</TableCell>
                <TableCell>E-mail</TableCell>
                <TableCell>CPF</TableCell>
                <TableCell>Endereço</TableCell>
                <TableCell>Contato</TableCell>
                <TableCell>Status</TableCell>
                <TableCell>Ações</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
            {professoresPaginados.map((professor) => (
              <TableRow
                key={professor.id}
                onClick={() => {
                  if (professorEditando !== professor.id) {
                    setProfessorSelecionado(professor);
                  }
                }}
              >
                <TableCell>
                  <>
                    {professorEditando === professor.id ? (
                      <TextField
                        value={editingProfessor.nome}
                        onChange={(e) => setEditingProfessor((prev) => ({ ...prev, nome: e.target.value }))}
                      />
                    ) : (
                      professor.nome
                    )}
                  </>
                </TableCell>
                <TableCell>
                  <>
                    {professorEditando === professor.id ? (
                      <TextField
                        value={editingProfessor.email}
                        onChange={(e) => setEditingProfessor((prev) => ({ ...prev, email: e.target.value }))}
                      />
                    ) : (
                      professor.email
                    )}
                  </>
                </TableCell>
                <TableCell>
                  <>
                    {professorEditando === professor.id ? (
                      <TextField
                        value={editingProfessor.cpf}
                        onChange={(e) => setEditingProfessor((prev) => ({ ...prev, cpf: e.target.value }))}
                      />
                    ) : (
                      professor.cpf
                    )}
                  </>
                </TableCell>
                <TableCell>
                  <>
                    {professorEditando === professor.id ? (
                      <TextField
                        value={editingProfessor.endereco}
                        onChange={(e) => setEditingProfessor((prev) => ({ ...prev, endereco: e.target.value }))}
                      />
                    ) : (
                      professor.endereco
                    )}
                  </>
                </TableCell>
                <TableCell>
                  <>
                    {professorEditando === professor.id ? (
                      <TextField
                        value={editingProfessor.numero}
                        onChange={(e) => setEditingProfessor((prev) => ({ ...prev, numero: e.target.value }))}
                      />
                    ) : (
                      professor.numero
                    )}
                  </>
                </TableCell>
                <TableCell>
                  <>
                    {professorEditando === professor.id ? (
                      <Switch
                        checked={editingProfessor.ativo === 1}
                        onChange={handleToggle}
                        inputProps={{ 'aria-label': 'Toggle suspenso/ativo' }}
                      />
                    ) : (
                      professor.ativo === 1 ? 'Ativo' : 'Suspenso'
                    )}
                  </>
                </TableCell>
                <TableCell>
                    {professorEditando === professor.id ? (
                      <>
                        <Button  variant="contained" color="primary">
                          Salvar
                        </Button>
                        <Button variant="contained" color="secondary">
                          Cancelar
                        </Button>
                      </>
                    ) : (
                      <>
                        <IconButton
                     
                          color="primary"
                        >
                          <EditIcon />
                        </IconButton>
                        <IconButton
                    
                          color="secondary"
                        >
                          <DeleteIcon />
                        </IconButton>
                      </>
                    )}
                  </TableCell>
                  </TableRow>
                ))}
              </TableBody>
               </Table>
          </TableContainer>

          <div className="pagination">
            <Button
              disabled={currentPage === 1}
              onClick={() => setCurrentPage(currentPage - 1)}
            >
              Anterior
            </Button>
            <span>{currentPage}</span>
            <Button
              disabled={endIndex >= professoresFiltrados.length}
              onClick={() => setCurrentPage(currentPage + 1)}
            >
              Próxima
            </Button>
          </div>

        <Modal open={showConfirmationModal} onClose={handleCancelarDesativar}>
            <div style={{ padding: '16px', background: '#fff', width: '400px', margin: '50px auto' }}>
              <p>Tem certeza de que deseja desativar esse aluno?</p>
              <Button onClick={handleConfirmDesativar} variant="contained" color="primary" style={{ marginRight: '8px' }}>
                Confirmar
              </Button>
              <Button onClick={handleCancelarDesativar} variant="contained" color="secondary">
                Cancelar
              </Button>
            </div>
        </Modal>
      </div>
    </>
  );
};

export default CadastroProfessor;