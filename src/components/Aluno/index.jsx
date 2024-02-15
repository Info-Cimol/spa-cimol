import React, { useState, useEffect } from 'react';
import {Autocomplete, TextField, Button, IconButton, Switch, Modal, Fade, Paper } from '@mui/material';
import { Edit as EditIcon, Delete as DeleteIcon } from '@mui/icons-material';
import CloseIcon from '@mui/icons-material/Close';
import Checkbox from '@mui/material/Checkbox';
import FormControlLabel from '@mui/material/FormControlLabel';
import UploadFileIcon from '@mui/icons-material/UploadFile';
import axiosFetch from '../../axios/config';
import AddIcon from '@mui/icons-material/Add';
import { toast } from 'react-toastify';
import ContainerTopo from '../../components/ContainerTopo';
import MenuHamburguer from '../../components/MenuHamburguer';
import CadastroAlunoForm from './formCadastro';
import FileUploader from '../FileUploader/pdfUploaderAluno';
import FichaUploader from '../FileUploader/fichaUploader';
import BackArrow from '../BackArrow/index';
import './alunoCadastro.css';

const CadastroAluno = () => {
  const [alunosDisponiveis, setAlunosDisponiveis] = useState([]);
  const [alunoEditando] = useState(null);
  const [termoPesquisa, setTermoPesquisa] = useState('');
  const [, setIsSearchEmpty] = useState(true);
  const [currentPage, setCurrentPage] = useState(1);
  const [alunosPorPagina] = useState(15);
  const [showConfirmationModal, setShowConfirmationModal] = useState(false);
  const [selectedAlunoId, setSelectedAlunoId] = useState(null);
  const [showEditModal, setShowEditModal] = useState(false);
  const [exibirCadastroAlunoForm, setExibirCadastroAlunoForm] = useState(false);
  const [alunoSelecionado, setAlunoSelecionado] = useState(null);
  const [userRole] = useState(localStorage.getItem('userRole'));
  const [showAttachmentModal, setShowAttachmentModal] = useState(false);
  const [selectedOption, setSelectedOption] = useState(null);

  const handleOptionSelect = (option) => {
    setSelectedOption(option);
  };

  const handleToggleAttachmentModal = () => {
    setShowAttachmentModal(!showAttachmentModal);
    setSelectedOption(null);
  };

  const MAX_CPF_LENGTH = 14;
  const MAX_TELEFONE_LENGTH = 16;

  const formatCPF = (value) => {
    const formattedValue = value.replace(/\D/g, '').replace(/(\d{3})(\d{3})(\d{3})(\d{2})/, '$1.$2.$3-$4');
    return formattedValue.slice(0, MAX_CPF_LENGTH);
  };

  const formatTelefone = (value) => {
    const formattedValue = value.replace(/\D/g, '').replace(/(\d{2})(\d{1})(\d{4})(\d{4})/, '($1) $2 $3-$4');
    return formattedValue.slice(0, MAX_TELEFONE_LENGTH);
  };

  const handleToggleForm = () => {
    setExibirCadastroAlunoForm(!exibirCadastroAlunoForm);
  };

  const [editingAluno, setEditingAluno] = useState({
    id: '',
    nome: '',
    matricula: '',
    email: '',
    cpf: '',
    endereco: '',
    numero: '',
    ativo: 0,
  });  
  
  const handleToggle = () => {
    setEditingAluno((prevEditingAluno) => ({
      ...prevEditingAluno,
      ativo: prevEditingAluno.ativo === 1 ? 0 : 1,
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
    carregarAlunos();
  }, [currentPage]);

  const DetalhesAlunoModal = ({ alunoSelecionado, onClose }) => {
    return (
      <Modal
        open={alunoSelecionado !== null}
        onClose={onClose}
        closeAfterTransition
        className="detahes-aluno-modal"
      >
        <Fade in={alunoSelecionado !== null}>
          <Paper className="detalhes-aluno-paper">
            <div className='header'>
            <h2>Ficha Individual</h2>
            </div>
            <div className="close">
              <IconButton onClick={onClose}>
                <CloseIcon style={{ color: 'cinza' }} />
              </IconButton>
            </div>
            {alunoSelecionado && (
              <div className="detalhes-aluno-grid">
                <div className="detalhes-aluno-column">
                  <div className="detalhes-aluno-info">
                    <strong>Nome:</strong> {alunoSelecionado?.nome}
                  </div>
                  <div className="detalhes-aluno-info">
                    <strong>Matrícula:</strong> {alunoSelecionado?.matricula}
                  </div>
                  <div className="detalhes-aluno-info">
                    <strong>E-mail:</strong> {alunoSelecionado?.email}
                  </div>
                </div>
                <div className="detalhes-aluno-column">
                  <div className="detalhes-aluno-info">
                    <strong>CPF:</strong> {alunoSelecionado?.cpf}
                  </div>
                  <div className="detalhes-aluno-info">
                    <strong>Telefone:</strong> {alunoSelecionado?.numero}
                  </div>
                  <div className="detalhes-aluno-info">
                    <strong>Endereço:</strong> {alunoSelecionado?.endereco}
                  </div>
                  <div className="detalhes-aluno-info">
                    <strong>Situação:</strong>{" "}
                    {alunoSelecionado?.ativo === 1 ? "Ativado" : "Suspenso"}
                  </div>
                </div>
              </div>
            )}
          </Paper>
        </Fade>
      </Modal>
    ); 
  };

  const handleTelefoneChange = (e) => {
    let numero = e.target.value.replace(/\D/g, ''); 
    numero = formatTelefone(numero);
    setEditingAluno((prev) => ({ ...prev, numero }));
  };
  
  const handleCPFChange = (e) => {
    // Formatar CPF enquanto o usuário digita
    let cpf = e.target.value.replace(/\D/g, ''); 
    cpf = formatCPF(cpf);
    setEditingAluno((prev) => ({ ...prev, cpf }));
  };

  const handleMatriculaChange = (e) => {
    const matricula = e.target.value.replace(/\D/g, '');
    setEditingAluno((prev) => ({ ...prev, matricula }));
  };

  const carregarAlunos = async () => {
    try {
      const token = localStorage.getItem('token');
      const headers = {
        'x-access-token': token,
      };

      const response = await axiosFetch.get('/listar/alunos', { headers });
      console.log('Resposta da API:', response.data);
      setAlunosDisponiveis(
        response.data.map((aluno) => ({
          id: aluno.pessoa_id_pessoa,
          nome: aluno.nome_aluno || 'Nome não fornecido',
          email: aluno.email_aluno || 'E-mail não fornecido',
          matricula: aluno.matricula_aluno || 'Matrícula não fornecido',
          cpf: aluno.cpf_aluno || 'CPF não fornecido',
          endereco: aluno.endereco_aluno || 'Endereço não fornecido',
          numero: aluno.numero_telefone || 'Número não informado',
          ativo: aluno.ativo_aluno || "Status de aluno não fornecido",
          editando: false,
        }))
      );
    } catch (error) {
      console.error('Erro ao carregar alunos:', error);
    }
  };

  const handleEditar = (aluno) => {
    setEditingAluno(aluno);
    setShowEditModal(true);
  };

  const handleSalvar = async (alunoId, novoNome, novaMatricula,  novoEmail, novoCpf, novoEndereco, novoNumero, novoAtivo) => {
    try {
      const token = localStorage.getItem('token');
      const headers = {
        'x-access-token': token,
      };

      const requestBody = {
        novoNome,
        novaMatricula,
        novoEmail,
        novoCpf,
        novoEndereco,
        novoAtivo,
        novoNumero,
      };

      await axiosFetch.put(`/altera/aluno/${alunoId}`, requestBody, { headers });

      carregarAlunos();
      toast.success('Aluno editado com sucesso!');
    } catch (error) {
      console.error('Erro ao editar aluno:', error);
      toast.error('Erro ao editar aluno.');
    }
  };

  const handleDesativar = (alunoId) => {
    setSelectedAlunoId(alunoId);
    setShowConfirmationModal(true);
  };

  const handleConfirmDesativar = async () => {
    try {
      const token = localStorage.getItem('token');
      const headers = {
        'x-access-token': token,
      };

      await axiosFetch.put(`/desativa/aluno/${selectedAlunoId}`, null, { headers });

      carregarAlunos();
      toast.success('Aluno desativado com sucesso!');
      setShowConfirmationModal(false);
    } catch (error) {
      console.error('Erro ao desativar aluno:', error);
      toast.error('Erro ao desativar aluno.');
    }
  };

  const handleCancelarDesativar = () => {
    setShowConfirmationModal(false);
  };

  const handleSalvarEdicao = async () => {
    try {
      const valorParaBanco = editingAluno.ativo !== null ? editingAluno.ativo : 0;
  
      await handleSalvar(
        editingAluno.id,
        editingAluno.nome,
        editingAluno.matricula,
        editingAluno.email,
        editingAluno.cpf,
        editingAluno.endereco,
        editingAluno.numero,
        valorParaBanco
      );
      setShowEditModal(false);
    } catch (error) {
      console.error('Erro ao editar aluno:', error);
      toast.error('Erro ao editar aluno.');
    }
  };
  
  const startIndex = (currentPage - 1) * alunosPorPagina;
  const endIndex = startIndex + alunosPorPagina;
  const alunosFiltrados = alunosDisponiveis.filter((aluno) => termoPesquisa ? aluno.nome.toLowerCase().includes(termoPesquisa.toLowerCase()) : true);
  const alunosPaginados = alunosFiltrados.slice(startIndex, endIndex);

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
        options={alunosDisponiveis}
        getOptionLabel={(aluno) => aluno.nome}
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
            label="Pesquisar Aluno"
            variant="outlined"
            fullWidth
          />
        )}
      />
      </div>

  <div className='container-fluid'>
     <div className="botoesAcao">

      <div className="uploaders">
      
        <IconButton onClick={handleToggleForm} title="Formulário de cadastro" component="span">
          <AddIcon  fontSize="large" />
        </IconButton>

        <IconButton onClick={handleToggleAttachmentModal} title="Escolha o tipo de anexo" component="span">
          <UploadFileIcon   fontSize="large" />
        </IconButton>
     
      <Modal
        open={showAttachmentModal}
        onClose={handleToggleAttachmentModal}
        aria-labelledby="attachment-options"
        aria-describedby="choose-attachment-type"
      >
        <div className="attachment-modal"> 
        <div className='anexo'>
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
              label="Ficha única aluno"
            />
            <FormControlLabel
              control={<Checkbox checked={selectedOption === 'Ficha Geral'} onChange={() => handleOptionSelect('Ficha Geral')} />}
              label="Lista Geral alunos"
            />
          </div>
          {selectedOption === 'Ficha Unitária' && <FichaUploader />}
          {selectedOption === 'Ficha Geral' && <FileUploader />}
        </div>
      </Modal>
    </div>

    </div>
        <DetalhesAlunoModal alunoSelecionado={alunoSelecionado} onClose={() => setAlunoSelecionado(null)} />

        <table>
          <thead>
            <tr>
              <th>Nome</th>
              <th>Matrícula</th>
              <th>E-mail</th>
              <th>CPF</th>
              <th>Endereço</th>
              <th>Contato</th>
              <th>Status</th>
              <th>Ações</th>
            </tr>
          </thead>
          <tbody>
          {alunosPaginados
            .filter((aluno) =>
              aluno.nome.toLowerCase().includes(termoPesquisa.toLowerCase())
            )
            .map((aluno) => (
              <tr
                key={aluno.id}
                onClick={() => {
                  if (alunoEditando !== aluno.id) {
                    setAlunoSelecionado(aluno);
                  }
                }}
              >
                  <td>
                    <>
                      {alunoEditando === aluno.id ? (
                        <TextField
                          value={editingAluno.nome}
                          onChange={(e) => setEditingAluno((prev) => ({ ...prev, nome: e.target.value }))}
                        />
                      ) : (
                        aluno.nome
                      )}
                    </>
                  </td>
                  <td>
                    <>
                      {alunoEditando === aluno.id ? (
                        <TextField
                          value={editingAluno.matricula}
                          onChange={(e) => setEditingAluno((prev) => ({ ...prev, matricula: e.target.value }))}
                        />
                      ) : (
                        aluno.matricula
                      )}
                    </>
                  </td>
                  <td>
                  <>
                      {alunoEditando === aluno.id ? (
                        <TextField
                          value={editingAluno.email}
                          onChange={(e) => setEditingAluno((prev) => ({ ...prev, email: e.target.value }))}
                        />
                      ) : (
                        aluno.email
                      )}
                    </>
                  </td>
                  <td>
                  <>
                      {alunoEditando === aluno.id ? (
                        <TextField
                          value={editingAluno.cpf}
                          onChange={(e) => setEditingAluno((prev) => ({ ...prev, cpf: e.target.value }))}
                        />
                      ) : (
                        aluno.cpf
                      )}
                    </>
                    </td>
                     <td>
                     <>
                      {alunoEditando === aluno.id ? (
                        <TextField
                          value={editingAluno.endereco}
                          onChange={(e) => setEditingAluno((prev) => ({ ...prev, endereco: e.target.value }))}
                        />
                      ) : (
                        aluno.endereco
                      )}
                    </>
                    </td>
                    <td>
                    <td>
                      {alunoEditando === aluno.id ? (
                        <>
                          <TextField
                            value={editingAluno.numero}
                            onChange={(e) => setEditingAluno((prev) => ({ ...prev, numero: e.target.value }))}
                          />
                        </>
                      ) : (
                        <>
                           {aluno.numero}
                        </>
                      )}
                    </td>
                    </td>
                    
                    <td>
                    <>
                      {alunoEditando === aluno.id ? (
                        <TextField
                          value={editingAluno.ativo}
                          onChange={(e) => setEditingAluno((prev) => ({ ...prev, ativo: e.target.value }))}
                        />
                      ) : (
                        aluno.ativo === 1 ? "Ativo" : "Suspenso"
                      )}
                    </>
                  </td>

                  <td>
                    {alunoEditando === aluno.id ? (
                      <>
                        <Button onClick={handleSalvarEdicao} variant="contained" color="primary">
                          Salvar
                        </Button>
                        <Button onClick={() => setShowEditModal(false)} variant="contained" color="secondary">
                          Cancelar
                        </Button>
                      </>
                    ) : (
                      <>
                      <IconButton
                        onClick={() => handleEditar(aluno)}
                        color="primary"
                      >
                        <EditIcon />
                      </IconButton>
                      <IconButton
                        onClick={() => handleDesativar(aluno.id)}
                        color="secondary"
                      >
                        <DeleteIcon />
                      </IconButton>
                    </>
                    
                    )}
                  </td>
                  </tr>
                ))}
          </tbody>
        </table>

  {exibirCadastroAlunoForm && 
      <CadastroAlunoForm open={true} onClose={() => setShowEditModal(false)} />    
  }
     <div className="pagination">
      <Button
        disabled={currentPage === 1}
        onClick={() => setCurrentPage(currentPage - 1)}
      >
        Anterior
      </Button>
      <span>{currentPage}</span>
      <Button
        disabled={endIndex >= alunosFiltrados.length}
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

        <Modal open={showEditModal} onClose={() => setShowEditModal(false)}>
        <div className="edicaoPessoa">
          
            <h2>Editar Aluno</h2>  
        
          <div className="close">
              <IconButton onClick={() => setShowEditModal(false)}>
                <CloseIcon style={{ color: 'cinza' }} />
              </IconButton>
            </div>

          <TextField
            id="nome"
            label="Nome"
            variant="outlined"
            value={editingAluno.nome}
            onChange={(e) => setEditingAluno((prev) => ({ ...prev, nome: e.target.value }))}
            style={{marginTop: "15px"}}className="inputField"
          />

            <TextField
              id="matricula"
              label="Matrícula"
              variant="outlined"
              value={editingAluno.matricula}
              onChange={handleMatriculaChange}
              style={{ marginTop: "15px" }}
              className="inputField"
            />

            <TextField
              id="email"
              label="E-mail"
              value={editingAluno.email}
              onChange={(e) => setEditingAluno((prev) => ({ ...prev, email: e.target.value }))}
              style={{ marginTop: "15px" }}
              className="inputField"
            />
            
            <TextField
              id="telefone"
              label="Contato"
              placeholder="(xx) x xxxx-xxxx"
              variant="outlined"
              value={editingAluno.numero}
              onChange={handleTelefoneChange}
              style={{ marginTop: "15px" }}
              className="inputField"
            />

              <TextField
                id="cpf"
                label="CPF"
                variant="outlined"
                value={editingAluno.cpf}
                onChange={handleCPFChange}
                style={{ marginTop: "15px" }}
                className="inputField"
              />

              <TextField
                id="endereco"
                label="Endereço"
                variant="outlined"
                value={editingAluno.endereco}
                onChange={(e) => setEditingAluno((prev) => ({ ...prev, endereco: e.target.value }))}
                style={{ marginTop: "15px" }}
                className="inputField"
              />

              <div>

              <div className="toggleAtivoSuspenso">
              <Switch
                checked={editingAluno.ativo === 1}
                onChange={handleToggle}
                inputProps={{ 'aria-label': 'Toggle suspenso/ativo' }}
              />
              {editingAluno.ativo === 1 ? 'Ativo' : 'Suspenso'}
            </div>

                    <div className="botoesAcao">
                      <Button onClick={handleSalvarEdicao} variant="contained" color="primary">
                        Salvar
                      </Button>
                    </div>
                  </div>
            </div>
      </Modal>
      </div>
    </>
  );
};

export default CadastroAluno;