import React, { useState } from 'react';
import { IconButton, Dialog, DialogContent, TextField, DialogActions, Button } from '@mui/material';
import CloseIcon from '@mui/icons-material/Close';
import axiosFetch from '../../axios/config';
import { toast } from 'react-toastify';

function EditarCardapio({ open, onClose, cardapioId, onUpdate }) {
  const [newNome, setNewNome] = useState('');
  const [newDescricao, setNewDescricao] = useState('');
  const [newImagem, setNewImagem] = useState('');
  const [newData, setNewData] = useState('');

  const handleEditeCardapio = async () => {
    try {
      await axiosFetch.put(`/cardapio/${cardapioId}`, {
        nome: newNome, 
        descricao: newDescricao, 
        data: newData, 
        imagem: newImagem, 
      });

      onUpdate(); 
      toast.success('Cardápio editado com sucesso!');
      onClose();
    } catch (error) {
      console.error('Erro ao editar cardápio:', error);
    }
  };

  return (
    <Dialog open={open} onClose={onClose}>
      <div className="header">
        <h2 className="title">Editar Cardápio</h2>
        <div className="close-button">
          <IconButton onClick={onClose}>
            <CloseIcon />
          </IconButton>
        </div>
      </div>
      <DialogContent>
        <TextField
          autoFocus
          margin="dense"
          id="nome"
          label="Nome"
          type="text"
          fullWidth
          value={newNome}
          onChange={(e) => setNewNome(e.target.value)}
        />
        <TextField
          margin="dense"
          id="descricao"
          label="Descrição"
          type="text"
          fullWidth
          value={newDescricao}
          onChange={(e) => setNewDescricao(e.target.value)}
        />
        <TextField
          margin="dense"
          id="imagem"
          label="Imagem URL"
          type="text"
          fullWidth
          value={newImagem}
          onChange={(e) => setNewImagem(e.target.value)}
        />
        <TextField
          margin="dense"
          id="data"
          label="Data"
          type="date"
          fullWidth
          value={newData}
          onChange={(e) => setNewData(e.target.value)}
          InputLabelProps={{
            shrink: true,
          }}
        />
      </DialogContent>
      <DialogActions>
        <Button onClick={handleEditeCardapio} color="primary">
          Salvar
        </Button>
      </DialogActions>
    </Dialog>
  );
}

export default EditarCardapio;