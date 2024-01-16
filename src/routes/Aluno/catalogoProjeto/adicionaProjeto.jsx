import React, { useState, useEffect } from 'react';
import axios from 'axios';
import './css/adiciona.css';

const ProjectForm = () => {

  const [loading, setLoading] = useState(false);
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
  const [logoProjeto, setLogoProjeto] = useState('');
  const [objetivoGeral, setObjetivoGeral] = useState('');
  const [abstract, setAbstract] = useState('');
  const [objetivoEspecifico, setObjetivoEspecifico] = useState('');
  const [anoPublicacao, setAnoPublicacao] = useState('');
  const [autores, setAutores] = useState([]);
  const [imagens, setImagens] = useState([]);
  const [isPrivate, setIsPrivate] = useState(false);
  const [pdfAdicionado, setPdfAdicionado] = useState(false);
  const [alunosDisponiveis, setAlunosDisponiveis] = useState([]);
  const [professoresDisponiveis, setProfessoresDisponiveis] = useState([]);
  const [logoAdicionada, setLogoAdicionada] = useState(false);
  const [mensagemErro, setMensagemErro] = useState(true);
  const [sucessoAdicao, setSucessoAdicao] = useState(false);
  const [url, setUrl] = useState('');
  const [urlPdf, setUrlPdf] = useState('');

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
    'objetivoGeral',
    'resumo',
    'objetivoEspecifico',
    'abstract',
    'anoPublicacao',
  ];

  useEffect(() => {
    carregarAlunos();
    carregarProfessores();
  }, []);

  const limitCharCount = (field, limit) => {
    let updatedField = field.length > limit ? field.substr(0, limit) : field;
    setCharCount((prevCharCount) => ({ ...prevCharCount, [field]: updatedField.length }));
    switch (field) {
      case 'titulo':
        setTitulo(updatedField);
        break;
      case 'tema':
        setTema(updatedField);
        break;
      case 'delimitacao':
        setDelimitacao(updatedField);
        break;
      
      default:
        break;
    }
  };

  const shouldHideDetails = (selectedItems) => (selectedItems.length === 0 ? 'auto' : true);

  const validateAlunosSelecionados = () => {
    if (alunosSelecionados.length > 3) {
      setAlunosSelecionados((prevAlunosSelecionados) => prevAlunosSelecionados.slice(0, 3));
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

        const cloudinaryResponse = await axios.post('https://api.cloudinary.com/v1_1/${cloudinaryCloudName}/raw/upload', formData,
          {
            headers: {
              'Content-Type': 'multipart/form-data',
            },
          }
        );

        if (cloudinaryResponse.status === 200 && cloudinaryResponse.data.secure_url) {
          const urlPdf = cloudinaryResponse.data.secure_url;
          setUrlPdf(urlPdf);
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

        uploadPromises.push(axios.post('https://api.cloudinary.com/v1_1/${cloudinaryCloudName}/upload', formData));
      }

      Promise.all(uploadPromises)
        .then((responses) => {
          const imageUrls = responses.map((response) => response.data.secure_url);
          setLogoProjeto(imageUrls);
          console.log(logoProjeto);
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
    if (alunoSelecionado.id !== null) {
      setAlunosSelecionados((prevAlunosSelecionados) => [...prevAlunosSelecionados, alunoSelecionado]);
      setAlunoSelecionado({ id: null });
    }
  };

  const adicionarProfessor = () => {
    if (professorSelecionado.id !== null) {
      setProfessoresSelecionados((prevProfessoresSelecionados) => [...prevProfessoresSelecionados, professorSelecionado]);
      setProfessorSelecionado({ id: null });
    }
  };

  const adicionarOrientador = () => {
    if (orientadorSelecionado.id !== null) {
      setCoorientadoresSelecionados((prevCoorientadoresSelecionados) => [...prevCoorientadoresSelecionados, orientadorSelecionado]);
      setOrientadorSelecionado({ id: null });
    }
  };

  const carregarAlunos = async () => {
    const token = localStorage.getItem('token');
    console.log(token);
    const headers = {
      'x-access-token': token,
    };

    try {
      const response = await axios.get('https://api-thesis-track.vercel.app/listar/alunos', { headers });
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
    console.log(token);
    const headers = {
      'x-access-token': token,
    };
    try {
      const response = await axios.get('https://api-thesis-track.vercel.app/listar/orientador', { headers });
      console.log(response);
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

  const projetos = async () => {
    try {
      setLoading(true);
      await new Promise((resolve) => setTimeout(resolve, 2000));
      const token = localStorage.getItem('token');
      const alunosIds = alunosSelecionados.map((aluno) => ({ id: aluno.id }));
      const orientadorId = orientadorSelecionado.id;
      const cloudinaryCloudName = 'dzpbclwij';
      const cloudinaryUploadPreset = 'atk1tfs8';
      setSucessoAdicao(true);

      for (const field of requiredFields) {
        if (!eval(field) || (Array.isArray(eval(field)) && eval(field).length === 0)) {
          setMensagemErro('Por favor, preencha o campo' + field.replace(/_/g, ' '));
          setLoading(false);
          setTimeout(() => {
            setMensagemErro('');
          }, 4000);
          return;
        }
      }

      let uploadedImageUrls = [];
      for (const file of logoProjeto) {
        const formData = new FormData();
        formData.append('resource_type', 'raw');
        formData.append('file', file);
        formData.append('upload_preset', cloudinaryUploadPreset);
        console.log(formData);
        const response = await axios.post('https://api.cloudinary.com/v1_1/${cloudinaryCloudName}/upload', formData, {
          headers: {
            'Content-Type': 'application/pdf',
          },
        });
        console.log(response);
        console.log(formData);

        if (response.status === 200 && response.data.secure_url) {
          uploadedImageUrls.push(response.data.secure_url);
        } else {
          console.error('Erro ao fazer upload:', response.data);
        }
      }

      const formData = {
        titulo,
        tema,
        resumo,
        problema,
        abstract,
        objetivoGeral,
        objetivoEspecifico,
        anoPublicacao,
        alunos: alunosIds,
        urlProjeto: url,
        professores: [{ id: orientadorId }],
        publico: isPrivate ? 0 : 1,
        logoProjeto: uploadedImageUrls,
        arquivo: urlPdf,
      };
      console.log(formData);

      const headers = {
        'x-access-token': token,
      };
      const response = await axios.post('https://api-thesis-track.vercel.app/projeto/adiciona', formData, { headers });
      setLoading(false);
      setProjetoAdicionado(true);
      await new Promise((resolve) => setTimeout(resolve, 2000));

      if (response && response.status === 200 && response.data) {
        console.log(response);
        const projeto = response.data;
        const projetoId = projeto.id_projeto;

        // Navigate to the desired page using your router logic (add your router logic here)
      } else {
        console.error('Resposta inválida:', response);
        setProjetoAdicionado(false);
      }
    } 
    catch (error) {
      console.error('Erro:', error);

      setMensagemErro('Ocorreu um erro ao adicionar o projeto. Por favor, tente novamente.');
    }
  
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
            <div className="loading-spinner">
              <div className="three-body">
                <div className="three-body__dot"></div>
                <div className="three-body__dot"></div>
                <div className="three-body__dot"></div>
              </div>
            </div>
          )}
        </div>
    
        {/* Alerta de projeto adicionado */}
        <div className="col-12" style={{ marginTop: '10px' }} hidden={!projetoAdicionado}>
          <div style={{ color: 'green' }}>Projeto adicionado</div>
        </div>
    
        {/* ... (other parts of your template) ... */}
    
        {/* Controle de Privacidade */}
        <div style={{ marginTop: '10px' }}>
          <label htmlFor="privacyToggle" className="toggle-label ms-5">
            Tornar {isPrivate ? 'Público' : 'Privado'} ?
          </label>
          <checked
            id="privacyToggle"
            onChange={togglePrivacy}
            className="toggle-checkbox ms-3"
            checked={isPrivate}
          />
        </div>
    
       
  
        {/* Botão de Adicionar Projeto */}
        <div className="float-end mb-5">
          <button variant="contained" color="primary" onClick={projetos}>
            Adicionar
          </button>
        </div>
      </div>
    );
};
}
export default ProjectForm;