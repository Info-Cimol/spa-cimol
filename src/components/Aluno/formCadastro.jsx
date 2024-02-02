import React, { useState } from 'react';
import Modal from '@mui/material/Modal';
import TextField from '@mui/material/TextField';
import Button from '@mui/material/Button';
import InputLabel from '@mui/material/InputLabel';
import axiosFetch from '../../axios/config';
import FileUploader from '../FileUploader/pdfUploaderAluno';

const CadastroAlunoForm = ({ open, onClose }) => {
  const [alunoData, setAlunoData] = useState({
    nome: '',
    email: '',
    cpf: '',
    telefone: '',
    endereco: '',
    observacao: '',
    matricula: '',
  });

  const [modalOpen, setModalOpen] = useState(open);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setAlunoData((prevData) => ({ ...prevData, [name]: value }));
  };

  const handleFormSubmit = async (e) => {
    e.preventDefault();

    const token = localStorage.getItem('token');
    const headers = {
      'x-access-token': token,
      'Content-Type': 'application/json',
    };

    try {
      const alunoDataJSON = JSON.stringify(alunoData);

      const response = await axiosFetch.post('/adiciona/aluno', alunoDataJSON, { headers });
      console.log('Resposta da API:', response.data);

      // Fechar o modal após o envio do formulário
      setModalOpen(false);
    } catch (error) {
      console.error('Erro ao cadastrar aluno:', error);
      if (error.response) {
        console.error('Detalhes do erro (response.data):', error.response.data);
        console.error('Status do erro (response.status):', error.response.status);
      } else if (error.request) {
        console.error('Erro na requisição (sem resposta do servidor):', error.request);
      } else {
        console.error('Erro ao processar requisição:', error.message);
      }
    }
  };

  const handleCancel = () => {
    setModalOpen(false);
  };

  React.useEffect(() => {
    setModalOpen(open);
  }, [open]);
  return (    
    <Modal open={modalOpen} onClose={() => onClose()}>
      <div className='edicaoPessoa'>
      <div className="header">
            <h2>Cadastro de Aluno</h2>
          </div>
        <form onSubmit={handleFormSubmit}>
          {/* Campos do formulário */}
          <TextField name="nome" label="Nome" variant="outlined" value={alunoData.nome} onChange={handleInputChange} fullWidth margin="normal" />
          <TextField name="email" label="E-mail" variant="outlined" value={alunoData.email} onChange={handleInputChange} fullWidth margin="normal" />
          <TextField name="cpf" label="CPF" variant="outlined" value={alunoData.cpf} onChange={handleInputChange} fullWidth margin="normal" />
          <TextField name="telefone" label="Telefone" variant="outlined" value={alunoData.telefone} onChange={handleInputChange} fullWidth margin="normal" />
          <TextField name="endereco" label="Endereco" variant="outlined" value={alunoData.endereco} onChange={handleInputChange} fullWidth margin="normal" />
          <TextField name="observacao" label="Observacao" variant="outlined" value={alunoData.observacao} onChange={handleInputChange} fullWidth margin="normal" />
          <TextField name="matricula" label="Matrícula" variant="outlined" value={alunoData.matricula} onChange={handleInputChange} fullWidth margin="normal" />

             {/* Adicione um InputLabel para a descrição antes do FileUploader */}
          <InputLabel>Ficha Geral dos Alunos</InputLabel>
          <FileUploader />

          {/* Adicione um InputLabel para a descrição antes do FileUploader */}
          <InputLabel>Ficha Unitária</InputLabel>
          <FileUploader />

          {/* Botões de cadastrar e cancelar */}
          <div className="botoesAcao">
          <Button type="submit" variant="contained" color="primary" style={{ marginRight: 10 }}>
            Cadastrar Aluno
          </Button>
          <Button variant="contained" color="secondary" onClick={handleCancel}>
            Cancelar
          </Button>
          </div>
        </form>
     </div>
    </Modal> 
  );
};

export default CadastroAlunoForm;