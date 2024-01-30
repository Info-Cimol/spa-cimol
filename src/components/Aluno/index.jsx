import React, { useState, useEffect } from 'react';
import Autocomplete from '@mui/material/Autocomplete';
import TextField from '@mui/material/TextField';
import Button from '@mui/material/Button';
import IconButton from '@mui/material/IconButton';
import EditIcon from '@mui/icons-material/Edit';
import DeleteIcon from '@mui/icons-material/Delete';
import { toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import axiosFetch from '../../axios/config';
import ArquivoUpload from '../FileUploader/pdfUploaderAluno';
import './alunoCadastro.css';

const CadastroAluno = () => {
  const [alunosDisponiveis, setAlunosDisponiveis] = useState([]);
  const [termoPesquisa, setTermoPesquisa] = useState('');
  const [alunoEditando, setAlunoEditando] = useState(null);
  const [currentPage, setCurrentPage] = useState(1);
  const [alunosPorPagina] = useState(15); 
  const [,setShowPageNumbers] = useState(false);

  useEffect(() => {
    const handleResize = () => {
      setShowPageNumbers(window.innerWidth > 600);
    };

    window.addEventListener('resize', handleResize);
    handleResize(); // Configurar o estado inicial

    return () => {
      window.removeEventListener('resize', handleResize);
    };
  }, []);
  useEffect(() => {
    carregarAlunos();
  }, [currentPage]); 

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

  const handleEditar = (alunoId) => {
    setAlunoEditando(alunoId);
  };

  const handleCancelar = () => {
    setAlunoEditando(null);
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
      setAlunoEditando(null);
      toast.success('Aluno editado com sucesso!');
    } catch (error) {
      console.error('Erro ao editar aluno:', error);
      toast.error('Erro ao editar aluno.');
    }
  };

  const handleDesativar = async (alunoId) => {
    try {
      const token = localStorage.getItem('token');
      const headers = {
        'x-access-token': token,
      };

      await axiosFetch.put(`/desativa/aluno/${alunoId}`, null, { headers });

      carregarAlunos();
      toast.success('Aluno desativado com sucesso!');
    } catch (error) {
      console.error('Erro ao desativar aluno:', error);
      toast.error('Erro ao desativar aluno.');
    }
  };

  const indexOfLastAluno = currentPage * alunosPorPagina;
  const indexOfFirstAluno = indexOfLastAluno - alunosPorPagina;
  const alunosPaginados = alunosDisponiveis.slice(indexOfFirstAluno, indexOfLastAluno);

  return (
 <div>
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

      {/* Tabela de Alunos */}
      <div className='container-fluid'>
        <ArquivoUpload />
        <table>
          <thead>
            <tr>
              <th>Nome</th>
              <th>Matrícula</th>
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
                    {alunoEditando === aluno.id ? (
                      <TextField
                        value={aluno.nome}
                        onChange={(e) => setAlunosDisponiveis((prev) => (
                          prev.map((prevAluno) => (
                            prevAluno.id === aluno.id ? { ...prevAluno, nome: e.target.value } : prevAluno
                          ))
                        ))}
                      />
                    ) : (
                      aluno.nome
                    )}
                  </td>
                  <td>
                    {alunoEditando === aluno.id ? (
                      <TextField
                        value={aluno.matricula}
                        onChange={(e) => setAlunosDisponiveis((prev) => (
                          prev.map((prevAluno) => (
                            prevAluno.id === aluno.id ? { ...prevAluno, matricula: e.target.value } : prevAluno
                          ))
                        ))}
                      />
                    ) : (
                      aluno.matricula
                    )}
                  </td>
                  <td>
                    {alunoEditando === aluno.id ? (
                      <>
                        <Button onClick={() => handleSalvar(aluno.id, aluno.nome, aluno.matricula)} variant="contained" color="primary">
                          Salvar
                        </Button>
                        <Button onClick={handleCancelar} variant="contained" color="secondary">
                          Cancelar
                        </Button>
                      </>
                    ) : (
                      <>
                        <IconButton onClick={() => handleEditar(aluno.id)} color="primary">
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

        {/* Adicionar navegação entre páginas */}
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
      </div>
  </div>
  );
};

export default CadastroAluno;