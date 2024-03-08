import React, { useState } from 'react';
import { TextField, IconButton, Switch, Button, Modal, Fade, Paper } from '@mui/material';
import CloseIcon from '@mui/icons-material/Close';
import axiosFetch from '../../axios/config';
import { toast } from 'react-toastify';
import './alunoCadastro.css';

const AlunoEdicao = ({ alunoEditando, setShowEditModal, carregarAlunos }) => {
    const MAX_CPF_LENGTH = 14;
    const MAX_TELEFONE_LENGTH = 16;

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

  const handleSalvar = async (alunoId, novoNome, novaMatricula,  novoEmail, novoCpf, novoEndereco, novoNumero, novoAtivo) => {
    try {
      const requestBody = {
        novoNome,
        novaMatricula,
        novoEmail,
        novoCpf,
        novoEndereco,
        novoAtivo,
        novoNumero,
      };

      await axiosFetch.put(`/altera/aluno/${alunoId}`, requestBody);

      carregarAlunos();
      toast.success('Aluno editado com sucesso!');
    } catch (error) {
      console.error('Erro ao editar aluno:', error);
      toast.error('Erro ao editar aluno.');
    }
  };

  const formatCPF = (value) => {
    const formattedValue = value.replace(/\D/g, '').replace(/(\d{3})(\d{3})(\d{3})(\d{2})/, '$1.$2.$3-$4');
    return formattedValue.slice(0, MAX_CPF_LENGTH);
  };

  const formatTelefone = (value) => {
    const formattedValue = value.replace(/\D/g, '').replace(/(\d{2})(\d{1})(\d{4})(\d{4})/, '($1) $2 $3-$4');
    return formattedValue.slice(0, MAX_TELEFONE_LENGTH);
  };

  const handleToggle = () => {
    setEditingAluno((prevEditingAluno) => ({
      ...prevEditingAluno,
      ativo: prevEditingAluno.ativo === 1 ? 0 : 1,
    }));
  };

  const handleTelefoneChange = (e) => {
    let numero = e.target.value.replace(/\D/g, ''); 
    numero = formatTelefone(numero);
    setEditingAluno((prev) => ({ ...prev, numero }));
  };
  
  const handleCPFChange = (e) => {
    let cpf = e.target.value.replace(/\D/g, ''); 
    cpf = formatCPF(cpf);
    setEditingAluno((prev) => ({ ...prev, cpf }));
  };

  const handleMatriculaChange = (e) => {
    const matricula = e.target.value.replace(/\D/g, '');
    setEditingAluno((prev) => ({ ...prev, matricula }));
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
  
      carregarAlunos();
  
      setShowEditModal(false);
    } catch (error) {
      console.error('Erro ao editar aluno:', error);
      toast.error('Erro ao editar aluno.');
    }
  };

  return (
    <Modal open={true} onClose={() => setShowEditModal(false)}>
      <div className="edicaoPessoa">
        <div className="header">
          <h2>Editar Aluno</h2>  
        </div>

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
  );
};

export default AlunoEdicao;