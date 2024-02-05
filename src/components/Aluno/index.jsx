import React, { useState, useEffect } from 'react';
import { Autocomplete, TextField, Button, IconButton, FormControl, InputLabel, Select, MenuItem } from '@mui/material';
import { toast } from 'react-toastify';
import ContainerTopo from '../../components/ContainerTopo';
import MenuHamburguer from "../../components/MenuHamburguer";
import { Edit as EditIcon, ArrowBack as ArrowBackIcon, Delete as DeleteIcon } from '@mui/icons-material';
import CadastroAlunoForm from './formCadastro';
import Modal from '@mui/material/Modal';
import AddIcon from '@mui/icons-material/Add';
import axiosFetch from '../../axios/config';
import './alunoCadastro.css';

const CadastroAluno = () => {
  const [alunosDisponiveis, setAlunosDisponiveis] = useState([]);
  const [alunoEditando] = useState(null);
  const [termoPesquisa, setTermoPesquisa] = useState('');
  const [currentPage, setCurrentPage] = useState(1);
  const [alunosPorPagina] = useState(15);
  const [showConfirmationModal, setShowConfirmationModal] = useState(false);
  const [selectedAlunoId, setSelectedAlunoId] = useState(null);
  const [showEditModal, setShowEditModal] = useState(false);
  const [exibirCadastroAlunoForm, setExibirCadastroAlunoForm] = useState(false);
  const [userRole] = useState(localStorage.getItem('userRole'));

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
    telefone: '',
    dd: '',    
    ativo: '',
  });

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


  const handleTelefoneChange = (e) => {
    let telefone = e.target.value.replace(/\D/g, ''); 
    telefone = formatTelefone(telefone);
    let dd = e.target.value.replace(/\D/g, ''); 
    dd = formatTelefone(telefone);
    setEditingAluno((prev) => ({ ...prev, telefone, dd }));
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
          dd: aluno.dd_telefone || 'DD não fornecido',
          telefone: aluno.numero_telefone || 'Número não informado',
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
        novoNumero,
        novoAtivo,
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
      await handleSalvar(
        editingAluno.id,
        editingAluno.nome,
        editingAluno.matricula,
        editingAluno.email,
        editingAluno.cpf,
        editingAluno.endereco,
        editingAluno.dd,
        editingAluno.telefone,
      );
      setShowEditModal(false);
    } catch (error) {
      console.error('Erro ao editar aluno:', error);
      toast.error('Erro ao editar aluno.');
    }
  };
  
  const indexOfLastAluno = currentPage * alunosPorPagina;
  const indexOfFirstAluno = indexOfLastAluno - alunosPorPagina;
  const alunosPaginados = alunosDisponiveis.slice(indexOfFirstAluno, indexOfLastAluno);

  return (
    <>
    <div>
    <ContainerTopo userType={userRole} />
    <MenuHamburguer userType={userRole} />
    </div>
      <div className="container-fluid">
      <IconButton style={{ marginTop: '50px', marginLeft: '10px' }}><ArrowBackIcon /></IconButton>

      <Autocomplete
      style={{ marginTop: '30px' }}
      options={alunosDisponiveis}
      getOptionLabel={(aluno) => aluno.nome}
      renderInput={(params) => (
        <TextField
          {...params}
          label="Pesquisar Aluno"
          variant="outlined"
          fullWidth
          onChange={(e) => {
            setTermoPesquisa(e.target.value);
          }}
        />
      )}
    />
      </div>

      <div className='container-fluid'>
  
        <IconButton  title='Adicione um arquivo' component="span">
          <AddIcon onClick={handleToggleForm} fontSize="large" />
        </IconButton>
    
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
              <tr key={aluno.id}>
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
                            value={editingAluno.dd}
                            onChange={(e) => setEditingAluno((prev) => ({ ...prev, dd: e.target.value }))}
                            style={{ width: '40px' }}
                          />
                          {' '}
                          <TextField
                            value={editingAluno.telefone}
                            onChange={(e) => setEditingAluno((prev) => ({ ...prev, telefone: e.target.value }))}
                          />
                        </>
                      ) : (
                        <>
                          ({aluno.dd}) {aluno.telefone}
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
                        <IconButton onClick={() => handleEditar(aluno)} color="primary">
                          <EditIcon />
                        </IconButton>
                        <IconButton onClick={() => handleDesativar(aluno.id)} color="secondary">
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
            disabled={indexOfLastAluno >= alunosDisponiveis.length}
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
          <div className="header">
            <h2>Editando Aluno</h2>
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
              value={ editingAluno.dd && editingAluno.telefone}
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

              <FormControl fullWidth variant="outlined" style={{ marginTop: "15px" }}>
                <InputLabel id="status-label">Status</InputLabel>
                <Select
                  label="Status"
                  value={editingAluno.ativo ? 'ativo' : 'suspenso'}
                  onChange={(e) => setEditingAluno((prev) => ({ ...prev, ativo: e.target.value === 'ativo' ? true : false }))}
                >
                  <MenuItem value="ativo">Ativo</MenuItem>
                  <MenuItem value="suspenso">Suspenso</MenuItem>
                </Select>
              </FormControl>

              <div className="botoesAcao">
                <Button onClick={handleSalvarEdicao} variant="contained" color="primary">
                  Salvar
                </Button>
                <Button onClick={() => setShowEditModal(false)} variant="contained" color="secondary">
                  Cancelar
                </Button>
              </div>
            </div>
      </Modal>
      </div>
    </>
  );
};

export default CadastroAluno;