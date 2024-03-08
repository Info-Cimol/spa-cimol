import React, { useState, useEffect } from 'react';
import Modal from '@mui/material/Modal';
import { toast } from 'react-toastify';
import { IconButton, TextField, Button } from '@mui/material';
import CloseIcon from '@mui/icons-material/Close';
import axiosFetch from '../../axios/config';

const CadastroAlunoForm = ({ open, onClose }) => {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const MAX_NOME_LENGTH = 255;
  const MAX_EMAIL_LENGTH = 255;
  const MAX_CPF_LENGTH = 14;
  const MAX_TELEFONE_LENGTH = 16;
  const MAX_MATRICULA_LENGTH = 20;
  const MAX_ENDERECO_LENGTH = 155;
  const MAX_OBSERVACAO_LENGTH = 100;

  const [cursos, setCursos] = useState([]);
  const [modalOpen, setModalOpen] = useState(open);

  const [alunoData, setAlunoData] = useState({
    nome: '',
    email: '',
    cpf: '',
    telefone: '',
    endereco: '',
    observacao: '',
    matricula: '',
    cursoId: '',
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
    setIsSubmitting(true); // Inicia o processo de envio
  
    try {
      const alunoDataJSON = { ...alunoData };
  
      const response = await axiosFetch.post('/adiciona/aluno', alunoDataJSON);
      console.log('Resposta da API:', response.data);
  
      setModalOpen(false);
  
      toast.success('Aluno cadastrado com sucesso!', { position: toast.POSITION.TOP_RIGHT });
  
      onClose();
    } catch (error) {
      // Lida com erros
    } finally {
      setIsSubmitting(false); // Finaliza o processo de envio, independentemente do resultado
    }
  };
  
  
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

  useEffect(() => {
    async function fetchCursos() {
      try {
        const response = await axiosFetch.get('/listar/cursos');
        const cursosData = response.data; // Supondo que a resposta seja um array de objetos com os dados dos cursos
        const cursosComIds = cursosData.map(curso => ({ id: curso.id_curso, nome: curso.nome }));
        setCursos(cursosComIds);
      } catch (error) {
        console.error('Erro ao buscar cursos:', error);
      }
    }

    fetchCursos();
  }, []);

  const handleCursoSelect = event => {
    const selectedCursoId = event.target.value;
    setAlunoData(prevData => ({
      ...prevData,
      cursoId: selectedCursoId
    }));
  };
  
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

          <select value={alunoData.cursoId} onChange={handleCursoSelect}>
            <option value="">Selecione um curso</option>
            {cursos.map(curso => (
              <option key={curso.id} value={curso.id}>
                {curso.nome}
              </option>
            ))}
          </select>

          {/* Botões de cadastrar e cancelar */}
          <div className="botoesAcao">
          <Button
            type="submit"
            variant="contained"
            color="primary"
            style={{ marginRight: 10 }}
            disabled={isSubmitting} 
          >
            {isSubmitting ? 'Cadastrando...' : 'Cadastrar Aluno'}
          </Button>
          </div>
        </form>
      </div>
    </Modal>
  );
};

export default CadastroAlunoForm;