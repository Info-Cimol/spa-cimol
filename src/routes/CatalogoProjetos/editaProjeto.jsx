import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import axios from 'axios';
import ContainerTopo from '../../components/ContainerTopo';
import MenuHamburguer from "../../components/MenuHamburguer";
import TextField from '@mui/material/TextField';
import TextareaAutosize from '@mui/material/TextareaAutosize';
import './css/editaProjeto.css';

const EdicaoProjeto = () => {
  const userRole = localStorage.getItem('userRole');
  const { id } = useParams();
  const [projetoEdit, setProjetoEdit] = useState({
    titulo: '',
    tema: '',
    problema: '',
    objetivo_geral: '',
    objetivo_especifico: '',
    resumo: '',
    abstract: '',
    arquivo: '',
    logo_projeto: [],
  });

  const [loading, setLoading] = useState(false);
  const [mensagemSucesso, setMensagemSucesso] = useState(null);
  const [pdfAdicionado, setPdfAdicionado] = useState(false);
  const [isPrivate, setIsPrivate] = useState(false);
  const [arquivoAdicionado, setArquivoAdicionado] = useState(false);
  const [projetoSalvo, setProjetoSalvo] = useState(false);

  const [alunosSelecionados, setAlunosSelecionados] = useState([]);
  const [alunoSelecionado, setAlunoSelecionado] = useState({ id: null });

  const [setAlunosDisponiveis] = useState([]);
  const [setProfessoresDisponiveis] = useState([]);

  useEffect(() => {
    const fetchProjeto = async () => {
      try {
        const token = localStorage.getItem('token');
        const headers = {
          'x-access-token': token,
        };
        const userId = localStorage.getItem('id');

        const response = await axios.get(
          `https://api-thesis-track.vercel.app/projeto/listar/${id}/pessoa/${userId}`,
          { headers }
        );

        setProjetoEdit(response.data);
      } catch (error) {
        console.error('Erro ao buscar projeto:', error);
      }
    };

    if (id) {
      fetchProjeto();
    }

    carregarAlunos();
    carregarProfessores();
  }, [id]);

  const togglePrivacy = () => {
    setIsPrivate(!isPrivate);
    projetoEdit.publico = isPrivate ? 0 : 1;
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
          `https://api.cloudinary.com/v1_1/${cloudinaryCloudName}/raw/upload`,
          formData,
          {
            headers: {
              'Content-Type': 'multipart/form-data',
            },
          }
        );

        if (cloudinaryResponse.status === 200 && cloudinaryResponse.data.secure_url) {
          setProjetoEdit({ ...projetoEdit, arquivo: cloudinaryResponse.data.secure_url });
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
    const files = event.target.files;

    if (files.length > 0) {
      const cloudinaryCloudName = 'dzpbclwij';
      const cloudinaryUploadPreset = 'bdsmg4su';
      const uploadPromises = [];
      setLoading(true);

      for (const file of files) {
        const formData = new FormData();
        formData.append('file', file);
        formData.append('upload_preset', cloudinaryUploadPreset);

        uploadPromises.push(
          axios.post(`https://api.cloudinary.com/v1_1/${cloudinaryCloudName}/upload`, formData)
        );
      }

      Promise.all(uploadPromises)
        .then((responses) => {
          const imageUrls = responses.map((response) => response.data.secure_url);
          setProjetoEdit({ ...projetoEdit, logo_projeto: imageUrls });
          setArquivoAdicionado(true);
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
    const token = localStorage.getItem('token');
    const headers = {
      'x-access-token': `${token}`,
    };

    try {
      const response = await axios.get('https://api-thesis-track.vercel.app/listar/alunos', {
        headers,
      });
      setAlunosDisponiveis(
        response.data.map((aluno) => ({
          id: aluno.matricula_aluno,
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
      'x-access-token': `${token}`,
    };

    try {
      const response = await axios.get('https://api-thesis-track.vercel.app/listar/orientador', {
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

  const adicionarAluno = () => {
    if (alunoSelecionado.id !== null) {
      setAlunosSelecionados([...alunosSelecionados, alunoSelecionado]);
      setAlunoSelecionado({ id: null });
    }
  };

  const editarProjeto = async () => {
    try {
      setLoading(true);
      const token = localStorage.getItem('token');
      const headers = {
        'x-access-token': `${token}`,
      };

      await axios.put(
        `https://api-thesis-track.vercel.app/projeto/atualiza/${id}`,
        projetoEdit,
        { headers }
      );

      setTimeout(() => {
        setProjetoSalvo(true);
        setLoading(false);
      }, 4000);
      setMensagemSucesso('Projeto editado com sucesso');
    } catch (error) {
      console.error('Erro ao editar projeto:', error);
      setLoading(false);
    }
  };

  return (
    <div>
      <ContainerTopo  userType={userRole}/>
      <MenuHamburguer userType={userRole}/>
      <div className="col-sm-6 container">
        <h1 className="tituloProjetos d-flex">EDIÇÃO DE PROJETO</h1>
      </div>
      <hr className="linhaAzul" />

      {loading && (
        <div className="loading-spinner">
          <div className="three-body">
            <div className="three-body__dot"></div>
            <div className="three-body__dot"></div>
            <div className="three-body__dot"></div>
          </div>
        </div>
      )}

      {projetoSalvo && (
        <div>
          <div color="green" type="info" shaped className="mensagem-container">
            Projeto adicionado
          </div>
        </div>
      )}

      <div className="container-fluid align-items-center justify-content-center mx-auto d-flex ">
        <div className="row">
          <div className="col-md-10 col-sm-8 align-self-center shadow-lg">
          <TextField
              id="titulo"
              label="Título"
              variant="outlined"
              value={projetoEdit.titulo}
              onChange={(e) => {
                const inputValue = e.target.value;

                if (inputValue.length <= 250) {
                setProjetoEdit({ ...projetoEdit, titulo: inputValue });
                }
            }}
              
              fullWidth
              InputLabelProps={{
                shrink: true,
              }}
            />
          </div>   
         
          <div className="col-md-10 col-sm-8 align-self-center shadow-lg">
          <TextareaAutosize
            id="tema"
            label="Tema"
            variant="outlined"
            value={projetoEdit.tema}
            onChange={(e) => {
                const inputValue = e.target.value;

                if (inputValue.length <= 400) {
                setProjetoEdit({ ...projetoEdit, tema: inputValue });
                }
            }}
            fullWidth
            rowsMin={3}
            />
          </div>

          <div className="col-md-10 col-sm-8 align-self-center shadow-lg">
          <TextareaAutosize
            id="problema"
            label="problema"
            variant="outlined"
            value={projetoEdit.problema}
            onChange={(e) => {
                const inputValue = e.target.value;

                if (inputValue.length <= 400) {
                setProjetoEdit({ ...projetoEdit, problema: inputValue });
                }
            }}
            fullWidth
            rowsMin={3}
            />
          </div>

          <div className="col-md-10 col-sm-8 align-self-center shadow-lg">
          <TextareaAutosize
            id="objetivo_geral"
            label="objetivo_geral"
            variant="outlined"
            value={projetoEdit.objetivo_geral}
            onChange={(e) => {
                const inputValue = e.target.value;

                if (inputValue.length <= 400) {
                setProjetoEdit({ ...projetoEdit, objetivo_geral: inputValue });
                }
            }}
            fullWidth
            />
          </div>

          <div className="col-md-10 col-sm-8 align-self-center shadow-lg">
          <TextareaAutosize
  id="objetivo_especifico"
  label="Objetivos Específicos"
  variant="outlined"
  multiline
  value={projetoEdit.objetivo_especifico}
  onChange={(e) => {
    const inputValue = e.target.value;

    if (inputValue.length <= 400) {
      setProjetoEdit({ ...projetoEdit, objetivo_especifico: inputValue });
    }
  }}
  onKeyDown={(e) => {
    if (e.key === 'Enter') {
      e.preventDefault(); 
      setProjetoEdit((prev) => ({
        ...prev,
        objetivo_especifico: prev.objetivo_especifico + '\n', 
      }));
    }
  }}
  fullWidth
/>

          </div>

          <div className="col-md-10 col-sm-8 align-self-center shadow-lg">
          <TextareaAutosize
            id="resumo"
            label="resumo"
            variant="outlined"
            value={projetoEdit.resumo}
            onChange={(e) => {
                const inputValue = e.target.value;

                if (inputValue.length <= 600) {
                setProjetoEdit({ ...projetoEdit, resumo: inputValue });
                }
            }}
            fullWidth
            />
          </div>

          <div className="col-md-10 col-sm-8 align-self-center shadow-lg">
          <TextareaAutosize
            id="abstract"
            label="abstract"
            variant="outlined"
            value={projetoEdit.abstract}
            onChange={(e) => {
                const inputValue = e.target.value;

                if (inputValue.length <= 600) {
                setProjetoEdit({ ...projetoEdit, abstract: inputValue });
                }
            }}
            fullWidth
            />
          </div>
        </div>
      </div>

      <div>
        <label htmlFor="privacyToggle" className="toggle-label ms-5">
          Tornar {isPrivate ? 'Público' : 'Privado'} ?
        </label>
        <input
          type="checkbox"
          id="privacyToggle"
          onChange={togglePrivacy}
          className="toggle-checkbox ms-3"
          checked={!isPrivate}
        />
      </div>

      <div className="float-end mb-5 me-5">
        <button className="color" onClick={editarProjeto} disabled={loading}>
          {loading ? (
            <div className="loading-spinner">
              <div className="three-body">
                <div className="three-body__dot"></div>
                <div className="three-body__dot"></div>
                <div className="three-body__dot"></div>
              </div>
            </div>
          ) : (
            <span>Salvar</span>
          )}
        </button>
      </div>

      {mensagemSucesso && <div className="alert alert-success">{mensagemSucesso}</div>}
    </div>
  );
};

export default EdicaoProjeto;