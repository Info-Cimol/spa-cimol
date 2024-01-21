import React, { useState, useEffect } from 'react';
import axios from 'axios';
import './css/adiciona.css';
import axiosFecht from '../../axios/config';

function AdicionarProjeto() {
  const [errorMessages, setErrorMessages] = useState({
    alunosSelecionados: '',
    orientadorSelecionado: '',
    titulo: '',
    tema: '',
    problema: '',
    objetivo_geral: '',
    resumo: '',
    objetivo_especifico: '',
    abstract: '',
    ano_publicacao: '',
  });

  const [mensagem, setMensagem] = useState(false);
  const [valueDeterminate, setValueDeterminate] = useState(50);
  const [projetoAdicionado, setProjetoAdicionado] = useState(false);
  const [alunosSelecionados, setAlunosSelecionados] = useState([]);
  const [alunoSelecionado, setAlunoSelecionado] = useState({ id: null });
  const [professoresSelecionados, setProfessoresSelecionados] = useState([]);
  const [professorSelecionado, setProfessorSelecionado] = useState({ id: null });
  const [orientadorSelecionados, setOrientadorSelecionados] = useState([]);
  const [coorientadoresSelecionados, setCoorientadoresSelecionados] = useState([]);
  const [orientadoresSelecionados, setOrientadoresSelecionados] = useState([]);
  const [orientadorSelecionado, setOrientadorSelecionado] = useState(null);
  const [novoAutor, setNovoAutor] = useState('');
  const [titulo, setTitulo] = useState('');
  const [tema, setTema] = useState('');
  const [delimitacao, setDelimitacao] = useState('');
  const [problema, setProblema] = useState('');
  const [resumo, setResumo] = useState('');
  const [objetivoGeral,] = useState('');
  const [objetivoEspecifico,] = useState('');
  const [urlProjeto,] = useState('');
  const [set,] = useState('');

  const [logo_projeto, setLogoProjeto] = useState('');
  const [objetivo_geral, setObjetivoGeral] = useState('');
  const [abstract, setAbstract] = useState('');
  const [objetivo_especifico, setObjetivoEspecifico] = useState('');
  const [ano_publicacao, setAnoPublicacao] = useState('');
  const [autores, setAutores] = useState([]);
  const [imagens, setImagens] = useState([]);
  const [isPrivate, setIsPrivate] = useState(false);
  const [pdfAdicionado, setPdfAdicionado] = useState(false);
  const [alunosDisponiveis, setAlunosDisponiveis] = useState([]);
  const [professoresDisponiveis, setProfessoresDisponiveis] = useState([]);
  const [logoAdicionada, setLogoAdicionada] = useState(false);
  const [mensagemErro, setMensagemErro] = useState(true);
  const [sucessoAdicao, setSucessoAdicao] = useState(false);
  const [loading, setLoading] = useState(false);
  const [url, setUrl] = useState('');
  const [menu, setMenu] = useState(false);
  
  const [charCount, setCharCount] = useState({
    titulo: 0,
    tema: 0,
    delimitacao: 0,
  });

  const requiredFields = [
    'alunosSelecionados',
    'orientadorSelecionado',
    'titulo',
    'tema',
    'problema',
    'objetivo_geral',
    'resumo',
    'objetivo_especifico',
    'abstract',
    'ano_publicacao',
  ];

  useEffect(() => {
    carregarAlunos();
    carregarProfessores();
  }, []);


  const limitCharCount = (field, limit) => {
    if (field.length > limit) {
      set(field, field.substr(0, limit));
    }
    setCharCount((prevCharCount) => ({ ...prevCharCount, [field]: field.length }));
  };

  const shouldHideDetails = (selectedItems) => (selectedItems.length === 0 ? 'auto' : true);

  const validateAlunosSelecionados = () => {
    if (alunosSelecionados.length > 3) {
      setAlunosSelecionados((prevAlunosSelecionados) => [...prevAlunosSelecionados].slice(0, -1));
    }
  };

  const togglePrivacy = () => {
    setIsPrivate((prevIsPrivate) => !prevIsPrivate);
    console.log(isPrivate);
  };

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
          'https://api.cloudinary.com/v1_1/' + cloudinaryCloudName,'/raw/upload',
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
          console.log(urlPdf);
          console.log(cloudinaryResponse.data.secure_url);

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

  const handleFileUpload = (event) => {
    setLoading(true);
    const files = event.target.files;

    if (files.length > 0) {
      const cloudinaryCloudName = 'dzpbclwij';
      const cloudinaryUploadPreset = 'bdsmg4su';
      const uploadPromises = [];

      for (const file of files) {
        const formData = new FormData();
        formData.append('file', file);
        formData.append('resource_type', 'raw');
        formData.append('upload_preset', cloudinaryUploadPreset);

        uploadPromises.push(
          axios.post('https://api.cloudinary.com/v1_1/' + cloudinaryCloudName,'/upload', formData)
        );
      }

      Promise.all(uploadPromises)
        .then((responses) => {
          const imageUrls = responses.map((response) => response.data.secure_url);
          setLogoProjeto(imageUrls);
          console.log(logo_projeto);
          setLogoAdicionada(true);
          setLoading(false);
        })
        .catch((error) => {
          console.error('Erro ao fazer upload de logo:', error);
        });
    } else {
      console.warn('Nenhuma logo selecionada');
    }
  };

  const adicionarAluno = () => {
    if (alunoSelecionado.id !== null) {
      setAlunosSelecionados((prevAlunosSelecionados) => [...prevAlunosSelecionados, alunoSelecionado]);
      setAlunoSelecionado({ id: null });
    }
  };

  const adicionarProfessor = () => {
    if (professorSelecionado.id !== null) {
      setProfessoresSelecionados((prevProfessoresSelecionados) => [
        ...prevProfessoresSelecionados,
        professorSelecionado,
      ]);
      setProfessorSelecionado({ id: null });
    }
  };

  const adicionarOrientador = () => {
    if (orientadorSelecionado.id !== null) {
      setCoorientadoresSelecionados((prevCoorientadoresSelecionados) => [
        ...prevCoorientadoresSelecionados,
        orientadorSelecionado,
      ]);
      setOrientadorSelecionado({ id: null });
    }
  };

  const alunosIds = alunosSelecionados?.map((aluno) => aluno.id) || [];
  const professoresIds = professoresSelecionados?.map((professor) => professor.id) || [];
  const orientadorIds = orientadorSelecionados?.map((professor) => professor.id) || [];

  const carregarAlunos = async () => {
    const token = localStorage.getItem('token');
    const headers = {
      'x-access-token': token,
    };

    try {
      const response = await axiosFecht.get('/listar/alunos', {
        headers,
      });
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
      const response = await axiosFecht.get('/listar/orientador', {
        headers,
      });
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
      setLoading(true);
      await new Promise((resolve) => setTimeout(resolve, 2000));
      const alunosIds = alunosSelecionados.map((aluno) => ({ id: aluno.id }));
      const orientadorId = orientadorSelecionado.id;
      const cloudinaryCloudName = 'dzpbclwij';
      const cloudinaryUploadPreset = 'atk1tfs8';
      setSucessoAdicao(true);

      for (const field of requiredFields) {
        if (!eval(field) || (Array.isArray(eval(field)) && eval(field).length === 0)) {
          setErrorMessages((prevErrorMessages) => ({
            ...prevErrorMessages,
            [field]: 'Por favor, preencha o campo' + field.replace(/_/g, ' '),
          }));
          setMensagem(true);
          setLoading(false);
          setTimeout(() => {
            setErrorMessages((prevErrorMessages) => ({
              ...prevErrorMessages,
              [field]: '',
            }));
            setMensagem(false);
          }, 4000);
          return;
        }
      }

      if (Object.values(errorMessages).some((message) => message !== '')) {
        return;
      }

      let uploadedImageUrls = [];
      for (const file of logo_projeto) {
        const formData = new FormData();
        formData.append('resource_type', 'raw');
        formData.append('file', file);
        formData.append('upload_preset', cloudinaryUploadPreset);

        const response = await axios.post(
          'https://api.cloudinary.com/v1_1/' + cloudinaryCloudName,'/upload', formData,
          {
            headers: {
              'Content-Type': 'application/pdf',
            },
          }
        );

        if (response.status === 200 && response.data.secure_url) {
          uploadedImageUrls.push(response.data.secure_url);
        } else {
        console.error('Resposta inválida:', response);
        setProjetoAdicionado(false);
      }
    }
    } catch (error) {
      console.error('Erro:', error);
      setMensagemErro('Ocorreu um erro ao adicionar o projeto. Por favor, tente novamente.');
    }
  }; 
  
return (
    <div>
      {/* Seção de Título */}
      <div>
        <div className="col-sm-12 container d-flex justify-content-center align-items-center">
          <h1 className="tituloProjetos animated-title">ADICIONE SEU PROJETO</h1>
        </div>
      </div>

      {/* Exibição do Spinner durante o carregamento */}
      <div className="col-12">
        {loading && (
          <div id="loadingSpinner" className="loading-spinner">
            <div className="three-body">
              <div className="three-body__dot"></div>
              <div className="three-body__dot"></div>
              <div className="three-body__dot"></div>
            </div>
          </div>
        )}
      </div>

      {/* Alerta de projeto adicionado */}
      <div className="col-12" id="projetoAdicionadoAlert">
        {projetoAdicionado && (
          <div className="alert success mensagem-container">
            Projeto adicionado
          </div>
        )}
      </div>

      {/* Linha divisória */}
      <hr className="linhaAzul" />

      {/* Container principal */}
      <div className="container d-flex align-items-center justify-content-center mx-auto">
        {/* Linha de formulário */}
        <div className="row">
          {/* Seleção de Orientador */}
          <div className="col-md-10 col-sm-8 align-self-center mt-5">
            <select
              value={orientadorSelecionado}
          
              className="custom-select"
            >
              {/* Opções aqui */}
            </select>
          </div>

          {/* Seleção de Alunos */}
          <div className="col-md-10 col-sm-8 align-self-center mt-5">
            <select
              value={alunosSelecionados}
       
              className="custom-select"
              multiple
            >
              {/* Opções aqui */}
            </select>
          </div>

          {/* Campo de Título */}
          <div className="col-md-10 col-sm-8 align-self-center mt-5">
            <input
              type="text"
              value={titulo}
             // onChange={handleTituloChange}
              className="form-control"
              placeholder="Título"
            />
            <div className="char-counter">{titulo.length}/200</div>
          </div>

          {/* Campo de Tema */}
          <div className="col-md-10 col-sm-8 align-self-center mt-5">
            <input
              type="text"
              value={tema}
              //onChange={handleTemaChange}
              className="form-control"
              placeholder="Tema"
            />
            <div className="char-counter">{tema.length}/100</div>
          </div>

          {/* Campo de Problema */}
          <div className="col-md-10 col-sm-8 align-self-center mt-5">
            <textarea
              value={problema}
            //  onChange={handleProblemaChange}
              className="form-control"
              placeholder="Problema"
              rows="4"
            />
            <div className="char-counter">{problema.length}/350</div>
          </div>

          {/* Campo de Objetivo Geral */}
          <div className="col-md-10 col-sm-8 align-self-center mt-5">
            <textarea
              value={objetivoGeral}
              
              className="form-control mensagem"
              placeholder="Objetivo geral"
              rows="4"
            />
            <div className="char-counter">{objetivoGeral.length}/300</div>
          </div>

          {/* Campo de Objetivo Específico */}
          <div className="col-md-10 col-sm-8 align-self-center mt-5">
            <textarea
              value={objetivoEspecifico}
          
              className="form-control"
              placeholder="Objetivos específicos"
            />
            <div className="char-counter">{objetivoEspecifico.length}/350</div>
          </div>

          {/* Campo de Resumo */}
          <div className="col-md-10 col-sm-8 align-self-center mt-5">
            <textarea
              value={resumo}
            
              className="form-control mensagem"
              placeholder="Resumo"
              rows="4"
              required
            />
            <div className="char-counter">{resumo.length}/400</div>
          </div>

          {/* Campo de Abstract */}
          <div className="col-md-10 col-sm-8 align-self-center mt-5">
            <textarea
              value={abstract}
            
              className="form-control"
              placeholder="Abstract"
            />
            <div className="char-counter">{abstract.length}/400</div>
          </div>

          {/* Campo de URL do Projeto */}
          <div className="col-md-10 col-sm-8 align-self-center mt-5">
            <input
              type="text"
              value={urlProjeto}
         
              className="form-control"
              placeholder="URL do Projeto"
            />
          </div>

          {/* Campo de Ano de Publicação com Menu de Data */}
          <div className="col-md-10 col-sm-8 align-self-center mt-5">
            {/* Adicione seu componente de escolha de data aqui */}
          </div>

          {/* Upload de Arquivos */}
          <div className="col-md-6 col-sm-6 align-self-center mt-5">
            {/* Adicione seu componente de upload de arquivo aqui */}
          </div>

          {/* Botão de Adicionar PDF */}
          <div className="col-md-6 col-sm-6 align-self-center mt-5">
            {/* Adicione seu componente de upload de PDF aqui */}
          </div>

          {/* Exibição de mensagem de erro */}
          <div className="col-md-6 col-sm-6 align-self-center mt-5">
            {/* Adicione seus componentes de exibição de erro aqui */}
          </div>
        </div>
      </div>

      {/* Controle de Privacidade */}
      <div>
        <label htmlFor="privacyToggle" className="toggle-label ms-5">
          Tornar {isPrivate ? 'Público' : 'Privado'} ?
        </label>
        <input
          type="checkbox"
          id="privacyToggle"
          onChange={togglePrivacy}
          className="toggle-checkbox ms-3"
          checked={isPrivate}
        />
      </div>

      {/* Botão de Navegação de Voltar   */ }
      <div className="row q-gutter-sm">
        <div>
          <button className="btn btn-sm btn-accent">
            <i className="icon-arrow_back" />
          </button>
        </div>
      </div>
   
      {/* Botão de Adicionar Projeto */}
      <div className="float-end mb-5 ">
        <button onClick={adicionarProjeto} className="btn color">
          Adicionar
        </button>
      </div>
    </div>
  );
  };
 
export default AdicionarProjeto;