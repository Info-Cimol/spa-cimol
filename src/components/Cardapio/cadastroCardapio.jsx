import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { toast } from 'react-toastify';
import TextField from '@mui/material/TextField';
import axiosFecht from '../../axios/config';
import Modal from '@mui/material/Modal';
import Box from '@mui/material/Box';
import Button from '@mui/material/Button';
import IconButton from '@mui/material/IconButton';
import CloseIcon from '@mui/icons-material/Close';

function CriarCardapio() {
  const [nome, setNome] = useState('');
  const [descricao, setDescricao] = useState('');
  const [data, setData] = useState('');
  const [imagem, setImagem] = useState('');
  const [imagemEnviada, setImagemEnviada] = useState(false);
  const [anexarArquivo, setAnexarArquivo] = useState(false);
  const [open, setOpen] = useState(true);

  const handleCriarCardapio = async () => {
    try {
      const token = localStorage.getItem('token');
      const headers = {
        'x-access-token': token,
      };

      let dataToSend = { nome, descricao, data };
      if (anexarArquivo && imagemEnviada) {
        dataToSend.imagem = imagem;
      }

      const response = await axiosFecht.post('/criar/cardapio', dataToSend, { headers });

      toast.success('Seu cardápio foi cadastrado!');
      handleClose();
    } catch (error) {
      console.error('Erro ao criar cardápio:', error);
      toast.error('Não foi possível cadastrar o seu cardápio!');
    }
  };

  const handleFileUpload = async (event) => {
    const files = event.target.files;

    if (files.length > 0) {
      const cloudinaryCloudName = process.env.REACT_APP_CLOUD_NAME;
      const cloudinaryUploadPreset = process.env.REACT_APP_UPLOAD_PRESENT;

      const uploadPromises = [];

      for (const file of files) {
        const formData = new FormData();
        formData.append('file', file);
        formData.append('resource_type', 'image');
        formData.append('upload_preset', cloudinaryUploadPreset);

        uploadPromises.push(
          axios.post(`https://api.cloudinary.com/v1_1/${cloudinaryCloudName}/upload`, formData)
        );
      }

      Promise.all(uploadPromises)
        .then((responses) => {
          const imageUrls = responses.map((response) => response.data.secure_url);
          setImagem(imageUrls);
          setImagemEnviada(true); // Definindo a imagem como enviada com sucesso
        })
        .catch((error) => {
          console.error('Erro ao fazer upload de imagem:', error);
        });
    } else {
      console.warn('Nenhuma imagem selecionada');
      setImagemEnviada(true); // Permitindo cadastro direto mesmo sem imagem
    }
  };

  const handleClose = () => setOpen(false);

  useEffect(() => {
    if (!open) {
      // Lógica para fechar o modal após o cadastro ou cancelamento
    }
  }, [open]);

  return (
    <Modal
      open={open}
      onClose={handleClose}
      aria-labelledby="modal-modal-title"
      aria-describedby="modal-modal-description"
    >
      <Box sx={{ position: 'absolute', top: '50%', left: '50%', transform: 'translate(-50%, -50%)', width: 600, bgcolor: 'background.paper', border: '2px solid #000', boxShadow: 24, p: 4 }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <h2 className='header'>Criar Cardápio</h2>
          <IconButton onClick={handleClose}>
            <CloseIcon />
          </IconButton>
        </div>
        <TextField
          name="nome"
          label="Nome do prato"
          variant="outlined"
          value={nome}
          onChange={(e) => setNome(e.target.value)}
          fullWidth
          margin="normal"
        />
        <TextField
          name="descricao"
          label="Descrição do prato"
          variant="outlined"
          value={descricao}
          onChange={(e) => setDescricao(e.target.value)}
          fullWidth
          margin="normal"
          multiline
          rows={4}
        />
        <TextField
          name="data"
          label="Data do cardápio"
          type="date"
          variant="outlined"
          value={data}
          onChange={(e) => setData(e.target.value)}
          fullWidth
          margin="normal"
          InputLabelProps={{ shrink: true }}
        />
        <label>
          <input
            type="checkbox"
            checked={anexarArquivo}
            onChange={(e) => setAnexarArquivo(e.target.checked)}
          />
          Anexar arquivo
        </label>
        {anexarArquivo && (
          <input type="file" id="fileInputLogo" name="file" multiple onChange={handleFileUpload} />
        )}
        <Button onClick={handleCriarCardapio} disabled={anexarArquivo && !imagemEnviada}>
          Criar Cardápio
        </Button>
      </Box>
    </Modal>
  );
}

export default CriarCardapio;