import React, { useState, useEffect } from 'react';
import Autocomplete from '@mui/material/Autocomplete';
import TextField from '@mui/material/TextField';
import Button from '@mui/material/Button';
import IconButton from '@mui/material/IconButton';
import EditIcon from '@mui/icons-material/Edit';
import DeleteIcon from '@mui/icons-material/Delete';
import { toast } from 'react-toastify';
import ArquivoUpload from '../FileUploader/pdfUploaderAluno';
import Modal from '@mui/material/Modal';
import 'react-toastify/dist/ReactToastify.css';
import axiosFetch from '../../axios/config';
import './alunoCadastro.css';

const CadastroAluno = () => {
  const [alunosDisponiveis, setAlunosDisponiveis] = useState([]);
  const [termoPesquisa, setTermoPesquisa] = useState('');
  const [alunoEditando] = useState(null);
  const [currentPage, setCurrentPage] = useState(1);
  const [alunosPorPagina] = useState(15);
  const [showConfirmationModal, setShowConfirmationModal] = useState(false);
  const [selectedAlunoId, setSelectedAlunoId] = useState(null);
  const [showEditModal, setShowEditModal] = useState(false);
  const [editingAluno, setEditingAluno] = useState({
    id: '',
    nome: '',
    matricula: '',
  });

  useEffect(() => {
    const handleResize = () => {
    };

    window.addEventListener('resize', handleResize);
    handleResize();

    return () => {
      window.removeEventListener('resize', handleResize);
    };
  }, []);

  useEffect(() => {
    carregarAlunos();
  }, [currentPage]);

  const formatarTelefone = (telefone) => {
    // Formatar telefone para (xx) x xxxx-xxxx
    const regexTelefone = /^(\d{2})(\d{1})(\d{4})(\d{4})$/;
    const telefoneFormatado = telefone.replace(regexTelefone, '($1) $2 $3-$4').slice(0,16);
    return telefoneFormatado;
  };

  const formatarCPF = (cpf) => {
    // Formatar CPF para xxx.xxx.xxx-xx
    const regexCPF = /^(\d{3})(\d{3})(\d{3})(\d{2})$/;
    const cpfFormatado = cpf.replace(regexCPF, '$1.$2.$3-$4').slice(0,14);
    return cpfFormatado;
  };

  const handleTelefoneChange = (e) => {
    // Formatar telefone enquanto o usuário digita
    let telefone = e.target.value.replace(/\D/g, ''); 
    telefone = formatarTelefone(telefone);
    setEditingAluno((prev) => ({ ...prev, telefone }));
  };

  const handleCPFChange = (e) => {
    // Formatar CPF enquanto o usuário digita
    let cpf = e.target.value.replace(/\D/g, ''); 
    cpf = formatarCPF(cpf);
    setEditingAluno((prev) => ({ ...prev, cpf }));
  };

  const handleMatriculaChange = (e) => {
    // Aceitar apenas números na matrícula
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

      setAlunosDisponiveis(
        response.data.map((aluno) => ({
          id: aluno.pessoa_id_pessoa,
          nome: aluno.nome_aluno,
          matricula: aluno.matricula_aluno,
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

  const handleSalvar = async (alunoId, novoNome, novaMatricula) => {
    try {
      const token = localStorage.getItem('token');
      const headers = {
        'x-access-token': token,
        'Content-Type': 'application/json',
      };

      const requestBody = {
        novoNome,
        novaMatricula,
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
      await handleSalvar(editingAluno.id, editingAluno.nome, editingAluno.matricula);
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
      <div className="container-fluid">
        <Autocomplete
          id='pesquisa'
          options={alunosDisponiveis}
          getOptionLabel={(aluno) => aluno.nome}
          renderInput={(params) => (
            <TextField
              id='pesquisa-text'
              {...params}
              label="Pesquisar Aluno"
              variant="outlined"
              onChange={(e) => setTermoPesquisa(e.target.value)}
            />
          )}
        />
      </div>

      <div className='container-fluid'>
        <ArquivoUpload />
        <table>
          <thead>
            <tr>
              <th>Nome</th>
              <th>Matrícula</th>
              <th>E-mail</th>
              <th>CPF</th>
              <th>Endereço</th>
              <th>Contato</th>
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
                    fghdhs@gmail.com
                  </td>
                  <td>
                    xxx.xxx.xxx-xx
                  </td>
                  <td>
                    Rua dos Alfeneiros N°4
                  </td>
                  <td>
                    (xx)x xxxx-xxxx
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
        variant="outlined"
        style={{ marginTop: "15px" }}
        className="inputField"
      />

<TextField
        id="telefone"
        label="Contato"
        placeholder="(xx) x xxxx-xxxx"
        variant="outlined"
        value={editingAluno.telefone}
        onChange={handleTelefoneChange}
        style={{ marginTop: "15px" }}
        className="inputField"
      />

      <TextField
        id="cpf"
        label="CPF"
        placeholder="xxx.xxx.xxx-xx"
        variant="outlined"
        value={editingAluno.cpf}
        onChange={handleCPFChange}
        style={{ marginTop: "15px" }}
        className="inputField"
      />

    <TextField
          id="endereco"
          label="Endereço"
          placeholder='Rua Martins Coelho'
          variant="outlined"
          style={{marginTop: "15px"}}className="inputField"
        />
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