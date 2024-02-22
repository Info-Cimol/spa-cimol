import React, { useState } from 'react';
import { IconButton, Card, CardContent, Button } from '@mui/material';
import { Add as AddIcon } from '@mui/icons-material';
import { toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import axiosFetch from '../../axios/config';

const FileUploader = () => {
  const [file, setFile] = useState(null);
  const [loading, setLoading] = useState(false);

  const handleFileChange = (e) => {
    setFile(e.target.files[0]);
  };

  const handleUpload = async () => {
    try {
      // Verifica se um arquivo foi selecionado
      if (!file) {
        toast.error('Nenhum arquivo PDF selecionado. Por favor, selecione um arquivo.');
        return;
      }

      setLoading(true);
      const formData = new FormData();
      formData.append('pdf', file);

      await axiosFetch.post('/aluno/upload/reading-pdf', formData);
      
      toast.success('Arquivo enviado com sucesso!');
    } catch (error) {
      console.error('Erro ao fazer upload do arquivo:', error);
      toast.error('Erro ao enviar o arquivo. Por favor, tente novamente.');
    } finally {
      setLoading(false);
    }
  };

  const handleCancelUpload = () => {
    setFile(null);
  };

  return (
    <div>
      <label htmlFor="file-input">
        <IconButton title='Adicione um arquivo' component="span">
          <AddIcon fontSize="large" />
        </IconButton>
      </label>
      <input id="file-input" type="file" onChange={handleFileChange} style={{ display: 'none' }} />
      
      {file && (
        <Card variant="outlined" style={{ marginTop: 10, maxWidth: 300 }}>
          <CardContent>
            <div>Arquivo selecionado: {file.name}</div>
            <Button onClick={handleUpload} variant="contained" color="primary" style={{ marginRight: 10 }} disabled={loading}>
              {loading ? 'Enviando...' : 'Enviar'}
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