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
  const [fileSecond, setFileSecond] = useState(null);
  const [loadingSecond, setLoadingSecond] = useState(false);

  const handleFileChangeSecond = (e) => {
    const selectedFile = e.target.files[0];
    setFileSecond(selectedFile);
  };

  const handleUploadAlunoSecond = async () => {
    try {
      setLoadingSecond(true);

      const token = localStorage.getItem('token');
      const headers = {
        'x-access-token': token,
      };

      const formData = new FormData();
      formData.append('pdf', fileSecond);

      const response = await axiosFetch.post('/aluno/upload/reading-pdf', formData, { headers });

      console.log(response.data);

      // Mensagem de sucesso
      toast.success('Arquivo enviado com sucesso!');
    } catch (error) {
      console.error('Erro ao fazer upload do arquivo:', error);

      // Mensagem de erro
      toast.error('Erro ao enviar o arquivo. Por favor, tente novamente.');
    } finally {
      setLoadingSecond(false);
    }
  };

  const handleCancelUploadSecond = () => {
    setFileSecond(null);
  };

  return (
    <div>
      <label htmlFor="file-input-second">
        <IconButton title='Adicione um arquivo' component="span">
          <AddIcon fontSize="large" />
        </IconButton>
      </label>
      <input id="file-input-second" type="file" onChange={(e) => handleFileChangeSecond(e)} style={{ display: 'none' }} />
      
      {fileSecond && (
        <Card variant="outlined" style={{ marginTop: 10, maxWidth: 300 }}>
          <CardContent>
            <div>
              Arquivo selecionado: {fileSecond.name}
            </div>
            <Button onClick={handleUploadAlunoSecond} variant="contained" color="primary" style={{ marginRight: 10 }} disabled={loadingSecond}>
              {loadingSecond ? 'Enviando...' : 'Enviar'}
            </Button>
            <Button onClick={handleCancelUploadSecond} variant="contained" color="secondary">
              Cancelar
            </Button>
          </CardContent>
        </Card>
      )}
    </div>
  );
};

export default FileUploader;