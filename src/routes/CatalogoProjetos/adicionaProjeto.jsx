import React, { useState, useEffect } from 'react';
import {useNavigate} from 'react-router-dom';
import axios from 'axios';
import axiosFecht from '../../axios/config';
import ContainerTopo from '../../components/ContainerTopo';
import MenuHamburguer from "../../components/MenuHamburguer";
import Autocomplete from '@mui/material/Autocomplete';
import TextField from '@mui/material/TextField';
import Button from '@mui/material/Button';
import DatePicker from 'react-datepicker';
import 'react-datepicker/dist/react-datepicker.css';

const AdicionaProjetoComponent = () => {
  const navigate = useNavigate();
  const [projetoAdicionado, setProjetoAdicionado] = useState(false);
  const [alunosSelecionados, setAlunosSelecionados] = useState([]);
  const [isPrivate] = useState('');
  const [alunoSelecionado, setAlunoSelecionado] = useState(null);
  const [orientadorSelecionado, setOrientadorSelecionado] = useState(null);
  const [titulo, setTitulo] = useState('');
  const [tema, setTema] = useState('');
  const [problema, setProblema] = useState('');
  const [resumo, setResumo] = useState('');
  const [logoProjeto, setLogoProjeto] = useState([]);
  const [objetivo_geral, setObjetivoGeral] = useState('');
  const [abstract, setAbstract] = useState('');
  const [objetivo_especifico, setObjetivoEspecifico] = useState('');
  const [autores, setAutores] = useState([]);
  const [pdfAdicionado, setPdfAdicionado] = useState(false);
  const [alunosDisponiveis, setAlunosDisponiveis] = useState([]);
  const [professoresDisponiveis, setProfessoresDisponiveis] = useState([]);
  const [logoAdicionada, setLogoAdicionada] = useState(false);
  const [mensagemErro, setMensagemErro] = useState(false);
  const [sucessoAdicao, setSucessoAdicao] = useState(false);
  const [loading, setLoading] = useState(false);
  const [url, setUrl] = useState('');
  const [menuAberto, setMenuAberto] = useState(false);
  const [publico, setPublico] = useState(false); 

  const handleToggle = () => {
    setPublico(!publico); // Inverte o valor de publico ao ser chamada
  };
  const userRole = localStorage.getItem('userRole');

  const [anoPublicacao, setAnoPublicacao] = useState(null);

  const handleChange = (date) => {
    setAnoPublicacao(date);
  };


  const handleDateChange = (date) => {
    setAnoPublicacao(date);
    setMenuAberto(false);
  };

  useEffect(() => {
    carregarAlunos();
    carregarProfessores();
  }, []);


  const handleFile = async (event) => {
    try {
      setLoading(true);
      const file = event.target.files[0];
      const cloudinaryCloudName = 'dzpbclwij';
      const cloudinaryUploadPreset = 'bdsmg4su';
      
      if (file) {
        const formData = new FormData();
        formData.append('file', file);
        formData.append('resource_type', 'raw');
        formData.append('upload_preset', cloudinaryUploadPreset);

        const cloudinaryResponse = await axios.post(
          `https://api.cloudinary.com/v1_1/${cloudinaryCloudName}/raw/upload`,
          formData,
          {
            headers: {
              'Content-Type': 'multipart/form-data',
            },
          }
        );

        if (cloudinaryResponse.status === 200 && cloudinaryResponse.data.secure_url) {
          const urlPdf = cloudinaryResponse.data.secure_url;

          setUrl(urlPdf);
          setPdfAdicionado(true);
          setLoading(false);
        } else {
          console.error('Erro ao fazer upload do PDF:', cloudinaryResponse.data);
        }
      } else {
        console.warn('Nenhum arquivo selecionado');
      }
    } catch (error) {
      console.error('Erro:', error);
    }
  };

  const handleFileUpload = async (event) => {
    setLoading(true);
    const files = event.target.files;

    if (files.length > 0) {
      const cloudinaryCloudName = 'dzpbclwij';
      const cloudinaryUploadPreset = 'bdsmg4su';
      const uploadPromises = [];

      for (const file of files) {
        const formData = new FormData();
        formData.append('file', file);
        formData.append('resource_type', 'image');
        formData.append('upload_preset', cloudinaryUploadPreset);

        uploadPromises.push(axios.post(`https://api.cloudinary.com/v1_1/${cloudinaryCloudName}/upload`, formData));
      }

      Promise.all(uploadPromises)
        .then((responses) => {
          const imageUrls = responses.map((response) => response.data.secure_url);
          setLogoProjeto(imageUrls);
          setLogoAdicionada(true);
          setLoading(false);
        })
        .catch((error) => {
          console.error('Erro ao fazer upload de logo:', error);
        });
    } else {
      console.warn('Nenhuma logo selecionado');
    }
  };

  const adicionarAluno = () => {
    if (alunoSelecionado && alunoSelecionado.id !== null) {
      setAlunosSelecionados([...alunosSelecionados, alunoSelecionado]);
      setAlunoSelecionado(null);
    }
  };

  const carregarAlunos = async () => {
    const token = localStorage.getItem('token');
    const headers = {
      'x-access-token': token,
    };

    try {
      const response = await axiosFecht.get('/listar/alunos/', { headers });
      setAlunosDisponiveis(
        response.data.map((aluno) => ({
          id: aluno.pessoa_id_pessoa,
          nome: aluno.nome_aluno,
        }))
      );
    } catch (error) {
      console.error('Erro ao carregar alunos:', error);
    }
  };

  const carregarProfessores = async () => {
    const token = localStorage.getItem('token');
    const headers = {
      'x-access-token': token,
    };

    try {
      const response = await axiosFecht.get('/listar/orientador/', { headers });
      setProfessoresDisponiveis(
        response.data.map((professor) => ({
          id: professor.pessoa_id_pessoa,
          nome: professor.nome_professor,
        }))
      );
    } catch (error) {
      console.error('Erro ao carregar professores:', error);
    }
  };

  const adicionarProjeto = async () => {
   
    try {
      if (!orientadorSelecionado || !orientadorSelecionado.id) {
        throw new Error('Selecione um orientador.');
      }

      if (alunosSelecionados.length < 1) {
        throw new Error('Selecione pelo menos um aluno.');
      }

      const projetoData = {
        orientadores: [orientadorSelecionado],
        autores: alunosSelecionados,
        titulo,
        tema,
        problema,
        objetivo_geral,
        resumo,
        abstract,
        objetivo_especifico,
        anoPublicacao,
        logo_projeto: logoProjeto,
        publico: publico ? 1 : 0, 
        url_projeto: url,
      };
    
    const token = localStorage.getItem('token');
    
    const headers = {
      'x-access-token': token,
    };
      // Fazer a requisição POST para adicionar o projeto
      const response = await axiosFecht.post('/projeto/adiciona', projetoData, {headers});

      if (response.status === 200) {
        setMensagemErro(false);
        setSucessoAdicao(true);
        setProjetoAdicionado(true);
        navigate('/Area/Pessoa-Projeto')
      } else {
        setMensagemErro(true);
        setSucessoAdicao(false);
      }
    } catch (error) {
      console.error('Erro ao adicionar projeto:', error);
      setMensagemErro(true);
      setSucessoAdicao(false);
    }
  };

  return (
    <div>
      <ContainerTopo userType={userRole}/>
      <MenuHamburguer userType={userRole}/>

      {loading && <p>Carregando...</p>}
      
      {mensagemErro && (
        <div>
          <p>Ocorreu um erro ao adicionar o projeto. Por favor, tente novamente.</p>
        </div>
      )}
  
      {sucessoAdicao && (
        <div>
          <p>Projeto adicionado com sucesso!</p>
        </div>
      )}
  
      {!projetoAdicionado && (
        <div className="container d-flex align-items-center justify-content-center mx-auto">
          <div className="row">
            
            <div className="col-md-10 col-sm-8 align-self-center mt-5">
              {/* Seleção de Orientador */}
              <Autocomplete
                value={orientadorSelecionado}
                onChange={(event, newValue) => setOrientadorSelecionado(newValue)}
                options={professoresDisponiveis}
                getOptionLabel={(option) => option.nome}
                renderInput={(params) => <TextField {...params} label="Selecione um orientador" />}
              />
            </div>
  
            <div className="col-md-10 col-sm-8 align-self-center mt-5">
              {/* Seleção de Alunos */}
              <Autocomplete
                multiple
                value={alunosSelecionados}
                onChange={(event, newValue) => setAlunosSelecionados(newValue)}
                options={alunosDisponiveis}
                getOptionLabel={(option) => option.nome}
                renderInput={(params) => (
                  <TextField {...params} label="Selecione um aluno" />
                )}
              />
            </div>
  
            <div className="col-md-10 col-sm-8 align-self-center mt-5">
              {/* Campo de Título */}
              <TextField
                label="Título"
                variant="outlined"
                fullWidth
                value={titulo}
                onChange={(event) => setTitulo(event.target.value)}
              />
            </div>
  
            <div className="col-md-10 col-sm-8 align-self-center mt-5">
              {/* Campo de Tema */}
              <TextField
                label="Tema"
                variant="outlined"
                fullWidth
                value={tema}
                onChange={(event) => setTema(event.target.value)}
              />
            </div>
  
            <div className="col-md-10 col-sm-8 align-self-center mt-5">
              {/* Campo de Problema */}
              <TextField
                label="Problema"
                variant="outlined"
                fullWidth
                multiline
                rows={4}
                value={problema}
                onChange={(event) => setProblema(event.target.value)}
              />
            </div>
  
            <div className="col-md-10 col-sm-8 align-self-center mt-5">
              {/* Campo de Objetivo Geral */}
              <TextField
                label="Objetivo Geral"
                variant="outlined"
                fullWidth
                multiline
                rows={4}
                value={objetivo_geral}
                onChange={(event) => setObjetivoGeral(event.target.value)}
              />
            </div>
  
            <div className="col-md-10 col-sm-8 align-self-center mt-5">
              {/* Campo de Objetivo Específico */}
              <TextField
                label="Objetivo Específico"
                variant="outlined"
                fullWidth
                multiline
                rows={4}
                value={objetivo_especifico}
                onChange={(event) => setObjetivoEspecifico(event.target.value)}
              />
            </div>
  
            <div className="col-md-10 col-sm-8 align-self-center mt-5">
              {/* Campo de Resumo */}
              <TextField
                label="Resumo"
                variant="outlined"
                fullWidth
                multiline
                rows={4}
                value={resumo}
                onChange={(event) => setResumo(event.target.value)}
              />
            </div>
  
            <div className="col-md-10 col-sm-8 align-self-center mt-5">
              {/* Campo de Abstract */}
              <TextField
                label="Abstract"
                variant="outlined"
                fullWidth
                multiline
                rows={4}
                value={abstract}
                onChange={(event) => setAbstract(event.target.value)}
              />
            </div>
  
            <div className="col-md-10 col-sm-8 align-self-center mt-5">
              {/* Campo de URL do Projeto */}
              <TextField
                label="URL do Projeto"
                variant="outlined"
                fullWidth
                value={url}
                onChange={(event) => setUrl(event.target.value)}
              />
            </div>
  
            <div className="col-md-10 col-sm-8 align-self-center mt-5">
      <DatePicker
        selected={anoPublicacao}
        onChange={handleChange}
        dateFormat="yyyy"
        showYearPicker
        placeholderText="Ano de Publicação"
        className="form-control"
      />
    </div>

    <div>
      <label htmlFor="privacyToggle" className="toggle-label ms-5">
      Tornar Público {publico ? '' : ''} ?
      </label>
      <input
        type="checkbox"
        id="privacyToggle"
        className="toggle-checkbox ms-3"
        value={publico}
        onChange={handleToggle} 
      />
    </div>
            {/* Botão de Adicionar Projeto */}
            <div className="col-md-10 col-sm-8 align-self-center mt-5">
              <Button variant="contained" color="primary" onClick={adicionarProjeto}>
                Adicionar Projeto
              </Button>
            </div>
          </div>
        </div>
      )}
  
      {projetoAdicionado && (
        <div>
          <p>Projeto Adicionado com Sucesso!</p>
        </div>
      )}
    </div>
  );
};

export default AdicionaProjetoComponent;