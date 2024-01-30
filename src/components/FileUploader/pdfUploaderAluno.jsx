import React, { useState } from 'react';
import IconButton from '@mui/material/IconButton';
import AddIcon from '@mui/icons-material/Add';
import Card from '@mui/material/Card';
import CardContent from '@mui/material/CardContent';
import Button from '@mui/material/Button';
import { toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import axiosFetch from '../../axios/config';

const FileUploader = () => {
  const [file, setFile] = useState(null);

  const handleFileChange = (e) => {
    const selectedFile = e.target.files[0];
    setFile(selectedFile);
  };

  const handleUploadAluno = async () => {
    try {
      const token = localStorage.getItem('token');
      const headers = {
        'x-access-token': token,
      };

      const formData = new FormData();
      formData.append('pdf', file);

      const response = await axiosFetch.post('/aluno/upload/reading-pdf', formData, { headers });

      console.log(response.data);

      // Mensagem de sucesso
      toast.success('Arquivo enviado com sucesso!');
    } catch (error) {
      console.error('Erro ao fazer upload do arquivo:', error);

      // Mensagem de erro
      toast.error('Erro ao enviar o arquivo. Por favor, tente novamente.');
    }
  };

  const handleCancelUpload = () => {
    setFile(null);
  };

  return (
    <div>
      <label htmlFor="file-input">
        <IconButton component="span">
          <AddIcon fontSize="large" />
        </IconButton>
      </label>
      <input id="file-input" type="file" onChange={(e) => handleFileChange(e)} style={{ display: 'none' }} />
      
      {file && (
        <Card variant="outlined" style={{ marginTop: 10, maxWidth: 300 }}>
          <CardContent>
            <div>
              Arquivo selecionado: {file.name}
            </div>
            <Button onClick={handleUploadAluno} variant="contained" color="primary" style={{ marginRight: 10 }}>
              Enviar
            </Button>
            <Button onClick={handleCancelUpload} variant="contained" color="secondary">
              Cancelar
            </Button>
          </CardContent>
        </Card>
      )}
    </div>
  );
};

export default FileUploader;