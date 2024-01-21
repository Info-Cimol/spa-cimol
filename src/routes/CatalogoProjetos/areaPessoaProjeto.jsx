import React, { useEffect, useState } from 'react';
import axiosFecht from '../../axios/config';
import { useNavigate } from 'react-router-dom';
import ContainerTopo from "../../components/ContainerTopo";
import MenuHamburguer from "../../components/MenuHamburguer";
import 'bootstrap/dist/css/bootstrap.min.css';
import 'bootstrap-icons/font/bootstrap-icons.css';
import '@fortawesome/fontawesome-free/css/all.css';
import './css/aluno.css';

const ProjectComponent = () => {
  const Navigate = useNavigate();
  const [projetosDoUsuario, setProjetosDoUsuario] = useState([]);
  const [semProjeto, /*setSemProjeto*/] = useState(false);

  const token = localStorage.getItem('token');
  const userRole = localStorage.getItem('userRole');
  const userId = localStorage.getItem('id');

  const loadProjects = async () => {
    try {
      if (userRole === 'aluno') {
        await loadProjectsAluno();
      } else if (userRole === 'professor' || userRole === 'admin') {
        await loadProjectsOrientador();
      }
    } catch (error) {
      console.error('Erro ao carregar projetos:', error);
    }
  };

  const loadProjectsOrientador = async () => {
    try {
      const headers = {
        'x-access-token': token,
      };

      let response = await axiosFecht.get('/projeto/orientador/' + userId, { headers });

      setProjetosDoUsuario(response.data);
    } catch (error) {
      console.error('Erro ao carregar projetos:', error);
    }
  };

  const loadProjectsAluno = async () => {
    try {
      const headers = {
        'x-access-token': token,
      };

      let response = await axiosFecht.get('/aluno/projetos/' + userId, { headers });

      setProjetosDoUsuario(response.data);
    } catch (error) {
      console.error('Erro ao carregar projetos:', error);
    }
  };

  /*const checkIfEmptyProjects = () => {
    if (projetosDoUsuario === 0) {
      setSemProjeto(true);
      console.log("Você não possui nenhum trabalho aqui.");
    }
  };  */

  const adicionar = () => {
    Navigate('');
  };

  const visualizar = (id) => {
    Navigate('/Visualiza/Projeto-Pessoa/' + id);
  };

  useEffect(() => {
    loadProjects();
  });  


  return (
    <div>
      <ContainerTopo userType={userRole} />
      <MenuHamburguer userType={userRole} />

      {/* Seção do Aluno */}
      <div className="imagemFundo col-sm-6 col-md-12">
        <div className="container" style={{ height: 'auto', display: 'flex', flexDirection: 'column' }}>
          {/* Area do Aluno */}
          {userRole === 'aluno' && (
            <div className="row align-items-center">
              <div className="col-sm-4 col-md-6">
                <h1 className="escreva fade-up">Área do Aluno</h1>
                <p className="escritaProjetos fade-up mt-6">
                  Esta é a sua área de projetos. Aqui, você pode criar, editar e excluir seus projetos em colaboração
                  com seu orientador. Utilize este espaço para se organizar e receber orientação.
                </p>
              </div>
              <div className="col-md-6 col-sm-6">
                <img src="/Images/projetos.png" className=" img-fluid" alt="Imagem Projetos" />
              </div>
            </div>
          )}

          {/* Area do Orientador */}
          {(userRole === 'professor') && (
            <div className="row align-items-center">
              <div className="col-sm-4 col-md-6">
                <h1 className="escreva fade-up">Área do Orientador</h1>
                <p className="escritaProjetos fade-up mt-6">
                  Esta é sua área de orientação. Aqui você poderá criar, revisar e gerenciar projetos compartilhados
                  com seus orientandos. Utilize este espaço para se organizar e fornecer orientação.
                </p>
              </div>
              <div className="col-md-6 col-sm-6">
                <img src="/Images/imagem8.png" className="imagem" alt="Imagem Orientador" />
              </div>
            </div>
          )}

           {/* Area do Admin */}
           {(userRole === 'admin') && (
            <div className="row align-items-center">
              <div className="col-sm-4 col-md-6">
                <h1 className="escreva fade-up">Área do Administrador</h1>
                <p className="escritaProjetos fade-up mt-6">
                Esta é sua área de administração. Aqui você terá o controle total, podendo impactar positivamente em todos os aspectos da plataforma.
          Utilize este espaço para gerenciar usuários, configurar permissões e garantir o bom funcionamento do sistema.
                </p>
              </div>
              <div className="col-md-6 col-sm-6">
                <img src="/Images/imagem8.png" className="imagem" alt="Imagem Orientador" />
              </div>
            </div>
          )}
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

              <button className="card__btn" onClick={() => visualizar(projeto.id_projeto)}>
                Visualizar
              </button>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default ProjectComponent;