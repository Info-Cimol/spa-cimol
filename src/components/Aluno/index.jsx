import React, { useState, useEffect } from 'react';
import Autocomplete from '@mui/material/Autocomplete';
import TextField from '@mui/material/TextField';
import axiosFetch from '../../axios/config';

const CadastroAluno = () => {
  const [alunosDisponiveis, setAlunosDisponiveis] = useState([]);
  const [termoPesquisa, setTermoPesquisa] = useState('');
  const [exibirAluno] = useState(false);

  useEffect(() => {
    // Chama a função para carregar alunos ao montar o componente
    carregarAlunos();
  }, []);

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
        }))
      );
    } catch (error) {
      console.error('Erro ao carregar alunos:', error);
    }
  };

  return (
    <div>
      {exibirAluno ? (
        // Se exibirAluno é true, renderiza somente o componente Aluno
        <CadastroAluno />
      ) : (
        <>
          <h2>Alunos Disponíveis</h2>
          {/* Barra de Pesquisa */}
          <Autocomplete
            options={alunosDisponiveis}
            getOptionLabel={(aluno) => aluno.nome}
            renderInput={(params) => (
              <TextField
                {...params}
                label="Pesquisar Aluno"
                variant="outlined"
                onChange={(e) => setTermoPesquisa(e.target.value)}
              />
            )}
          />

          {/* Tabela de Alunos */}
          <table>
            <thead>
              <tr>
                <th>Nome</th>
                <th>Matrícula</th>
              </tr>
            </thead>
            <tbody>
              {alunosDisponiveis
                .filter((aluno) =>
                  aluno.nome.toLowerCase().includes(termoPesquisa.toLowerCase())
                )
                .map((aluno) => (
                  <tr key={aluno.id}>
                    <td>{aluno.nome}</td>
                    <td>{aluno.matricula}</td>
                  </tr>
                ))}
            </tbody>
          </table>
        </>
      )}
    </div>
  );
};

export default CadastroAluno;