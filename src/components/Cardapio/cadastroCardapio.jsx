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
import './cardapio.css';

function CriarCardapio({open, onClose }) {
  const [nome, setNome] = useState('');
  const [descricao, setDescricao] = useState('');
  const [data, setData] = useState('');
  const [imagem, setImagem] = useState('');
  const [imagemEnviada, setImagemEnviada] = useState(false);
  const [anexarArquivo, setAnexarArquivo] = useState(false);
  const [modalOpen, setModalOpen] = useState(open);

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

      await axiosFecht.post('/criar/cardapio', dataToSend, { headers });

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
          setImagemEnviada(true); 
        })
        .catch((error) => {
          console.error('Erro ao fazer upload de imagem:', error);
        });
    } else {
      console.warn('Nenhuma imagem selecionada');
      setImagemEnviada(true); 
    }
  };

  const handleClose = () => setModalOpen(false);

  useEffect(() => {
    if (!open) {
    }
  }, [open]);

  return (
    <Modal open={modalOpen} onClose={() => onClose()}>

<Box className='edicaoPessoa'>

      <div className="header">
            <h2 className="title">Cadastro de Cardápio</h2>
            <div className="close-button">
              <IconButton onClick={onClose}>
                <CloseIcon />
              </IconButton>
            </div>
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
        
        <div className='botoesAcao'>
         <Button onClick={handleCriarCardapio} disabled={anexarArquivo && !imagemEnviada} variant="contained" color="primary" style={{ marginRight: 10 }}>
          Criar Cardápio
        </Button>
        </div>
       
      </Box>
    </Modal>
  );
}

export default CriarCardapio;