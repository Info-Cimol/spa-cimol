import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';

const ProjectComponent = () => {

    const Navigate = useNavigate();
    const [userType] = useState(localStorage.getItem('userType') || 'default');
    const [userId] = useState(localStorage.getItem('id') || null);
    const [projetosDoUsuario, setProjetosDoUsuario] = useState([]);
    const [semProjeto, setSemProjeto] = useState(false);
    const [pageTitle, setPageTitle] = useState('Meus Projetos');
    const token = localStorage.getItem('token');

    const isPublic = (projeto) => (projeto.publico === 1 ? 'Projeto Público' : 'Projeto Privado');

    const editarProjeto = (projeto) => {
      console.log("Projeto ID:", projeto);
      Navigate.push('/Editar/${projeto}');
    };
  
    const loadProjects = async () => {
      try {
        let response;
       
        const headers = {
          'x-access-token': token,
        };
  
        if (userType === 'professor') {
          response = await axios.get('https://api-thesis-track.vercel.app/projeto/orientador/${userId}', { headers });
          console.log(response);
        } else if (userType === 'aluno') {
          response = await axios.get('https://api-thesis-track.vercel.app/aluno/projetos/${userId}', { headers });
          console.log(response);
        }
  
        setProjetosDoUsuario(response.data);
        checkIfEmptyProjects();
      } catch (error) {
        console.error('Erro ao carregar projetos:', error);
      }
    };
  
    const updatePageTitle = () => {
      setPageTitle(window.innerWidth <= 484 ? 'Projetos' : 'Meus Projetos');
    };
  
    const checkIfEmptyProjects = () => {
      if (projetosDoUsuario.length === 0) {
        setSemProjeto(true);
        console.log("Você não possui nenhum trabalho aqui.");
      }
    };
  
    const adicionar = () => {
      Navigate.push('/Adicionar');
    };
  
    const getAutoresNome = (response) => {
      try {
        const autores = JSON.parse(response.alunos);
        console.log(autores);
        if (autores && autores.length > 0) {
          return autores.map((autor) => autor.nome).join(', ');
        }
      } catch (error) {
        console.error('Error parsing autores:', error);
        return '';
      }
    };
  
    const visualizar = (projeto, orientadorId) => {
     
    };
  
    useEffect(() => {
      loadProjects();
      window.addEventListener('resize', updatePageTitle);
      updatePageTitle();
  
      return () => {
        window.removeEventListener('resize', updatePageTitle);
      };
    }, [userType, userId, Navigate]);
  
    return (
      <div>
        {/* Seção do Aluno */}
        {userType === 'aluno' && (
          <div className="imagemFundo col-sm-6 col-md-12">
            <div className="container" style={{ height: 'auto', display: 'flex', flexDirection: 'column' }}>
              <div className="row align-items-center">
                <div className="col-sm-4 col-md-6">
                  <h1 className="escreva fade-up">Área do Aluno</h1>
                  <p className="escritaProjetos fade-up mt-4">
                    Esta é a sua área de projetos. Aqui, você pode criar, editar e excluir seus projetos em colaboração
                    com seu orientador. Utilize este espaço para se organizar e receber orientação.
                  </p>
                </div>
                <div className="col-md-6 col-sm-6">
                  <img src="/Images/projetos.png" className="imagem img-fluid" alt="Imagem Projetos" />
                </div>
              </div>
            </div>
          </div>
        )}
  
        {/* Seção do Professor */}
        {userType === 'professor' && (
          <div className="imagemFundo col-sm-6 col-md-12">
            <div className="container" style={{ height: 'auto', display: 'flex', flexDirection: 'column' }}>
              <div className="row align-items-center">
                <div className="col-sm-4 col-md-6">
                  <h1 className="escreva fade-up">Área do Orientador</h1>
                  <p className="escritaProjetos fade-up mt-6">
                    Esta é sua área de orientação. Aqui você poderá criar, revisar e gerenciar projetos compartilhados
                    com seus orientandos. Utilize este espaço para se organizar e fornecer orientação.
                  </p>
                </div>
                <div className="col-md-6 col-sm-6">
                  <img src="/Images/imagem8.png" className="imagem img-fluid" alt="Imagem Orientador" />
                </div>
              </div>
            </div>
          </div>
        )}
  
        <div>
          <div className="container" style={{ display: 'flex' }}>
            <h1 className="tituloProjetos col-sm-4 col-lg-4" onClick={adicionar}>
              {pageTitle}
            </h1>
            <div className="col-sm-4 col-lg-4 maisProjeto d-flex" onClick={adicionar}>
              <svg
                xmlns="http://www.w3.org/2000/svg"
                width="38"
                height="38"
                fill="currentColor"
                className="bi bi-plus-circle ms-5 d-flex rounded float-end"
                viewBox="0 0 16 16"
              >
                <path d="M8 15A7 7 0 1 1 8 1a7 7 0 0 1 0 14zm0 1A8 8 0 1 0 8 0a8 8 0 0 0 0 16z" />
                <path
                  d="M8 4a.5.5 0 0 1 .5.5v3h3a.5.5 0 0 1 0 1h-3v3a.5.5 0 0 1-1 0v-3h-3a.5.5 0 0 1 0-1h3v-3A.5.5 0 0 1 8 4z"
                />
              </svg>
            </div>
          </div>
        </div>
        <hr className="linhaAzul" />
  
        <div className="fade-in-down cards mx-auto justify-content-between">
          {semProjeto && (
            <div className="col-12 text-center mt-5 textAlter">
              <img src="/Images/sem projeto.png" className="imagemilustrada" alt="Imagem Ilustrativa" />
              <p className="textAlter mb-5">Putz... Você não tem nenhum projeto cadastrado.</p>
            </div>
          )}
  
          <div className="cards row mt-5 mb-5">
            {projetosDoUsuario.map((projeto) => (
              <div key={projeto.id_projeto} className="card col-sm-6 col-md-4 col-lg-3">
                <div className="card__img">
                  {projeto.logo_projeto ? (
                    <img
                      src={projeto.logo_projeto}
                      style={{ height: '150px', objectFit: 'cover', borderRadius: '12px' }}
                      alt="Logo Projeto"
                    />
                  ) : (
                    <img
                      src="Images/Logo.png"
                      style={{ height: '140px', objectFit: 'cover', borderRadius: '12px' }}
                      alt="Logo Padrão"
                    />
                  )}
                </div>
                <div className="card__body">
                  <h2 className="card__head">{projeto.tema}</h2>
                  <p className="card__desc">{projeto.titulo}</p>
                  <h2 className="card__desc">{projeto.publico ? 'Público' : 'Privado'}</h2>
                </div>
                <a href="#" className="card__btn" onClick={() => visualizar(projeto.id_projeto)}>
                  Visualizar
                </a>
              </div>
            ))}
          </div>
        </div>
      </div>
    );
  };

export default ProjectComponent;