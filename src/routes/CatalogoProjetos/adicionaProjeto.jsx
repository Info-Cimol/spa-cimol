import React, { useState, useEffect, useRef } from 'react';
import {useNavigate} from 'react-router-dom';
import { toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import axios from 'axios';
import axiosFecht from '../../axios/config';
import ContainerTopo from '../../components/ContainerTopo';
import MenuHamburguer from "../../components/MenuHamburguer";
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import Autocomplete from '@mui/material/Autocomplete';
import TextField from '@mui/material/TextField';
import Button from '@mui/material/Button';
import {faFileImage, faFilePdf, faCheckCircle } from '@fortawesome/free-solid-svg-icons';
import DatePicker from 'react-datepicker';
import './css/adiciona.css';
import 'react-datepicker/dist/react-datepicker.css';

const AdicionaProjetoComponent = () => {
  const navigate = useNavigate();
  const [projetoAdicionado, setProjetoAdicionado] = useState(false);
  const [alunosSelecionados, setAlunosSelecionados] = useState([]);
  const [orientadorSelecionado, setOrientadorSelecionado] = useState(null);
  const [titulo, setTitulo] = useState('');
  const [tema, setTema] = useState('');
  const [problema, setProblema] = useState('');
  const [resumo, setResumo] = useState('');
  const [logoProjeto, setLogoProjeto] = useState([]);
  const [objetivo_geral, setObjetivoGeral] = useState('');
  const [abstract, setAbstract] = useState('');
  const [objetivo_especifico, setObjetivoEspecifico] = useState('');
  const [pdfAdicionado, setPdfAdicionado] = useState(false);
  const [alunosDisponiveis, setAlunosDisponiveis] = useState([]);
  const [professoresDisponiveis, setProfessoresDisponiveis] = useState([]);
  const [setLogoAdicionada] = useState(false);
  const [mensagemErro, setMensagemErro] = useState(false);
  const [sucessoAdicao, setSucessoAdicao] = useState(false);
  const [arquivoAdicionado] = useState(false);
  const fileInputLogoRef = useRef(null);
  const fileInputPDFRef = useRef(null);
  const [loading, setLoading] = useState(false);
  const [url, setUrl] = useState('');
  const [publico, setPublico] = useState(false); 

  const handleToggle = () => {
    setPublico(!publico); // Inverte o valor de publico ao ser chamada
  };
  const userRole = localStorage.getItem('userRole');

  const [anoPublicacao, setAnoPublicacao] = useState(null);

  const handleChange = (date) => {
    setAnoPublicacao(date);
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


  const carregarAlunos = async () => {

    try {

    const token = localStorage.getItem('token');
    const headers = {
      'x-access-token': token,
    };

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

   const token = localStorage.getItem('token');

    const headers = {
      'x-access-token': token,
    };

    try {
      const projetoData = {
        orientadores: orientadorSelecionado,
        autores: alunosSelecionados,
        titulo,
        tema,
        problema,
        objetivo_geral,
        resumo,
        abstract,
        objetivo_especifico,
        logo_projeto: logoProjeto,
        publico: publico ? 1 : 0, 
        url_projeto: url,
      };
    
      const response = await axiosFecht.post('/projeto/adiciona', projetoData, {headers});

      if (response.status === 200) {
        setMensagemErro(false);
        setSucessoAdicao(true);
        setProjetoAdicionado(true);
        navigate('/Area/Pessoa-Projeto');
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

   // Função para exibir toast de sucesso
   const exibirToastSucesso = () => {
    toast.success('Projeto adicionado com sucesso!', {
      position: "top-right",
      autoClose: 3000, 
      hideProgressBar: false,
      closeOnClick: true,
      pauseOnHover: true,
      draggable: true,
      progress: undefined,
    });
  };

  /* Função para exibir toast de erro
  const exibirToastErro = (mensagem) => {
    toast.error(`Erro ao adicionar o projeto: ${mensagem}`, {
      position: "top-right",
      autoClose: 3000,
      hideProgressBar: false,
      closeOnClick: true,
      pauseOnHover: true,
      draggable: true,
      progress: undefined,
    });
  };*/

   useEffect(() => {
    if (sucessoAdicao) {
      exibirToastSucesso();
    }
  }, [sucessoAdicao]);


/*  useEffect(() => {
    if (mensagemErro) {
      exibirToastErro('Por favor, tente novamente.');
    }
  }, [mensagemErro]);*/

return (
  <div>
  <ContainerTopo userType={userRole}/>
  <MenuHamburguer userType={userRole}/>

  <div className="col-sm-12 container">
    <h1 className="tituloProjetos">ADICIONAR PROJETO</h1>
  </div>
  <hr className="linhaAzul" />

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

          <div className='row'>
          {/* Adicionar Logo */}
          <div className="col-md-6 col-sm-6 align-self-center mt-5">
          <label className="custom-file">
            <input
              type="file"
              ref={fileInputLogoRef}
              id="fileInputLogo"
              name="file"
              multiple
              onChange={handleFileUpload}
            />
            <span>
              <FontAwesomeIcon icon={faFileImage} />
            </span>
          </label>
          </div>

          {/* Exibir mensagem de sucesso para Logo */}
          {arquivoAdicionado && (
          <div className="col-md-6 col-sm-6 align-self-center mt-5">
            <div className="alert alert-success" role="alert">
              <FontAwesomeIcon icon={faCheckCircle} />{' '}
              Logo adicionada com sucesso
            </div>
          </div>
          )}

          {/* Adicionar PDF */}
          <div className="col-md-6 col-sm-6 align-self-center mt-5">
          <label className="custom-file">
            <input
              type="file"
              ref={fileInputPDFRef}
              id="fileInputPDF"
              name="file"
              onChange={handleFile}
              accept=".pdf"
            />
            <span>
              <FontAwesomeIcon icon={faFilePdf} />
            </span>
          </label>
          </div>

          {/* Exibir mensagem de sucesso para PDF */}
          {pdfAdicionado && (
          <div className="col-md-6 col-sm-6 align-self-center mt-5">
            <div className="alert alert-success" role="alert">
              <FontAwesomeIcon icon={faCheckCircle} />{' '}
              PDF adicionado com sucesso
            </div>
          </div>
          )}
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
</div>
);
};

export default AdicionaProjetoComponent;