import React, { useState } from 'react';
import { Modal, Box, TextField, Button, IconButton } from '@mui/material';
import CloseIcon from '@mui/icons-material/Close';
import axiosFetch from '../../axios/config';
import { toast } from 'react-toastify';

function CardapioCadastro({ open, onClose }) {
  const [nome, setNome] = useState('');
  const [descricao, setDescricao] = useState('');
  const [data, setData] = useState('');

  const handleCriarCardapio = async () => {
    try {
      const token = localStorage.getItem('token');
      const headers = {
        'x-access-token': token,
      };

      // Verifica se a data não é sábado nem domingo
      const selectedDate = new Date(data);
      const dayOfWeek = selectedDate.getDay();

      if (dayOfWeek === 0 || dayOfWeek === 6) {
        toast.error('Não é permitido criar cardápios para sábado ou domingo.');
        return; // Sai da função se for sábado ou domingo
      }

      const dataToSend = { nome, descricao, data };
      await axiosFetch.post('/criar/cardapio', dataToSend, { headers });

      toast.success('Seu cardápio foi cadastrado!');
      onClose();
    } catch (error) {
      console.error('Erro ao criar cardápio:', error);
      toast.error('Não foi possível cadastrar o seu cardápio!');
    }
  };

  return (
    <Modal open={open} onClose={onClose}>
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

        <div className='botoesAcao'>
          <Button
            onClick={handleCriarCardapio}
            variant="contained"
            color="primary"
            style={{ marginRight: 10 }}
          >
            Criar Cardápio
          </Button>
        </div>

      </Box>
    </Modal>
  );
}

export default CardapioCadastro;