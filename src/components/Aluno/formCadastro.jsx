// StudentForm.jsx
import React, { useState } from 'react';
import TextField from '@mui/material/TextField';
import Button from '@mui/material/Button';
import Grid from '@mui/material/Grid';
import FileUploader from '../FileUploader/pdfUploaderAluno';
import axiosFetch from '../../axios/config';  

const StudentForm = () => {
  const [studentData, setStudentData] = useState({
    nome: '',
    email: '',
    matricula: '',
    cpf: '',
    endereco: '',
    telefone: '',
    observacao: '',
    pdf: null, 
  });

  const handleInputChange = (field) => (e) => {
    setStudentData((prev) => ({ ...prev, [field]: e.target.value }));
  };

  const handleFileUpload = (file) => {
    setStudentData((prev) => ({ ...prev, pdf: file }));
  };

  const handleSubmit = async () => {
    try {
      const response = await axiosFetch.post('/adiciona/aluno', studentData);

      if (response.data.success) {
        if (studentData.pdf) {
          await handleFileUpload(studentData.pdf);
        }

        // Mensagem de sucesso
        // toast.success('Aluno adicionado com sucesso!');
      } else {
        // Mensagem de erro
        // toast.error('Erro ao adicionar o aluno. Por favor, tente novamente.');
      }
    } catch (error) {
      console.error('Erro ao adicionar o aluno:', error);

      // Mensagem de erro
      // toast.error('Erro ao adicionar o aluno. Por favor, tente novamente.');
    }
  };

  return (
    <Grid container spacing={2}>
      <Grid item xs={6}>
        <TextField label="Nome" variant="outlined" fullWidth onChange={handleInputChange('nome')} />
      </Grid>
      <Grid item xs={6}>
        <TextField label="Email" variant="outlined" fullWidth onChange={handleInputChange('email')} />
      </Grid>
      <Grid item xs={6}>
        <TextField label="Matrícula" variant="outlined" fullWidth onChange={handleInputChange('matricula')} />
      </Grid>
      <Grid item xs={6}>
        <TextField label="CPF" variant="outlined" fullWidth onChange={handleInputChange('cpf')} />
      </Grid>
      <Grid item xs={6}>
        <TextField label="Endereço" variant="outlined" fullWidth onChange={handleInputChange('endereco')} />
      </Grid>
      <Grid item xs={6}>
        <TextField label="Telefone" variant="outlined" fullWidth onChange={handleInputChange('telefone')} />
      </Grid>
      <Grid item xs={6}>
        <TextField label="Observação" variant="outlined" fullWidth onChange={handleInputChange('observacao')} />
      </Grid>
      <Grid item xs={12}>
        <FileUploader onFileChange={handleFileUpload} />
      </Grid>
      <Grid item xs={12}>
        <Button variant="contained" color="primary" onClick={handleSubmit}>
          Enviar
        </Button>
      </Grid>
    </Grid>
  );
};

export default StudentForm;