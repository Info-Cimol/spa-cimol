import React, { useState, useEffect, useRef} from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { useParams, useNavigate} from 'react-router-dom';
import ContainerTopo from '../../components/ContainerTopo';
import MenuHamburguer from "../../components/MenuHamburguer";
import TextareaAutosize from '@mui/material/TextareaAutosize';
import {faFileImage, faFilePdf, faCheckCircle } from '@fortawesome/free-solid-svg-icons';
import axiosFecht from '../../axios/config';
import axios from 'axios';
import './css/editaProjeto.css';

const EdicaoProjeto = () => {
  const navigate = useNavigate();
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
    publico: 0,
  });
  const [loading, setLoading] = useState(false);
  const [mensagemSucesso, setMensagemSucesso] = useState(null);
  const [isPrivate, setIsPrivate] = useState(projetoEdit.publico === 0);
  const [pdfAdicionado, setPdfAdicionado] = useState(false);
  const [arquivoAdicionado, setArquivoAdicionado] = useState(false);
  const fileInputLogoRef = useRef(null);
  const fileInputPDFRef = useRef(null);
  const [projetoSalvo, setProjetoSalvo] = useState(false);
 // const [alunosDisponiveis, setAlunosDisponiveis] = useState([]);
  const userRole = localStorage.getItem('userRole');

  const togglePrivacy = () => {
    setProjetoEdit((prevProjetoEdit) => ({
      ...prevProjetoEdit,
      publico: prevProjetoEdit.publico === 1 ? 0 : 1,
    }));
  
    setIsPrivate((prevIsPrivate) => !prevIsPrivate);
  };

  useEffect(() => {
    const fetchProjeto = async () => {
      try {
        const token = localStorage.getItem('token');
        const headers = {
          'x-access-token': token,
        };
        const userId = localStorage.getItem('id');

        const response = await axiosFecht.get(`/projeto/listar/${id}/pessoa/${userId}`, { headers });

        setProjetoEdit(response.data);
        setIsPrivate(response.data.publico === 0);
      } catch (error) {
        console.error('Erro ao buscar projeto:', error);
      }
    };

    if (id) {
      fetchProjeto();
    }
  }, [id]);

  const handleFile = async (event) => {
    try {
      setLoading(true);
      const file = event.target.files[0];
      const cloudinaryCloudName = process.env.REACT_APP_CLOUD_NAME;
      const cloudinaryUploadPreset = process.env.REACT_APP_UPLOAD_PRESENT;
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
      const cloudinaryCloudName = process.env.REACT_APP_CLOUD_NAME;
      const cloudinaryUploadPreset = process.env.REACT_APP_UPLOAD_PRESENT;
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
  
  const editarProjeto = async () => {
    try {
      setLoading(true);
      const token = localStorage.getItem('token');
      const headers = {
        'x-access-token': token,
      };

      await axiosFecht.put(`/projeto/atualiza/${id}`, projetoEdit, { headers });

      setTimeout(() => {
        setProjetoSalvo(true);
        setLoading(false);
      }, 4000);
      setMensagemSucesso('Projeto editado com sucesso');
      navigate('/Projeto/' + id)
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
        <h1 className="tituloProjetos">EDIÇÃO DE PROJETO</h1>
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

      <div className="container-fluid align-items-center justify-content-center d-flex ">
        <div className="row">
          <div className="col-md-10 col-sm-8 align-self-center">
          <TextareaAutosize className='input'
              id="titulo"
              label="Título"
              variant="outlined"
              value={projetoEdit.titulo}
              onChange={(e) => {
                const inputValue = e.target.value;

                if (inputValue.length <= 600) {
                setProjetoEdit({ ...projetoEdit, titulo: inputValue });
                }
            }}
            />
          </div>  
         
          <div className="col-md-10 col-sm-8 align-self-center">
          <TextareaAutosize className='input'
            id="tema"
            aria-label="Tema"
            variant="outlined"
            value={projetoEdit.tema}
            onChange={(e) => {
                const inputValue = e.target.value;

                if (inputValue.length <= 600) {
                setProjetoEdit({ ...projetoEdit, tema: inputValue });
                }
            }}
            />
          </div>

          <div className="col-md-10 col-sm-8 align-self-center">
          <TextareaAutosize className='input'
            id="problema"
            label="problema"
            variant="outlined"
            value={projetoEdit.problema}
            onChange={(e) => {
                const inputValue = e.target.value;

                if (inputValue.length <= 600) {
                setProjetoEdit({ ...projetoEdit, problema: inputValue });
                }
            }}
            />
          </div>

          <div className="col-md-10 col-sm-8 align-self-center">
          <TextareaAutosize className='input'
            id="objetivo_geral"
            label="objetivo_geral"
            variant="outlined"
            value={projetoEdit.objetivo_geral}
            onChange={(e) => {
                const inputValue = e.target.value;

                if (inputValue.length <= 600) {
                setProjetoEdit({ ...projetoEdit, objetivo_geral: inputValue });
                }
            }}
            />
          </div>

          <div className="col-md-10 col-sm-8 align-self-center">
          <TextareaAutosize className='input'
            id="objetivo_especifico"
            label="Objetivos Específicos"
            variant="outlined"
            multiline
            value={projetoEdit.objetivo_especifico}
            onChange={(e) => {
              const inputValue = e.target.value;

              if (inputValue.length <= 600) {
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
            
          />
          </div>

          <div className="col-md-10 col-sm-8 align-self-center">
          <TextareaAutosize className='input'
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
            />
          </div>

          <div className="col-md-10 col-sm-8 align-self-center">
          <TextareaAutosize className='input'
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
            />
          </div>

          <div className="col-md-10 col-sm-8 align-self-center">
          <TextareaAutosize className='input'
            id="abstract"
            label="abstract"
            variant="outlined"
            value={projetoEdit.url_projeto}
            onChange={(e) => {
                const inputValue = e.target.value;

                if (inputValue.length <= 600) {
                setProjetoEdit({ ...projetoEdit, url_projeto: inputValue });
                }
            }}
            />
          </div>
        </div>
      </div>

      <div>
        <label htmlFor="privacyToggle" className="toggle-label ms-5">
          Tornar Público {isPrivate ? '' : ''} ?
        </label>
        <input
          type="checkbox"
          id="privacyToggle"
          onChange={() => togglePrivacy()}
          className="toggle-checkbox ms-3"
          checked={projetoEdit.publico}
        />
      </div>

      <div className='row'>
        {/* Adicionar Logo */}
        <div className="col-md-6 col-sm-6 align-self-center mt-5">
          <label className="custom-file-upload">
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
              {' '}{projetoEdit.logo_projeto || 'Adicionar logo'}
            </span>
          </label>
      </div>

        {/* Exibir mensagem de sucesso para Logo */}
        {arquivoAdicionado && (
          <div className="col-md-6">
            <div className="alert alert-success" role="alert">
              <FontAwesomeIcon icon={faCheckCircle} />{' '}
              Logo adicionada com sucesso
            </div>
          </div>
        )}

          {/* Adicionar PDF */}
        <div className="col-md-6 col-sm-6 align-self-center mt-5">
            <label className="custom-file-upload">
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
                {' '}{projetoEdit.arquivo || 'Adicionar PDF'}
              </span>
            </label>
        </div>

          {/* Exibir mensagem de sucesso para PDF */}
          {pdfAdicionado && (
            <div className="col-md-6">
              <div className="alert alert-success" role="alert">
                <FontAwesomeIcon icon={faCheckCircle} />{' '}
                PDF adicionado com sucesso
              </div>
            </div>
          )}
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
            <span className='custom-button'>Salvar</span>
          )}
        </button>
      </div>

      {mensagemSucesso && <div className="alert alert-success">{mensagemSucesso}</div>}
    </div>
  );
};

export default EdicaoProjeto;