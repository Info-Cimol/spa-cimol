import React, { useState, useEffect } from 'react';
import Modal from '@mui/material/Modal';
import { toast } from 'react-toastify';
import { IconButton } from '@mui/material';
import TextField from '@mui/material/TextField';
import CloseIcon from '@mui/icons-material/Close';
import Button from '@mui/material/Button';
import axiosFetch from '../../axios/config';

const CadastroAlunoForm = ({ open, onClose }) => {
  const MAX_NOME_LENGTH = 255;
  const MAX_EMAIL_LENGTH = 255;
  const MAX_CPF_LENGTH = 14;
  const MAX_TELEFONE_LENGTH = 16;
  const MAX_MATRICULA_LENGTH = 20;
  const MAX_ENDERECO_LENGTH = 155;
  const MAX_OBSERVACAO_LENGTH = 100;

  const [modalOpen, setModalOpen] = useState(open);

  const [alunoData, setAlunoData] = useState({
    nome: '',
    email: '',
    cpf: '',
    telefone: '',
    endereco: '',
    observacao: '',
    matricula: '',
  });

  const [charCount, setCharCount] = useState({
    nome: MAX_NOME_LENGTH, 
    email: MAX_EMAIL_LENGTH,
    cpf: MAX_CPF_LENGTH,
    telefone: MAX_TELEFONE_LENGTH,
    matricula: MAX_MATRICULA_LENGTH,
    endereco: MAX_ENDERECO_LENGTH,
    observacao: MAX_OBSERVACAO_LENGTH,
  });

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    const maxChars = getMaxChars(name);

    if (value.length > maxChars) return;

    const updatedCharCount = { ...charCount, [name]: Math.max(0, maxChars - value.length) };
    setCharCount(updatedCharCount);

    const formattedValue = formatInputValue(name, value);
    setAlunoData((prevData) => ({ ...prevData, [name]: formattedValue }));
  };
  
  const getMaxChars = (fieldName) => {
    switch (fieldName) {
      case 'nome':
      return MAX_NOME_LENGTH;
      case 'email': 
      return MAX_EMAIL_LENGTH;
      case 'cpf':
        return MAX_CPF_LENGTH;
      case 'telefone':
        return MAX_TELEFONE_LENGTH;
      case 'matricula':
        return MAX_MATRICULA_LENGTH;
      case 'endereco':
        return MAX_ENDERECO_LENGTH;
      case 'observacao':
        return MAX_OBSERVACAO_LENGTH;
      default:
        return 0;
    }
  };

  const formatInputValue = (fieldName, value) => {
    switch (fieldName) {
      case 'cpf':
        return formatCPF(value);
      case 'telefone':
        return formatTelefone(value);
      case 'matricula':
        return formatMatricula(value);
      default:
        return value;
    }
  };

  const formatCPF = (value) => {
    const formattedValue = value.replace(/\D/g, '').replace(/(\d{3})(\d{3})(\d{3})(\d{2})/, '$1.$2.$3-$4');
    return formattedValue.slice(0, MAX_CPF_LENGTH);
  };

  const formatMatricula = (value) => {
    const formattedValue = value.replace(/\D/g, '');
    return formattedValue.slice(0, MAX_MATRICULA_LENGTH);
  };

  const formatTelefone = (value) => {
    const formattedValue = value.replace(/\D/g, '').replace(/(\d{2})(\d{1})(\d{4})(\d{4})/, '($1) $2 $3-$4');
    return formattedValue.slice(0, MAX_TELEFONE_LENGTH);
  };

  const handleFormSubmit = async (e) => {
    e.preventDefault();
  
    try {
      const alunoDataJSON = JSON.stringify(alunoData);
  
      const response = await axiosFetch.post('/adiciona/aluno', alunoDataJSON);
      console.log('Resposta da API:', response.data);

    // Fechar o modal após o envio do formulário
    setModalOpen(false);

      toast.success('Aluno cadastrado com sucesso!', { position: toast.POSITION.TOP_RIGHT });
  
      // Fechar o modal após o envio do formulário
      onClose();
    }catch (error) {
      if (error.response && error.response.status === 401) {
          if (error.response.data.error === 'A matrícula já está em uso') {
              toast.error('Matrícula já existe. Por favor, escolha outra matrícula.');
          } else if (error.response.data.error === 'Email já existente') {
              toast.error('Email já existe. Por favor, escolha outro email.');
          } else {
              // Se o erro não for especificamente de matrícula ou email já existentes, exibir mensagem genérica
              toast.error('Erro ao cadastrar aluno. Detalhes no console.');
              console.error('Detalhes do erro (response.data):', error.response.data);
          }
      } else if (error.response) {
          // Se houver uma resposta do servidor com um status diferente de 409, exibir mensagem genérica
          console.error('Erro ao cadastrar aluno:', error);
          console.error('Detalhes do erro (response.data):', error.response.data);
          console.error('Status do erro (response.status):', error.response.status);
          toast.error('Erro ao cadastrar aluno. Detalhes no console.');
      } else if (error.request) {
          // Se não houver resposta do servidor, exibir mensagem genérica
          console.error('Erro na requisição (sem resposta do servidor):', error.request);
          toast.error('Erro na requisição. Detalhes no console.', { position: toast.POSITION.TOP_RIGHT });
      } else {
          // Se ocorrer um erro durante o processamento da requisição, exibir mensagem genérica
          console.error('Erro ao processar requisição:', error.message);
          toast.error('Erro ao processar requisição. Detalhes no console.', { position: toast.POSITION.TOP_RIGHT });
      }
  }
}
  
  const handleCancel = () => {
    setModalOpen(false);
  };

  useEffect(() => {
    if (open) {

      setCharCount({
        nome: MAX_NOME_LENGTH,
        email: MAX_EMAIL_LENGTH,
        cpf: MAX_CPF_LENGTH,
        telefone: MAX_TELEFONE_LENGTH,
        matricula: MAX_MATRICULA_LENGTH,
        endereco: MAX_ENDERECO_LENGTH,
        observacao: MAX_OBSERVACAO_LENGTH,
      });
    }
  }, [open]);

  return (
    <Modal open={modalOpen} onClose={() => onClose()}>
      <div className="edicaoPessoa">
        <div className="header">
          <h2>Cadastro de Aluno</h2>
        </div>
        <div className="close">
              <IconButton onClick={handleCancel}>
                <CloseIcon style={{ color: 'cinza' }} />
              </IconButton>
            </div>
        <form onSubmit={handleFormSubmit}>

          {/* Campos do formulário */}
          <TextField
            name="nome"
            label={`Nome (${charCount.nome} caracteres restantes)`}
            variant="outlined"
            value={alunoData.nome}
            onChange={handleInputChange}
            fullWidth
            margin="normal"
          />

          <TextField
            name="matricula"
            label={`Matrícula (${charCount.matricula} caracteres restantes)`}
            variant="outlined"
            value={alunoData.matricula}
            onChange={handleInputChange}
            fullWidth
            margin="normal"
          />

          <TextField
            name="email"
            label={`Email (${charCount.email} caracteres restantes)`}
            variant="outlined"
            value={alunoData.email}
            onChange={handleInputChange}
            fullWidth
            margin="normal" 
          />

          <TextField
            name="cpf"
            label={`CPF (${charCount.cpf} caracteres restantes)`}
            variant="outlined"
            value={alunoData.cpf}
            onChange={handleInputChange}
            fullWidth
            margin="normal"
          />

          <TextField
            name="telefone"
            label={`Telefone (${charCount.telefone} caracteres restantes)`}
            variant="outlined"
            value={alunoData.telefone}
            onChange={handleInputChange}
            fullWidth
            margin="normal"
          />

          <TextField
            name="endereco"
            label={`Endereco (${charCount.endereco} caracteres restantes)`}
            variant="outlined"
            value={alunoData.endereco}
            onChange={handleInputChange}
            fullWidth
            margin="normal"
            multiline
            rows={4}
          />

          <TextField
            name="observacao"
            label={`Observação (${charCount.observacao} caracteres restantes)`}
            variant="outlined"
            value={alunoData.observacao}
            onChange={handleInputChange}
            fullWidth
            margin="normal"
            multiline
            rows={4}
          />

          {/* Botões de cadastrar e cancelar */}
          <div className="botoesAcao">
            <Button type="submit" variant="contained" color="primary" style={{ marginRight: 10 }}>
              Cadastrar Aluno
            </Button>
          </div>
        </form>
      </div>
    </Modal>
  );
};

export default CadastroAlunoForm;