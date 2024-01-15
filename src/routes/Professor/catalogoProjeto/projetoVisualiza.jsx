import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import ContainerTopo from "../../../components/ContainerTopo";
import MenuHamburguer from "../../../components/MenuHamburguer";
import 'bootstrap/dist/css/bootstrap.min.css';
import 'bootstrap-icons/font/bootstrap-icons.css';
import '@fortawesome/fontawesome-free/css/all.css';
import './projeto.css'

const ProjectComponent = () => {

    const Navigate = useNavigate();
    const [userId] = useState(localStorage.getItem('id'));
    const [projetosDoUsuario, setProjetosDoUsuario] = useState([]);
    const [semProjeto, setSemProjeto] = useState(false);
    const token = localStorage.getItem('token');
    const userType = "professor";
 
    const loadProjects = async () => {
      try {
        const headers = {
          'x-access-token': token,
        };
    
        let response = await axios.get('https://api-thesis-track.vercel.app/projeto/orientador/' + userId, { headers });
    
        setProjetosDoUsuario(response.data);
        checkIfEmptyProjects(); 
      } catch (error) {
        console.error('Erro ao carregar projetos:', error);
      }
    };
  
    const checkIfEmptyProjects = () => {
      if (projetosDoUsuario.length === null) {
        setSemProjeto(true);
        console.log("Você não possui nenhum trabalho aqui.");
      }
    };
   
    const adicionar = () => {
      Navigate.push('/Adicionar');
    };
  
   /* const getAutoresNome = (response) => {
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
    };*/
  
 /*   const visualizar = (projeto, orientadorId) => { };*/
  
    useEffect(() => {
      loadProjects();
    }, 
    );
  
    return (
      <div>
          <ContainerTopo />
          <MenuHamburguer userType={userType}/>
       
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
       
        <div>
          <div className="container-fluid">
            <div className='row'>
             <h1 className="tituloProjetos col-lg-4">
              Meus Projetos
            </h1>
            <div className="maisProjeto col-sm-10 col-lg-8" onClick={adicionar}>
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
                      src="/Images/Logo.png"
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
               <a href="#" className="card__btn" /*onClick={() => visualizar(projeto.id_projeto)}*/>
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